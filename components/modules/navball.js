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
  deviceOrientation,
  safeArea,
  model // iPhone | Xr
} = wx.getSystemInfoSync()

function listenEvent(evtname, opts, event, type) {
  if (lib.isFunction(opts[evtname])) {
    opts[evtname].call(this, event)
  } else if (lib.isString(opts[evtname]) && lib.isFunction(this.activePage[opts[evtname]])) {
    this.activePage[opts[evtname]].call(this.activePage, event)
  } else {
    if (type === 'home') wx.navigateBack({ delta: 100 }) 
    else {
      if (type) {
        // longpress 空闲
      } else {
        wx.navigateBack({ delta: 1 }) 
      }
    }
  }
}

// mkNavball
module.exports = function(params) {
  let dft = {
    itemClass: 'nav-ball-handle',
    tap: null,
    doubleTap: null,
    longpress: null
  }
  let opts = Object.assign({}, dft, params)
  return {
    id: lib.suid('navball_'),
    itemClass: opts.itemClass,
    touchoption: {
      navball: opts.hasOwnProperty('navball') ? opts.navball : true,
      navballOption: { safeArea }
    },
    dot: [
      {
        title: opts.title || '',
        itemClass: 'inner-button',
      }
    ],
    aim(e){
      let ts = e.timeStamp
      let difTime = ts - this.prevTimeStamp
      this.prevTimeStamp = ts
      if (difTime <250) {
        clearTimeout(this.taptimmer)
        this.dtap(e)
      } else {
        this.taptimmer = setTimeout(() => {
          listenEvent.call(this, 'tap', opts, e)
        }, 250);
      }


      // let ts = e.timeStamp
      // let difTime = ts - this.prevTimeStamp
      // this.prevTimeStamp = ts
      // if (difTime < 300) {
      //   this.dtap(e)
      // } else {
      //   listenEvent.call(this, 'tap', opts, e)
      // }
    },
    catchlongpress(e) {
      listenEvent.call(this, 'longpress', opts, e, 'home')
    },
    catchtouchstart(e, param, inst){},
    methods: {
      dtap(e){ // 双击
        listenEvent.call(this, 'doubleTap', opts, e, 'home')
      },
      fresh(){
        this.update({'touchoption.navball': 'fresh'})
      },
      __ready(){
        this.prevTimeStamp = 0
        let scrollLeft=0, scrollTop=0, scrollHeight = 0, scrollWidth = 0
        let query = wx.createSelectorQuery().in(this)
        let done = false
        query.selectViewport().scrollOffset(function (res) {
          scrollLeft = res.scrollLeft
          scrollTop = res.scrollTop
          scrollHeight = res.scrollHeight
          scrollWidth = res.scrollWidth
        }).exec(()=>{
          query.selectAll(`.nav-ball-handle`).boundingClientRect(ret => {
            if (ret && !done) {
              done = true
              let position = ret[0]
              position.top = position.top + scrollTop
              position.left = position.left + scrollLeft
              position.scrollTop = scrollTop
              position.scrollLeft = scrollLeft
              position.scrollHeight = scrollHeight
              position.scrollWidth = scrollWidth
              position.safeArea = safeArea
              position.windowHeight = windowHeight
              position.windowWidth = windowWidth
              position.pixelRatio = pixelRatio
              this.update({ 'touchoption.navballOption': {...position} })
            }
          }).exec()
        })
      }
    }
  }
}