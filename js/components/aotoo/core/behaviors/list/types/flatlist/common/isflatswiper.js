import { showInScrollViewPort, showInScrollViewPortX } from "./showinvp";

export function isFlatSwiper(customType, params){
  params.type = Object.assign(
    {
      is: 'swiper',
      vertical: false,
      scope: 1,
      bindchange: '_flatlistBindEvent?eventtype=swiper',
    }, 
    customType,  
  )
  let showInVp = showInScrollViewPortX

  if (customType.axle === 'y') {
    params.type['vertical'] = true
    showInVp = showInScrollViewPort
  }

  if (params.type.bindchange !== '_flatlistBindEvent?eventtype=swiper') {
    if (typeof params.type.bindchange === 'string') {
      const customBindChangeFun = params.type.bindchange
      params.type.bindchange = '_flatlistBindEvent?eventtype=swiper&customswiperChange='+customBindChangeFun
    }
  }

  return {showInVp, params}
}