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

// mkNavpad
module.exports = function (params) {
  let dft = {
    id: '',
    bindbeforeopen: null,
    bindopen: null,
    bindclose: null,
    content: null,
    navpadHeight: '90%',   // 导航板高度
    navpadTop: '85%', // 导航板初始位置
    navpadOpen: '-80%'  // 导航板打开高度
  }

  let content = []
  let opts = Object.assign({}, dft, params)
  if (opts.content) {
    if (lib.isArray(opts.content)) {
      content = opts.content
    } else {
      content = [].concat(opts.content)
    }
  }

  return {
    id: lib.suid('$$navpad_'),
    itemClass: 'navpad',
    itemStyle: `--navpad-height: ${opts.navpadHeight}; --navpad-top: ${opts.navpadTop}; --open-height: ${opts.navpadOpen}`,
    type: {
      is: 'scroll',
      "scroll-y": false,
      "enable-flex": true
    },
    dot: content,
    touchoption: {
      navpad: {}
    },
    touchstart(e, param, inst){
      let isOpen = e.navpadOpened
      if (!isOpen) {
        if (lib.isFunction(opts.bindbeforeopen)) {
          opts.bindbeforeopen.call(this)
        }
      }
    },
    touchmove(e, param, inst) {
    },
    touchend(e, param, inst) {
      let isOpen = e.navpadOpened
      if (isOpen) {
        this.update({'type.scroll-y': true}, ()=>{
          if (lib.isFunction(opts.bindopen)) {
            opts.bindopen.call(this)
          }
        })
      } else {
        if (isOpen === false) {
          this.update({'type.scroll-y': false})
          if (lib.isFunction(opts.bindclose)) {
            opts.bindclose.call(this)
          }
        }
      }
    },
    methods: {
      innerContent(cnt, cb){
        if (cnt) {
          content = [].concat(cnt)
          this.update({ dot: content }, cb)
        }
      },
      appendContent(cnt, cb){
        if (cnt) {
          content = content.concat(cnt)
          // let currentDot = this.getData().dot
          // if (currentDot && currentDot.length) {
          //   content = currentDot.concat(content)
          // }
          this.update({ dot: content }, cb)
        }
      },
      __ready(){
        if (opts.id) this.activePage[opts.id] = this
        let queryDone = false
        let query = wx.createSelectorQuery().in(this)
        query.selectViewport().scrollOffset(res => {
          if (queryDone === true) return 
          queryDone = true
          this.scrollDetail = res
        }).exec(()=>{
          query.selectAll(`.navpad`).boundingClientRect(ret => {
            this.ret = ret[0]
            let {left, right, top, bottom, width, height, id} = this.ret
            this.update({
              'touchoption.navpad': {
                safeArea,
                rect: {left, right, top, bottom, width, height, id},
                ...this.scrollDetail,
                openHeight: opts.navpadOpen
              }
            })
          }).exec()
        })
      }
    }
  }
}