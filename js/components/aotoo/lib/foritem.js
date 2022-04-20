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
import { ad } from "./ad";
const app = require('../core/getapp')()

const eventName = ['tap', 'catchtap', 'aim', '_tap', '_aim', 
'longpress', '_longpress', 'catchlongpress', 'longtap', '_longtap', 'catchlongtap',
'touchstart', 'touchmove','touchend', 'touchcancel',
'_touchstart', '_touchmove', '_touchend', '_touchcancel',
'catchtouchstart', 'catchtouchmove', 'catchtouchend', 'catchtouchcancel',
'touchoption'
]

function parseImg(src) {
  if (isString(src)) {
    let ary = src.split('#')
    if (ary.length > 1) {
      src = src.replace('#', '?')
      let obj = formatQuery(src)
      return obj
    } else {
      return {url: src, query: {}}
    }
  }
}

function formatImg(props) {
  let img = props.img
  if (isString(img)) {
    let obj = parseImg(img)
    props.img = { src: obj.url, ...obj.query }
    // let ary = img.split('#')
    // if (ary.length > 1) {
    //   img = img.replace('#', '?')
    //   let obj = formatQuery(img)
    //   props.img = { src: obj.url, ...obj.query }
    // } 
  }
  if (isObject(img)) {
    let obj = parseImg(img.src)
    if (obj) {
      let tmp = { src: obj.url, ...obj.query }
      props.img = Object.assign({}, props.img, tmp)
    }
  }
  if (isArray(img)) {
    props.img = img.map(pic => {
      if (isString(pic)) {
        let obj = parseImg(pic)
        return { src: obj.url, ...obj.query }
      }
      if (isObject(pic)) {
        let obj = parseImg(img.src)
        if (obj) {
          let tmp = { src: obj.url, ...obj.query }
          pic = Object.assign({}, props.img, tmp)
        }
        return pic
      }
    })
  }
  return props
}

// 处理url
// hash 传递navigate组件的参数
function formatUrl(props) {
  let url = props.url
  if (isString(url) && url.length > 1) {
    const isbutton = url.indexOf('button://') === 0
    const __isAd = url.indexOf('ad://') === 0
    const __isMp = url.indexOf('mp://') === 0
    const ary = url.split('#')
    const hash = ary[1] || ''
    url = ary[0]
    const urlobj = formatQuery(url)
    const hashobj = formatQuery(('?'+hash))
    const funName = url.replace(/(button\:\/\/|ad\:\/\/|mp\:\/\/)/ig, '')  // width query
    const compnentConfig = Object.assign({}, hashobj.query)  // navigater组件|ad组件 的配置参数
    if (__isAd) {
      // const adTypes = ['banner', 'bannerv', 'video', 'custom', 'insert', 'excitation', 'excitation-long']
      const adTypes = ['banner', 'bannerv', 'video', 'custom']
      const adExecTypes = ['insert', 'excitation', 'excitation-long']
      if (adTypes.indexOf(funName)>-1) {
        props.url = Object.assign({}, ad(funName), hashobj.query, {__isAd})
      } 
    } else if (isbutton) {
      props.url = {tap: funName, value: props.title, __isButton: true, ...compnentConfig}
    } else if (__isMp) {
      props.url = {target: 'miniProgram', title: props.title, 'app-id': funName, __isMp: true, ...compnentConfig}
    } else {
      props.url = {title: props.title, url: funName, ...compnentConfig}
    }
    delete props.title

    // // const query = Object.assign({}, urlobj.query, hashobj.query, {__isAd})
    // let   compConfig = Object.assign({}, hashobj.query, {__isAd})
    // if (isbutton || __isAd) {
    //   props.url = {tap: funName, ...compConfig}
    //   if (isbutton) {
    //     props.url.value = props.title
    //   }
    // } else {
    //   props.url = {title: props.title, url, ...compConfig}
    //   if (__isMp) {
    //     url = funName
    //     compConfig = Object.assign({}, urlobj.query, compConfig)
    //     props.url = {target: 'miniProgram', title: props.title, 'app-id': url, ...compConfig}
    //   }
    // }
    // delete props.title
    
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

// menus有特殊性，不会加入排序(__sort)
const accessKey = [
  'title', 'img',  'text',
  'header', 'body', 'footer', 'dot', 'li', 'k', 'v', 'url', 'menus'
]

export function itemTouchoption(item){
  const touchoption =  item.touchoption
  const slipOptions = touchoption.slip
  const deletePart = {title: '删除', itemClass: 'slip-menu', _aim: '_onSlipMenus?id='+item.id+'&action=delete'}
  const fakeEventName = ['aim', 'tap', 'catchtap', 'longpress', 'catchlongpress', 'longtap', 'catchlongtap']
  
  if (slipOptions) {
    slipOptions.menuWidth = slipOptions.menuWidth || '80px'
    const autoDelete = slipOptions.autoDelete
    let   slipLeft = autoDelete ? slipOptions.slipLeft ? slipOptions.slipLeft : true : slipOptions.slipLeft

    if (slipLeft) {
      if (slipLeft === true) {
        slipLeft = [deletePart]
      }

      if (isObject(slipLeft)) {
        slipLeft = [].concat(slipLeft)
      }

      if (slipLeft && slipLeft.length) {
        slipLeft = slipLeft.map(it=>{
          if (isString(it)) {
            it = {title: it, itemClass: 'slip-menu', _aim: '_onSlipMenus?id='+item.id+'&action='+it}
          }
          if (isObject(it)) {
            it.containerStyle = it.itemStyle||''
          }

          Object.keys(it).forEach(key=>{
            if (fakeEventName.includes(key)) {
              const fakeKey = "_"+key
              it[fakeKey] = it[key]
              delete it[key]
            }
          })
          
          return it
        })
  
        if (!item.idf || (item.idf && item.slip===true)) {
          item.li = [].concat((item.li||[]))
          const tmpli = []
          item.li.forEach(item=>{
            tmpli.push(item.__key)
          })

          // 之所以这样写是为了去重
          slipLeft.forEach(it=>{
            const key = it.__key
            if (tmpli.indexOf(key) === -1) {
              item.li.push(it)
              item.liClass = (item.liClass||'') + ' slip-menus'
              item.touchoption.slip.menuCount = slipLeft.length || 0
            }
          })
        }
  
        if (item.slip === false) {
          item.li = null
          item.liClass = null
          item.touchoption.slip.menuCount = 0
        }
      }
    }
  }

  return item
}

function setAppVars(context){
  const myApp = app || getApp()
  if (!myApp['_vars'][context.uniqId]) {
    myApp['_vars'][context.uniqId] = context
  }
}

let treeid = ''
export function resetItem(data, context, loop, attrkey) {
  if (typeof data == 'string' || typeof data == 'number' || typeof data == 'boolean') return data
  if (isObject(data)) {

    if (data && !loop) {
      treeid = ''
      if ( data.attr && ( data.attr['data-treeid'] || data.attr['treeid']) ) {
        treeid = data.attr['data-treeid'] || data.attr['treeid']
      }
    }
    
    if (data.touchoption) {
      data = itemTouchoption(data)
    }

    let extAttrs = {}
    let incAttrs = []
    data['__sort'] = []
    data.show = data.hasOwnProperty('show') ? data.show : true
    data.__relationId = data.__relationId || suid('relation_')

    if (loop && treeid && data.__relationId.indexOf(treeid) === -1) {
      data.__relationId = treeid + '__' + data.__relationId
    }

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
        if (attrkey && attrkey.indexOf('@') > -1) {
          /** 不处理 @组件的methods */
        } else if (data.data && loop) {
          // footer body dot 的子项为list/tree的配置时，不处理methods与itemMethod
        } else {
          const methods = data.methods
          Object.keys(methods).forEach(key=>{
            let fun = methods[key]
            if (isFunction(fun)) {
              fun = fun.bind(context)
              context[key] = fun
            }
          })
          // delete data.methods
          // delete data.itemMethod
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
      if (data[key] || data[key]===0 || typeof data[key] === 'boolean') {
        if (accessKey.indexOf(key) > -1 || (key.indexOf('@') === 0 && key.length > 1)) {
          incAttrs.push(key)
          if (key.indexOf('@') === 0) {
            setAppVars(context)
          }
        } else {
          if (key == 'aim') {
            data.catchtap = data[key]
            extAttrs['catchtap'] = data[key]
            delete data.aim
          } else {
            extAttrs[key] = data[key]
          }

          if (eventName.includes(key)) {
            if (context) {
              if (context.$$is === 'list') {
                setAppVars(context)
              } else {
                if (loop) {
                  setAppVars(context)
                }
              }
            }
            if (key === 'aim') key = 'catchtap'
            let val = data[key]
            if (isFunction(val)) {
              let fun = val.bind(context)
              let funKey = suid('__on') + key
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
        data[attr] = sonItem.filter(item => {
          // if (item.__key && item.__relationId) {
          //   return item
          // }
          return resetItem(item, context, 'itemSubArray')
        })
      } else {
        if (attrkey && attrkey.indexOf('@') > -1) {
          /** 不去污染内部的父级链，只做表层 */
        }
        else {
          data[attr] = resetItem(sonItem, context, true, attr)
        }
      }
    }
    if (!data.parent && !loop) data.itemDataRoot = true // 标识该item是最顶层item，class style用作容器描述
    
    if (data['__sort'] && data['__sort'].indexOf('menus')>-1)  {
      const sortIndex = data['__sort'].indexOf('menus')
      data['__sort'].splice(sortIndex, 1)
    }
  }

  // menus不做渲染排序，单独处理模板
  return data
}