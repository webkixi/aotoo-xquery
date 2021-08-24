import { showInScrollViewPort, showInScrollViewPortX } from "./showinvp";

function initializeLoopSwiper(params) {
  const lib = params.lib
  const that = this
  const screens = this.screens
  const oriData = this.validMonth
  const current = params.type.current
  const instack = lib.clone(this.instack)
  const outstack = lib.clone(this.outstack)
  return function(options={}, cb){
    if (typeof options === 'function') {
      cb = options
      options = {}
    }
    const $$ = this.activePage.getElementsById.bind(this.activePage)
    this.reseting = true
    this.historyCount = current
    this.instack = lib.clone(instack)
    this.outstack = lib.clone(outstack)
    screens.forEach((item, ii)=>{
      const $item = item['@item']
      const contentId = $item.id
      const contentInst = $$(contentId)
      const content = $item
      
      const targetData = {attr: {...content.attr}, '@list': {...content['@list']}, options}
      wx.showLoading({
        title: '更新数据...'
      })
      setTimeout(() => {
        contentInst.reset(targetData, function(){
          if (ii === (screens.length - 1)) {
            setTimeout(() => {
              that.update({ 'type.current': current }, function(){
                if (typeof cb === 'function') {
                  cb()
                }
                wx.hideLoading()
                that.reseting = false
              })
            }, 100);
          }
        })
      }, 300);
    })
  }
}

let screens = [5, 2]
export function isLoopSwiper(customType, params){
  const lib = params.lib
  const data = params.data
  let   fullstack = [...data]
  screens = Object.assign(screens, (customType.screens))

  if (data.length <= screens[0]) {
    params.screens = null
  } else {
    const middleIndex = (customType.current||customType.current===0) ? customType.current : (fullstack.length - (fullstack.length % 2)) / 2 + 1
    const firstEdge = (middleIndex - screens[1]) - 1 < 0 ? 0 : (middleIndex - screens[1]) - 1
    const lastEdge = firstEdge === 0 ? (middleIndex + screens[1]*2 + 1) : (middleIndex + screens[1]) 
    this.outstack = fullstack.slice(0, firstEdge).map(unit=>unit["@item"])
    this.instack = fullstack.slice(lastEdge)
    params.screens = fullstack.slice(firstEdge, lastEdge)
    this.screens = params.screens
  }

  const currentIndex = (customType.current||customType.current===0) ? customType.current : params.screens ? (screens[0] - screens[0] % 2) / 2 : 0
  params.type = Object.assign(
    {
      is: 'swiper',
      vertical: false,
      circular: true,
      scope: 1,
      current: currentIndex,
      bindchange: '_flatlistBindEvent?eventtype=swiper_loop',
    }, 
    customType,
  )
  let showInVp = showInScrollViewPortX

  if (customType.axle === 'y' || params.type['vertical']) {
    params.type['vertical'] = true
    showInVp = showInScrollViewPort
  }
  
  if (params.type.bindchange !== '_flatlistBindEvent?eventtype=swiper_loop') {
    if (typeof params.type.bindchange === 'string') {
      const customBindChangeFun = params.type.bindchange
      params.type.bindchange = '_flatlistBindEvent?eventtype=swiper_loop&customswiperChange='+customBindChangeFun
    }
  }
  
  this.swiperCurrent = params.type.current
  this.historyCount = params.type.current

  // 补充附加数据
  if (!this.instack.length) {
    attachData.call(this, 'isForward', {lib, customType, action: false})
  }

  if (!this.outstack.length) {
    attachData.call(this, 'isBackwards', {lib, customType, action: false})
    if (this.outstack.length) {
      const tmpary = []
      this.outstack.forEach((item, ii)=>{
        if (ii < (screens[1])) {
          const index = screens[0] - ii - 1
          delete item['$$id']
          delete item['id']
          delete item['__key']
          delete item['attr']
          delete item['show']
          
          const oldItem = this.screens[index]['@item']
          this.screens[index]['@item'] = Object.assign({}, this.screens[index]['@item'], item)
          tmpary.push({"@item": oldItem})
        }
      })
      this.instack = tmpary.reverse().concat(this.instack)
    }
    attachData.call(this, 'isBackwards', {lib, customType, action: false})
    this.outstack.splice(0, screens[1])
  }

  this.reset = initializeLoopSwiper.call(this, params).bind(this)
  return {showInVp, params}
}

function attachData(type, {lib, customType, action}) {
  const that = this
  const appendItems = customType.appendItems
  const prependItems = customType.prependItems
  const util = {
    instack: that.instack,
    outstack: that.outstack,
    action,
    add(data=[]){
      if (data) {
        if (!lib.isArray(data)) {
          data = [data]
        }
        const tmpdata = []
        data.forEach(item=>{
          if (typeof item === 'string') item = {title: item}
          if (lib.isObject(item)) tmpdata.push({ "@item": item })
        })
        that.instack = that.instack.concat(tmpdata)
      }
    }
  }

  const backUtil = Object.assign({}, util, { 
    add(data=[]){
      if (data) {
        if (!lib.isArray(data)) {
          data = [data]
        }
        const tmpdata = []
        data.forEach((item, ii)=>{
          if (typeof item === 'string') item = {title: item}
          if (lib.isObject(item)) {
            tmpdata.push(item)
          }
        })
        // that.outstack = tmpdata.concat(that.outstack)
        that.outstack = that.outstack.concat(tmpdata)
      }
    }
  })

  if (type === 'isForward') {
    if (lib.isFunction(appendItems)) {
      appendItems.call(this, util)
    } else if (typeof appendItems === 'string') {
      if (typeof this[appendItems] === 'function') {
        this[appendItems](util)
      }
    }
  }

  if (type === 'isBackwards') {
    if (lib.isFunction(prependItems)) {
      prependItems.call(this, backUtil)
    } if (typeof prependItems === 'string') {
      if (typeof this[prependItems] === 'function') {
        this[prependItems](util)
      }
    }
  }
}


function swiperStep(e){
  const detail = e.detail
  const current = detail.current

  let isForward = false
  let isBackwards = false

  if (current > this.swiperCurrent) {
    isForward = true
    isBackwards = false
  } else {
    isForward = false
    isBackwards = true
  }

  if (this.swiperCurrent === (screens[0]-1)) {
   if (current === 0) {
     isForward = true
     isBackwards = false
   }
  }

  if (this.swiperCurrent === 0) {
   if (current === (screens[0]-1)) {
     isForward = false
     isBackwards = true
   }
  }

  this.swiperCurrent = current


  if (isForward) {
    this.historyCount++
  }

  if (isBackwards) {
    this.historyCount--
  }

  return {
    isForward,
    isBackwards,
    historyCount: this.historyCount
  }
}


export function presetEvent_loop({
  e, 
  params, 
  rect,
  lib,
  options
}){
  if (this.reseting) return
  const that = this
  const detail = e.detail
  const current = detail.current
  const $$ = this.activePage.getElementsById.bind(this.activePage)
  let   {isBackwards, isForward, historyCount} = swiperStep.call(this, e)
  
  if (isForward && this.instack.length === 1) {
    attachData.call(this, 'isForward', {lib, customType: params.type, action: true})
  }
  
  if (isBackwards && this.outstack.length === 1) {
    attachData.call(this, 'isBackwards', {lib, customType: params.type, action: true})
  }

  let targetScreenIndex = -1
  let targetScreen = null
  let targetScreenInst = null
  let targetScreenData = null
  let targetData = null
  historyCount = isForward ? historyCount - 1 : historyCount
  let $count = ((historyCount % screens[0]) - screens[1]) % screens[0]
  if ($count > -1) {
    targetScreenIndex = $count
  } else {
    targetScreenIndex = screens[0] + $count
  }
  targetScreenIndex = Math.abs(targetScreenIndex)

  if (targetScreenIndex > -1) {
    targetScreen = params.screens[targetScreenIndex]
    const targetId = targetScreen['@item'].id
    targetScreenInst = $$(targetId)
    targetScreenData = targetScreenInst.getData()
  }
  
  if (targetScreen && targetScreenInst) {
    if (isForward) {
      targetData = this.instack.shift()
      if (targetData) {
        targetData = targetData['@item']
        this.outstack.unshift(targetScreenData)
      }
    }
    if (isBackwards) {
      targetData = this.outstack.shift()
      if (targetData) {
        this.instack.unshift({'@item': targetScreenData})
      }
    }

    if (targetData) {
      delete targetData['$$id']
      delete targetData['id']
      delete targetData['__key']
      delete targetData['itemClass']
      delete targetData['show']
      delete targetData['__fromParent']
      delete targetData['__relationId']
      delete targetData['treeid']
      targetScreenInst.reset(targetData)
    }
  }
}