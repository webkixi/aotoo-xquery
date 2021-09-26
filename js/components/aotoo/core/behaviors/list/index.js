const lib = require('../../../lib/index')
const getmyApp = require('../../getapp')
import {
  commonBehavior,
  commonMethodBehavior,
  setPropsHooks,

  _addClass,
  _removeClass,
  _hasClass,
  listInstDelegate,
  fakeListInstance
} from "../common";

import {
  initFlatList,
  adapterDataFlatList,
  getShowStat
} from "./types/flatlist/index"

const {
  resetItem,
  reSetItemAttr,
  reSetArray,
  reSetList,
  isArray,
  isObject,
  isString
} = lib

const extendListType = [
  'flatlist',
  'flatswiper',
  'swiper-loop'
]

function presetUpdateAdapterData(data, id){
  const viewStat = getShowStat()
  const $data = this.getData().data
  $data.forEach(item=>{
    const attr = item.attr
    const attrId = attr.id
    if (viewStat['Yshowing'][attrId]){
      item['@item'].show = true
    }
  })
  return adapterDataFlatList(data, id)
}

// 扩展定义的列表
function presetType(properties, isDidUpdate){
  let   ds = (properties.list || properties.dataSource) || properties || {}
  let   type =  ds.type || this.originalDataSource.type || {is: 'list'}
  const id = ds['$$id'] || ds.id

  if (extendListType.indexOf(type.is) > -1) {
    if (isDidUpdate) {
      ds.data = presetUpdateAdapterData.call(this, ds.data, id)
    } else {
      ds = initFlatList.call(this, ds)
    }
    type = ds.type
  } else {
    if (isDidUpdate && this.originalDataSource.type && extendListType.indexOf(this.originalDataSource.type.is) > -1) {
      ds.data = presetUpdateAdapterData.call(this, ds.data, id)
    }
  }


  // if (extendListType.indexOf(type.is) > -1) {
  //   if (isDidUpdate) {
  //     const $data = adapterDataFlatList(ds.data, id)
  //     ds = {data: $data}
  //   } else {
  //     ds = initFlatList.call(this, ds)
  //   }
  //   type = ds.type
  // }

  // 左滑菜单
  if (type.slip && !isDidUpdate) {
    if (typeof type.slip === 'boolean') {
      type.slip = {}  // areaClass, areaItemClass, menus, menuWidth, width, height, menuOptions, autoClose, slipChange
    }
    const autoClose = type.slip.autoClose === false ? false : true
    const slipChange = type.slip.slipChange

    let slipTimmer = null
    let startTarget = []
    let endTarget = []
    let slipStat = []
    this.onSlipchange = function(e, param, inst){
      const gap = parseInt(param.gap)
      const detail = e.detail
      const x = detail.x
      slipStat = [x, gap]
    }

    ds.itemMethod = Object.assign({}, ds.itemMethod, {
      touchstart(e, param, inst){
        const changedItem = e.changedTouches[0]
        const pageX = changedItem.pageX
        const pageY = changedItem.pageY

        const left = slipStat[0]
        const gap = slipStat[1]

        const oriPageX = startTarget[0]
        const oriPageY = startTarget[1]
        const preInst  = startTarget[2]
        const position = startTarget[3]  // [x, gap]

        if (autoClose && preInst && inst.index !== preInst.index) {
          const gap = position[1]
          gap ? preInst.update({x: gap}) : ''
        }

        startTarget = [pageX, pageY, inst]
      },
      touchend(e, param, inst){
        const changedItem = e.changedTouches[0]
        const pageX = changedItem.pageX
        const pageY = changedItem.pageY

        const startPageX = startTarget[0]
        const startPageY = startTarget[1]

        const left = slipStat[0]
        const gap = slipStat[1]
        const switchGap = gap - gap/3
        startTarget[3] = [left, gap]

        const diff = pageX - startPageX

        if (diff < 0) {
          if (left < switchGap) {
            inst.update({x: 0}, function(){
              if (lib.isFunction(slipChange)) slipChange({x: 0}, inst)
            })
          }
        } else {
          if (left > 30) {
            inst.update({x: gap}, function(){
              if (lib.isFunction(slipChange)) slipChange({x: gap}, inst)
            })
          }
        }
      },
    })

    let menuWidth = [].concat( (type.slip.menuWidth || 120) )
    if (isArray(menuWidth)) {
      let totalWidth = 0
      menuWidth = menuWidth.map(wth=>{
        const width = lib.isNumber(wth) ? wth : lib.isString(wth) ? parseInt(wth.replace(/(px|rpx|vw|vh|em|rem)/ig, '')) : 120
        totalWidth+=width
        return width
      })
      type.slip.width = type.slip.width || '100vw'   // movable-view的宽，movable-area的宽以此计算
      type.slip.height = type.slip.height || '200rpx' // movable-view的高, movable-area的高设置为auto
      type.slip.menuWidth = menuWidth
      type.slip.totalOffsetDistance = totalWidth
      type.slip.bindchange = 'onSlipchange?gap='+totalWidth

      const areaWidth = `calc(${(type.slip.width)} + ${totalWidth}rpx)`
      type.slip.areaStyle = `width: ${areaWidth}; height: auto; position: relative; left: -${totalWidth}rpx;`
      type.slip.areaItemStyle = `position: relative; width: ${type.slip.width};height: ${type.slip.height};`,
      ds.type = type
    }

  }

  if (type.slip) {
    ds.data = ds.data.map(item=>{
      if (lib.isString(item)) {
        item = {title: item}
      }
      const itemMenus = item.menus || []
      const slipMenus = type.slip.menus || []
      const tmpmenus = Object.assign([], slipMenus, itemMenus )
      const menus = []
      let   totalWidth = 0
      tmpmenus.forEach((menu, ii)=>{
        if (lib.isString(menu)) {
          menu = {title: menu}
        }
        if (lib.isObject(menu)) {
          const mWidth = parseInt((type.slip.menuWidth[ii]||120))
          totalWidth+=mWidth
          menu.itemClass = 'slip-menus-item '+ (menu.itemClass||'')
          menu.itemStyle = (menu.itemStyle||'')+`;width: ${mWidth}rpx;`
          menus.push(menu);
        }
      })
  
      item.x = totalWidth || type.slip.totalOffsetDistance
      item.menus = menus
      const areaWidth = `calc(${(type.slip.width)} + ${totalWidth}rpx)`
      item.menuOptions = {
        areaStyle: `width: ${areaWidth}; height: auto; position: relative; ${totalWidth ? 'left: -'+totalWidth+'rpx' : ''}`,
        direction: totalWidth ? type.slip.direction : 'none',
        totalMenusWidth: totalWidth
      }
      return item
    })
  }

  return ds
}

function updateSelf(params) {
  if (params && isObject(params)) {
    params = presetType.call(this, params)
    params = setPropsHooks.call(this, params)

    let $props = this.data.props||{}
    let $itemMethod = $props.itemMethod || params.itemMethod || {}
    let hasTouchoption = false
    let touchoption = $itemMethod.touchoption || params.touchoption
    if (params.touchoption){
      delete params.touchoption
    }
    if (touchoption) {
      hasTouchoption = true
      params.itemMethod = params.itemMethod || $itemMethod
      params.itemMethod.touchoption = touchoption
      params.hasTouchoption = true
    }

    let list = params
    let listProps = (() => {
      let props = {}
      Object.keys(list).forEach(key => {
        if (key != 'data') props[key] = list[key]
      })
      return props
    })()
    
    // if (list.itemMethod && lib.isObject(list.itemMethod)) {
    //   Object.keys(list.itemMethod).forEach(fn=>{
    //     this[fn] = list.itemMethod[fn]
    //   })
    //   delete list.itemMethod
    // }

    if (list.header || list.footer) {
      // list.header = list.header && resetItem(list.header, this)
      // list.footer = list.footer && resetItem(list.footer, this)
      // list.header ? list.header.__header = true : ''
      // list.footer ? list.footer.__footer = true : ''
      
      if (list.header && lib.isObject(list.header)) {
        let methods = list.header.methods
        list.header.methods = null
        list.header = resetItem(list.header, this)
        list.header.methods = methods
        list.header.__header = true
      }

      if (list.footer && lib.isObject(list.footer)) {
        let methods = list.footer.methods
        list.footer.methods = null
        list.footer = resetItem(list.footer, this)
        list.footer.methods = methods
        list.footer.__footer = true
      }
    }
    
    let mylist = list
    let fromTree = this.data.fromTree || mylist.fromTree
    if (fromTree) {
      this.__fromTree = fromTree
    }

    if (this.$$type === 'tree') {
      mylist = reSetList.call(this, list)
      mylist = lib.listToTree.call(this, mylist, fromTree)
    } else {
      mylist = reSetList.call(this, list)
    }
    // mylist = fromTree ? lib.listToTree.call(this, mylist, fromTree) : reSetList.call(this, list)
    this.setData({
      $list: mylist,
      props: listProps,
    })
  }
}

export const listBehavior = function(app, mytype) {
  app = getmyApp(app)
  mytype = mytype || 'list'
  return Behavior({
    behaviors: [commonBehavior(app, mytype), commonMethodBehavior(app, mytype)],
    properties: {
      list: {
        type: Object, 
        observer: function (params) {
          if (!this.init) {
            // this.reset()
            updateSelf.call(this, params)
          }
        } 
      },
    },
    data: {
      
    },
    lifetimes: {
      created: function() {
        this.$$is = 'list'
      },
      attached: function attached() { //节点树完成，可以用setData渲染节点，但无法操作节点
        const properties = this.properties
        const list = properties.list || properties.dataSource
        // const list = presetType.call(this, properties)
        updateSelf.call(this, list)
        if (typeof this.customLifeCycle.attached === 'function') {
          this.customLifeCycle.attached.call(this)
        }
      },

      ready: function () { //组件布局完成，这时可以获取节点信息，也可以操作节点
        let that = this
        function setHeaderFooter() {
          that.children.forEach(child=>{
            let $data = child.getData()
            if ($data.__header) that.header = child
            if ($data.__footer) that.footer = child
          })
        }
        if (this.activePage && this.activePage.__rendered) {
          setHeaderFooter()
        } else {
          this.activePage.hooks.on('onReady', function(){
            setHeaderFooter()
          })
        }
      }
    },
    methods: {
      _reset: function(param, cb) {
        // this.setData({$list: JSON.parse(this.originalDataSource)})
        if (lib.isFunction(param)) {
          cb = param
          param = undefined
        }

        this.setData({'$list.data': []})
        let oriData = lib.clone(this.originalDataSource)
        param = param || oriData.data


        if (lib.isArray(param)) {
          oriData.data = param
        }

        oriData = presetType.call(this, oriData, true)
        oriData = reSetArray.call(this, oriData.data, this.data.props)
        this.setData({$list: oriData}, cb)
        return this


        // if (lib.isArray(param)) {
        //   const list = presetType.call(this, {data: param, ...this.data.props}, true)
        //   let tmp = reSetArray.call(this, list.data, this.data.props)
        //   oriData.data = tmp.data
        // }
        // this.setData({$list: oriData}, cb)
        // return this
      },
      reset(){
        return this._reset.apply(this, arguments)
      },

      forEach(cb, callback){
        this.__foreachUpdata = {}
        let that = this
        let upData = {}
        let data = this.getData().data
        data.forEach(function(item, ii){
          let attr = item.attr || {}
          let treeid = attr.treeid || attr['data-treeid']
          let it = listInstDelegate(treeid, that, 'foreach')
          cb(it, ii)
          // let key = `data[${ii}]`
          // if (lib.isFunction(cb)) {
          //   let context = {
          //     data: item,
          //     addClass(cls) {
          //       let clsData = _addClass(key, cls, item)
          //       upData = Object.assign(upData, clsData)
          //     },
          //     removeClass(cls) {
          //       let clsData = _removeClass(key, cls, item)
          //       upData = Object.assign(upData, clsData)
          //     },
          //     hasClass(cls) {
          //       return _hasClass(cls, item)
          //     },
          //     update(param) {
          //       let keyData = {[key]: param}
          //       upData = Object.assign(upData, keyData)
          //     }
          //   }
          //   cb(context, ii)
          // }
        })
        // this.update(upData)
        this.update(this.__foreachUpdata, callback)
      },

      addClass: function(listCls, cb) {
        if (listCls) {
          listCls = listCls.replace(/\./g, '')
          listCls = lib.isString(listCls) ? listCls.split(' ') : []
          let $list = this.data.$list
          let $listClass = $list.listClass && $list.listClass.split(' ') || []
          listCls = listCls.filter(cls=> $listClass.indexOf(cls) == -1 )
          $listClass = $listClass.concat(listCls)
          this.update({
            listClass: $listClass.join(' ')
          }, cb)
        }
      },

      hasClass: function (listCls) {
        if (listCls) {
          listCls = listCls.replace(/\./g, '')
          listCls = lib.isString(listCls) ? listCls.split(' ') : []
          let len = listCls.length
          let $list = this.data.$list
          let $listClass = $list.listClass && $list.listClass.split(' ') || []
          listCls = listCls.filter(cls => $listClass.indexOf(cls) !== -1)
          return len === listCls.length ? true : false
          // return listCls.length ? true : false
        }
      },

      removeClass: function (listCls, cb) {
        if (listCls) {
          listCls = listCls.replace(/\./g, '')
          listCls = lib.isString(listCls) ? listCls.split(' ') : []
          let $list = this.data.$list
          let $listClass = $list.listClass && $list.listClass.split(' ') || []
          // let _cls = listCls.filter(cls => $listClass.indexOf(cls) === -1)
          let _cls = $listClass.filter(cls => listCls.indexOf(cls) === -1)
          $listClass = _cls
          this.update({
            listClass: ($listClass.join(' ') || ' ')
          }, cb)

          // let indexs = []
          // $listClass.forEach((cls, ii)=>{
          //   if (listCls.indexOf(cls) !== -1) {
          //     indexs.push(ii)
          //   }
          // })
          // if (indexs.length) {
          //   indexs.forEach(index => $listClass.splice(index, 1))
          // }
          // this.update({
          //   listClass: ($listClass.join(' ')||' ')
          // })
        }

      },

      update(){
        this._update.apply(this, arguments)
      },

      _update: function (_param, callback) {
        try {
          let param = lib.clone(_param)
          const that = this
          const cb = lib.isFunction(callback) ? callback : null
          const updateFun = (opts) => {
            let param = opts
            if (lib.isArray(param)) {
              param = {data: param}
            }

            if (param.methods && lib.isObject(param.methods)) {
              const methods = param.methods
              Object.keys(methods).forEach(key => {
                let fun = methods[key]
                if (lib.isFunction(fun)) {
                  fun = fun.bind(that)
                  that[key] = methods[key]
                }
              })
            }
            // delete param.methods

            let itemMethod = null
            if (param.itemMethod) {
              itemMethod = param.itemMethod
              // delete param.itemMethod
            }

            let $list = this.data.$list
            if (lib.isObject(itemMethod)) {
              $list.itemMethod = itemMethod
            }

            if (param.data) {
              let tmp = presetType.call(this, {...$list, data: param.data}, true)
              tmp = reSetArray.call(this, tmp.data, $list)
              param.data = tmp.data
              if (this.$$type === 'tree') {
                param = lib.listToTree.call(this, param)
              }
            }

            if (lib.isObject(param)) {
              let target = {}
              Object.keys(param).forEach(key => {
                if (param[key] || param[key] === 0 || typeof param[key] === 'boolean') {
                  let nkey = key.indexOf('$list.') == -1 ? '$list.' + key : key
                  let nval = param[key]
                  if (isArray(nval) && key!=='data') {
                    nval = reSetArray.call(this, param[key], $list).data
                  } else {
                    let re = /\.?(img|animation|type)/
                    if (key.indexOf('title') > -1 || key.indexOf('img')>-1 || isObject(nval)) {
                      if (
                        re.test(key)
                        // key.indexOf('img') > -1 ||
                        // key.indexOf('animation') > -1 ||
                        // key === 'type' || 
                        // nkey.indexOf('$list.type.') > -1
                      ) {
                        /** 不出来list.type数据 */
                      } else if (isObject(nval)) {
                        nval = reSetItemAttr.call(this, param[key], $list)
                      }
                      // if (key.indexOf('@') === -1) {
                      //   nval = reSetItemAttr.call(this, param[key], $list)
                      // }
                    }
                  }
                  target[nkey] = nval
                }
              })

              // 如果要重置，在reset中传入数组重置整个list.data
              // if (lib.isArray(target['$list.data'])) {
              //   that.setData({ '$list.data': [] })
              // }

              let $ds = lib.isObject(this.originalDataSource) ? this.originalDataSource : {}
              let $$id = $ds['$$id']
              let _id = $ds['id']
              let dataId = this.data.id

              if (target['$$id'] && target['$$id'] === $$id) {
                delete target['$$id']
              } 
              if (target['id'] && target['id'] === _id) {
                delete target['id']
              }
              if (target['id'] && target['id'] === dataId) {
                delete target['id']
              }
              that.setData(target, cb)
            }
    
            // if (lib.isArray(param)) {
            //   let target = Object.assign({data: []}, this.data.$list)
            //   target.data = param
            //   let mylist = reSetList.call(this, target)
            //   that.reset([]).setData({ $list: mylist }, cb)
            // }
          }

          let result = this.hooks.emit('update', param)
          if (result && result[0]) {
            result = result[0]
            if (lib.isFunction(result.then)) {
              result.then( res => updateFun(res)).catch(err => err)
            } else {
              updateFun(result)
            }
          } else {
            updateFun(param)
          }
          return this
        } catch (error) {
          console.log(error);
        }
      },
      
      __newItem: function(params, act) {
        const self = this
        const tmp = presetType.call(this, {...this.data.$list, data: ([].concat(params))}, act)
        params = tmp.data
        if (this.$$type === 'tree') {
          let treeProps = this.data.props
          if (!lib.isArray(params)) {
            params = [params]
          }

          if (lib.isArray(params)) {
            function embedList(item, data) {
              if (data.length) {
                item['@list'] = {
                  data,
                  type: item.type,
                  listClass: item.liClass || 'ul',
                  itemClass: treeProps.itemClass || '',
                  itemStyle: treeProps.itemStyle || '',
                  show: item.hasOwnProperty('show') ? item.show : true,
                  fromTree: self.__fromTree || self.uniqId,
                  fromComponent: self.componentInst ? self.componentInst.uniqId : self.uniqId,
                  __fromParent: self.uniqId,
                  methods: {
                    __ready() {
                      if (self) {
                        // self.childs[treeid] = this
                        self.childs[item.idf] = this
                      }
                    }
                  }
                }
              }
              return item
            }

            function getChild(idf, ary) {
              let tmp = []
              ary.forEach(item=>{
                if (item.$parent === idf) {
                  if (item.idf) {
                    let data = getChild(item.idf, ary)
                    item = embedList(item, data)
                  }
                  tmp.push(item)
                }
              })
              return tmp
            }

            let idfp = {};  // 有idf和parent
            let olyp = {};  // 只有parent
            let noip = [];  // 没有idf，没有parent
            let idfs = {}   // 只有idf

            params.forEach(item=>{
              if (item.parent) {
                item.$parent = item.parent
                delete item.parent
              }

              if (item.$parent) {
                if (item.idf) {
                  idfp[item.$parent] = (idfp[item.$parent] || [item]).concat(getChild(item.idf, params))
                } else {
                  olyp[item.$parent] = (olyp[item.$parent]||[]).push(item)
                }
              } else {
                if (item.idf) {
                  // idfs[item.idf] = (idfs[item.idf]||[item]).concat(getChild(item.idf, params))
                  let data = getChild(item.idf, params)
                  item = embedList(item, data)
                } 
                noip.push(item)
              }
            })

            if (!lib.isEmpty(olyp)) {
              Object.keys(olyp).forEach(idf => {
                this.childs[idf] && this.childs[idf][act](olyp[idf])
              })
            }

            if (!lib.isEmpty(idfp)) {
              Object.keys(idfp).forEach(idf => {
                let val = idfp[idf]
                let item = val.splice(0, 1)
                item = embedList(item, val)
                this.childs[idf] && this.childs[idf][act](item)
              })
            }

            return noip.map(param => {
              return reSetItemAttr.call(this, param, treeProps)
            })
          }
        } else {
          if (lib.isArray(params)) {
            return params.map(param => {
              return reSetItemAttr.call(this, param, this.data.props)
            })
          } else {
            return reSetItemAttr.call(this, params, this.data.props)
          }
        }
      },

      findIndex: function (params, bywhat='attr') {
        let $selectIndex
        if (params || params === 0) {
          if (lib.isNumber(params)) {
            return params
          }

          if (typeof params === 'function') {
            let $list = this.data.$list
            let $data = $list.data
            let index = -1
            for (let ii = 0; ii < $data.length; ii++) {
              const item = $data[ii]
              const res = params(item, $data)
              if (res) {
                index = ii
                break;
              }
            }
            return index === -1 ? -1 : index
          }

          if (params.type && params.currentTarget && params.changedTouches) {
            const dataset = params.currentTarget.dataset
            const treeid = dataset.treeid
            if (treeid) {
              params = {"data-treeid": treeid}
            } else {
              return 
            }
          }
          
          let $list = this.data.$list
          let $data = $list.data
          for (let ii = 0; ii < $data.length; ii++) {
            const item = $data[ii]
            const attr = item.attr
            const treeid = attr['data-treeid']||attr['treeid']

            if (bywhat == 'attr') {
              if (lib.isObject(params)) {
                Object.keys(params).forEach(function (key, jj) {
                  if (jj == 0) {  // 只匹配params的第一个参数
                    if (attr&&(attr[key] === params[key]) ||
                      item[key] == params[key]
                    ) $selectIndex = ii;
                  }
                })
                if ($selectIndex || $selectIndex === 0) break;
              } 
              
              if (lib.isString(params)) {
                if (treeid == params) {
                  $selectIndex = ii;
                  break;
                }
              }
            }


            if (bywhat == 'class') {
              if (lib.isString(params)) {
                const cls = item.itemClass || item.class
                const _params = params.replace('.', '')
                if (cls.indexOf(_params) > -1) {
                  $selectIndex = $selectIndex ? $selectIndex.concat(ii) : [ii]
                }
              }
            }

            if (bywhat == 'id') {
              if (lib.isString(params)) {
                const id = item.id
                const _params = params.replace('#', '')
                if (id === _params) {
                  $selectIndex = ii;
                  break;
                }
              }
            }
          }
        }
        return $selectIndex
      },

      find: function (params, bywhat) {
        return wx.$$find(params, this)
        // let index
        // if (lib.isString(params)) {
        //   let strNum = parseInt(params)
        //   if (strNum && lib.isNumber(strNum)) {
        //     params = strNum
        //   }
        // }

        // // if (lib.isNumber(params)) {
        // //   let $list = this.data.$list
        // //   let $data = $list.data
        // //   return $data[params]
        // // } 

        // if (params && lib.isString(params)) {
        //   if (params.charAt(0) === '#') {
        //     bywhat = 'id'
        //   } 
        //   if (params.charAt(0) === '.') {
        //     bywhat = 'class'
        //   }
        // }

        // index = this.findIndex(params, bywhat)
        // if (index || index === 0) {
        //   if (!lib.isArray(index)) index = [index]
        //   if (lib.isArray(index)) {
        //     // listInstDelegate
        //     // return index.map((idx) => this.data.$list.data[idx])

        //     let datas = {}
        //     index.forEach(idx => {
        //       let item = this.data.$list.data[idx]
        //       item.__realIndex = idx
        //       datas[`data[${idx}]`] = item
        //     })
        //     let tmpData = lib.clone(datas)
        //     return fakeListInstance(tmpData, this)
        //   }

        //   let res = this.data.$list.data[index]
        //   res.__realIndex = index
        //   return res
        // }
      },

      findAndUpdate: function (params, cb) {
        const that = this
        const res = this.find(params)
        const isFun = lib.isFunction(cb)
        const index = res.__realIndex
        let context = {
          update(param){
            if (lib.isObject(param)){
              that.update({ [`data[${index}]`]: param })    
            }
          }
        }
        if (res) {
          if (isFun) {
            cb.call(context, res)
          } else {
            if (lib.isObject(cb)) {
              let param = cb
              that.update({ [`data[${index}]`]: param })    
            }
          }
        } else {
          if (isFun) cb.call(this)
        }
      },

      attr: function (params) {
        const res = this.find(params)
        if (res) {
          return res.attr
        }
      },

      append(){
        this._append.apply(this, arguments)
      },
      _append: function(params, cb) {
        const that = this
        if (params) {
          let $list = this.data.$list
          let $data = $list.data
          let appendFun = (opts) => {
            let newData = $data.concat(that.__newItem(opts, 'append'))
            that.setData({ "$list.data": newData }, cb)
          }

          let result = this.hooks.emit('append', params)
          if (result && result[0]) {
            result = result[0]
            if (lib.isFunction(result.then)) {
              result.then(res=> appendFun(res) ).catch(err=>err)
            } else {
              appendFun(result)
            }
          } else {
            appendFun(params)
          }
        }
        return this
      },

      prepend(){
        this._prepend.apply(this, arguments)
      },
      
      _prepend: function(params, cb) {
        const that = this
        if (params) {
          let $list = this.data.$list
          let $data = $list.data
          let prependFun = (opts) => {
            let newData = [].concat(this.__newItem(opts, 'prepend')).concat($data)
            // that.setData({$list}, cb)
            that.setData({ "$list.data": newData }, cb)
          }

          let result = this.hooks.emit('prepend', params)
          if (result && result[0]) {
            result = result[0]
            if (lib.isFunction(result.then)) {
              result.then(res => prependFun(res)).catch(err => err)
            } else {
              prependFun(result)
            }
          } else {
            prependFun(params)
          }
        }
        return this
      },

      delete(){
        this._delete.apply(this, arguments)
      },

      _delete: function (params, cb) {
        let $list = this.data.$list
        let $data = $list.data
        let $selectIndex = this.findIndex(params)
        if ($selectIndex || $selectIndex == 0) {
          $data.splice($selectIndex, 1)
          this.setData({ "$list.data": $data }, cb)
        }
        return this
      },

      insert(){
        this._insert.apply(this, arguments)
      },
      _insert: function (params, pay, cb) {
        const that = this
        let $list = this.data.$list
        let $data = $list.data
        if (lib.isString(params) || lib.isObject(params)) {
          let $selectIndex = this.findIndex(params)
          let insertFun = (payload) => {
            if (payload) {
              payload = that.__newItem(payload, 'insert')
              if ($selectIndex || $selectIndex == 0) {
                if (lib.isArray(payload)) {
                  payload.forEach((it, ii)=>{
                    let targetIndex = $selectIndex + ii
                    $data.splice(targetIndex, 0, it)
                  })
                } else {
                  $data.splice($selectIndex, 0, payload)
                }
                // that.setData({ $list }, cb)
                that.setData({ "$list.data": $data }, cb)
              }
            }
          }

          let result = this.hooks.emit('insert', pay)
          if (result && result[0]) {
            result = result[0]
            if (lib.isFunction(result.then)) {
              result.then(res=> insertFun(res) ).catch(err=>err)
            } else {
              insertFun(result)
            }
          } else {
            insertFun(pay)
          }
        }
        return this
      },

      _scrollMethod: function (e) {
        return listReactFun.call(this, app, e, 'scroll')

        // if (this.treeInst) {
        //   this.treeInst._scrollMethod(e)
        //   return
        // }

        // const $list = this.data.$list
        // const mytype = $list.type
        // const {fun, param} = this._rightEvent(e)

        // if (mytype && mytype.is == 'scroll') {
        //   this.hooks.emit('bindscroll', e)
        //   this.hooks.emit('bindscrolltoupper', e)
        //   this.hooks.emit('bindscrolltolower', e)
        // }
        
        // const activePage = this.activePage
        // const parentInstance = this.componentInst
        // const evtFun = activePage[fun]
        // const thisFun = this[fun]
        // const isEvt = lib.isFunction(evtFun)

        // if (parentInstance && lib.isFunction(parentInstance[fun])) {
        //   parentInstance[fun].call(parentInstance, e, param)
        // } else {
        //   if (lib.isFunction(thisFun)) {
        //     thisFun(e, param, this)
        //   } else {
        //     if (isEvt) evtFun.call(activePage, e, param, that)
        //   }
        // }
      },

      _swiperMethod: function (e) {
        return listReactFun.call(this, app, e, 'swiper')
      },
      _movableMethod: function (e) {
        return listReactFun.call(this, app, e, 'movable')
      },
    }
  })
}

function lookforEventFun(ctx, fun) {
  if (ctx.parentInst) {
    if (ctx.parentInst[fun] && lib.isFunction(ctx.parentInst[fun])) {
      return ctx.parentInst
    } else {
      return lookforEventFun(ctx.parentInst, fun)
    }
  } else {
    if (ctx.componentInst && lib.isFunction(ctx.componentInst[fun])) {
      return ctx.componentInst
    }
  }
}

function listReactFun(app, e, type="list") {
  app = getmyApp(app)
  const that = this
  if (this.treeInst) {
    return type == 'swiper' ? this.treeInst._swiperMethod.call(this.treeInst, e, type) : this.treeInst._scrollMethod.call(this.treeInst, e, type)
  }

  const $list = this.data.$list
  const mytype = $list.type

  if (type == 'swiper') {
    this.hooks.emit('bindchange', e)
    this.hooks.emit('bindtransition', e)
    this.hooks.emit('bindanimationfinish', e)
  }

  if (type == 'scroll') {
    this.hooks.emit('bindscroll', e)
    this.hooks.emit('bindscrolltoupper', e)
    this.hooks.emit('bindscrolltolower', e)
  }

  // if (type == 'movable') {
  //   this.hooks.emit('bindchange', e)
  //   this.hooks.emit('bindscale', e)
  //   this.hooks.emit('htouchmove', e)
  //   this.hooks.emit('vtouchmove', e)
  // }

  const activePage = this.activePage
  let parentInstance = this.parentInst || this.componentInst
  const {fun, param} = this._rightEvent(e)

  if (fun) {
    const evtFun = activePage[fun] || app.activePage[fun]
    const thisFun = this[fun]

    if (lib.isFunction(thisFun)) {
      thisFun.call(this, e, param, this)
    } else if (lib.isFunction(evtFun)) {
      evtFun.call(activePage, e, param, that)
    } else if (parentInstance) {
      let ctx = lookforEventFun(that, fun)
      if (ctx) {
        ctx[fun].call(ctx, e, param, that)
      } else {
        console.warn(`找不到定义的${fun}方法`);
      }
    } else {
      console.warn(`找不到定义的${fun}方法`);
    }

    // const evtFun = activePage[fun] || app.activePage[fun]
    // const thisFun = this[fun]
    // const isEvt = lib.isFunction(evtFun)
    // if (lib.isEmpty(parentInstance)) {
    //   parentInstance = undefined
    // }
  
    // if (parentInstance && lib.isFunction(parentInstance[fun])) {
    //   parentInstance[fun].call(parentInstance, e, param)
    // } else {
    //   if (lib.isFunction(thisFun)) {
    //     thisFun.call(this, e, param, this)
    //   } else {
    //     if (isEvt) evtFun.call(activePage, e, param, (parentInstance||that))
    //     else {
    //       console.warn(`找不到定义的${fun}方法`);
    //     }
    //   }
    // }

  }
}

export const listComponentBehavior = function(app, mytype) {
  mytype = mytype || 'list'
  return Behavior({
    behaviors: [listBehavior(app, mytype)],
  })
}