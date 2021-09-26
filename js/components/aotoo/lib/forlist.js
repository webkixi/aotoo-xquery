import {
  isString,
  isObject,
  isArray,
  isNumber,
  isFunction,
  formatQuery,
  suid,
  resetSuidCount,
  clone
} from './util'

import {
  resetItem,
  itemTouchoption
} from "./foritem";

// 处理 itemMethod
function dealwithItemMethod(list){
  if (list.itemMethod && isObject(list.itemMethod)) {
    let methods = list.itemMethod
    let tmp = {}
    Object.keys(methods).forEach(key => {
      let customEvent = methods[key]
      if (key === 'touchoption') {
        tmp[key] = customEvent
        list.hasTouchoption = true
      } 
      else {
        let funKey = isString(customEvent) ? customEvent : '__on'+key
        tmp[key] = funKey
        if (isFunction(customEvent)) {
          customEvent = customEvent.bind(this)
          this[funKey] = customEvent
        }
      }
    })
    list.__itemMethod = tmp
  }
  return list
}

export function reSetItemAttr(item, list){
  if (typeof item == 'boolean') return item
  if (typeof item == 'string' || typeof item == 'number') {
    item = {title: item}
  }

  if (list.itemMethod && !list.__itemMethod) {
    list = dealwithItemMethod.call(this, list)
  }

  if (isObject(item)) {
    const clsIndex = suid('treeid-index-') // 将data-index置入每条数据的class中，这样不用去动结构
    const $ii = clsIndex

    if (list.__itemMethod ){
      var itm = list.__itemMethod
      if (!item.idf) {
        item = Object.assign({}, itm, item)
      }
    }
  
    // 设置样式类
    let itmc = list.itemClass || list.class || ''
    let myClass = item['itemClass'] || item['class'] || item['className'] || ''
    item['itemClass'] = myClass ? itmc + ' ' + myClass : itmc
    item['itemClass'] = item.idf ? 'item itemroot ' + item['itemClass'] : 'item ' + item['itemClass']
    let cls = item['itemClass'].split(' ')
    // 去重
    for(var i=0;i<cls.length-1;i++){
      for(var j=i+1;j<cls.length;j++){
        if(cls[i]==cls[j]){
          cls.splice(j,1);
        }
      }
    }
    item['itemClass'] = cls.join(' ') || ' '
    
    // 设置内联样式
    if (list.itemStyle || list.style) {
      var itsy = list.itemStyle || list.style
      if (item['style'] || item['itemStyle']) {
        var myStyle = item['style'] || item['itemStyle']
        item['style'] = myStyle
      } else {
        item['style'] = itsy
      }
    }
    
    // 设置attr属性
    item.id = item['$$id'] || item['id'] || suid('item_')
    if (item['attr']) {
      if (!item['attr']['data-treeid']) item['attr']['data-treeid'] = $ii
    } else {
      if (item['$$typeof']) {
        item = {title: item, attr: {'data-treeid': $ii}}
      } else {
        item['attr'] = {'data-treeid': $ii}
      }
    }
    
    if (list.hasTouchoption) {
      item.touchoption = Object.assign({}, list.itemMethod.touchoption, (item.touchoption || {}))
    }
    
    let newItem = resetItem(item, this)
    return newItem
  }
}


export function reSetArray(data, list) {
  try {

    // common中作为公共属性被处理过
    // if (list.methods && isObject(list.methods)) {
    //   const methods = list.methods
    //   Object.keys(methods).forEach(key=>{
    //     let fun = methods[key]
    //     if (isFunction(fun)) {
    //       fun = fun.bind(that)
    //       that[key] = fun
    //     }
    //   })
    // }
    // delete list.methods

    list = dealwithItemMethod.call(this, list)
    
    if (isArray(data)) {
      if (list.hasTouchoption) {
        this._onSlipMenus = (e, param, inst) => {
          let acp = this.activePage
          if (acp && isFunction(acp['onSlipMenus'])) {
            let id = param.id
            let tmp = this.find({id})
            let target = null
            if (tmp) {
              target = tmp.data[0]
            }
            acp['onSlipMenus'].call(acp, e, param, target)
          } else {
            console.warn('在Page环境中定义onSlipMenus方法');
          }
        }
      }

      list.data = data.map((item) => {
        return reSetItemAttr.call(this, item, list)
      })
    }
    // delete list.itemMethod
    return list
    
  } catch (error) {
    console.warn('======= lib.reSetArray =======', error);
  }
}

export function reSetList(list) {
  if (isObject(list)) {
    list['show'] = list.hasOwnProperty('show') ? list.show : true
    return reSetArray.call(this, list.data, list)
  }
}