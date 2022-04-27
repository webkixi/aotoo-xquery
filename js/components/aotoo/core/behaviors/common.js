const lib = require('../../lib/index')
const getmyApp = require('../getapp')
const {vibrateShort, vibrateLong} = lib

let storeEvts = {}
export function resetStoreEvts(params) {
  storeEvts = {}
}

function rightEvent(dsetEvt) {
  if (lib.isString(dsetEvt)) {
    const $id = lib.md5(dsetEvt)

    if (storeEvts[$id]) {
      return storeEvts[$id]
    }
    
    let rightEvt
    if (dsetEvt.indexOf('?')>-1) {
      let myQuery = {}
      const params = dsetEvt.split('@@')
      const evtType = params[0]
      dsetEvt = params[1]
      const evts = dsetEvt.split(',')
      evts.forEach(function(item) {
        if (item) {
          const its = item.split('=')
          const itName = its.splice(0, 1)
          const itQuery = its.join('=')
          const evtObj = lib.formatQuery(itQuery)
          myQuery[itName] = {fun: evtObj.url, param: evtObj.query}
        }
      })
      rightEvt = myQuery[evtType] || {fun: '', param: {}}
      rightEvt.allParam = lib.clone(myQuery)
    } else {
      dsetEvt = dsetEvt.replace('@@', '?').replace(/,/g, '&')
      const evtObj = lib.formatQuery(dsetEvt)
      const evtType = evtObj.url
      const evtQuery = evtObj.query
      const evtSelect = evtQuery[evtType]
      const selObj = lib.formatQuery(evtSelect)
      const selFun = selObj.url
      const selParam = selObj.query
      rightEvt = {
        fun: selFun, 
        param: selParam,
        allParam: evtQuery
      }
    }
    storeEvts[$id] = rightEvt
    return rightEvt||{}
  }
}

export function _addClass(key, params, data) {
  if (!lib.isString(params)) return
  let upData = {}
  if (data) {
    params = params.replace(/\./g, '')
    let cls = params.split(' ')
    let itCls = (data.itemClass || ' ').split(' ')
    let _cls = cls.filter(c => itCls.indexOf(c) === -1)
    itCls = itCls.concat(_cls)
    data.itemClass = (itCls.join(' ') || ' ')
    upData[key] = data
    return upData
  }
}

export function _css(key, params, data) {
  let upData = {}
  if (data) {
    let itStyle = params
    data.itemStyle = itStyle
    upData[key] = data
    return upData
  }
}

export function _removeClass(key, params, data) {
  if (!lib.isString(params)) return
  let upData = {}
  if (data) {
    params = params.replace(/\./g, '')
    let cls = params.split(' ')
    let itCls = (data.itemClass || ' ').split(' ')
    let _cls = itCls.filter(c => cls.indexOf(c) === -1)
    itCls = _cls
    data.itemClass = (itCls.join(' ') || ' ')
    upData[key] = data
    return upData
  }
}

export function _hasClass(params, data) {
  if (data) {
    params = params.replace(/\./g, '')
    let cls = params.split(' ')
    let itCls = (data.itemClass || ' ').split(' ')
    let _cls = cls.filter(c => itCls.indexOf(c) > -1)
    return cls.length === _cls.length
  }
}

// tmpData 数据格式 {"data[1]": {}, "data[2]": {}}
export function fakeListInstance(temp_data, listInst, listInstDelegate) {
  let theOldTempData = temp_data
  listInst.changedTimer = null
  function exec(forEachTmp, callback){
    clearTimeout(listInst.changedTimer)
    listInst.changedTimer = setTimeout(() => {
      listInst.update(forEachTmp, callback)
    }, 50);
  }
  return {
    $$is: 'fakelist',
    parentInst: listInst,
    length: Object.keys(temp_data).length,
    data: lib.clone(temp_data),
    getData() {
      // return this.data
      return listInstDelegate.__refreshData()
    },
    parent(param){
      if (listInstDelegate) {
        return listInstDelegate.parent(param)
      }
      return listInst.parent(param)
    },
    reset(){
      this.data = lib.clone(theOldTempData)
    },
    forEach(cb, callback) {
      let that = this
      let forEachTmp = {}
      let tmpData = this.data
      let datas = Object.keys(tmpData)
      let changed = false
      datas.forEach((key, ii) => {
        // let _data = {[key]: tmpData[key]}
        let _data = lib.clone(tmpData[key])
        if (lib.isFunction(cb)) {
          let context = {
            data: _data,
            parent(param){
              return that.parent(param)
            },
            attr(){
              return _data.attr
            },
            reset(){
              changed = true
              forEachTmp = Object.assign(forEachTmp, {[key]: tmpData[key]})
              exec(forEachTmp, callback)
            },
            getChilds(){
              if (_data && _data.idf) {
                let attr = _data.attr || {}
                let treeid = attr.treeid || attr['data-treeid']
                return listInst.childs[treeid]
              }
            },
            addClass(cls) {
              changed = true
              let clsData = _addClass(key, cls, _data)
              forEachTmp = Object.assign(forEachTmp, clsData)
              exec(forEachTmp, callback)
            },
            removeClass(cls) {
              changed = true
              let clsData = _removeClass(key, cls, _data)
              forEachTmp = Object.assign(forEachTmp, clsData)
              exec(forEachTmp, callback)
            },
            hasClass(cls) {
              return _hasClass(cls, _data)
            },
            toggleClass(cls) {
              if (this.hasClass(cls)) {
                this.removeClass(cls)
              } else {
                this.addClass(cls)
              }
            },
            update(param) {
              changed = true
              let keyData = {
                [key]: param
              }
              forEachTmp = Object.assign(forEachTmp, keyData)
              exec(forEachTmp, callback)
            }
          }
          cb(context, ii)
        }
      })
      changed && listInst.update(forEachTmp, callback)
    },
    hasClass(params){
      let hasCls = false
      let tmpData = this.data
      Object.keys(tmpData).forEach(key => {
        let data = tmpData[key]
        let clsData = _hasClass(params, data)
        if (clsData) hasCls = true
      })
      return hasCls
    },
    addClass(params, cb) {
      let tmpData = this.data
      if (!lib.isString(params)) return
      Object.keys(tmpData).forEach(key => {
        let data = tmpData[key]
        let clsData = _addClass(key, params, data)
        tmpData = Object.assign(tmpData, clsData)

        // let data = tmpData[key]
        // params = params.replace(/\./g, '')
        // let cls = (params || ' ').split(' ')
        // let itCls = (data.itemClass || ' ').split(' ')
        // let _cls = cls.filter(c => itCls.indexOf(c) === -1)
        // itCls = itCls.concat(_cls)
        // data.itemClass = (itCls.join(' ') || ' ')
        // tmpData[key] = data
      })
      listInst.update(tmpData, cb)
    },
    removeClass(params, cb) {
      let tmpData = this.data
      if (!lib.isString(params)) return
      Object.keys(tmpData).forEach(key => {
        let data = tmpData[key]
        let clsData = _removeClass(key, params, data)
        tmpData = Object.assign(tmpData, clsData)

        // let data = tmpData[key]
        // params = params.replace(/\./g, '')
        // let cls = (params || ' ').split(' ')
        // let itCls = (data.itemClass || ' ').split(' ')
        // let _cls = itCls.filter(c => cls.indexOf(c) === -1)
        // itCls = _cls
        // let mykey = key+'.itemClass'
        // tmpData[mykey] = (itCls.join(' ') || ' ')
      })
      listInst.update(tmpData, cb)
    },
    update(params, cb) {
      let tmpData = this.data
      Object.keys(tmpData).forEach(key => {
        let data = tmpData[key]
        data = Object.assign({}, data, params)
        tmpData[key] = data
      })
      listInst.update(tmpData, cb)
    }
  }
}

function getAllChilds(ctx, loop) {
  let xxx = []
  if (ctx.children) {
    if (loop) xxx = xxx.concat(ctx)
    if (ctx.children.length) {
      ctx.children.forEach(cld => {
        xxx =xxx.concat(getAllChilds(cld, true))
      })
    }
  }
  return xxx
}

function syncChildData(ctx, data) {
  let childs = getAllChilds(ctx)
  childs.forEach(item => {
    let _data = item.getData()
    let rid = _data.__relationId
    lib.syncChildData(data, rid, _data)
  })
  return data
}

export function listInstDelegate(treeid, listInst, from){
  listInst.batchUpdateTimmer = null
  let index = null
  if (treeid && (treeid.__realIndex || treeid.__realIndex===0)) {
    index = treeid.__realIndex
    treeid = treeid.attr['treeid'] || treeid.attr['data-treeid']
  } else {
    index = listInst.findIndex(treeid)
  }
  listInst.__foreachUpdata = listInst.__foreachUpdata || {}
  function exec(inst, cb){
    let __foreachUpdata = listInst.__foreachUpdata
    // 列表实例批量更新方法
    // exec方法允许执行以下若干更新方法后，触发批量更新数据并渲染
    // 本对象原来的使用环境是list.forEach场景中使用，由forEach方法批来量更新数据，脱离forEach后没有触发机制
    // 在有些场景当中本对象会作为个体变量传递给外部，如 return [inst1, inst2, inst3]
    // 此时即便应用了更新方法仍然不能更新数据、渲染，因为没有触发事件执行更新
    clearTimeout(inst.batchUpdateTimmer)
    inst.batchUpdateTimmer = setTimeout(() => {
      if (lib.isEmpty(__foreachUpdata)) return 
      inst.update(__foreachUpdata, function(){
        if (lib.isFunction(cb)) cb()
      })
      __foreachUpdata = {}
      listInst.__foreachUpdata = {}
    }, 20);
  }

  if (index || index === 0) {
    let data = (listInst.getData()).data[index]
    let key = `data[${index}]`
    return {
      treeid,
      index,
      parentInst: listInst,
      data: lib.clone(data),
      getData(){
        let $data = (listInst.getData()).data[index]
        return syncChildData(listInst, $data)
      },
      attr(){
        const $data = this.getData()
        return $data.attr
      },
      reset(param, cb){
        if (!param) param = {}
        const upData = {}
        const $data = {...listInst.originalDataSource.data[index]}
        if ($data) {
          let tmpData = param
          if (lib.isFunction(param)) {
            tmpData = param($data)||{}
          }
          tmpData = Object.assign({}, $data, tmpData)
          upData[key] = tmpData
          if (from === 'foreach') {
            listInst.__foreachUpdata = Object.assign({}, listInst.__foreachUpdata, upData)
            exec(listInst, cb)
          } else {
            listInst.update(upData, cb)
          }
        }

        // if (!param) return
        // let upData = {}
        // if (data) {
        //   if (lib.isFunction(param)) {
        //     data = param(data) || data
        //   } else {
        //     data = param
        //   }
        //   upData[key] = data
        //   if (from === 'foreach') {
        //     listInst.__foreachUpdata = Object.assign({}, listInst.__foreachUpdata, upData)
        //     this.exec()
        //   } else {
        //     listInst.update(upData, cb)
        //   }
        // }
      },
      parent(param){
        if (!param) return listInst
        else {
          let res = listInst.hasClass(param)
          if (!res && listInst.parentInst) {
            return listInst.parent(param)
          }
          return listInst
        }
      },
      getChilds(){
        if (data && data.idf) {
          return listInst.childs[treeid]
        }
      },
      css(params, cb) {
        // if (!lib.isString(params)) return
        if (typeof params !== 'string') return
        if (data) {
          data = this.getData()
        }
        let styData = _css(key, params, data)
        if (styData) {
          if (from === 'foreach') {
            listInst.__foreachUpdata = Object.assign({}, listInst.__foreachUpdata, styData)
            exec(listInst, cb)
          } else {
            listInst.update(styData, cb)
          }
        }
      },
      toggleClass(cls, cb) {
        if (cls) {
          let clsAry = lib.isString(cls) ? cls.split(' ') : []
          if (clsAry.length) {
            cls = clsAry[0]
            if (this.hasClass(cls)) {
              this.removeClass(cls, cb)
            } else {
              this.addClass(cls, cb)
            }
          }
        }
      },
      addClass(params, cb) {
        if (!lib.isString(params)) return
        if (data) {
          data = this.getData()
        }
        let clsData = _addClass(key, params, data)
        if (clsData) {
          if (from === 'foreach') {
            listInst.__foreachUpdata = Object.assign({}, listInst.__foreachUpdata, clsData)
            exec(listInst, cb)
          } else {
            listInst.update(clsData, cb)
          }
        }

        // if (!lib.isString(params)) return
        // let upData = {}
        // if (data) {
        //   // key = key + '.itemClass'
        //   params = params.replace(/\./g, '')
        //   let cls = params.split(' ')
        //   let itCls = (data.itemClass || ' ').split(' ')
        //   let _cls = cls.filter(c => itCls.indexOf(c) === -1)
        //   itCls = itCls.concat(_cls)
        //   data.itemClass = (itCls.join(' ') || ' ')
        //   upData[key] = data
        //   listInst.update(upData)
        // }
      },
      removeClass(params, cb) {
        if (!lib.isString(params)) return
        if (data) {
          data = this.getData()
        }
        let clsData = _removeClass(key, params, data)
        if (from === 'foreach') {
          listInst.__foreachUpdata = Object.assign({}, listInst.__foreachUpdata, clsData)
          exec(listInst, cb)
        } else {
          listInst.update(clsData, cb)
        }
      },
      hasClass(params) {
        if (data) {
          data = this.getData()
          return _hasClass(params, this.data)
        }
      },
      update(params, cb) {
        let upData = {}
        if (data) {
          data = this.getData()
          if (lib.isFunction(params)) {
            data = params(data) || data
          } else {
            data = Object.assign({}, data, params)
          }
          upData[key] = data
          if (from === 'foreach') {
            listInst.__foreachUpdata = Object.assign({}, listInst.__foreachUpdata, upData)
            exec(listInst, cb)
          } else {
            listInst.update(upData, cb)
          }
        }
      },
      show(cb) {
        let upData = {}
        if (data) {
          data = this.getData()
          if (data.show) return
          data.show = true
          upData[key] = data
          // listInst.update(upData)
          if (from === 'foreach') {
            listInst.__foreachUpdata = Object.assign({}, listInst.__foreachUpdata, upData)
            exec(listInst, cb)
          } else {
            listInst.update(upData, cb)
          }
        }
      },
      hide(cb) {
        let upData = {}
        if (data) {
          data = this.getData()
          if (data.show === false) return
          data.show = false
          upData[key] = data
          // listInst.update(upData)
          if (from === 'foreach') {
            listInst.__foreachUpdata = Object.assign({}, listInst.__foreachUpdata, upData)
            exec(listInst)
          } else {
            listInst.update(upData, cb)
          }
        }
      },
      remove(cb) {
        listInst.delete(treeid, cb)
      },
      delete(cb) {
        listInst.delete(treeid, cb)
      },
      siblings(param) { // 只针对class进行筛选
        function __refreshData() {
          let _tmpData = {};
          ((listInst.getData()).data || []).forEach((item, ii) => {
            if (ii !== index) {
              let key = `data[${ii}]`
              if (lib.isString(param)) {
                let cls = param.split(' ')
                let itCls = (item.itemClass || ' ').split(' ')
                let _cls = cls.filter(c => itCls.indexOf(c) > -1)
                if (cls.length === _cls.length) _tmpData[key] = item
              } else {
                _tmpData[key] = item
              }
            }
          })
          return _tmpData
        }
        let tmpData = lib.clone(__refreshData())
        this.__refreshData = __refreshData
        return fakeListInstance(tmpData, listInst, this)
        
        // return {
        //   length: Object.keys(tmpData).length,
        //   data: tmpData,
        //   getData(){
        //     return tmpData
        //   },
        //   forEach(cb){
        //     let forEachTmp = {}
        //     let datas = Object.keys(this.data)
        //     datas.forEach((key, ii) => {
        //       // let _data = {[key]: this.data[key]}
        //       let _data = this.data[key]
        //       if (lib.isFunction(cb)) {
        //         let context = {
        //           data: _data,
        //           addClass(cls){
        //             let clsData = _addClass(key, cls, _data)
        //             forEachTmp = Object.assign(forEachTmp, clsData)
        //           },
        //           removeClass(cls){
        //             let clsData = _removeClass(key, cls, _data)
        //             forEachTmp = Object.assign(forEachTmp, clsData)
        //           },
        //           hasClass(cls){
        //             return _hasClass(cls, _data)
        //           },
        //           update(param){
        //             let keyData = {[key]: param}
        //             forEachTmp = Object.assign(forEachTmp, keyData)
        //           }
        //         }
        //         cb(context, ii)
        //         // cb.call(context, _data, ii)
        //       }
        //       // if ((ii + 1) === datas.length) {
        //       //   listInst.update(forEachTmp)
        //       // }
        //     })
        //     listInst.update(forEachTmp)
        //   },
        //   addClass(params) {
        //     if (!lib.isString(params)) return
        //     Object.keys(tmpData).forEach(key => {
        //       let data = tmpData[key]
        //       let clsData = _addClass(key, params, data)
        //       tmpData = Object.assign(tmpData, clsData)
              
        //       // let data = tmpData[key]
        //       // params = params.replace(/\./g, '')
        //       // let cls = (params || ' ').split(' ')
        //       // let itCls = (data.itemClass || ' ').split(' ')
        //       // let _cls = cls.filter(c => itCls.indexOf(c) === -1)
        //       // itCls = itCls.concat(_cls)
        //       // data.itemClass = (itCls.join(' ') || ' ')
        //       // tmpData[key] = data
        //     })
        //     listInst.update(tmpData)
        //   },
        //   removeClass(params) {
        //     if (!lib.isString(params)) return
        //     Object.keys(tmpData).forEach(key => {
        //       let data = tmpData[key]
        //       let clsData = _removeClass(key, params, data)
        //       tmpData = Object.assign(tmpData, clsData)

        //       // let data = tmpData[key]
        //       // params = params.replace(/\./g, '')
        //       // let cls = (params || ' ').split(' ')
        //       // let itCls = (data.itemClass || ' ').split(' ')
        //       // let _cls = itCls.filter(c => cls.indexOf(c) === -1)
        //       // itCls = _cls
        //       // let mykey = key+'.itemClass'
        //       // tmpData[mykey] = (itCls.join(' ') || ' ')
        //     })
        //     listInst.update(tmpData)
        //   },
        //   update(params) {
        //     Object.keys(tmpData).forEach(key => {
        //       let data = tmpData[key]
        //       data = Object.assign({}, data, params)
        //       tmpData[key] = data
        //     })
        //     listInst.update(tmpData)
        //   }
        // }
      }
    }
  }
}

export function itemInstDelegate(subItemKey, ITEMINST, from) {
  const tmp = subItemKey.split('-')
  const subkey = tmp[0]
  const subkeyIndex = tmp[1]
  const data = ITEMINST.getData()
  const subData = data[subkey]
  const subItemData = data[subkey][subkeyIndex]
  const $data = lib.clone(subItemData)
  const key = `${subkey}['${subkeyIndex}']`
  const exec = function(indexData){
    subData[subkeyIndex] = indexData
    ITEMINST.update({
      [subkey]: subData
    })
  }
  return {
    data: subItemData,
    css(params, cb){
      if (!lib.isString(params)) return
      const upData = {...subItemData, itemStyle: params}
      exec(upData, cb)
    },
    addClass(params, cb){
      if (!lib.isString(params)) return
      let clsData = _addClass(key, params, subItemData)
      const upData = {...subItemData, ...clsData[key]}
      exec(upData, cb)
    },
    removeClass(params, cb){
      if (!lib.isString(params)) return
      let clsData = _removeClass(key, params, subItemData)
      const upData = {...subItemData, ...clsData[key]}
      exec(upData, cb)
    },
    hasClass(params){
      return _hasClass(params, subItemData)
    },
    toggleClass(cls, cb){
      if (cls && lib.isFunction(this.hasClass)) {
        let clsAry = lib.isString(cls) ? cls.split(' ') : []
        if (clsAry.length) {
          cls = clsAry[0]
          if (this.hasClass(cls)) {
            this.removeClass(cls, cb)
          } else {
            this.addClass(cls, cb)
          }
        }
      }
    },
    reset(param={}, cb){
      let tmpData = param
      if (lib.isFunction(param)) {
        tmpData = param($data)||{}
      }
      const upData = {...$data, ...tmpData}
      exec(upData, cb)
    },
    update(param={}, cb){
      let tmpData = param
      if (lib.isFunction(param)) {
        tmpData = param(subItemData)||{}
      }
      const upData = {...subItemData, ...tmpData}
      exec(upData, cb)
    },
    attr(key){
      if (key) {
        return subItemData.attr[key]
      }
      return subItemData.attr
    },
    show(cb){
      subItemData.show = true
      exec(subItemData, cb)
    },
    hide(cb){
      subItemData.show = false
      exec(subItemData, cb)
    },
    remove(){
      subData.splice(subkeyIndex, 1)
      ITEMINST.update({
        [`data[${subkey}]`]: subData
      })
    },
    siblings(cls){
      const siblins = []
      subData.forEach((item, ii)=>{
        if (ii !== subkeyIndex && lib.isObject(item)) {
          const _subItemKey = subkey+'-'+ii
          const bro = itemInstDelegate(_subItemKey, ITEMINST)
          if (cls) {
            if (bro.hasClass && bro.hasClass(cls)) {
              siblins.push(itemInstDelegate(_subItemKey, ITEMINST))
            }
          } else {
            siblins.push(itemInstDelegate(_subItemKey, ITEMINST))
          }
        }
      })
      return {
        data: siblins,
        forEach(cb){
          if (lib.isFunction(cb)) {
            siblins.forEach(cb)
          }
        },
        addClass(cls, cb){
          siblins.forEach(item=>{
            item.addClass && item.addClass(cls)
          })
          if (lib.isFunction(cb)) cb()
        },
        removeClass(cls, cb){
          siblins.forEach(item=>{
            item.removeClass && item.removeClass(cls)
          })
          if (lib.isFunction(cb)) cb()
        },
        toggleClass(cls){
          siblins.forEach(item=>{
            item.toggleClass && item.toggleClass(cls)
          })
          if (lib.isFunction(cb)) cb()
        },
        length: siblins.length,
      }
    },
    parent(){
      return ITEMINST
    },
    getData(){
      return subItemData
    },
  }
}

export const commonBehavior = (app, mytype) => {
  app = getmyApp(app)
  mytype = mytype || 'behavior'
  return Behavior({
    properties: {
      id: {
        type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
        // value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
        // observer: function () { }  // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        value: ''
      },
      fromComponent: {
        type: String,
        value: ''
      },
      fromTree: {
        type: String,
        value: ''
      },
      dataSource: Object,
    },
    definitionFilter(defFields, definitionFilterArr) {
      // 监管组件的setData
      defFields.methods = defFields.methods || {}
      defFields.methods._setData_ = function (data, callback) {
        let that = this
        let didUpdate = this.customLifeCycle.didUpdate
        const parentSamilarIdInstance = this.parentSamilarIdInstance
        const samilarContext = parentSamilarIdInstance
        /**
         * setData补充状态
         * selfDataChanging  // 内部方法修改中
         * selfDataChanged   // 内部方法是否已经修改过, false时，props允许修改，true时，拒绝修改
         * 
         * 配置参数补充参数
         * alwaysSyncProps   // 配置参数，true始终允许props传入数据修改，不保证现有状态, false不允许修改
         * forceSyncProps // alwaysSyncProps为false时，传入props包含此参数，则允许修改
         */

        const setCallback = function(ctx){
          return function(){
            if (that.activePage) {
              // 必须在页面稳定后执行
              // that.hooks.emit('didUpdate', {}, that)
              if (lib.isFunction(didUpdate)) {
                didUpdate.call(ctx)
              }

              that.activePage.doReady()
              if (lib.isFunction(callback)) {
                callback.call(ctx)
              }
            } else {
              that.hooks.on('__ready', function() {
                that.activePage && that.activePage.doReady()
                if (lib.isFunction(callback)) {
                  callback.call(ctx)
                }
              })
            }
          }
        }

        const originalSetData = this._originalSetData // 原始 setData
        originalSetData.call(this, data, setCallback(this) )
        
        if (parentSamilarIdInstance && parentSamilarIdInstance.uniqId !== this.uniqId) {
          parentSamilarIdInstance.setData(data, setCallback(samilarContext))
        }
      }
    },
    externalClasses: ['class-name'],
    relations: {},
    pageLifetimes: {
      // 页面被展示
      // console.log(app.globalData.currentPage);
      show: function () { },
      // 页面被隐藏
      hide: function () { },
      // 页面尺寸变化
      resize: function (size) { }
    },
    lifetimes: {
      // 初始化，啥数据都没有，但可以给this设置一些预定义值，可以在后面的生命周期调用
      created: function(params) {
        this.uniqId = lib.suid(mytype)
        this.hooks = lib.hooks(this.uniqId)
        this.$$type = mytype
        this.init = true // 第一次进入
        this.mounted = false
        this.children = []
        // app['_vars'][this.uniqId] = this
        this._originalSetData = this.setData // 原始 setData
        this.setData = this._setData_ // 封装后的 setData
        this.selfDataChanging = false
        this.selfDataChanged = false
        this.isINmemery = false
        this.parentSamilarIdInstance = null


        this.customLifeCycle = {
          created: null,
          attached: null,
          ready: null,
          moved: null,
          detached: null,
          didUpdate: null
        };
      },
      //节点树完成，可以用setData渲染节点，但无法操作节点
      attached: function () { //节点树完成，可以用setData渲染节点，但无法操作节点
        let that = this
        let pages = getCurrentPages()
        let activePage = this.activePage || pages[pages.length - 1] || app.activePage
        this.activePage = activePage
        if (!this.activePage) {
          app.__active_page__.push(function(actpage){
            that.activePage = actpage
          })
        }

        // this.properties = lib.clone(this.properties)
        let properties = this.properties
        let ds = (properties.item || properties.list || properties.dataSource || {})
        if (lib.isObject(ds) || lib.isArray(ds)) this.originalDataSource = lib.clone(ds)
        else {
          this.originalDataSource = ds
        }

        if (lib.isObject(ds)) {

          this.customLifeCycle = {
            created: ds.created,
            attached: ds.attached,
            ready: ds.ready,
            moved: ds.moved,
            detached: ds.detached,
            didUpdate: ds.didUpdate
          };

          // delete ds.created; 
          // delete ds.attached;
          // delete ds.ready;
          // delete ds.moved;
          // delete ds.detached;

          if (typeof this.customLifeCycle.created === 'function') {
            this.customLifeCycle.created.call(this)
          }
          
          if (ds.$$id || ds.id || this.data.id) {
            activePage['elements'] = activePage['elements'] || {}
            // activePage[(ds.$$id||ds.id)] = this
            activePage['elements'][(ds.$$id || ds.id || this.data.id)] = this
          }

          if (ds.methods) {
            if (lib.isObject(ds.methods)) {
              Object.keys(ds.methods).forEach(key => {
                let fun = ds.methods[key]
                if (lib.isFunction(fun)) {
                  this[key] = fun.bind(this)
                }
              })
            }
            // delete ds.methods
            // delete this.originalDataSource.methods
          }

          for (let ky in ds) {
            const val = ds[ky]
            if (lib.isFunction(val)) {
              this[ky] = val
            }
          }
        }

        let preSet = {
          uniqId: this.uniqId,
          show: true,
          fromComponent: this.data.fromComponent || ''
        }

        if (lib.isObject(ds)) {
          ds['show'] = ds.hasOwnProperty('show') ? ds.show : true
          preSet.show = ds['show']
          preSet.fromComponent = ds.fromComponent || ''

          /**
           * 设置this.data.fromParent为自身
           * ds数据需要传递给其子组件使用，子组件需要知道来源组件 
           */
          preSet.__fromParent = this.uniqId
          preSet.id = properties.id || ds.id || ''

          /**
           * ds.treeid是透过模板传递过来的
           * 只有继承了列表类，数据项中才会有treeid，普通的item类数据没有
           * 所有列表项都有treeid，但列表项的(body,footer..)的子项无法定位到列表项上
           * 列表项的treeid设置在item.attr['data-treeid']上
           * (body, footer)的子项由item组件实现，treeid由父级数据(列表项)传递过来，在item.treeid上
           * 列表项数据
           * {
           *  title: '',
           *  attr: {'data-treeid': 'hash'}
           * }
           * 
           * 列表子项数据解析后结构
           * {
           *  title: '',
           *  body: [   {title: '', treeid: 'hash 来自上一级传递attr'}  ]
           * }
           */
          if (ds.treeid) {
            this.treeid = ds.treeid
          }
        }

        // if (!preSet.fromComponent) delete preSet.fromComponent
        // if (!preSet.id) delete preSet.id
        this.setData(preSet)
      },


      //组件布局完成，这时可以获取节点信息，也可以操作节点
      ready: function (params) {
        const that = this
        this.init = false
        this.mounted = true
        this._mount()
        this.hooks.emit('ready')
        this.hooks.fire('__ready')

        const activePage = this.activePage || app.activePage
        activePage.hooks.reverseOn('__READY', function() {
          that.__ready && typeof that.__ready==='function' && that.__ready()
          if (typeof that.customLifeCycle.ready === 'function') {
            that.customLifeCycle.ready.call(that)
          }
          if (activePage.__rendered) {
            activePage.hooks.fire('__READY')
          }
        })

      },

      //组件实例被移动到树的另一个位置
      moved: function () {
        if (this.__moved) {
          this.__moved()
        }
        if (typeof this.customLifeCycle.moved === 'function') {
          this.customLifeCycle.moved.call(this)
        }
      },

      //组件实例从节点树中移除
      detached: function () {
        if (this.__detached) {
          this.__detached()
        }
        if (typeof this.customLifeCycle.detached === 'function') {
          this.customLifeCycle.detached.call(this)
        }
        this.hooks.emit('componentDetached')
      }
    },
    methods: {
      parent(param, ctx){
        if (!ctx) ctx = this
        let res = null
        let treeid = ctx.treeid
        const relationId = ctx.getData().__relationId
        if (relationId && relationId.indexOf('__') > -1) {
          treeid = relationId.split('__')[0]
        }
        if (treeid && ctx.parentInst && ctx.parentInst.$$is === 'list') {
          if (param) {
            res = listInstDelegate(treeid, ctx.parentInst)
            if (res) {
              if (res.hasClass(param)) {
                return res
              } else {
                return res.parent(param)
              }
            }
          } else {
            return listInstDelegate(treeid, ctx.parentInst)
          }
        }

        if (!param) {
          res = ctx.parentInst
        }

        if (lib.isString(param)) {
          param = param.replace('.', '')
          if (lib.isFunction(ctx.hasClass)) {
            if (ctx.hasClass(param)) res = ctx
          }
        }

        if (!res && ctx.parentInst) {
          return ctx.parent(param, ctx.parentInst)
        }
        
        return res
      },

      siblings(param){
        let tmp = []
        let $is = this.$$is
        let itemPropertyPrefix = [
          ['hb-item', 'body'], 
          ['hdot-item', 'dot'], 
          ['hf-item', 'footer'], 
          ['li-item', 'li'], 
          ['t-item', 'title']
        ]
        if (this.parentInst) {
          let clstype = null
          let datatype = null
          for (let ii=0; ii<itemPropertyPrefix.length; ii++) {
            let cls = itemPropertyPrefix[ii][0]
            let dt = itemPropertyPrefix[ii][1]
            if (this.hasClass(cls)) { 
              clstype = cls;
              datatype = dt
              break;
            }
          }
          if (this.parentInst.$$is === 'item') {
            tmp = clstype ? this.parentInst.children.filter(
              item => lib.isFunction(item.hasClass) && item.hasClass(clstype) && item.uniqId !== this.uniqId
            ) : []
          }
          if (this.parentInst.$$is === 'list') {
            this.parentInst.forEach(item=>{
              if (item.data.__relationId === this.data.item.__relationId) {
                tmp = item
                return item
              }
            })
            return tmp.siblings()
          }
        }

        tmp = lib.isString(param) ? tmp.filter(item => item.hasClass(param)) : tmp
        const that = this
        return {
          parent: function(){
            return that.parentInst
          },
          addClass: params => tmp.forEach($inst => $inst.addClass(params)),
          removeClass: params => tmp.forEach($inst => $inst.removeClass(params)),
          update: params => tmp.forEach($inst => $inst.update(params)),
          // setData: params => tmp.forEach($inst => $inst.setData(params)),
          forEach(cb){
            tmp.forEach((item, ii) => {
              if (lib.isFunction(cb)) {
                cb(item, ii)
                // cb.call(item, item.getData())
              }
            })
          },
          length: tmp.length,
          data: tmp
        }
        // return tmp.length === 1 ? tmp[0] : {
        //   addClass: params => tmp.forEach($inst => $inst.addClass(params)),
        //   removeClass: params => tmp.forEach($inst => $inst.removeClass(params)),
        //   update: params => tmp.forEach($inst => $inst.update(params)),
        //   // setData: params => tmp.forEach($inst => $inst.setData(params)),
        //   forEach(cb){
        //     tmp.forEach((item, ii) => {
        //       if (lib.isFunction(cb)) {
        //         cb(item, ii)
        //         // cb.call(item, item.getData())
        //       }
        //     })
        //   },
        //   length: tmp.length,
        //   data: tmp
        // }
      },

      getData: function() {
        return this.data.$item || this.data.$list || this.data.$dataSource || this.data.dataSource || {}
      },

      css: function (param = {}, cb) {
        let cssStr = ''
        if (typeof param === 'string') {
          cssStr = param
        } else {
          Object.keys(param).forEach(attr => {
            const val = param[attr]
            cssStr += `${attr}: ${val};`
          })
        }
        if (this.$$is == 'item') {
          this.setData({
            '$item.itemStyle': cssStr
          }, cb)
        } 
        else if (this.$$is == 'list' || this.$$is == 'tree') {
          this.setData({
            // '$list.itemStyle': cssStr
            '$list.listStyle': cssStr
          }, cb)
        }
        else if (this.data.$dataSource) {
          this.setData({
            '$dataSource.itemStyle': cssStr
          }, cb)
        }
        return this
      },

      toggleClass(cls, cb) {
        if (cls && lib.isFunction(this.hasClass)) {
          let clsAry = lib.isString(cls) ? cls.split(' ') : []
          if (clsAry.length) {
            cls = clsAry[0]
            if (this.hasClass(cls)) {
              this.removeClass(cls, cb)
            } else {
              this.addClass(cls, cb)
            }
          }
        }
      },

      _getAppVars: function(key) {
        const $ds = this.data.$item || this.data.$list || this.data.dataSource
        const id = key || this.data.fromComponent || ($ds && $ds['fromComponent'])
        if (id) {
          return app['_vars'][id] || {}
        }
        return {}
      },

      _preGetAppVars(key, params, son) {
        const {fun} = params
        let ctx = son || this

        if (!fun) {
          return ctx
        }

        function getParent(_key, context){
          const $ds = context && context.data && (context.data.$item || context.data.$list || context.data.dataSource)
          if ($ds) {
            const id = _key || context.data.fromComponent || ($ds && $ds['fromComponent'])
            return app['_vars'][id]
          }
        }

        const parent = getParent(key, ctx)
        if (parent) {
          const $ds = parent.data.$item || parent.data.$list || parent.data.dataSource
          const fromComponent = parent.data.fromComponent || ($ds && $ds['fromComponent'])
          if (parent.uniqId === ctx.uniqId) {
            return ctx
          } else if (parent[fun]) {
            return parent
          }
          else if (fromComponent) {
            return this._preGetAppVars(fromComponent, params, parent)
          }
          return parent
        } else {
          return ctx
        }
      },

      generateUpdate: function(_keyid, cb) {
        const that = this
        if (_keyid) {
          const keyId = `${_keyid}.`
          this.update = function (param) {
            if (lib.isObject(param)) {
              let target = {}
              Object.keys(param).forEach(key => {
                if (key.indexOf(keyId) == -1) {
                  const nkey = keyId + key
                  target[nkey] = param[key]
                } else {
                  target[key] = param[key]
                }
              })
              param = target
              this.setData(param, function() {
                if (lib.isFunction(cb)) cb.call(that)
              })
            }
          }
        }
        return this
      },
      
      _mount(id){
        let that = this
        let pages = getCurrentPages()
        let activePage = this.activePage || pages[pages.length - 1]
        if (!activePage) {
          app.hooks.on('__MOUNT', function() {
            that._mount(id)
          })
          return 
        } else {
          app.hooks.fire('__MOUNT')
        }
        let elements = activePage['elements'] || {}
        let eles = activePage['eles'] || {}
        let uniqId = this.uniqId
        let $is = this.$$is
        let $ds = lib.isObject(this.originalDataSource) ? this.originalDataSource : {}
        let fromComponent = this.data.fromComponent || ($ds && $ds['fromComponent'])
        let fromTree = this.data.fromTree || ($ds && $ds['fromTree'])
        let __fromParent = $ds['__fromParent']
        let $$id = $ds['$$id'] || $ds['id']
        let _id = this.data.id
        let pageDataKey = eles[$$id]
        // app['_vars'][uniqId] = this
        // if (id) {
        //   elements[id] = this
        // }
        // if (this.data.id) {
        //   elements[_id] = this
        // }
        // if ($$id) {
        //   elements[$$id] = this
        // }
        // if (pageDataKey) {
        //   elements[pageDataKey] = this
        // }
        if (fromComponent) {
          this.componentInst = app['_vars'][fromComponent]
        }
        if (__fromParent) {
          this.parentInst = app['_vars'][__fromParent]
          if (this.parentInst) {
            const eleId = _id || $$id
            let   parentSamilarIdInstance = null
            this.parentInst.children.forEach(child=>{
              const $data = child.getData()
              const $$id = child.id || $data.id || $data.$$id
              if ($$id && eleId && ($$id === eleId)) {
                parentSamilarIdInstance = child  // true
              }
            })
            this.parentSamilarIdInstance = parentSamilarIdInstance
            if (!parentSamilarIdInstance) {
              this.parentInst.children.push(this)
            }
          }
        }
        if (lib.isString(fromTree)) {
          let treeInst = app['_vars'][fromTree]
          this.treeInst = treeInst
        }
        activePage['elements'] = elements

        this.hooks.one('componentDetached', function () {
          app['_vars'][uniqId] = null
          if (_id) activePage['elements'][_id] = null
          if ($$id) activePage['elements'][$$id] = null
          if (pageDataKey) activePage['elements'][pageDataKey] = null
        })
      },
      mount: function(id) {
        this._mount(id)
      },
      show: function(cb) {
        let data = this.getData()
        if (data.show) return
        lib.isFunction(this.update) && this.update({ show: true }, cb)
      },
      hide: function(cb) {
        let data = this.getData()
        if (!data.show) return
        lib.isFunction(this.update) && this.update({ show: false }, cb)
      },
      toggle: function(cb) {
        const data = this.getData()
        const toggleShow = data.show ? false : true
        if (lib.isFunction(this.update)) {
          this.update({show: toggleShow}, function() {
            if (lib.isFunction(cb)) cb(toggleShow)
          })
        }
      },
    }
  })
}

export const commonMethodBehavior = (app, mytype) => {
  app = getmyApp(app)
  return Behavior({
    behaviors: [],
    methods: {
      _rightEvent: function (e, prefix) {
        const specialKey = ['error']

        let that = this
        let is = this.$$is
        let currentTarget = e.currentTarget
        let dataset = currentTarget.dataset
        let activePage = this.activePage

        let oType = e.__type || e.type
        if (specialKey.includes(oType)) {
          oType = 'bind'+oType
        }
        let nType = (prefix ? prefix + oType : oType).replace('catchcatch', 'catch')
        let dsetEvtStr = dataset['evt'].replace(/_(tap|aim|catchtap|longpress|catchlongpress)/, '$1').replace(/aim=/g, 'catchtap=')
        // let dsetEvtStr = dataset['evt'].replace(/_/g, '').replace(/aim/g, 'catchtap')
        let dsetEvt = nType + '@@' + dsetEvtStr
        
        if (is == 'list' || is == 'tree') {
          const mytype = this.data.$list.type
          if (mytype && (mytype.is == 'scroll' || mytype.is == 'swiper' || mytype.slip)) {
            dsetEvt = 'bind' + dsetEvt
          }
        }

        if (is == 'form') {
          dsetEvt = 'bind' + dsetEvt
        }

        if (dataset.isform) {
          dsetEvt = 'bind' + dsetEvt
        }
        
        let rEvt = rightEvent(dsetEvt)
        if (!rEvt.fun) {
          dsetEvt = dsetEvt.replace('bind', '')
          let _rEvt = rightEvent(dsetEvt)
          if (_rEvt.fun) rEvt = _rEvt
        }
        e.currentTarget.dataset._query = rEvt.param

        let attr = this.attr && this.attr()
        if (lib.isObject(attr)) {
          let dset = e.currentTarget.dataset
          Object.keys(attr).forEach(kn => dset[kn] = attr[kn])
          e.currentTarget.dataset = dset
        }
        
        return rEvt
      },

      itemMethod: function (e) {
        reactFun.call(this, app, e)
      },

      catchItemMethod: function (e) {
        reactFun.call(this, app, e, 'catch')
      },

      imgPreview: function(e) {
        let currentTarget = e.currentTarget
        let dataset = currentTarget.dataset
        let src = dataset.src
        let treeid = dataset.treeid

        let $item = this.data.$item
        if (treeid) {
          let index = this.findIndex(treeid)
          if (index === undefined) return
          $item = this.data.$list.data[index]
        }

        let $img = $item.img
        let findIt = null
        if (lib.isArray($img)) {
          // findIt = $img.find({src})
          findIt = ($img.filter(pic=> pic.src === src ))[0]
        } else {
          findIt = $img
        }

        if (findIt) {
          let preview = findIt.preview
          let previewConfig = {
            current: src,
            urls: [src]
          }
          if (lib.isArray(preview)) {
            previewConfig = {
              current: src,
              urls: preview
            }
          }
          wx.previewImage(previewConfig)
        }
      }
    }
  })
}

function getParent(ctx, f) {
  if (ctx.parentInst) {
    if (ctx.parentInst[f]) {
      return ctx.parentInst
    } else {
      return getParent(ctx.parentInst, f)
    }
  }
}

export function reactFun(app, e, prefix) {
  app = getmyApp(app)
  if (this.treeInst) {
    this.treeInst[(prefix ? 'catchItemMethod' : 'itemMethod')].call(this.treeInst, e, prefix)
    return false
  }
  const that = this
  let   enableTik = true
  const activePage = this.activePage
  const oType = e.__type || e.type

  let rEvt = this._rightEvent(e, prefix)
  let {fun, param, allParam} = rEvt
  if (fun === 'true') return
  if (!fun && prefix) {
    if (allParam[oType]) {
      const tmp = allParam[oType]
      if (lib.isObject(tmp)) {
        fun = tmp.fun
        param = tmp.param
      } else {
        const tmp = lib.formatQuery(allParam[oType])
        fun = tmp.url
        param = tmp.query
      }
    }
  }

  let currentTarget = e.currentTarget
  let dataset = currentTarget.dataset
  let is = this.$$is
  let context = this
  if (dataset) {
    const treeid = (dataset['treeid'] || dataset['data-treeid'])
    const relationId = dataset['relationid']
    const subkey = dataset['subkey']
    if (is === 'item' && subkey) {
      context = itemInstDelegate(subkey, this)
    }

    if (is === 'list') {
      if (treeid) {
        if (this.$$type === 'tree') {
          const that = this
          context = this.find(treeid)
          context.parent = function() {
            return that
          }
        } else {
          if (subkey) {
            const ctx = listInstDelegate(treeid, this)
            context = itemInstDelegate(subkey, ctx)
          } else {
            context = listInstDelegate(treeid, this)
          }
        }
      }

      if (subkey) {
        if (relationId && relationId.indexOf('__') > -1) {
          const treeid = relationId.split('__')[0]
          const ctx = listInstDelegate(treeid, this)
          context = itemInstDelegate(subkey, ctx)
        }
      }
    }
  }
  
  if (fun) {
    let rootInstance = this._preGetAppVars(null, rEvt)
    if (lib.isEmpty(rootInstance)) {
      rootInstance = undefined
    }
    let parentInstance = getParent(this, fun)

    const parentSamilarIdInstance = this.parentSamilarIdInstance
    
    e.currentTarget.dataset._query = param
    const evtFun = activePage[fun] || app.activePage[fun]
    const thisFun = this[fun]
    const isEvt = lib.isFunction(evtFun)
    let vals = this.hooks.emit('instBindBefore', {ctx: this, event: e, funName: fun, param})
    if (vals) {

    } else {
      if (lib.isFunction(thisFun)) {
        thisFun.call(this, e, param, context)
      } 
      else if (parentSamilarIdInstance &&lib.isFunction(parentSamilarIdInstance[fun])) {
        parentSamilarIdInstance[fun].call(parentSamilarIdInstance, e, param, context)
      } 
      else if (parentInstance && lib.isFunction(parentInstance[fun])) {
        parentInstance[fun].call(parentInstance, e, param, context)
      } 
      else if(rootInstance && lib.isFunction(rootInstance[fun])) {
        rootInstance[fun].call(rootInstance, e, param, context)
      } 
      else {
        if (isEvt) evtFun.call(activePage, e, param, context)
        else {
          enableTik = false
          console.warn(`找不到定义的${fun}方法`)
        }
      }
    }

    if (enableTik && is === 'item') {
      const $data = this.getData()
      if ($data.tik === true) {
        vibrateShort()
      }
    }
  }
}

// 将 item/list元件中配置文件中的hooks属性剥离出来
// 挂载到该实例的hooks属性上
export function setPropsHooks(props) {
  if (props && lib.isObject(props) && props.hooks) {
    const myHooks = props.hooks
    const thisHooks = this.hooks
    Object.keys(myHooks).forEach(key => {
      let fun = myHooks[key]
      if (lib.isFunction(fun)) {
        thisHooks.once(key, fun)
      }

      if (lib.isArray(fun) && lib.isString(fun[0]) && lib.isFunction(fun[1])) {
        if (thisHooks[fun[0]]) {
          // fun[0] => setItem getItem on one once ....
          // fun[1] => 用户传导过来的自定义方法
          thisHooks[fun[0]](key, fun[1])
        }
      }
    })
    delete props.hooks
  }
  return props
}