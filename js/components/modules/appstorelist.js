const Pager = require('../../components/aotoo/core/index')
const lib = Pager.lib

const {
  screenHeight,
  screenWidth,
  statusBarHeight,
  system,
  version,
  windowHeight,
  windowWidth,
  pixelRatio,
  SDKVersion,
  batteryLevel,
  brand,
  safeArea,
  deviceOrientation,
  model // iPhone Xr
} = wx.getSystemInfoSync()

let scopeVar = {
  // containerList 容器列表, appstore-pad 的实例
  // popViewInst 弹层实例
}
let navbar = wx.getMenuButtonBoundingClientRect()
let maxWidth = screenWidth
// let maxHeight = screenHeight
let maxHeight = screenHeight - navbar.bottom
let zoomWidth = screenWidth * 0.9  // 关闭当前页的阈值，手动从左滑向右，关闭当前页
let zoomScale = 0.8  // 关闭当前页的阈值，从上往下滑

// let openPos = null
const aniOpen = function (position) {
  const scrollTop = position.scrollTop
  const scrollLeft = position.scrollLeft
  this.openPos = {
    translateX: scrollLeft - position.left,
    translateY: scrollTop - position.top,
  }

  const target = position.target
  return [{
      ease: 'ease-in',
      top: `${target.top}px`,
      left: `${target.left}px`,
      width: `${target.width}px`,
      height: `${target.height}px`,
      offset: 0,
    },
    {
      // ease: 'ease-out',
      ease: 'cubic-bezier(.76,1.47,.57,.9)',
      top: 0,
      left: 0,
      width: `${maxWidth}px`,
      // height: `${maxHeight}px`,
      height: `100%`,
      offset: 1,
      zIndex: 600,
    }
  ]
}

const aniReopen = function (position, current) {
  return [{
    ease: 'ease-in',
    width: `${current._width}PX`,
    height: `${current._height}PX`,
    top: `${current._top}PX`,
    left: `${current._left}PX`,
    offset: 0,
  }, {
    // ease: 'cubic-bezier(.12,.58,0,1.31)',
    // ease: 'cubic-bezier(.75,.93,.33,1.44)',
    ease: 'ease-in',
    width: `${maxWidth}px`,
    // height: `${maxHeight}px`,
    height: `100%`,
    top: 0,
    left: 0,
    offset: 1,
    zIndex: 100
  }]
}

let maxScale = null
const aniClose = function (position, current) {
  let openPos = this.openPos
  if (openPos) {
    openPos = null
    maxScale = null
    const target = position.target
    return [{
        ease: 'ease-in',
        top: `${current && current._top || 0}px`,
        left: `${current && current._left || 0}px`,
        width: `${current && current._width || maxWidth}px`,
        height: `${current && current._height || maxHeight}px`,
        offset: 0,
      },
      {
        ease: 'cubic-bezier(.32,1.51,.57,.9)',
        top: `${target.top}px`,
        left: `${target.left}px`,
        width: `${target.width}px`,
        height: `${target.height}px`,
        offset: 1,
      }
    ]
  }
}

const aniResize = function(position, current, y) {
  let openPos = this.openPos
  if (current) {
    if (maxScale === null) {
      let wrate = maxWidth/position.width
      let hrate = maxHeight/position.height
      maxScale = [wrate, hrate]
    }
    let direct = y ? current._directY ? 1 : -1 : current._directX ? 1 : -1
    // let direct = current._directX ? 1 : -1
    let baseRate = maxWidth/maxHeight
    let rectGap = 3 * direct
    current._width = (current._width || maxWidth) - rectGap * baseRate
    current._height = (current._height || maxHeight) - rectGap*1.6

    let transRate = openPos.translateX / openPos.translateY
    let translateGap = 1 * direct
    current._translateX = (current._translateX || openPos.translateX) + translateGap
    current._translateY = (current._translateY || openPos.translateY) + translateGap*2

    current._width = current._width > maxWidth ? maxWidth : current._width
    current._height = current._height > maxHeight ? maxHeight : current._height

    let target = position.target
    let targetGap = 1 * direct
    let targetRate = target.top / target.left
    current._top = (current._top || 0) + targetGap*2
    current._left = (current._left || 0) + targetGap

    if (current._top > 80) {
      current._top = 80
    }

    // console.log(current._top, current._left);


    let scaleGap = 0.01 * direct
    maxScale = [1, 1]
    let _wrate = (current._scale&&current._scale[0] || maxScale[0]) - scaleGap
    let _hrate = (current._scale&&current._scale[1] || maxScale[1]) - (scaleGap/baseRate)*0.5
    current._scale = [_wrate, _hrate]
    if (y) {
      if (current._top > 30) {
        current._top = 30
      }
      current._left = current._left * 0.7
    }

    if (openPos) {
      return {
        data: [{
          ease: 'linear',
          scale: current._scale,
          translateX: current._translateX,
          translateY: current._translateY,
          width: `${current._width}px`,
          height: `${current._height}px`,
          top: current._top,
          left: current._left,
          offset: 0,
          zIndex: 100
        }],
        config: [
          y ?
          {
            ease: 'linear',
            top: current._top + 'px',
            left: current._left + 'px',
            scale: current._scale,
            // width: `${current._width}px`,
            // height: `${current._height}px`,
            offset: 0,
            zIndex: 100
          } :
          {
            ease: 'linear',
            top: current._top + 'px',
            left: current._left + 'px',
            width: `${current._width}px`,
            height: `${current._height}px`,
            offset: 0,
            zIndex: 100
          }
        ]
      }
    }
  }
}

let globalOpts = null
const itemMethods = {
  aim: 'onOpenTap',
  touchoption: {
    stopPropagation: false
  },
  touchstart(e, param, inst){
    this.touchmoving = false
    this.current = null
    this.__ontouchendToClose = true

    let ct = e.changedTouches[0]
    let id = '#' + (e.currentTarget.id || e.currentTarget.dataset.id)
    let $data = inst.parent('.appstore-item').getData()
    let position = $data.position
    let pageX = ct.pageX
    let pageY = ct.pageY
    this.start = {
      x: pageX,
      y: pageY,
      ts: e.timeStamp,
      id
    }
    this.current = {
      id: id,
      position
    }
  },
  touchmove(e, param, inst){
    let openPos = this.openPos
    this.touchmoving = true
    let that = this
    let $data = inst.parent('.appstore-item').getData()
    let position = $data.position
    let scrollTop = position.scrollTop
    let ct = e.changedTouches[0]
    let id = '#' + (e.currentTarget.id || e.currentTarget.dataset.id)
    let pageX = ct.pageX
    let pageY = ct.pageY
    let diffX = pageX - this.start.x
    let diffY = pageY - this.start.y
    let absX = Math.abs(diffX)
    let absY = Math.abs(diffY)
    let directX = diffX > 0
    let directY = diffY > 0
    this.current = {
      id,
      x: pageX,
      y: pageY,
      ts: e.timeStamp,
      _width: this.current && this.current._width,
      _height: this.current && this.current._height,
      _translateX: this.current && this.current._translateX,
      _translateY: this.current && this.current._translateY,
      _scale: this.current && this.current._scale,
      _top: this.current && this.current._top,
      _left: this.current && this.current._left,
      position: this.current && this.current.position,
      _directX: directX,
      _directY: directY,
    }

    function triggerClosePopView(y) {
      let aniConfig = aniResize.call(this, position, this.current, y)
      if (aniConfig) {
        let width = parseInt(aniConfig.data[0].width.replace('px', ''))
        let height = parseInt(aniConfig.data[0].height.replace('px', ''))
        let scale = aniConfig.data[0].scale
        let top = aniConfig.data[0].top
        let left = aniConfig.data[0].left
        let translateX = aniConfig.data[0].translateX
        let translateY = aniConfig.data[0].translateY
        this.current._width = width
        this.current._height = height
        this.current._top = top
        this.current._left = left
        this.current._scale = aniConfig.data[0].scale
        this.current.position = position
        if (y && scale[0] > zoomScale) {
          this.resizePopView(id, aniConfig.config)
        } else if (!y && width > zoomWidth) {
          this.resizePopView(id, aniConfig.config)
        } else {
          if (this.animateOpen && this.__ontouchendToClose) {
            this.__ontouchendToClose = false // touchmove的防抖开关
            this.closePopView(id, position)
          }
          return
        }
      }
    }
    // console.log(directX, (absX/absY), openPos, this.animateOpen, (e.timeStamp - this.start.ts));
    if (
      directX &&
      (absX/absY > 4) &&
      openPos &&
      this.animateOpen &&
      (e.timeStamp - this.start.ts) % 17 < 15
    ){
      triggerClosePopView.call(this)
    } else {
      // 纵向滑动
      // if (
      //   this.contentScrollTop <= 2 &&
      //   (absY/absX > 4) && 
      //   openPos && 
      //   this.animateOpen &&
      //   (e.timeStamp - this.start.ts) % 17 < 15
      // ) {
      //   triggerClosePopView.call(this, true)
      // }
    }

  },
  touchend: '__ontouchend',
  methods: {
    scrollTopPos(e, param, inst) {
      this.contentScrollTop = e.detail.scrollTop
      if (globalOpts && lib.isFunction(globalOpts.onCardScroll)) {
        globalOpts.onCardScroll.call(this, e, param, inst)
      }
    },
    __ontouchend(e, param, inst) {
      let that = this
      let openPos = this.openPos
      let $data = inst.parent('.appstore-item').getData()
      let position = $data.position
      let scrollTop = position.scrollTop
      let ct = e.changedTouches[0]
      let id = '#' + (e.currentTarget.id || e.currentTarget.dataset.id)
      let current = this.current
      let pageX = ct.pageX
      let pageY = ct.pageY
      let diffX = param.diffX || (pageX - this.start.x)
      let diffY = param.diffY || (pageY - this.start.y)
      let absX = Math.abs(diffX)
      let absY = Math.abs(diffY)
      let directX = diffX > 0
      let directY = diffY > 0
      if (
        directX &&
        ((absX / absY > 4)) &&
        openPos &&
        this.animateOpen &&
        current._width > zoomWidth
      ) {
        this.reOpenPopView(id, position)
      } else {
        if (
          directY &&
          ((absY / absX > 4)) &&
          openPos &&
          this.animateOpen &&
          this.contentScrollTop < 5 &&
          current._width > zoomWidth
        ) {
          this.reOpenPopView(id, position)
        }
      }
    },
  }
}

const adapterImg = function(item, sorts, _sorts) {

  if (item.img && !item.IMG) {
    if (lib.isObject(item.img)) {
      item.img.itemStyle = item.img.itemStyle ? item.img.itemStyle : `width: ${maxWidth}px;`
    }
    if (lib.isArray(item.img)) {
      item.img = item.img.map(pic=>{
        pic.itemStyle = pic.itemStyle ? pic.itemStyle : `width: ${maxWidth}px;`
        return pic
      })
    }
  }

  if (lib.isObject(item.IMG)) {
    let imgSortIndex = sorts['IMG']
    if (item.img) {
      item.li = [].concat(item.img)
      item.img = item.IMG
    } else {
      item.img = item.IMG
    }
    item.img.itemStyle = item.img.itemStyle ? item.img.itemStyle : `width: ${maxWidth}px;`
    item.img.itemClass = item.img.itemClass ? item.img.itemClass + ' cover-img' : 'cover-img'
    delete item.IMG
    item.itemClass = item.itemClass ? item.itemClass += ' project-cover light' : 'project-cover light'
    if (item.img.dark) item.itemClass = item.itemClass.replace('light', 'dark')

    item.img.mode = 'aspectFill'
    // item.img.mode = 'widthFix'
    sorts.img = imgSortIndex
    // delete sorts.IMG

    let index = _sorts.findIndex(it=>it.key === 'img')
    if (index > -1) {
      _sorts[index].index = imgSortIndex
    } else {
      _sorts.push({key: 'img', index: imgSortIndex})
    }
  }
  return {item, sorts, _sorts}
}

function adapter(params, opts) {
  return params.map((item, ii)=>{
    if (lib.isString(item) || lib.isNumber(item)) {
      item = {title: item}
    }

    if (!lib.isObject(item)) {
      return {title: item}
    }

    let id = item.id || lib.suid('store_')
    item = Object.assign({ id }, itemMethods, item)
    item.type = {
      "is": 'scroll',
      "scroll-y": false,
      "enable-flex": true,
      "scroll-with-animation": true,
      "bindscroll": 'scrollTopPos'
    }

    let sorts = {}
    let _sorts = []
    Object.keys(item).forEach((key, ii)=>{
      sorts[key] = ii+1
      _sorts.push({key, index: ii+1})
    })

    let $item = adapterImg(item, sorts, _sorts)
    item = $item.item
    sorts = $item.sorts
    _sorts = $item._sorts

    if (item.title) {
      item.title = [].concat(item.title)

      if (!item.itemClass) item.itemClass = 'project-title-header'
      else {
        item.itemClass += ' project-title-header'
      }

      if (sorts.img) {
        if (sorts.img < sorts.title) {
          item.itemClass = item.itemClass.replace('project-title-header', 'project-title-footer')
        }
      }

      if (item.title.length === 1) {
        item.itemClass += ' topic'
        if (item.banner) {
          if (sorts.IMG) {
            item.itemClass = item.itemClass.replace('project-title-header', 'project-title-footer banner').replace('project-title-footer', 'project-title-footer banner')
            if (lib.isString(item.banner) || lib.isNumber(item.banner)) {
              item.banner = {title: item.banner}
            }
            if (lib.isObject(item.banner)) {
              item.banner.itemClass = 'banner-zone ' + (item.banner.itemClass||'')
            }
            item.title = (item.title||[]).concat(item.banner) // banner允许数组
          }
          delete item.banner
        }
      }
      
      else if (item.title.length === 2) {
        item.itemClass += ' subject-topic'
      }

      else if (item.title.length === 3) {
        item.itemClass += ' subject-topic-desc'
      } 
      
      else if (item.title.length>3) {
        delete item.img
        item.itemClass = item.itemClass.replace('banner', '').replace('project-title-footer', 'project-title-header section subject-topic').replace('project-title-header', 'project-title-header section subject-topic')
        let content = item.title.splice(2)
        item.li = content
        item.liClass = 'section-zone'
      }
    }

    let nItem = {}
    _sorts.sort((a, b)=>a.index-b.index).forEach(it=>{
      let key = it.key
      if (item.hasOwnProperty(key)) nItem[key] = item[key]
    })
    nItem = Object.assign(nItem, item)
    nItem.itemClass = 'appstore-popitem ' + nItem.itemClass

    let frameClass = ''
    if (sorts.IMG) frameClass = 'frame-cover'

    return {
      attr: {id},
      dot: [nItem],
      itemClass: frameClass
    }
  })
}

// mkAppstoreList
module.exports = function(params) {
  let dft = {
    id: lib.suid('appstore_'),
    listClass: 'appstore-pad',
    itemClass: 'appstore-item',
    onOpen: null,
    onClose: null,
    onContainerScroll: null,
    onCardScroll: null,
    data: []
  }

  if (lib.isArray(params)) {
    dft.data = params
  }

  let $$id = params.id
  let opts = Object.assign({}, dft, params)
  globalOpts = opts
  opts.$$id = $$id

  // 容器列表
  return {
    id: opts.id,
    listClass: opts.listClass,
    itemClass: 'appstore-item',
    type: { 
      "is": 'scroll', 
      "scroll-y": true, 
      "enable-flex": true,
      "bindscroll": 'bindscrollFunc'
    },
    data: adapter(opts.data, opts),
    footer: {
      dot: [
        // 遮罩层
        {
          id: 'appstore-masker',
          itemClass: 'appstore-masker',
          show: false
        },

        // 关闭按钮
        {
          id: 'appstore-close-button',
          itemClass: 'appstore-close-button',
          show: false,
          aim(){
            this.closePopView()
          }
        }
      ]
    },
    methods: {
      bindscrollFunc(e, param, inst){
        // deltaX: 0, deltaY: -3, scrollHeight: 8666, scrollLeft: 0, scrollTop: 3, scrollWidth: 414
        this.scrollDetail = e.detail
        if (lib.isFunction(opts.onContainerScroll)) {
          opts.onContainerScroll.call(this, e, param, inst)
        }
      },
      // 获取弹层实例
      getTargetInst(id){
        let scopeVar = this.scopeVar
        return (id ? (scopeVar.popViewInst||this.activePage.getElementsById(id)) : null) || scopeVar.popViewInst
      },
      resizePopView(id, config){
        let popViewInst = this.getTargetInst(id)
        popViewInst && popViewInst.animate(id, config, 17)
      },
      reOpenPopView(id, position){
        let popViewInst = this.getTargetInst(id)
        let current = this.current
        popViewInst && popViewInst.animate(id, aniReopen.call(this, position, current), 100)
      },
      closePopView(id, position) {
        if (!this.animateOpen) return 
        id = id || (this.current && this.current.id)
        if (!id) return
        position = position || this.current.position
        let popViewInst = this.getTargetInst(id)
        let scopeVar = this.scopeVar
        if (!popViewInst) return
        let maskerInst = this.activePage.getElementsById('appstore-masker')
        let closeButtonInst = this.activePage.getElementsById('appstore-close-button')

        position.target = {
          top: position.top - position.scrollTop,
          left: position.left - position.scrollLeft,
          width: position.width,
          height: position.height
        }

        scopeVar.containerList && scopeVar.containerList.update({ "type.scroll-y": true })
        closeButtonInst.hide()
        maskerInst.hide()
        this.animateOpen = false
        this.__ontouchendToClose = true

        popViewInst.update({ "type.scroll-top": 0 })
        if (!id) {
          // 如果点透了弹层，则强制关闭弹层，没有动画，一般这是属于出错状态
          popViewInst.clearAnimation('#'+popViewInst.data.id)
          popViewInst.reset()
          // popViewInst.update({
          //   "itemStyle": 'position: static',
          //   "type.scroll-y": false
          // })
          scopeVar.popViewInst = null
        } else {
          // 正常动画归位弹层
          popViewInst.animate(id, aniClose.call(this, position, this.current), 400)
          setTimeout(() => {
            popViewInst.clearAnimation(id)
            popViewInst.reset()
            // popViewInst.update({
            //   "itemStyle": 'position: static',
            //   "type.scroll-y": false,
            // })
            scopeVar.popViewInst = null
          }, 440);
          if (lib.isFunction(opts.onClose)) {
            opts.onClose.call(popViewInst, popViewInst.getData())
          }
        }
      },

      // 打开弹层
      openPopView(id, position){
        let that = this
        let popViewInst = this.activePage.getElementsById(id)
        let maskerInst = this.activePage.getElementsById('appstore-masker')
        let closeButtonInst = this.activePage.getElementsById('appstore-close-button')
        let scopeVar = this.scopeVar
        scopeVar.popViewInst = popViewInst

        position.target = {
          top: position.top - position.scrollTop,
          left: position.left - position.scrollLeft,
          width: position.width,
          height: position.height
        }
        this.current.position = position

        // "touchoption.stopPropagation": false,
        // "itemStyle": `position: fixed; left: ${position.target.left}px; top: ${position.target.top}px; z-index: 100; width: ${position.target.width}px; height: ${position.target.height}px; overflow-y: scroll;`
        popViewInst.update({
          "itemStyle": `position: fixed; left: ${position.target.left}px; top: ${position.target.top}px; z-index: 600; border-radius: 0;`,
        }, function () {
          setTimeout(() => {
            popViewInst.animate(id, aniOpen.call(that, position), 400)
            setTimeout(() => {
              //设置弹层可以滚动，分开设置动画效果较好
              popViewInst.update({ "type.scroll-y": true })
              //设置容器列表不能滚动
              scopeVar.containerList && scopeVar.containerList.update({ "type.scroll-y": false })
              // 显示关闭按钮
              closeButtonInst.update({ show: true, itemStyle: `top: ${navbar.top+1}px; left: ${navbar.left-40}px;` })
              // 打开遮罩
              maskerInst.show()

              let $content = popViewInst.getData().content
              if (lib.isString($content)) {
                popViewInst.update({
                  "@md": $content
                })
              }

              if (lib.isObject($content)) {
                popViewInst.update({
                  "@item": $content
                })
              }

              if (lib.isArray($content)) {
                popViewInst.update({
                  "@list": {
                    listClass: 'appstore-item-subs',
                    itemClass: 'appstore-item-subitem',
                    data: $content
                  }
                })
              }

              if (lib.isFunction(opts.onOpen)) {
                opts.onOpen.call(popViewInst, popViewInst.getData())
              }
            }, 440);
          }, 50);
        })
      },

      // 响应点击事件
      onOpenTap(e, param, inst) {
        let that = this
        let id = '#' + (e.currentTarget.id || e.currentTarget.dataset.id)
        let scrollDetail = this.scrollDetail
        if (this.animateOpen) {

        } else {
          let $data = inst.parent('.appstore-item').getData()
          let position = $data.position
          if (this.animateOpen === false) {
            position._width = this.current && this.current._width
            position._height = this.current && this.current._height
            position.scrollTop = scrollDetail.scrollTop
            position.scrollLeft = scrollDetail.scrollLeft
            position.scrollHeight = scrollDetail.scrollHeight
            position.scrollWidth = scrollDetail.scrollWidth
            this.animateOpen = true
            this.openPopView(id, position)
          }
        }
      },

      stopScroll(){
        this.update({ "type.scroll-y": false })
      },

      startScroll(){
        this.update({ "type.scroll-y": true })
      },

      __ready(){
        if ($$id) {
          this.activePage[$$id] = this
        }
        this.contentScrollTop = 0  // 弹开内容页时，默认在顶部0
        this.scopeVar = {
          containerList: this
        }
        this.openPos = null
        this.animateOpen = false
        let scrollLeft=0, scrollTop=0, scrollHeight = 0, scrollWidth = 0
        let query = wx.createSelectorQuery().in(this)
        this.hooks.once('query-items', function(param={}) {
          let done = false
          query.selectViewport().scrollOffset(res => {
            scrollLeft = res.scrollLeft
            scrollTop = res.scrollTop
            scrollHeight = res.scrollHeight
            scrollWidth = res.scrollWidth
            this.scrollDetail = res
          }).exec(()=>{
            query.selectAll(`.${opts.listClass} .appstore-item`).boundingClientRect(ret => {
              if (ret && !done) {
                done = true
                this.ret = ret
                let $data = this.data.$list.data
                this.items = $data.map(item => {
                  let position = ret.find(it=>(it.id||it.dataset.id)===(item.id || item.attr.id))
                  if (position) {
                    position.top = position.top + scrollTop
                    position.left = position.left + scrollLeft
                    position.scrollTop = scrollTop
                    position.scrollLeft = scrollLeft
                    position.scrollHeight = scrollHeight
                    position.scrollWidth = scrollWidth
                    item.position = position
                  }
                  return item
                })
                this.update({ data: this.items }, param.cb)
              }
            }).exec()
          })
        })
        this.hooks.emit('query-items', {}, this)
      }
    }
  }
}