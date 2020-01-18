const Pager = require('../aotoo/core/index')
let lib = Pager.lib

module.exports = function mkTab($$id, opts, type) {
  let dft = {
    data: [],
    type: 'h'
  }

  if (!$$id) $$id = lib.suid('tabside_')

  if (lib.isArray($$id) || lib.isObject($$id)) {
    opts = $$id
    $$id = lib.suid('tabside_')
  }

  if (lib.isArray(opts)) {
    dft.data = opts
    opts = dft
  }

  if (lib.isObject(opts)) {
    opts = Object.assign({}, dft, opts)
  }

  opts.listClass = 'tab-header '+(opts.listClass||'')

  let menus = opts.data
  let contents = opts.content || []
  let autoContent = contents.length ? false : true  // 是否外部传入的数据

  menus = menus.map((item, ii)=>{
    let id = ii + 1

    if (autoContent) {
      contents.push({
        title: '',
        id: 'sw-'+id
      })
    } else {
      if (contents[ii] && lib.isObject(contents[ii])) {
        contents[ii].id = 'sw-'+id
      } else {
        contents.push({
          // title: contents[ii]||(item.title+'内容-'+id),
          title: '',
          id: 'sw-' + id
        })
      }
    }

    return {
      title: item.title,
      id: 'sc-'+id,
      tap: `onTap?id=${id}&title=${item.title}`
    }
  })

  let menusType = {
    "is": 'scroll',
    "scroll-y": true,
  }

  let contentType = {
    is: 'swiper',
    bindchange: 'onSwiperChange',
    circular: false,
    duration: 300,
    vertical: true,
  }

  type = type || opts.type

  if (type === 'v') {
    menusType = {
      "is": 'scroll',
      "scroll-x": true,
    }

    contentType = {
      is: 'swiper',
      bindchange: 'onSwiperChange',
      circular: false,
      duration: 300
    }
  }

  return {
    $$id: $$id || lib.suid('tabside_'),
    listClass: opts.listClass,
    itemClass: 'tab-item',
    type: menusType,
    data: menus,
    footer: {
      itemClass: 'tab-content',
      "@list": {
        listClass: 'swiper-content',
        itemClass: 'swiper-item',
        type: contentType,
        data: contents
      }
    },
    methods: {
      __ready(){
        this.swiperInst = this.find('.swiper-content').data[0]
        this.scrollInst = this
        this.scrollInst.find({id: 'sc-1'}).addClass('active')
        setTimeout(() => {
          this.hooks.emit('set-content', {id: 1}, this.swiperInst.find({id: 'sw-1'}))
        }, 100);
        this.hasChangeContent = {'sw-1': true}
        if ($$id) {
          this.activePage[$$id] = this
        }
      },
      onTap(e, param, inst) {
        let that = this
        let id = parseInt(param.id)
        let title = param.title
        inst.siblings().removeClass('active')
        inst.addClass('active')
        this.swiperInst.update({"type.current": id-1}, function(){
          let hc = that.hasChangeContent
          let swId = 'sw-'+id
          let target = that.swiperInst.find({id: swId})
          if (!hc[swId]) {
            that.hooks.emit('set-content', {id, title}, target)
            that.hooks.emit('tap-to', {id, title}, target)
            that.hasChangeContent[swId] = true
          }
        })
      },
      onSwiperChange(e){
        let that = this
        this.scrollInst.forEach(item => item.removeClass('active'))
        let id = e.detail.currentItemId.replace('sw-', '')  
        id = parseInt(id)
        
        let scrollId = 'sc-'+id
        let activeIt = this.scrollInst.find({id: scrollId})
        activeIt.addClass('active')
        let $data = activeIt.data[0].data
        let title = $data.title

        let intoId = id === 1 ? id : id-3
        this.update({ "type.scroll-into-view": 'sc-'+intoId }, function() {
          let hc = that.hasChangeContent
          let swId = 'sw-' + id
          let target = that.swiperInst.find({id: swId})
          if (!hc[swId]) {
            that.hooks.emit('set-content', {id, title}, target)
            that.hooks.emit('switch-to', {id, title}, target)
          }
        })
      }
    }
  }
}