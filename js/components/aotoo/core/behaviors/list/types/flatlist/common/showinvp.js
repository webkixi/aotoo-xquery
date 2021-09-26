let YshowTimmer = {}
let Yshowing = {}
export function showInScrollViewPort(
  containerRect, 
  items, 
  scroll={top: 0, left: 0, width: 0, height: 0}, 
  axle='y'
){
  if (!scroll) scroll = {top: 0, left: 0, width: 0, height: 0}
  const {top, left, width, height} = scroll
  const context = this.ctx
  const type = this.type
  const scope = type.scope || 1
  const autoHide = type.autoHide === false ? false : true
  items.forEach( (item, ii) => {
    const dataset = item.dataset
    const itemId = dataset.id
    const itemInst = context.activePage.getElementsById(itemId)
    // const uniqId = itemInst.uniqId
    const uniqId = itemId


    // const itemTop = item.top - top
    const itemTop = item.top
    const showState = itemInst.getData().show
    if (itemTop >= (containerRect.top - containerRect.height * scope) && itemTop <= (containerRect.bottom + containerRect.height * scope)) {
      if (!showState || !Yshowing[uniqId]) {
        // YshowTimmer[uniqId] && clearTimeout(YshowTimmer[uniqId])
        Yshowing[uniqId] = true
        YshowTimmer[uniqId] = setTimeout(() => {
          itemInst.show()
        }, 100);
      }
    } else {
      YshowTimmer[uniqId] && clearTimeout(YshowTimmer[uniqId])
      Yshowing[uniqId] = false
      if (autoHide) {
        YshowTimmer[uniqId] = setTimeout(() => {
          itemInst.hide()
        }, 100);
      }
      // if (showState) {
      //   YshowTimmer[uniqId] && clearTimeout(YshowTimmer[uniqId])
      //   Yshowing[uniqId] = false
      //   if (autoHide) {
      //     YshowTimmer[uniqId] = setTimeout(() => {
      //       itemInst.hide()
      //     }, 100);
      //   }
      // }
    }
  })
}

const XshowTimmer = {}
const Xshowing = {}
export function showInScrollViewPortX(
  containerRect, 
  items, 
  scroll={top: 0, left: 0, width: 0, height: 0}, 
  axle='x'
){
  if (!scroll) scroll = {top: 0, left: 0, width: 0, height: 0}
  const {top, left, width, height} = scroll
  const context = this.ctx
  const type = this.type
  const scope = type.scope || 1
  const autoHide = type.autoHide === false ? false : true
  items.forEach( (item, ii) => {
    const dataset = item.dataset
    const itemId = dataset.id
    const itemInst = context.activePage.getElementsById(itemId)
    const uniqId = itemId
    const itemLeft = item.left
    const showState = itemInst.getData().show
    if (itemLeft >= (containerRect.left - containerRect.width * scope) && itemLeft <= (containerRect.right + containerRect.width * scope)) {
      if (!showState || !Xshowing[uniqId]) {
        XshowTimmer[uniqId] && clearTimeout(XshowTimmer[uniqId])
        Xshowing[uniqId] = true
        XshowTimmer[uniqId] = setTimeout(() => {
          itemInst.show()
        }, 100);
      }
    } else {
      XshowTimmer[uniqId] && clearTimeout(XshowTimmer[uniqId])
      Xshowing[uniqId] = false
      if (autoHide) {
        XshowTimmer[uniqId] = setTimeout(() => {
          itemInst.hide()
        }, 100);
      }
    }
  })
}

export function clearShowStat(){
  YshowTimmer = {}
  Yshowing = {}
}

export function getShowStat(){
  return {
    YshowTimmer,
    Yshowing,
    XshowTimmer,
    Xshowing
  }
}