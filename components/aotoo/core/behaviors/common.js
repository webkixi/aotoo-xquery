const lib = require('../../lib/index')

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
    let _cls = cls.filter(c => itCls.indexOf(c) !== -1)
    return cls.length === _cls.length
  }
}

// tmpData 数据格式 {"data[1]": {}, "data[2]": {}}
export function fakeListInstance(temp_data, listInst, listInstDelegate) {
  let theOldTempData = temp_data
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
      datas.forEach((key, ii) => {
        // let _data = {[key]: tmpData[key]}
        let _data = tmpData[key]
        if (lib.isFunction(cb)) {
          let context = {
            data: _data,
            parent(param){
              return that.parent(param)
            },
            getChilds(){
              if (_data && _data.idf) {
                let attr = _data.attr || {}
                let treeid = attr.treeid || attr['data-treeid']
                return listInst.childs[treeid]
              }
            },
            addClass(cls) {
              let clsData = _addClass(key, cls, _data)
              forEachTmp = Object.assign(forEachTmp, clsData)
            },
            removeClass(cls) {
              let clsData = _removeClass(key, cls, _data)
              forEachTmp = Object.assign(forEachTmp, clsData)
            },
            hasClass(cls) {
              return _hasClass(cls, _data)
            },
            update(param) {
              let keyData = {
                [key]: param
              }
              forEachTmp = Object.assign(forEachTmp, keyData)
            }
          }
          cb(context, ii)
          // cb.call(context, _data, ii)
        }
        // if ((ii + 1) === datas.length) {
        //   listInst.update(forEachTmp)
        // }
      })
      listInst.update(forEachTmp, callback)
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
  let index = null
  if (treeid && (treeid.__realIndex || treeid.__realIndex===0)) {
    index = treeid.__realIndex
    treeid = treeid.attr['treeid'] || treeid.attr['data-treeid']
  } else {
    index = listInst.findIndex(treeid)
  }
  if (index || index === 0) {
    let data = (listInst.getData()).data[index]
    let key = `data[${index}]`
    return {
      treeid,
      parentInst: listInst,
      data: lib.clone(data),
      getData(){
        let $data = (listInst.getData()).data[index]
        return syncChildData(listInst, $data)
      },
      exec(cb){
        // 列表实例批量更新方法
        // exec方法允许执行以下若干更新方法后，触发批量更新数据并渲染
        // 本对象原来的使用环境是list.forEach场景中使用，由forEach方法批来量更新数据，脱离forEach后没有触发机制
        // 在有些场景当中本对象会作为个体变量传递给外部，如 return [inst1, inst2, inst3]
        // 此时即便应用了更新方法仍然不能更新数据、渲染，因为没有触发事件执行更新
        if (!listInst.__foreachUpdata) return 
        listInst.update(listInst.__foreachUpdata, cb)
      },
      reset(param, cb){
        if (!param) return
        let upData = {}
        if (data) {
          if (lib.isFunction(param)) {
            data = param(data) || data
          } else {
            data = param
          }
          upData[key] = data
          if (from === 'foreach') {
            listInst.__foreachUpdata = Object.assign({}, listInst.__foreachUpdata, upData)
          } else {
            listInst.update(upData, cb)
          }
        }
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
        } else {
          listInst.update(clsData, cb)
        }
      },
      hasClass(params) {
        return _hasClass(params, data)
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
          } else {
            listInst.update(upData, cb)
          }
        }
      },
      show(cb) {
        let upData = {}
        if (data) {
          data = this.getData()
          data.show = true
          upData[key] = data
          // listInst.update(upData)
          if (from === 'foreach') {
            listInst.__foreachUpdata = Object.assign({}, listInst.__foreachUpdata, upData)
          } else {
            listInst.update(upData, cb)
          }
        }
      },
      hide(cb) {
        let upData = {}
        if (data) {
          data = this.getData()
          data.show = false
          upData[key] = data
          // listInst.update(upData)
          if (from === 'foreach') {
            listInst.__foreachUpdata = Object.assign({}, listInst.__foreachUpdata, upData)
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

export const commonBehavior = (app, mytype) => {
  app = app || getApp()
  mytype = mytype || 'behavior'
  return Behavior({
    properties: {
      id: {
        type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
        // value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
        // observer: function () { }  // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
      },
      fromComponent: {
        type: String,
        value: ''
      }
    },
    definitionFilter(defFields, definitionFilterArr) {
      // 监管组件的setData
      defFields.methods = defFields.methods || {}
      defFields.methods._setData_ = function (data, callback) {
        let that = this
        const originalSetData = this._originalSetData // 原始 setData
        originalSetData.call(this, data, function() {
          if (that.activePage) {
            that.activePage.doReady()
            if (lib.isFunction(callback)) {
              callback.call(this)
            }
          } else {
            that.hooks.on('__ready', function() {
              that.activePage.doReady()
              if (lib.isFunction(callback)) {
                callback.call(this)
              }
            })
          }
        }) // 做 data 的 setData
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
        app['_vars'][this.uniqId] = this
        this._originalSetData = this.setData // 原始 setData
        this.setData = this._setData_ // 封装后的 setData
      },
      //节点树完成，可以用setData渲染节点，但无法操作节点
      attached: function () { //节点树完成，可以用setData渲染节点，但无法操作节点
        // let properties = this.properties
        // if (lib.isObject(properties.item)) {
        //   properties.item = lib.clone(properties.item)
        // }
        // if (lib.isObject(properties.list)) {
        //   properties.list = lib.clone(properties.list)
        // }
        // if (lib.isObject(properties.dataSource)) {
        //   properties.dataSource = lib.clone(properties.dataSource)
        // }
        
        // // ??? 没有赋值给$item/$list，造成不能通过show/hide来显示隐藏结构
        // let props = (properties.item || properties.list || properties.dataSource || {})
        // if (lib.isObject(props)) {
        //   props['show'] = props.hasOwnProperty('show') ? props.show : true
        // }
        // let id = properties.id
        // // this.mountId = props.$$id ? false : id  // 如果$$id，则交给
        // this.mountId = id || props.$$id // 如果$$id，则交给
        // this.setData({uniqId: this.uniqId})

        let that = this
        let pages = getCurrentPages()
        let activePage = this.activePage || pages[pages.length - 1]

        this.properties = lib.clone(this.properties)
        let properties = this.properties
        let ds = (properties.item || properties.list || properties.dataSource || {})
        if (lib.isObject(ds) || lib.isArray(ds)) this.originalDataSource = lib.clone(ds)
        else this.originalDataSource = ds
        if (lib.isObject(ds)) {
          if (ds.methods) {
            if (lib.isObject(ds.methods)) {
              Object.keys(ds.methods).forEach(key => {
                let fun = ds.methods[key]
                if (lib.isFunction(fun)) {
                  // this[key] = fun.bind(this)
                  this[key] = fun.bind(this)
                }
              })
            }
            delete ds.methods
            delete this.originalDataSource.methods
          }
        }

        let preSet = {
          uniqId: this.uniqId,
          show: true,
          fromComponent: this.data.fromComponent
        }
        if (lib.isObject(ds)) {
          ds['show'] = ds.hasOwnProperty('show') ? ds.show : true
          preSet.show = ds['show']
          preSet.fromComponent = ds.fromComponent

          /**
           * 设置this.data.fromParent为自身
           * ds数据需要传递给其子组件使用，子组件需要知道来源组件 
           */
          preSet.__fromParent = this.uniqId
          preSet.id = properties.id || ds.id

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
        if (!preSet.fromComponent) delete preSet.fromComponent
        if (!preSet.id) delete preSet.id
        this.setData(preSet)

        if (this.__ready) {
          if (activePage.hooks) {
            activePage.hooks.reverseOn('__READY', function () {
              that.__ready()
            })
          } else {
            activePage.__READY = [that.__ready].concat(activePage.__READY||[])
          }
        }
      },


      //组件布局完成，这时可以获取节点信息，也可以操作节点
      ready: function (params) {
        const that = this
        this.init = false
        this.mounted = true
        this.activePage = app.activePage
        // // let oriData = this.data.item || this.data.list || this.data.dataSource || {}
        // // this.originalDataSource = lib.clone(oriData)
        
        
        
        
        // this.mount()
        
        this._mount()
        this.hooks.emit('ready')
        this.hooks.fire('__ready')

        // if (this.__ready) {
        //   console.log('======= 3333');
        //   this.activePage.hooks.reverseOn('__READY', function() {
        //     that.__ready()
        //   })
        //   // if (this.activePage.__rendered) {
        //   //   clearTimeout(this.activePage.timmer)
        //   //   this.activePage.timmer = setTimeout(() => {
        //   //     that.activePage.hooks.fire('__READY')
        //   //   }, 60);
        //   // }
        // }

        // let ods = this.originalDataSource
        // if (ods && lib.isObject(ods) && ods.__fromParent) {
        //   this.parentInst = app['_vars'][ods.__fromParent]
        //   this.parentInst && this.parentInst.children.push(this)
        // }

        // /** 执行在数据中预置__ready方法
        //  * {
        //  *    title: '',
        //  *    methods: {
        //  *      __ready(){}
        //  *    }
        //  * }
        // */
        // if (this.__ready&&lib.isFunction(this.__ready)) {
        //   let activePage = this.activePage
        //   that.__ready()
        //   // if (activePage.__rendered) {
        //   //   that.__ready()
        //   // } else {
        //   //   this.activePage.hooks.on('onReady', function() {
        //   //     // setTimeout(that.__ready.bind(that), 50);
        //   //     // that.__ready.call(that)
        //   //     that.__ready()
        //   //   })
        //   // }
        // }




        // let activePage = this.activePage
        // let proto = activePage.__prototype
        // let uniqId = this.uniqId
        // let fcid = this.data.fromComponent || this.originalDataSource.fromComponent
        // if (fcid) {
        //   proto[fcid] = (proto[fcid]||[fcid]).concat(uniqId)
        // } else {
        //   proto[uniqId] = [uniqId]
        // }
        // activePage.__prototype = proto
      },

      //组件实例被移动到树的另一个位置
      moved: function () {},

      //组件实例从节点树中移除
      detached: function () {
        this.hooks.emit('componentDetached')
        // this.hooks = null
        // setTimeout(() => {
        //   app['_vars'][this.uniqId] = null
        // }, 50);
      }
    },
    methods: {
      // __getAppVers(param){
      //   if (lib.isString(param)) {
      //     return app['_vars'][param]
      //   }
      // },

      findPath(param){
        /** 查找路径 */
      },

      parent(param, ctx){
        if (!ctx) ctx = this
        let res

        if (ctx.treeid && ctx.parentInst && ctx.parentInst.$$is === 'list') {
          if (param) {
            res = listInstDelegate(ctx.treeid, ctx.parentInst)
            if (res) {
              if (res.hasClass(param)) {
                return res
              } else {
                return res.parent(param)
              }
            }
          } else {
            return listInstDelegate(ctx.treeid, ctx.parentInst)
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
            let parentInst = this.parentInst
            if (this.treeid) {  // 存在this.treeid，表明该数据为(body, dot...)数据 正常父级应该是item，为list表明是混合结构
              tmp = clstype ? this.parentInst.children.filter(
                item => (item.treeid === this.treeid && item.uniqId !== this.uniqId)
              ) : []
            } else {
              tmp = this.parentInst.children.filter( item => (
                lib.isFunction(item.attr) && 
                item.attr() && 
                item.uniqId !== this.uniqId
              ))
            }
          }
        }

        tmp = lib.isString(param) ? tmp.filter(item => item.hasClass(param)) : tmp
        return tmp.length === 1 ? tmp[0] : {
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
      },

      getData: function() {
        return this.data.$item || this.data.$list || this.data.$dataSource || this.data.dataSource || {}
      },

      css: function (param = {}) {
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
          })
        } 
        else if (this.$$is == 'list' || this.$$is == 'tree') {
          this.setData({
            // '$list.itemStyle': cssStr
            '$list.listStyle': cssStr
          })
        }
        else if (this.data.$dataSource) {
          this.setData({
            '$dataSource.itemStyle': cssStr
          })
        }
        return this
      },

      toggleClass(cls) {
        if (cls && lib.isFunction(this.hasClass)) {
          let clsAry = lib.isString(cls) ? cls.split(' ') : []
          if (clsAry.length) {
            cls = clsAry[0]
            if (this.hasClass(cls)) {
              this.removeClass(cls)
            } else {
              this.addClass(cls)
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
        app['_vars'][uniqId] = this
        if (id) {
          elements[id] = this
        }
        if (this.data.id) {
          elements[_id] = this
        }
        if ($$id) {
          elements[$$id] = this
        }
        if (pageDataKey) {
          elements[pageDataKey] = this
        }
        if (fromComponent) {
          this.componentInst = app['_vars'][fromComponent]
        }
        if (__fromParent) {
          this.parentInst = app['_vars'][__fromParent]
          this.parentInst && this.parentInst.children.push(this)
        }
        if (lib.isString(fromTree)) {
          let treeInst = app['_vars'][fromTree]
          this.treeInst = treeInst
        }
        activePage['elements'] = elements

        this.hooks.one('componentDetached', function () {
          app['_vars'][uniqId] = null
          if (_id) elements[_id] = null
          if ($$id) elements[$$id] = null
          if (pageDataKey) elements[pageDataKey] = null
        })
      },
      mount: function(id) {
        this._mount(id)
        // let that = this
        // let activePage = this.activePage
        // let uniqId = this.uniqId
        // if (!this.init) {
        //   if (id) {
        //     activePage['elements'][id] = this
        //   }

        //   let $is = this.$$is
        //   // let $id = this.data.id || this.properties.id
        //   let $id = ''
        //   let $ds = this.data.$item || this.data.$list || this.data.$dataSource || this.data.dataSource
        //   let fromTree
        //   let fromComponent = this.data.fromComponent || ($ds && $ds['fromComponent'])

        //   if (fromComponent) {
        //     this.componentInst = app['_vars'][fromComponent]
        //   }

        //   if ($is == 'list') {
        //     fromTree = this.data.fromTree || this.data.$list.fromTree
        //     if (lib.isString(fromTree)) {
        //       const treeInst = app['_vars'][fromTree]
        //       // $id ? treeInst['childs'][$id] = this : ''
        //       this.treeInst = treeInst
        //     }
        //   }

        //   if ($is == 'item') {
        //     // $id = $id || this.data.item['$$id'] || this.data.item['id']
        //     $id = $id || this.data.item && this.data.item['$$id']
        //   }
          
        //   if ($is == 'list' || $is == 'tree') {
        //     $id = $id || this.data.$list && this.data.$list['$$id']
        //   }

        //   let $$$id = this.data.id

        //   $id = $id||id
        //   if ($id) {
        //     const itemKey = activePage['eles'][$id]
        //     if (itemKey) {
        //       activePage['elements'][$id] = activePage['elements'][itemKey] = this
        //     } else {
        //       activePage['elements'][$id] = this
        //     }
        //   }

        //   if ($$$id) {
        //     activePage['elements'][$$$id] = this
        //   }

        //   // 该页面实例销毁时，销毁所有组件实例
        //   activePage.hooks.on('destory', function () {
        //     app['_vars'][uniqId] = null
        //     if (id || $id) {
        //       const myid = id || $id
        //       const itemKey = activePage['eles'][$id]
        //       // activePage['elements'][$id] = null
        //       // activePage['elements'][itemKey] = null
        //     }
        //     activePage['elements'] = null
        //   })
        // } else {
        //   this.hooks.on('ready', function() {
        //     that.mount(id)
        //   })
        // }
      },
      show: function(params) {
        lib.isFunction(this.update) && this.update({ show: true })
      },
      hide: function(params) {
        lib.isFunction(this.update) && this.update({ show: false })
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
  app = app || getApp()
  return Behavior({
    behaviors: [],
    methods: {
      // aim: function (e) {
      //   if (this.treeInst) {
      //     this.treeInst.aim.call(this.treeInst, e)
      //     return false
      //   }
      //   const that = this
      //   const activePage = this.activePage
      //   const target = e.currentTarget
      //   const currentDset = target.dataset
      //   const parentInstance = this._getAppVars()
      //   let query
      //   let theAim = currentDset.aim

      //   if (theAim) {
      //     const aimObj = lib.formatQuery(theAim)
      //     theAim = aimObj.url
      //     query = aimObj.query
      //     e.currentTarget.dataset.aim = theAim
      //     e.currentTarget.dataset._query = query
      //   }

      //   const evtFun = activePage['aim']
      //   const isEvt = lib.isFunction(evtFun)
      //   let vals = this.hooks.emit('beforeAim', {ctx: this, event: e, aim: theAim, param: query})
      //   if (parentInstance && lib.isFunction(parentInstance['aim'])) {
      //     parentInstance['aim'].call(parentInstance, e)
      //   } else {
      //     if (vals) {
      //       vals.forEach(function(val) {
      //         if (val !== 0 && isEvt) evtFun.call(activePage, e, query, that) // 返回值为0则不透传
      //       })
      //     } else {
      //       if (isEvt) evtFun.call(activePage, e, query, that)
      //     }
      //   }
      // },

      _rightEvent: function (e, prefix) {
        // const is = this.$$is
        // const currentTarget = e.currentTarget
        // const dataset = currentTarget.dataset
        // let dsetEvt = (e.__type || e.type)+'@@'+dataset['evt']  // __type，改写原生type，适合不同场景
        // if (is == 'list' || is == 'tree') {
        //   const mytype = this.data.$list.type
        //   if (mytype && (mytype.is == 'scroll' || mytype.is == 'swiper')) {
        //     dsetEvt = 'bind'+dsetEvt
        //   }
        // }
        // const tmp = rightEvent(dsetEvt)
        // e.currentTarget.dataset._query = tmp.param
        // return tmp


        let that = this
        let is = this.$$is
        let currentTarget = e.currentTarget
        let dataset = currentTarget.dataset
        let activePage = this.activePage

        let oType = e.__type || e.type
        let nType = (prefix ? prefix + oType : oType).replace('catchcatch', 'catch')
        let dsetEvtStr = dataset['evt'].replace(/_(tap|aim|catchtap|longpress|catchlongpress)/, '$1').replace(/aim=/g, 'catchtap=')
        // let dsetEvtStr = dataset['evt'].replace(/_/g, '').replace(/aim/g, 'catchtap')
        let dsetEvt = nType + '@@' + dsetEvtStr
        
        if (is == 'list' || is == 'tree') {
          const mytype = this.data.$list.type
          if (mytype && (mytype.is == 'scroll' || mytype.is == 'swiper')) {
            dsetEvt = 'bind' + dsetEvt
          }
        }

        if (is == 'form') {
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

        let $item = this.data.$item
        let $img = $item.img
        let findIt = null
        if (lib.isArray($img)) {
          findIt = $img.find({src})
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
  app = app || getApp()
  if (this.treeInst) {
    this.treeInst[(prefix ? 'catchItemMethod' : 'itemMethod')].call(this.treeInst, e, prefix)
    return false
  }
  const that = this
  const activePage = this.activePage
  const oType = e.__type || e.type

  
  // const that = this
  // const currentTarget = e.currentTarget
  // const dataset = currentTarget.dataset
  // const activePage = this.activePage
  
  // // const oType = e.type.indexOf('catch') == 0 ? e.type.replace('catch', '') : e.type
  // const oType = e.__type || e.type
  // let nType = prefix ? prefix + oType : oType
  // nType = nType.replace('catchcatch', 'catch')
  
  // let dsetEvtStr = dataset['evt'].replace(/_/g, '').replace(/aim/g, 'catchtap')
  // let dsetEvt = nType + '@@' + dsetEvtStr
  // let rEvt = rightEvent(dsetEvt)
  // let {fun, param, allParam} = rEvt

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
  if (dataset && (dataset['treeid'] || dataset['data-treeid']) && is === 'list') {
    let treeid = (dataset['treeid'] || dataset['data-treeid'])
    if (this.$$type === 'tree') {
      context = this.find(treeid)
    } else {
      context = listInstDelegate(treeid, this)
    }
  }
  
  if (fun) {
    let rootInstance = this._preGetAppVars(null, rEvt)
    if (lib.isEmpty(rootInstance)) {
      rootInstance = undefined
    }
    let parentInstance = getParent(this, fun)
    
    e.currentTarget.dataset._query = param
    const evtFun = activePage[fun] || app.activePage[fun]
    const thisFun = this[fun]
    const isEvt = lib.isFunction(evtFun)
    let vals = this.hooks.emit('instBindBefore', {ctx: this, event: e, funName: fun, param})
    if (vals) {

    } else {
      // let rootInstance = rootInstance
      // function getParent(ctx, f){
      //   if (ctx.parentInst) {
      //     if (ctx.parentInst[f]) {
      //       return ctx.parentInst
      //     } else {
      //       return getParent(ctx.parentInst, f)
      //     }
      //   }
      // }
      // parentInstance = getParent(this, fun)

      if (lib.isFunction(thisFun)) {
        thisFun.call(this, e, param, context)
      } else if (parentInstance) {
        parentInstance[fun].call(parentInstance, e, param, context)
      } else if(rootInstance && lib.isFunction(rootInstance[fun])) {
        rootInstance[fun].call(rootInstance, e, param, context)
      } else {
        if (isEvt) evtFun.call(activePage, e, param, context)
        else {
          console.warn(`找不到定义的${fun}方法`)
        }
      }
      
      // if (lib.isFunction(thisFun)) {
      //   thisFun.call(this, e, param, context)
      // } else if (parentInstance && lib.isFunction(parentInstance[fun])) {
      //   parentInstance[fun].call(parentInstance, e, param, context)
      // } else {
      //   if (isEvt) evtFun.call(activePage, e, param, context)
      //   else {
      //     console.warn(`找不到定义的${fun}方法`);
      //   }
      // }
    }

    // if (parentInstance && lib.isFunction(parentInstance[fun])) {
    //   parentInstance[fun].call(parentInstance, e, param, that)
    // } else {
    //   if (vals) {
    //     vals.forEach(function (val) {
    //       if (val !== 0 && isEvt) evtFun.call(activePage, e, param, that) // 返回值为0则不透传
    //     })
    //   } else {
    //     if (lib.isFunction(thisFun)) {
    //       thisFun.call(this, e, param, this)
    //     } else {
    //       if (isEvt) evtFun.call(activePage, e, param, that)
    //       else {
    //         console.warn(`找不到定义的${fun}方法`);
    //       }
    //     }
    //   }
    // }
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