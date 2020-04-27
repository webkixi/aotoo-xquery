const Pager = require('../../components/aotoo/core/index')
let lib = Pager.lib

function adapter(params) {
  return params.map((item, ii)=>{
    if (lib.isString(item)) {
      item = {title: item}
    }
    if (lib.isObject(item)) {
      item._idx_ = ii
      item.dot = [ {id: `pop-${ii}`, itemClass: 'dropdown-item-content', aim: function(params) {} } ]
    }
    return item
  })
}

module.exports = function mkDropdown(params) {
  let dft = {
    id: '',
    listClass: 'dropdown-tab',
    tap: null,
    data: []
  }

  let opts = Object.assign({}, dft, params)
  opts.data = adapter(opts.data)

  return {
    listClass: opts.listClass,
    itemClass: 'dropdown-item',
    data: opts.data,
    footer: {itemClass: 'dropdown-mask', aim: 'closePop'},
    itemMethod: {
      aim(e, param, inst) {
        let $data = inst.getData()
        let idx = $data._idx_
        this.currentMenu = inst
        this.forEach(it=>{
          it.removeClass('.active')
          if (it.data._idx_ === idx) {
            if (it.hasClass('.active')) {
              this.closePop()
              it.removeClass('.active')
            } else {
              it.addClass('.active')
              this.showMask()
              this.fillContent(it, idx)
            }
          }
        })
      }
    },
    methods: {
      fillContent(item, idx){
        let that = this
        if (lib.isFunction(opts.tap)) {
          let id = '#pop-'+idx
          let contentInst = this.find(id)
          this.currentContent = contentInst
          if (contentInst) {
            const context = {
              resetContent(){
                contentInst.reset()
              },
              updateContent(param, forceUpdate){
                if ((that.contentRendered.indexOf(id) === -1) || forceUpdate === true) {
                  that.contentRendered.push(id)
                  if (lib.isObject(param)) {
                    contentInst.update(param)
                  }
                }
              },
              updateTitle(param){
                that.updateTitle(param)
              },
              getTitle() {
                return that.currentMenu.getData().title
              }
            }
            opts.tap.call(context, item, idx)
          }
        }
      },
      closePop(){
        this.currentMenu.removeClass('.active')
        this.footer.removeClass('show-masker')
      },
      showMask(){
        this.footer.addClass('show-masker')
      },
      updateContent(param){
        if (this.currentContent) {
          if (lib.isObject(param)) {
            this.currentContent.update(param)
          }
        }
      },
      updateTitle(param){
        if (this.currentMenu) {
          if (lib.isString(param)) {
            this.currentMenu.update({ title: param })
          }
          if (lib.isObject(param)) {
            this.currentMenu.update(param)
          }
        }
      },
      __ready(){
        this.contentRendered = []
        if (opts.id) {
          this.activePage[opts.id] = this
        }
      },
    }
  }
}