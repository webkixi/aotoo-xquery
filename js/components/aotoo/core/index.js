const lib = require('../lib/index')
const getmyApp = require('./getapp')
import {
  resetStoreEvts,
  commonBehavior,
  commonMethodBehavior,
  baseBehavior,
  itemBehavior,
  itemComponentBehavior,
  listBehavior,
  listComponentBehavior,
  treeBehavior,
  treeComponentBehavior,
  reactFun,
  fakeListInstance,
  listInstDelegate
} from "./behaviors/index";

import { 
  alert
} from "./ui";

import { 
  post,
  _get,
  upload,
  usualKit,
} from "./utils";

function mkFind(context, app){
  let that = context
  wx.$$find = function (param, context) {
    let id, cls, treeid, justit
    let vars = app['_vars']
    if (param||param === 0) {
      if (lib.isString(param)) {
        if (param.charAt(0) === '#') {
          id = param.replace('#', '')
          cls = undefined
        } else if (param.indexOf('treeid-index-') > -1) {
          treeid = param
          cls = undefined
        } else if (that.getElementsById(param)) {
          justit = that.getElementsById(param)
        } else {
          cls = param
          id = undefined
          treeid = undefined
        }

        if (id) {
          justit = that.getElementsById(id)
        }

        if (justit) {
          return justit
        }

        if (treeid) {
          return listInstDelegate(treeid, context)
        }

        // let justit = that.getElementsById(param)
        // if (justit) return justit
        // if (vars[param]) return vars[param]  // 直接返回实例
        // if (param.charAt(0) === '#') {
        //   id = param.replace('#', '')
        // } else {
        //   cls = param
        //   if (param.indexOf('treeid-index-')>-1) {
        //     cls = undefined
        //     treeid = param
        //   }
        // }

      }

      let findScope = lib.findChilds(context) || Object.entries(vars).map(item => item[1])
      let findIt = []
      findScope.forEach(inst => {
        // let inst = item[1] 
        let $data = (inst && inst.getData()) || null
        if ($data) {
          if ((inst.$$is === 'list' || inst.$$is === 'fakelist') && !$data.isItem) {
            let listInst = inst
            let index = null
            let bywhat = 'attr'
            if (param && lib.isString(param)) {
              if (id) {
                bywhat = 'id'
              }
              if (param.charAt(0) === '.') {
                bywhat = 'class'
              }
              if (!treeid && !id) bywhat = 'class'
            }
            if (inst.$$is === 'fakelist') {
              listInst = inst.parentInst
            }
            index = listInst.findIndex(param, bywhat)
            if (index || index === 0) {
              index = [].concat(index)
              let datas = {}
              index.forEach(idx => {
                let item = listInst.getData().data[idx]
                let treeid = item.attr['treeid'] || item.attr['data-treeid']
                item.__realIndex = idx
                if (item.$$id) {
                  /** item作为实例来处理 */
                } else if (item.isItem) {
                  /** item作为实例来处理 */
                } else {
                  /** 此处的数据为非实例处理数据，需要封装 */
                  datas[`data[${idx}]`] = item
                  const targetItem = listInstDelegate(item, listInst)
                  targetItem.__realIndex = idx
                  findIt = findIt.concat(targetItem)
                }
              })

              // index.forEach(idx => {
              //   let item = listInst.data.$list.data[idx]
              //   let treeid = item.attr['treeid'] || item.attr['data-treeid']
              //   item.__realIndex = idx
              //   if (item.$$id) {
              //     /** item作为实例来处理 */
              //   } else if (item.isItem) {
              //     /** item作为实例来处理 */
              //   } else {
              //     /** 此处的数据为非实例处理数据，需要封装 */
              //     datas[`data[${idx}]`] = item
              //   }
              // })
              // let tmpData = lib.clone(datas)
              // findIt = findIt.concat(fakeListInstance(tmpData, listInst))
            }
          }

          if (id) {
            if (id === $data.$$id || id === $data.id || id === inst.data.id) {
              findIt = findIt.concat(inst)
            }
          }

          if (cls) {
            if (inst.hasClass && inst.hasClass(cls)) {
              findIt = findIt.concat(inst)
            } else {
              /** form及其他实例方法暂未有对应解决方案 */
            }
          }

          if (param && lib.isObject(param)) {
            let tmp = Object.entries(param)
            let target = tmp[0]
            if ($data[target[0]] && $data[target[0]] === target[1]) {
              findIt = findIt.concat(inst)
            }
          }
        }
      })

      // 没有考虑form及非item/list的情况
      if (findIt.length) {
        return {
          data: findIt,
          length: findIt.length,
          getData(){
            return this.data
          },
          find(param){
            return wx.$$find(param, this.data)
          },
          forEach(cb) {
            if (lib.isFunction(cb)) {
              findIt.forEach(function (cld) {
                cb.call(that, cld)
              })
            }
          },
          addClass(cls) {
            this.forEach(function (cld) {
              cld.addClass && cld.addClass(cls)
            })
          },
          removeClass(cls) {
            this.forEach(function (cld) {
              cld.removeClass && cld.removeClass(cls)
            })
          },
          reset(param) {
            this.forEach(function (cld) {
              cld.reset && cld.reset(param)
            })
          },
          update(param) {
            this.forEach(function (cld) {
              cld.update && cld.update(param)
            })
          }
        }
      }
    } 
  }.bind(context)
}

function pageDataElement(data) {
  let nData
  let eles = {}
  let acts = {}
  if (lib.isObject(data)) {
    if (data['$$id']) {
      const $id = data['$$id']
      eles[$id] = $id
      // if (data.methods) {
      //   const methods = data.methods
      //   if (lib.isObject(methods)) {
      //     acts[$id] = Object.assign(acts, methods)
      //     delete data.methods
      //   }
      // }
    } else {
      nData = {}
      Object.keys(data).forEach(key=>{
        let item = data[key]
        if (lib.isObject(item)) {
          if (item['$$id']) {
            const $id = item['$$id']
            eles[$id] = key
    
            // if (item.methods) {
            //   if (lib.isObject(item.methods)) {
            //     // acts[$id] = Object.assign(acts, item.methods)
            //     acts[$id] = item.methods
            //     delete item.methods
            //   }
            // }
    
            if (item.data && lib.isArray(item.data)) {
              item.data = item.data.map(sub => {
                // if (lib.isObject(sub) && sub['$$id']) {
                //   const obj = pageDataElement(sub)
                //   eles = Object.assign(eles, obj.eles)  // tree/@list 模式适用,  tree/li模式需要区分是否为idf项
                //   acts = Object.assign(acts, obj.acts)
                // }
                return sub
              })
            }
          }
        }
        nData[key] = item
      })
    }
  }
  nData = nData || data
  return {eles, acts, nData}
}

function mergeActions(inst, acts) {
  if (lib.isObject(acts)) {
    Object.entries(acts).forEach(function(item) {
      const mtdKey = item[0]
      const mtdFun = item[1]
      if (lib.isFunction(mtdFun)) {
        inst[mtdKey] = mtdFun
      }
    })
  }
}

let activePage
core.getElementsById = function (id) {
  if (activePage) {
    return activePage.getElementsById(id)
  }
}

function core(params, _page) {
  let doreadyTimmer = null
  if (lib.isObject(params)) {
    let app = getmyApp(params.appConfig, true)
    app.hooks = lib.hooks('aotoo')

    if (params.data) {
      let myData = params.data
      var {eles, acts, nData} = pageDataElement(myData)
      params.data = nData
      // if (!app['_vars']) {
      //   app['_vars'] = {}
      // }
    }

    function doneActivePage(ctx){
      app.__active_page__.forEach(item=>{
        if (typeof item === 'function') item(ctx)
      })
      app.__active_page_ready__.forEach(item=>{
        if (typeof item === 'function') item(ctx)
      })
      app.__active_page__ = []
      app.__active_page_ready__ = []
    }

    const oldLoad = params.onLoad
    params.onLoad = function () {
      app.activePage = activePage = this
      doneActivePage(activePage)
      let that = this
      this.vars = {}
      this.elements = this.elements || {}
      this.eles = eles || {}  // 存放id映射表
      this.acts = acts || {}
      this.uniqId = lib.suid('page')
      this.hooks = lib.hooks(this.uniqId)
      this.getElementsById = function(key) {
        if (key) {
          key = key.replace('#', '')
          return this.elements[key] || app['_vars'][key] || this.selectComponent('#'+key) || this.selectComponent('.'+key)
        } else {
          return this.elements
        }
      }
      this.doReady = (pageReady) => {
        clearTimeout(doreadyTimmer)
        doreadyTimmer = setTimeout(() => {
          if (this.__rendered || pageReady) {
            if (this.__READY && this.__READY.length) {
              this.hooks.actions['__READY'] = (this.hooks.actions['__READY'] || []).concat(this.__READY)
              this.__READY = []
            }
            this.hooks.fire('__READY')
          }
        }, 50);
      }


      // let oldSetData = this.setData
      // this.setData = function (param, cb) {
      //   oldSetData.call(that, param, function () {
      //     if (lib.isFunction(cb)) {
      //       that.doReady()
      //       cb.call(that)
      //     }
      //   })
      // }


      app.hooks.emit('activePage', activePage)
      app.hooks.fire('changeActivePage', activePage)


      /**
       * ==================
       * 从onReady搬过来
       * ==================
       */
      const elements = this.eles
      const actions = this.acts
      const actionIds = Object.keys(actions)
      actionIds.forEach($$id => {
        const defineMethods = actions[$$id]
        if (elements[$$id]) {
          const instId = elements[$$id]
          if (this.elements[instId]) {
            let $component = this.elements[instId]
            mergeActions($component, defineMethods)
          }
        }
      })

      /**
       * ????????
       * 把依赖onReady和__rendered状态的方法，修改为依赖onLoad
       * this.hooks.emit('onLoad')
       * 或者改为对 app.hooks.fire('changeActivePage', activePage)的依赖
       * ????????
       */
      // this.__rendered = true
      // this.hooks.emit('onReady')
      // this.doReady()

      // mkFind(this, app)
      // this.find = wx.$$find
      /** ================== */

      if (typeof oldLoad == 'function') {
        oldLoad.apply(this, arguments)
      }
    }

    const oldReady = params.onReady
    params.onReady = function() {
      // const elements = this.eles
      // const actions = this.acts
      // const actionIds = Object.keys(actions)
      // actionIds.forEach($$id => {
      //   const defineMethods = actions[$$id]
      //   if (elements[$$id]) {
      //     const instId = elements[$$id]
      //     if (that.elements[instId]) {
      //       let $component = that.elements[instId]
      //       mergeActions($component, defineMethods)
      //     }
      //   }
      // })

      mkFind(this, app)
      this.find = wx.$$find
      
      this.__rendered = true
      this.hooks.emit('onReady')
      this.doReady()

      if (typeof oldReady == 'function') {
        oldReady.apply(this, arguments)
      }
    }

    const oldSshow = params.onShow
    params.onShow = function(){
      // let pageStack = getCurrentPages()
      // let curPage = pageStack[(pageStack.length-1)] || this
      if (this.__hide) {
        mkFind(this, app)
        app.activePage = this
        activePage = this
        // app.activePage = curPage
        // activePage = curPage
      }
      this.__hide = false
      this.hooks.emit('onShow')
      if (typeof oldSshow == 'function') {
        oldSshow.apply(this, arguments)
      }
    }

    const oldHide = params.onHide
    params.onHide = function () {
      this.hooks.off('__READY')
      this.__READY = []
      this.__hide = true
      if (typeof oldHide == 'function') {
        oldHide.apply(this, arguments)
      }
    }

    const oldUnload = params.onUnload
    params.onUnload = function() {
      this.hooks.off('__READY')
      this.__READY = []
      if (typeof oldUnload == 'function') {
        oldUnload.apply(this, arguments)
      }
      app.activePage = undefined
      activePage = null
      resetStoreEvts()
      app.hooks.emit('destory')
      this.hooks.emit('destory')
      // lib.resetSuidCount()
      this.hooks.destory()
      core.kit.destory()
      core.toolkit = null
    }

    let $page = _page || Page
     $page(params)
  }
}

core.item = function(data, prefix) {
  if (data) {
    if (lib.isString(data) || lib.isNumber(data)) {
      data = {title: data}
    }

    if (lib.isObject(data)) {
      data['$$id'] = data['$$id'] || prefix || lib.suid('item__')
    }

    data.show = data.hasOwnProperty('show') ? data.show : true
  }
  return data
}

core.list = function(list, prefix) {
  if (typeof list == 'object') {
    if (lib.isArray(list)) {
      list = {data: list}
    }
    list['$$id'] = list['$$id'] || prefix || lib.suid('list__')
    list['show'] = list.hasOwnProperty('show') ? list.show : true
    return list
  }
}

core.tree = function(data) {
  return core.list(data, lib.suid('tree__'))
}

function setItem(item) {
  let $item = item
  if (!item.hasOwnProperty('show')){
    $item = core.item(item)
  }
  $item = lib.resetItem($item)
  return $item
}

core.lib = lib
core.kit = usualKit(null)
core.toolkit = core.kit
core.alert = alert
core.post = post
core.get = _get
core.upload = upload
core.setItem = setItem
core.reactFun = reactFun
core.commonBehavior = commonBehavior
core.commonMethodBehavior = commonMethodBehavior
core.baseBehavior = baseBehavior
core.itemBehavior = itemBehavior
core.itemComponentBehavior = itemComponentBehavior
core.listBehavior = listBehavior
core.listComponentBehavior = listComponentBehavior
core.treeBehavior = treeBehavior
core.treeComponentBehavior = treeComponentBehavior
core.hooks = lib.hooks
lib.innerKit = core.toolkit
module.exports = core