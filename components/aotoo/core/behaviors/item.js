const lib = require('../../lib/index')
import {
  commonBehavior,
  commonMethodBehavior,
  setPropsHooks
} from "./common";


function _resetItem(data, context) {
  // if (typeof data.title !== 'object') {
  //   data.title = {title: data.title}
  // }
  // if (typeof data.desc !== 'object') {
  //   data.desc = {title: data.desc}
  // }
  data = setPropsHooks.call(context, data)
  return lib.resetItem(data, context)
}



export const itemBehavior = function(app, mytype) {
  mytype = mytype || 'item'
  return Behavior({
    behaviors: [commonBehavior(app, mytype), commonMethodBehavior(app, mytype)],
    properties: {
      item: {
        type: Object|String|Number, 
        observer: function (params) { 
          if (!this.init) {
            if (params) {
              if (params.$$id) {
                this.setData({$item: _resetItem(params, this)})
              } else {
                this.update(params)
              }
            }
          }
        } 
      },
      id: String,
    },
    data: {

    },
    lifetimes: {
      created: function() {
        this.$$is = 'item'
      },
      attached: function attached() { //节点树完成，可以用setData渲染节点，但无法操作节点
        const xitem = _resetItem(this.properties.item, this)
        if (xitem) {
          this.setData({
            "$item": xitem
          })
        }
      },
      ready: function () { //组件布局完成，这时可以获取节点信息，也可以操作节点
      }
    },
    methods: {
      attr: function (params) {
        if (lib.isString(params)){
          return this.data.$item.attr[params]
        } else {
          if (lib.isObject(params)) {
            let $attr = this.data.$item.attr||{}
            let keys = Object.keys[params]
            let key0 = keys[0]
            let val0 = params[key0]
            if (val0 === $attr[key0]) return $attr
          } else {
            return this.data.$item.attr
          }
        }
      },
      reset: function(param, cb) {
        // this.setData({$item: JSON.parse(this.originalDataSource)})
        if (lib.isFunction(param)) {
          cb = param
          param = undefined
        }
        if (lib.isObject(param)) {
          this.setData({$item: _resetItem(param, this)}, cb)
        } else {
          this.setData({$item: _resetItem(lib.clone(this.originalDataSource), this)}, cb)
        }
        return this
      },
      
      addClass: function(itCls) {
        if (itCls) {
          itCls = itCls.replace(/\./g, '')
          itCls = lib.isString(itCls) ? itCls.split(' ') : []
          let $item = this.data.$item
          let $itemClass = $item.itemClass && $item.itemClass.split(' ') || []
          itCls = itCls.filter(cls => $itemClass.indexOf(cls) == -1)
          $itemClass = $itemClass.concat(itCls)
          this.update({
            itemClass: $itemClass.join(' ')
          })
        }
      },

      hasClass: function (itCls) {
        if (itCls) {
          itCls = itCls.replace(/\./g, '')
          itCls = lib.isString(itCls) ? itCls.split(' ') : []
          let len = itCls.length
          let $item = this.data.$item
          let $itemClass = $item.itemClass && $item.itemClass.split(' ') || []
          itCls = itCls.filter(cls => $itemClass.indexOf(cls) !== -1)
          return len === itCls.length ? true : false
          // return itCls.length ? true : false
        }
      },

      removeClass: function(itCls) {
        if (itCls) {
          itCls = itCls.replace(/\./g, '')
          itCls = lib.isString(itCls) ? itCls.split(' ') : []
          let $item = this.data.$item
          let $itemClass = $item.itemClass && $item.itemClass.split(' ') || []
          let _cls = $itemClass.filter(cls => itCls.indexOf(cls) === -1)
          $itemClass = _cls
          this.update({
            itemClass: ($itemClass.join(' ') || ' ')
          })

          // let indexs = []
          // $itemClass.forEach((cls, ii) => {
          //   if (itCls.indexOf(cls) !== -1) {
          //     indexs.push(ii)
          //   }
          // })
          // if (indexs.length) {
          //   indexs.forEach(index => $itemClass.splice(index, 1))
          // }
          // this.update({
          //   itemClass: ($itemClass.join(' ')||' ')
          // })
        }
      },

      update: function (param, callback) {
        const that = this
        const $tmp = lib.clone(this.data.$item)
        this.setData({$tmp})
        const updateFun = (opts) => {
          let target = {}
          if (lib.isObject(opts)) {
            if (opts.methods || opts.itemMethod) {
              const methods = opts.methods || opts.itemMethod
              if (lib.isObject(methods)) {
                Object.keys(methods).forEach(key => {
                  let fun = methods[key]
                  if (lib.isFunction(fun)) {
                    fun = fun.bind(that)
                    that[key] = fun
                  }
                })
              }
              delete opts.methods
              delete opts.itemMethod
            }

            Object.keys(opts).forEach(key => {
              if (opts[key] || opts[key] === 0 || typeof opts[key] === 'boolean') {
                let nkey = key.indexOf('$tmp.') == -1 ? '$tmp.' + key : key
                target[nkey] = opts[key]
              }
            })
  
            that.setData(target)
            const _item = _resetItem(that.data.$tmp, that)
            that.setData({ $item: _item }, callback)
          }
        }

        param = setPropsHooks.call(this, param)
        let result = this.hooks.emit('update', param)
        if (result && result[0]) {
          result = result[0] 
          if (lib.isFunction(result.then)) {
            result.then( res => updateFun(res) ).catch(err => err)
          } else {
            updateFun(result)
          }
        } else {
          updateFun(param)
        }

        return this
      },

      // 根据类名查找子元素
      find(param){
        return wx.$$find(param, this)
        // let that = this
        // let id, cls
        // if (param && lib.isString(param)) {
        //   if (param.charAt(0) === '#') {
        //     id = param.replace('#', '')
        //   } else {
        //     cls = param
        //   }
        // } else {
        //   return this.children
        // }

        // function loopFindChildren(children) {
        //   let childs = []
        //   if (children.length) {
        //     children.forEach(child => {
        //       let childData = child.getData()
        //       if ((id && childData.id === id) || (cls && child.hasClass(cls))) {
        //         childs = childs.concat(child)
        //       }
        //       if (child.children) {
        //         if (child.$$is === 'list') {
        //           childs = childs.concat(child.find(param))
        //         } else {
        //           childs = childs.concat(loopFindChildren((child.children || [])))
        //         }
        //       }
        //     })
        //   }
        //   return childs
        // }

        // if (this.children.length) {
        //   let mychilds = loopFindChildren(this.children)
        //   return {
        //     data: mychilds,
        //     length: mychilds.length,
        //     forEach(cb){
        //       if (lib.isFunction(cb)) {
        //         mychilds.forEach(function(cld) {
        //           cb.call(that, cld)
        //         })
        //       }
        //     },
        //     addClass(cls){
        //       this.forEach(function(cld) {
        //         cld.addClass(cls)
        //       })
        //     },
        //     removeClass(cls){
        //       this.forEach(function(cld) {
        //         cld.removeClass(cls)
        //       })
        //     },
        //     reset(param){
        //       this.forEach(function(cld) {
        //         cld.reset(param)
        //       })
        //     },
        //     update(param){
        //       this.forEach(function(cld) {
        //         cld.update(param)
        //       })
        //     }
        //   }
        // }
      },
    }
  })
}

export const itemComponentBehavior = function(app, mytype) {
  return Behavior({
    behaviors: [itemBehavior(app, mytype)],
    definitionFilter(defFields, definitionFilterArr) {
      // 监管组件的setData
      defFields.methods = defFields.methods || {}
      defFields.methods._setData = function (data, opts, callback) {
        if (lib.isFunction(opts)) {
          callback = opts
          opts = {}
        }
        if (this.init) {
          if (data && lib.isObject(data)) {
            let myitem = data.$item || data.item || data.dataSource || {}
            data.$item = _resetItem(myitem, this)
          }
        }
        const originalSetData = this._originalSetData // 原始 setData
        originalSetData.call(this, data, callback) // 做 data 的 setData
      }
    },
    lifetimes: {
      created: function () {
        this._originalSetData = this.setData // 原始 setData
        this.setData = this._setData // 封装后的 setData
      },
      ready: function () { //组件布局完成，这时可以获取节点信息，也可以操作节点
        this.mount()
      },
    }
  })
}