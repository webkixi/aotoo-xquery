import { showInScrollViewPort, showInScrollViewPortX, clearShowStat, getShowStat } from "./common/showinvp";
import { isFlatSwiper } from "./common/isflatswiper";
import { isLoopSwiper, presetEvent_loop } from "./common/isloopswiper";
export { getShowStat }

const app = getApp()
const lib = require('../../../../../lib/index')

export function adapterDataFlatList(data, flatListId, from){
  const len  = data.length
  const flatListData = []
  for (let ii=0; ii < len; ii++) {
    let val = data[ii]
    if (lib.isString(val) || lib.isNumber(val) || lib.isArray(val) || lib.isObject(val)) {
      if (!lib.isObject(val)) {
        val = {title: val}
      }
      const flatListItemId = val['$$id'] || lib.uuid(flatListId, 12)
      val['$$id'] = flatListItemId
      val['id'] = flatListItemId
      val['__key'] = flatListItemId
      val['itemClass'] = 'flatlist-unit ' + (val['itemClass']||'')
      val['show'] = false
      const menus = val['menus']
      const menuOptions = val['menuOptions']
      const wrapitem = {
        attr: {"id": flatListItemId},
        id: `box-${flatListItemId}`,
        idf: val['idf'],
        parent: val['parent'],
        "@item": val,
        menus,
        menuOptions
      }
      val['idf'] ? (delete val['idf']) : (delete wrapitem['idf'])
      val['parent'] ? (delete val['parent']) : (delete wrapitem['parent'])
      flatListData.push(wrapitem)
    }
  }
  return flatListData
}


/**
 * 
 * @param {*} params 
 * @returns 
 * containerList: {
      id: 'xxx',
      data: data,
      type: {
        is: 'flatlist',
        axle: 'x'  横向滚动，默认纵向滚动
      }
    },
 */

export function initFlatList(params) {
  this.query = wx.createSelectorQuery().in(this)
  this.flatlistContainerRect = null
  this.flatItems = []
  this.$$type = 'flatlist'

  let customType = (params.type||{}); 
  let customTypeIs = customType.is
  delete customType.is
  params.type = Object.assign(
    {
      is: 'scroll',
      "scroll-y": true,
      scope: 1,
      bindscroll: '_flatlistBindEvent',
    }, 
    customType, 
  )
  const flatListId = params['$$id'] || params['id'] || lib.uuid('fl-', 10)
  const flatListData = adapterDataFlatList(params.data, flatListId, 'init')

  let showInVp = showInScrollViewPort
  params.id = flatListId
  params.data = flatListData
  params.itemClass = 'flatlist-item' + (params.itemClass ? ` ${params.itemClass}` : '')
  params.listClass = 'flatlist-container' + (params.listClass ? ` ${params.listClass}` : '')

  if (customType.axle === 'x') {
    params.type['scroll-y'] = false
    params.type['scroll-x'] = true
    showInVp = showInScrollViewPortX
  }

  if (params.type.bindscroll !== '_flatlistBindEvent') {
    if (lib.isString(params.type.bindscroll)) {
      const customBindScrollFun = params.type.bindscroll
      params.type.bindscroll = '_flatlistBindEvent?custombindScroll='+customBindScrollFun
    }
  }

  if (customTypeIs === 'flatswiper') {
    const swiperConfig = isFlatSwiper.call(this, customType, {lib, ...params})
    showInVp = swiperConfig.showInVp
    params = swiperConfig.params
  }

  if (customTypeIs === 'swiper-loop') {
    const swiperConfig = isLoopSwiper.call(this, customType, {lib, ...params})
    showInVp = swiperConfig.showInVp
    params = swiperConfig.params
  }

  const showContext = {
    type: params.type,
    ctx: this
  }

  // 响应scroll-view的bindscroll事件 和 swiper-view的bindchange事件
  this._flatlistBindEvent = function(e, param={}){
    const custombindEvent = param.custombindScroll || param.customswiperChange

    let rect = {
      top: e.detail.scrollTop,
      left: e.detail.scrollLeft,
      width: e.detail.scrollWidth,
      height: e.detail.scrollHeight,
    }

    if (param.eventtype === 'swiper') {
      const {current} = e.detail
      rect.current = current
    }

    if (param.eventtype === 'swiper_loop') {
      const {current} = e.detail
      rect.current = current
      presetEvent_loop.call(this, {e, options: param, params, rect, lib})
    }

    if (this.flatlistContainerRect) {
      flatlistReady.call(this, rect)
      if (lib.isFunction(this[custombindEvent]) ) {
        this[custombindEvent](e)
      }
    }
  }

  function flatlistReady(rect){
    this._tempRect = rect
    this.flatlistContainerChildsQuery.exec()
  }

  const oldReady = this.customLifeCycle.ready
  this.customLifeCycle.ready = function(){
    // 避免挂载多个回调方法，queryAll 需要在ready时定义
    this.query.select('#'+flatListId).boundingClientRect().exec(ret=>{
      const flatlistContainerRect = ret[0]
      if (flatlistContainerRect) {
        const queryAll = this.query.selectAll('.flatlist-item').boundingClientRect((ret) => {
          let rect = this._tempRect
          if (ret && ret.length) {
            if (this.flatItems.length && (ret.length !== this.flatItems.length)) {
              clearShowStat()
            }
            this.flatItems = ret
            if (rect && (rect.current || rect.current === 0)) {
              rect = ret[rect.current]
            }
            showInVp.call(showContext, this.flatlistContainerRect, ret, rect)
          }
        })
        this.flatlistContainerRect = flatlistContainerRect
        this.flatlistContainerChildsQuery = queryAll
        flatlistReady.call(this)
      } else {
        console.warn('没有找到父级元素:' + flatListId);
      }
    })
    if (lib.isFunction(oldReady)) oldReady.call(this)
  }

  const oldDetached = this.customLifeCycle.detached
  this.customLifeCycle.detached = function(){
    if (lib.isFunction(oldDetached)) oldDetached.call(this)
  }

  const oldDidUpdate = this.customLifeCycle.didUpdate
  this.customLifeCycle.didUpdate = function tmpUpdate(){
    if (lib.isFunction(oldDidUpdate)) oldDidUpdate.call(this)
    if (this.flatlistContainerRect) {
      flatlistReady.call(this)
    }
  }
  return params
}