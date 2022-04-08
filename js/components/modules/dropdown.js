const Pager = require('../../components/aotoo/core/index')
let lib = Pager.lib

function adapter(params) {
  return params.map((item, ii)=>{
    if (lib.isString(item)) {
      item = {title: item}
    }
    if (lib.isObject(item)) {
      item._idx_ = ii
      let content = {$$id: `pop-${ii}`, id: `pop-${ii}`, itemClass: 'dropdown-item-content' }
      if (item.contentStyle) {
        content.itemStyle = item.contentStyle
        delete item.contentStyle
      }
      item.dot = [ content ]
    }
    return item
  })
}

module.exports = function mkDropdown(params) {
  let dft = {
    id: '',
    listClass: 'dropdown-tab',
    tap: null,
    data: [],
    footerId: lib.suid('dd-footer-'),
    maskStyle: '',
    show: true,
    __ready: null
  }

  let opts = Object.assign({}, dft, params)
  opts.data = adapter(opts.data)

  return {
    listClass: opts.listClass,
    itemClass: 'dropdown-item',
    data: opts.data,
    show: opts.show,
    footer: {$$id: opts.footerId, itemClass: 'dropdown-mask', itemStyle: opts.maskStyle, aim: 'closePop'},
    itemMethod: {
      aim(e, param, inst) {
        const that = this
        let $data = inst.getData()
        let idx = $data._idx_
        this.currentMenu = inst
        // inst.siblings().removeClass('.active', function(){
        //   that.showMask()
        //   inst.addClass('.active', function(){
        //     that.fillContent(inst, idx)
        //   })
        // })
        this.forEach(it=>{
          if (it.data._idx_ === idx) {
            if (it.hasClass('.active')) {
              this.closePop()
              it.removeClass('.active')
            } else {
              it.addClass('.active')
              this.showMask()
              this.fillContent(it, idx)
            }
          } else {
            it.removeClass('.active')
          }
        })
      }
    },
    methods: {
      fillContent(item, idx){
        let that = this
        let id = '#pop-'+idx
        let contentInst = this.find(id)
        this.currentContent = contentInst

        let $data = item.data || item
        let $content = $data.content

        function filling(content, reset) {
          if (contentInst && content) {
            if (reset) {
              contentInst.reset()
            }
            if (lib.isObject(content)) {
              contentInst.update(content)
            }
            if (lib.isArray(content)) {
              contentInst.update({
                "@list": {listClass: 'pop-'+idx, data: content}
              })
            }
            if (lib.isString(content)) {
              contentInst.update({
                "@md": content
              })
            }
          }
        }


        if ($content && contentInst) {
          if (that.contentRendered.indexOf(id) === -1){
            that.contentRendered.push(id)
            if (lib.isFunction($content)) {
              let res = $content(item.data, idx)
              if (res.then) {
                res.then(result=>{
                  filling(result)
                })
              } else {
                filling(res)
              }
            } else {
              filling($content)
            }
          }
        }


        if (lib.isFunction(opts.tap)) {
          if (contentInst) {
            const context = {
              activePage: that.activePage,
              resetContent(){
                contentInst.reset()
              },
              updateContent(param, forceUpdate){
                if ((that.contentRendered.indexOf(id) === -1) || forceUpdate === true) {
                  if (that.contentRendered.indexOf(id) === -1) {
                    that.contentRendered.push(id)
                  }
                  filling(param, forceUpdate)
                }
              },
              updateTitle(param){
                that.updateTitle.call(that, param)
              },
              getTitle() {
                return that.currentMenu.getData().title
              }
            }
            // opts.tap.call(context, item, idx)
            opts.tap.call(context, $data, idx)
          }
        }
      },
      closePop(){
        if (!this.footer) {
          this.footer = this.getFooter()
        }
        this.hooks.emit('close-pop')
        this.currentMenu.removeClass('.active')
        this.footer.removeClass('show-masker')
      },
      showMask(){
        if (!this.footer) {
          this.footer = this.getFooter()
        }
        this.hooks.emit('open-pop')
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
            setTimeout(() => {
              this.currentMenu.update(param)
            }, 100);
          }
        }
      },
      getFooter(){
        let footerInst = Pager.getElementsById('#'+opts.footerId)
        this.footer = footerInst
        return footerInst
      },
      __ready(){
        this.contentRendered = []
        if (opts.id) {
          this.activePage[opts.id] = this
        }
        if (lib.isFunction(opts.__ready)) {
          opts.__ready.call(this)
        }
      },
    }
  }
}