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
  resetItem
} from "./foritem";

export function reSetItemAttr(item, list){
  if (typeof item == 'boolean') return item
  if (typeof item == 'string' || typeof item == 'number') {
    item = {title: item}
  }

  const clsIndex = suid('index-') // 将data-index置入每条数据的class中，这样不用去动结构
  const $ii = clsIndex

  if (list.itemMethod ){
    var itm = list.itemMethod
    if (typeof itm == 'object') {
      Object.keys(itm).forEach(evt=>{
        item[evt] = itm[evt]
      })
    }
  }

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

  if (list.itemStyle || list.style) {
    var itsy = list.itemStyle || list.style
    if (item['style'] || item['itemStyle']) {
      var myStyle = item['style'] || item['itemStyle']
      item['style'] = myStyle
    } else {
      item['style'] = itsy
    }
  }

  if (isObject(item)) {
    if (item['attr']) {
      if (!item['attr']['data-treeid']) item['attr']['data-treeid'] = $ii
    } else {
      if (item['$$typeof']) {
        item = {title: item, attr: {'data-treeid': $ii}}
      } else {
        item['attr'] = {'data-treeid': $ii}
      }
    }

    // let _attr = item.attr||{}
    // let excludeAttr = ['id', 'treeid', 'data-treeid']
    // let extraAttr = Object.keys(_attr).filter(kyname => excludeAttr.indexOf(kyname) == -1)
    // item['__moreAttributs'] = extraAttr.length
  }

  const newItem = resetItem(item, this)
  return newItem
}

export function reSetArray(data, list) {
  const that = this
  try {
    if (list.methods && isObject(list.methods)) {
      const methods = list.methods
      Object.keys(methods).forEach(key=>{
        let fun = methods[key]
        if (isFunction(fun)) {
          fun = fun.bind(that)
          that[key] = fun
        }
      })
    }
    delete list.methods

    if (list.itemMethod && isObject(list.itemMethod)) {
      let methods = list.itemMethod
      let tmp = {}
      Object.keys(methods).forEach(key => {
        let funKey = '__on'+key
        tmp[key] = funKey
        let fun = methods[key]
        if (isFunction(fun)) {
          fun = fun.bind(that)
          that[funKey] = fun
        }
      })
      list.itemMethod = tmp
    }

    if (isArray(data)) {
      list.data = data.map(item => reSetItemAttr.call(this, item, list))
    }
    delete list.itemMethod
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