import {
  isString,
  isObject,
  isArray,
  isNumber,
  isFunction,
  formatQuery,
  suid,
  resetSuidCount,
} from './util'

const eventName = ['tap', 'catchtap', 'aim', '_tap', '_aim', 
'longpress', '_longpress', 'catchlongpress', 'longtap', '_longtap', 'catchlongtap',
'touchstart', 'touchmove','touchend', 'touchcancel',
'_touchstart', '_touchmove', '_touchend', '_touchcancel',
'catchtouchstart', 'catchtouchmove', 'catchtouchend', 'catchtouchcancel',
'touchoption'
]

function formatImg(props) {
  let img = props.img
  if (isString(img)) {
    let ary = img.split('#')
    if (ary.length > 1) {
      img = img.replace('#', '?')
      let obj = formatQuery(img)
      props.img = { src: obj.url, ...obj.query }
    } 
  }
  return props
}

// 处理url
// hash 传递navigate组件的参数
function formatUrl(props) {
  let url = props.url
  if (isString(url) && url.length > 1) {
    let ary = url.split('#')
    let isbutton = url.indexOf('button://') === 0
    let __isAd = null
    let funName = (()=>{
      if (url.indexOf('button://') === 0) {
        ary[0] = ary[0].replace('button://', '')
        return ary[0]
      }
      if (url.indexOf('ad://') === 0) {
        __isAd = true
        ary[0] = ary[0].replace('ad://', '')
        return ary[0]
      }
    })()
    if (ary.length === 1) {
      if (isbutton) {
        props.url = {value: props.title, tap: funName}
      } else {
        props.url = {title: props.title, url: url}
      }
    } else {
      let obj = formatQuery('?'+ary[1])  // 获取navigate的配置
      if (isbutton) {
        props.url = {value: props.title, tap: funName, ...obj.query}
      } else if(__isAd){
        props.url = {__isAd: true, tap: funName, ...obj.query}
      } else {
        url = ary[0]
        props.url = {title: props.title, url, ...obj.query}
      }
      
      // let tmp = {}
      // let param = ary[1]
      // tmp.url = ary[0]
      // let paramAry = param.split('&')
      // for (let ii = 0; ii < paramAry.length; ii++) {
      //   let val = paramAry[ii]
      //   let kv = val.split('=')
      //   if (!kv[1]) kv[1] = true
      //   if (kv[1]==='false' || kv[1]==='true') kv[1] = JSON.parse(kv[1])
      //   tmp[kv[0]] = kv[1]
      // }
      // props.url = {...tmp}
    }
    delete props.title
  }
  return props
}

const attrKey = [
  'aim', 'attr', 'class', 'itemClass', 'style', 'itemStyle', 'template',
  'tap', 'catchtap', 'longtap', 'catchlongtap', 'longpress', 'catchlongpress',
  'touchstart', 'touchmove', 'touchend', 'touchcancel',
  'data-treeid', 'id', 'treeid', 'src', '$$id', '__sort', 'tempName', 'idf', 'parent', 'show',
  'type', 'typeOptions',
  'hoverclass', '__actionMask',
  'data', 'mode'
]

const accessKey = [
  'title', 'img', 'icon', 'list', 'tree', 'item', 
  'header', 'body', 'footer', 'dot', 'li', 'k', 'v', 'url'
]

export function resetItem(data, context, loop, attrkey) {
  if (typeof data == 'string' || typeof data == 'number' || typeof data == 'boolean') return data
  if (isObject(data)) {
    let extAttrs = {}
    let incAttrs = []
    data['__sort'] = []
    data.show = data.hasOwnProperty('show') ? data.show : true
    data.__relationId = data.__relationId || suid('relation_')

    if (attrkey!=='url' && data.url) {
      data = formatUrl(data)
    }

    if (attrkey!=='img' && data.img) {
      data = formatImg(data)
    }
  
    if (context) {
      data.fromComponent = context.data.fromComponent || data.fromComponent || context.data.uniqId
      data.__fromParent = context.data.__fromParent
      if (data.methods) {
        if (attrkey&&attrkey.indexOf('@')>-1) {
          /** 不处理 @组件的methods */
        } else {
          const methods = data.methods
          Object.keys(methods).forEach(key=>{
            let fun = methods[key]
            if (isFunction(fun)) {
              fun = fun.bind(context)
              context[key] = fun
            }
          })
          delete data.methods
          delete data.itemMethod
          // if (loop !== 'itemSubArray') { // 数据(dot, body...)数组的子数据
          //   const methods = data.methods
          //   Object.keys(methods).forEach(key=>{
          //     let fun = methods[key]
          //     if (isFunction(fun)) {
          //       fun = fun.bind(context)
          //       context[key] = fun
          //     }
          //   })
          //   delete data.methods
          //   delete data.itemMethod
          // }
        }
      }

      if (context.$$is && (context.$$is === 'list' || context.$$is === 'tree')) {
        if (!data['__key']) data['__key'] = suid('arykey_')
      }
    }

    // (dot, body...)的子元素
    if (loop === 'itemSubArray') {
      if (!data['__key']) data['__key'] = suid('arykey_')
    }
    
    Object.keys(data).forEach(function (key) {
      // if (data.hasOwnProperty(key)) {
      if (data[key] || data[key]===0 || typeof data[key] === 'boolean') {
        if (accessKey.indexOf(key) > -1 || (key.indexOf('@') == 0 && key.length > 1)) {
          incAttrs.push(key)
        } else {
          if (key == 'aim') {
            data.catchtap = data[key]
            extAttrs['catchtap'] = data[key]
            delete data.aim
          } else {
            extAttrs[key] = data[key]
          }

          if (eventName.includes(key) && context) {
            if (key === 'aim') key = 'catchtap'
            let val = data[key]
            if (isFunction(val)) {
              let fun = val.bind(context)
              let funKey = suid('__on_') + key
              data[key] = funKey
              context[funKey] = fun
            }
          }
        }
      } else {
        delete data[key]
      }
    })
    
    data['__sort'] = incAttrs
    for (var attr of incAttrs) {
      const sonItem = data[attr]
      if (isArray(sonItem)) {
        data[attr] = sonItem.filter(item => resetItem(item, context, 'itemSubArray'))
      } else {
        if (attrkey && attrkey.indexOf('@') > -1) {
          /** 不去污染内部的父级链，只做表层 */
        }
        else {
          data[attr] = resetItem(sonItem, context, true, attr)
        }
        // if (/^[^@]/.test(attr) && sonItem) {
        //   data[attr] = resetItem(sonItem, context, true)
        // } 
      }
    }
    if (!data.parent && !loop) data.itemDataRoot = true // 标识该item是最顶层item，class style用作容器描述
  }
  return data
}