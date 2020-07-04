const Pager = require('../../components/aotoo/core/index')
const lib = Pager.lib
const cd = lib.cd

module.exports = function(params={}) {
  let def = {
    id: '',
    title: '',
    disable: false,
    itemClass: 'button',
    loadingClass: 'loading',
    itemStyle: ''
  }

  let $class = params.itemClass || params.class
  let opts = Object.assign({}, def, params)
  if ($class) {
    if (!(/ ?button ?/g.test($class))) {
      opts.itemClass = 'button ' + $class
    }
  }

  opts.methods = {
    __ready(){
      if (opts.id) {
        this.activePage[opts.id] = this
      }
      this.loadingClass = opts.loadingClass
      this.disabled = opts.disable
      let odata = this.getData()
      this.otitle = odata.title
      this.oItemClass = odata.itemClass
      
      if (this.disabled) {
        this.addClass('disable')
      }

      if (opts.__ready) {
        opts.__ready.call(this)
      }
    },
    disable(){
      this.disabled = true
      this.addClass('disable')
    },
    enable(){
      this.disabled = false
      this.removeClass('disable')
    },
    loading(clear){
      if (this.disabled) return
      this.disabled = true
      if (clear) {
        let loadClass = this.oItemClass+' '+this.loadingClass+ ' disable'
        this.update({
          title: ' ',
          itemClass: loadClass,
        })
      } else {
        this.addClass(this.loadingClass+' disable')
      }
    },
    loaded(){
      this.disabled = false
      this.removeClass('disable ' + this.loadingClass)
      this.updateTitle(this.otitle)
    },
    updateTitle(tit){
      this.update({ title: tit })
    },
    countdown(cdtime, per, final){
      let that = this
      let title = this.otitle
      this.disable()
      let itemClass = this.oItemClass

      let cdPreTitle = ''
      let cdAftTitle = ''
      if (lib.isObject(cdtime)) {
        let obj = cdtime
        cdtime = obj.time
        let cdary = Object.keys(obj)
        if (cdary[0] === 'title'){
          cdPreTitle = obj.title
        } else {
          cdAftTitle = obj.title
        }
      }

      cd(
        cdtime, 
        function(count, ms) { // per callback
          let cdCount = ms/1000
          cdCount = `${cdPreTitle}(${cdCount})${cdAftTitle}`
          if (lib.isFunction(per)) {
            per.call(that, ms, cdCount)
          } else {
            that.update({
              title: cdCount,
              itemClass: itemClass+' disable countdown'
            })
          }
        },
        function(ms) { // final callback
          that.enable()
          if (lib.isFunction(final)) {
            that.updateTitle(title)
            final.call(that, ms, title)
          } else {
            that.update({
              title,
              itemClass
            })
          }
        }
      )
    }
  }

  return opts
}