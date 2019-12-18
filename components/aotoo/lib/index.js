
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
//默认执行，扩展Date的方法
Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

// 时间戳转格式化
Date.prototype.ttf = function (fmt) {
  try {
    fmt = fmt || "yyyy-MM-dd hh:mm:ss"
    return this.Format(fmt)
  } catch (error) {
    console.error(error);
  }
}

// 时间戳转格式化
// time为毫秒
export function secondFormat(time, fmt) {
  try {
    fmt = fmt || "hh:mm:ss"
    let _sec = 1000
    let _min = 60 * 1000
    let _hour = 60 * _min
    let _day = 24 * _hour
    
    let day = 0, hour=0, min=0, sec=0, msec=0
    day = parseInt(time / _day) 
    hour = parseInt(time / _hour) - day * 24
    min = parseInt(time / _min) - 60 * (hour + day * 24)
    sec = parseInt(time/1000) - 60*(min + hour*60 + day*24*60)
    msec = parseInt((time - (sec*1000))/10)

    var o = {
      "d+": day, //日
      "h+": hour, //小时
      "m+": min, //分
      "s+": sec, //秒
      "S+": msec // 毫秒
    }
    
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)){
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    return fmt;
  } catch (error) {
    console.error(error);
  }
}

export function timestampFormat(time, fmt) {
  return secondFormat(time, fmt)
}

export {
  md5,
  isString,
  isObject,
  isArray,
  isNumber,
  isFunction,
  formatQuery,
  formatToUrl,
  suid,
  uuid,
  resetSuidCount,
  clone,
  merge,
  isEmpty,
  debounce,
  throttle,
  nav,  // wx路由的节流封装 1200毫秒,
  countdown,  // 倒计时器
  counter  // 计时器，秒表
} from './util'

export {
  tree,
  listToTree
} from './tree'

export {
  vibrateLong,
  vibrateShort
} from './vibrate'

export {
  hooks
} from "./hooks";

export {
  resetItem
} from "./foritem";

export {
  reSetItemAttr,
  reSetArray,
  reSetList
} from "./forlist";
