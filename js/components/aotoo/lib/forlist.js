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

export function reSetItemAttr(item, list){
  if (typeof item == 'boolean') return item
  if (typeof item == 'string' || typeof item == 'number') {
    item = {title: item}
  }

  const clsIndex = suid('treeid-index-') // 将data-index置入每条数据的class中，这样不用去动结构
  const $ii = clsIndex

  if (list.itemMethod ){
    var itm = list.itemMethod
    if (typeof itm == 'object') {
      if (!item.idf) {
        item = Object.assign({}, itm, item)
      }
      // if (!item.idf && (item.title || item.img)) {
      //   item = Object.assign({}, itm, item)
      // }
      // Object.keys(itm).forEach(evt=>{
      //   item[evt] = itm[evt]
      // })
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
  }
  

  let oMethods = null;
  let oItemMethod = null
  if (isObject(item)) {
    oMethods = item.methods; 
    delete item.methods;
    
    oItemMethod = item.itemMethod; 
    delete item.itemMethod
  }

  if (list.hasTouchoption) {
    item.touchoption = Object.assign({}, list.itemMethod.touchoption, (item.touchoption || {}))
  }

  let newItem = resetItem(item, this)
  newItem.methods = oMethods
  newItem.itemMethod = oItemMethod
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
        let customEvent = methods[key]
        if (key === 'touchoption') {
          tmp[key] = customEvent
          list.hasTouchoption = true
        } else {
          let funKey = isString(customEvent) ? customEvent : '__on'+key
          tmp[key] = funKey
          if (isFunction(customEvent)) {
            customEvent = customEvent.bind(that)
            that[funKey] = customEvent
          }
        }
      })
      list.itemMethod = tmp
    }

    
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

      list.data = data.map(item => {
        // if (list.hasTouchoption) {
        //   item.id = item.id || suid('item_')
        //   let touchoption =  list.itemMethod.touchoption
          
        //   let slip = touchoption.slip || {}
        //   let autoDelete = slip.autoDelete === false ? false : true
        //   let slipLeft = slip.slipLeft
        //   let deletePart = {title: '删除', itemClass: 'slip-menu', _aim: '_onSlipMenus?id='+item.id+'&action=delete'}
          
        //   if (slipLeft) {
        //     if (slipLeft === true) slipLeft = []
        //     slip.menuWidth = slip.menuWidth || '80px'
        //     if (!autoDelete) deletePart = []
        //     slipLeft = [].concat(slipLeft, deletePart)
        //   }

        //   let itemSlipLeft = []
        //   let itemTouchoption = item.touchoption
        //   if (itemTouchoption) {
        //     let itemSlip = itemTouchoption.slip || {}
        //     itemSlipLeft = itemSlip.slipLeft
        //     if (itemSlipLeft) {
        //       if (itemSlipLeft === true) itemSlipLeft = []
        //       if (isString(itemSlipLeft)) {
        //         itemSlipLeft = [itemSlipLeft]
        //       }
        //     }
        //   }

        //   if (itemSlipLeft.length) {
        //     slipLeft = itemSlipLeft
        //   }
          
        //   if (slipLeft && slipLeft.length) {
        //     slipLeft = slipLeft.map(it=>{
        //       if (isString(it)) {
        //         it = {title: it, itemClass: 'slip-menu', _aim: '_onSlipMenus?id='+item.id+'&action='+it}
        //       }
        //       if (isObject(it)) {
        //         // let styleWidth = 'width:' + (slip.menuWidth) + ';'
        //         let styleWidth = ''
        //         it.containerStyle = styleWidth + (it.itemStyle||'') 
        //       }
        //       return it
        //     })

        //     if (!item.idf || (item.idf && item.slip===true)) {
        //       item.li = [].concat((item.li||[]), slipLeft)
        //       item.liClass = (item.liClass||'') + ' slip-menus'
        //       slip.menuCount = (slipLeft.length || 0)
        //     }

        //     if (item.slip === false) {
        //       item.li = null
        //       item.liClass = null
        //       slip.menuCount = 0
        //     }
        //   }
        // }

        // if (list.hasTouchoption) {
        //   item.id = item.id || suid('item_')
        //   item.touchoption = Object.assign({}, list.itemMethod.touchoption, (item.touchoption || {}))
        //   item = itemTouchoption(item)
        // }
        return reSetItemAttr.call(this, item, list)
      })
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