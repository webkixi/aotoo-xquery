const Pager = require('../../components/aotoo/core/index')
const lib = Pager.lib

function adapter(params) {
  return params.map(item=>{
    let obj = item

    if (lib.isString(item) || lib.isNumber(item)) {
      obj = {
        title: item,
      }
    }

    if (obj.selected) {
      obj.itemClass = 'on'
    }

    if (obj.disabled) {
      obj.itemClass = 'disabled'
    }

    if (obj.content) {
      obj.body = [].concat(obj.content)
      delete obj.content
    }

    if (!obj.body) {
      obj.body = []
    }
    return obj
  })
}

// mkCollapse
module.exports = function(params) {
  let dft = {
    listClass: 'collaps-pad',  // 容器类名
    itemClass: 'collaps-item', // 子项类名
    data: [],  // 传入collapse数组数据
    tap: null  // 切换子项响应方法
  }

  let opts = Object.assign({}, dft, params)

  return {
    listClass: opts.listClass,
    itemClass: 'collaps-item',
    data: adapter(opts.data),
    itemMethod: {
      aim(e, param, inst){
        if (inst.hasClass('.disabled')) return
        lib.vibrateShort()
        let click = opts.tap || opts.catchtap || opts.aim
        if (lib.isString(click)) {
          click = this.activePage && this.activePage[click]
        }
        if (lib.isFunction(click)) {
          let $data = inst.getData()
          let context = {
            disabled(obj){
              if (obj === true) {
                inst.update({ disabled: true })
                inst.addClass('.disabled')
                setTimeout(() => {
                  inst.removeClass('.on')
                }, 20);
              }
              if (obj === false) {
                inst.update({ disabled: false })
                inst.removeClass('.disabled')
              }
            },
            title(obj){
              if (obj) {
                inst.update({ title: obj })
              }
            },
            content(obj){
              if (obj) {
                if (lib.isString(obj) || lib.isNumber(obj)) {
                  obj = {title: obj}
                }
                obj = [].concat(obj)
                inst.update({ body: obj })
                // if (lib.isArray(obj)) {
                // } else {
                //   inst.update({ body: [obj] })
                // }
              }
            }
          }
          click.call(context, e, $data)
        }

        // 弹出性能最好的方式
        let parentList = inst.parent()
        parentList.forEach(item=>{
          if (item.data.selected) {
            if (item.treeid === inst.treeid) {
              item.toggleClass('.on')
            } else {
              item.removeClass('.on')
            }
            item.update({ selected: false })
          } else {
            if (item.treeid === inst.treeid) {
              item.addClass('.on')
              item.update({ selected: true })
            }
          }
        })
      }
    },
    methods: {
      __ready(){
        this.preSelected = null
      }
    }
  }
}