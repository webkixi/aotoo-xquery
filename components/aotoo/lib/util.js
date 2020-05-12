const deepmerge = require('./deepmerge')
export const md5 = require('./md5')

export function isString(title) {
  return typeof title == 'string'
}

export function objTypeof(obj, type) {
  // if (obj) return obj.nv_constructor ? obj.nv_constructor.toLowerCase() : (obj.constructor.toLowerCase && obj.constructor.toLowerCase())
  if (obj) {
    if (obj.nv_constructor) {
      return obj.nv_constructor.toLowerCase()
    } else {
      if (obj.constructor.toLowerCase) {
        return obj.constructor.toLowerCase()
      }
    }
    const typeofobj = typeof obj
    if (type && type == 'array') {
      return Array.isArray(obj) ? 'array' : typeofobj
    }
    return typeofobj
  }
}

export function isObject(obj) {
  return obj && objTypeof(obj) == 'object' && !isArray(obj)
}

export function isArray(obj) {
  return objTypeof(obj, 'array') == 'array'
}

export function isNumber(obj) {
  if (obj === 0) return true
  if (isNaN(obj)) return false
  return obj && objTypeof(obj) == 'number'
}

export function isFunction(obj) {
  return objTypeof(obj) == 'function'
}

export function clone(params={}) {
  return deepmerge({}, params)
  // return JSON.parse(JSON.stringify(params))
}

export function merge() {
  return deepmerge.apply(null, arguments)
}

export function isEmpty(params) {
  const $obj = typeof params == 'object' ? true : false
  if ($obj) {
    if (Array.isArray(params)) {
      return params.length ? false : true
    } else {
      for (var key in params) {
        return false
      };
    }
  }
  return true
}

//计算字符变量的长度，包含处理中文
export function strlen(str) {
  return str.replace(/[^\x00-\xff]/g, "aaa").length;
}

/* 2007-11-28 XuJian */
//截取字符串 包含中文处理
//(内容串,长度, 是否添加省略号)
export function subcontent(content, len, ellipse) {
  if (!content) return
  var newLength = 0;
  var newStr = "";
  var chineseRegex = /[^\x00-\xff]/g;
  var singleChar = "";
  var strLength = content.replace(chineseRegex, "**").length;
  for (var i = 0; i < strLength; i++) {
    singleChar = content.charAt(i).toString();
    if (singleChar.match(chineseRegex) != null) {
      newLength += 2;
    } else {
      newLength++;
    }
    if (newLength > len) break;
    newStr += singleChar;
  }
  if (ellipse && strLength > len) {
    newStr += "...";
  }
  return newStr;
}

export function formatQuery(url) {
  let aim = url
  let query={};
  if (url) {
    let urls = url.split('?')
    aim = urls[0]
    if (urls[1]) {
      let params = urls[1].split('&')
      params.forEach(param => {
        let attrs = param.split('=')
        if (!attrs[1]) attrs[1] = true
        if (attrs[1]==='true' || attrs[1] === 'false') attrs[1] = JSON.parse(attrs[1])
        query[attrs[0]] = attrs[1]
        // query[attrs[0]] = attrs[1] ? attrs[1] : true
      })
    }
  }
  return {url: aim, query}
}

export function formatToUrl(url, param={}) {
  if (isString(url) && isObject(param)) {
    let queryStr = ''
    Object.keys(param).forEach(key=>{
      queryStr+=`&${key}=${param[key]}`
    })
    if (queryStr) {
      url += '?'+queryStr
      url = url.replace('?&', '?').replace('&&', '&')
    }
  }
  return url
}

let suidCount = -1
export function suid(prefix) {
  if (suidCount >= 99999) resetSuidCount()
  suidCount++
  prefix = prefix || 'normal_'
  if (typeof prefix == 'string') {
    return prefix + suidCount
  }
}

export function resetSuidCount(){
  if (suidCount > 99999) suidCount = -1
}

export function uuid(prefix, len) {
  const mydate = new Date()
  const randomNum = mydate.getDay() + mydate.getHours() + mydate.getMinutes() + mydate.getSeconds() + mydate.getMilliseconds() + Math.round(Math.random() * 10000);
  const uuid = (prefix || 'uuid') + md5(randomNum)
  if (len && typeof len == 'number' && len > 6) {
    const remainder = len - 5
    const pre = uuid.substr(0, 5)
    const aft = uuid.substr(uuid.length - remainder)
    return pre + aft
  } else {
    return uuid
  }
}

// 节流方法
export function throttle(fn, gapTime=1500) {
  let _lastTime = null
  return function () {
    var context = this
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(context, arguments)
      _lastTime = _nowTime
    }
  }
}
// throttle(fn,1000),10)  稳定一秒输出，不会被打断，中途打断无效

// 防抖函数
export function debounce(fn, wait=1000) {
  var timer = null;
  return function () {
    var context = this
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(function () {
      fn.apply(context, arguments)
    }, wait)
  }
}
// (debounce(fn, 500), 1000)  // 1000触发一次，中途触发则阻止上一次的

let _nav = {}
_nav.gapTime = 1200
const navFuns = ['switchTab', 'reLaunch', 'redirectTo', 'navigateTo', 'navigateBack']
navFuns.forEach(key => {
  _nav[key] = throttle(function () {
    wx[key].apply(null, arguments)
  }, _nav.gapTime)
})

export const nav = _nav

export function findChilds(ctx) {
  if (!ctx) return null
  let xxx = []
  if (isArray(ctx)) {
    ctx.forEach(item => {
      if (item.$$is === 'fakelist') {
        if (item.length) xxx = xxx.concat(findChilds(item.parentInst))
      } else {
        xxx = xxx.concat(findChilds(item))
      }
    })
  } else {
    if (ctx.children && ctx.children.length) {
      ctx.children.forEach(cld => {
        if (cld.children && cld.children.length) {
          xxx = findChilds(cld).concat(xxx)
        } else {
          xxx = xxx.concat(cld)
        }
      })
    }
    xxx = xxx.concat(ctx)
  }
  return xxx
}

export function syncChildData(res, rid, data) {
  if (res.__relationId === rid) {
    res = data
  } else {
    Object.keys(res).forEach(key => {
      if (key !== '__sort') {
        let val = res[key]
        if (isObject(val)) {
          if (val.__relationId === rid) {
            res[key] = data
          } else {
            res[key] = syncChildData(val, rid, data)
          }
        }
        if (isArray(val)) {
          res[key] = val.map(it => syncChildData(it, rid, data))
        }
      }
    })
  }
  return res
}


// 百度 ”JS实现活动精确倒计时“
class cdd {
  constructor(opts, callback, finaFun){
    let dftConfig = { time: 60000, step: 1000, start: 0, end: 0 }
    if (isNumber(opts)) {
      opts = {time: opts}
    }
    if (isFunction(opts)) {
      if (isFunction(callback)) {
        finaFun = callback
        callback = opts
      } else {
        callback = opts
      }
    }
    this.props = Object.assign(dftConfig, opts)
    this.timeCounter = null
    this.callback = callback
    this.final = finaFun
    this.stat = false
    this.currentStat = null
  }
  isPause(){
    return this.control === 'pause'
  }
  isCancel(){
    return this.control === 'cancel'
  }

  /**
   * 小程序被切换到后台时，即onHide状态下，计时逻辑数据会丢失，导致计时失败
   * 因此需要对计时逻辑数据进行特殊处理
   * 
   * pause有两种状态
   * 1. 忽略间隔时间，暂停后重新开始，将接续暂停的时间，间隔时间为0
   * 2. 不忽略间隔时间， 暂停后重新开始，将跳跃补上间隔时间并继续
   * 
   * isback为true，将运行第二种暂停模式
   */
  pause(isback, cb){
    if (isFunction(isback)) {
      cb = isback
      isback = null
    }
    this.control = 'pause'
    if (isback) {
      this._isback = true
    }
    if (isFunction(cb)) cb(this.control)
  }
  cancel(cb){
    this.control = 'cancel'
    if (isFunction(cb)) cb(this.control)
  }
  toggle(isback, cb){
    if (isFunction(isback)) {
      cb = isback
      isback = null
    }
    if (this.control == 'pause') {
      this.continue()
    } else {
      this.pause(isback)
    }
    if (isFunction(cb)) cb(this.control)
  }
  continue(cb){
    if (this.control == 'pause') {
      this.control = 'continue'
      if (this.currentStat) {
        if (!this._isback) {
          this.currentStat.startTime = (new Date()).getTime()
        } else {
          this.currentStat.startTime = this.currentStat.pauseTime
        }
        this.run(this.currentStat)
      }
      this._isback = false
      this.currentStat = null
    }
    if (isFunction(cb)) cb(this.control)
  }

  start(){
    this.run()
  }

  restart(){
    this.control = ''
    this.run()
  }

  countEnd(ms) {
    let final = this.final
    this.stat = false
    this.control = ''
    clearTimeout(this.timeCounter);
    if (isFunction(final)) {
      final(ms)
    }
  }

  run(param){
    let that = this
    let {time, step, start, end} = this.props
    let timeCounter = this.timeCounter
    let callback = this.callback
    if (start && end) {
      time = end-start
    }
    this.stat = true
    let interval = step
    let ms = time //从服务器和活动开始时间计算出的时间差，这里测试用50000ms
    let count = 0
    let startTime = new Date().getTime()

    if (param) {
      interval = param.interval
      ms = param.ms
      count = param.count
      startTime = param.startTime
    } 

    if (ms >= 0) {
      timeCounter = setTimeout(countDownStart, interval);
    }
    
    function countDownStart(){
      // 取消倒计时
      if (that.control === 'cancel') {
        clearTimeout(timeCounter)
        that.control = ''
        return
      }

      count++;
      let offset = new Date().getTime() - (startTime + count * interval);
      let nextTime = interval - offset;
      let daytohour = 0; 
      let _count = null
      if (nextTime < 0) { 
        _count = count
        if (offset >= 1000) {
          _count = parseInt(offset / interval)
        }
        count = _count
        nextTime = 0 
        ms -= (count * interval)
      } else {
        ms -= interval;
      }

      // 暂停倒计时
      if (that.control === 'pause') {
        clearTimeout(timeCounter)
        that.currentStat = {
          interval,
          ms: _count ? ms+=(count*interval) : ms+=interval,
          count: 0,
          startTime,
          pauseTime: new Date().getTime()
        }
        return
      }

      if (typeof callback == 'function') {
        let res = callback(count, ms)
        if (typeof res == 'object' && typeof res.then === 'function') {
          res.then(()=>{
            if(ms <= 0){
              that.countEnd(ms)
            }else{
              timeCounter = setTimeout(countDownStart, nextTime);
            }
          })
        } else {
          // console.log("误差：" + offset + "ms，下一次执行：" + nextTime + "ms后，离活动开始还有：" + ms + "ms");
          if(ms <= 0){
            that.countEnd(ms)
          }else{
            timeCounter = setTimeout(countDownStart, nextTime);
          }
        }
      } else {
        console.log("误差：" + offset + "ms，下一次执行：" + nextTime + "ms后，离活动开始还有：" + ms + "ms");
        if (ms <= 0) {
          that.countEnd(ms)
        } else {
          timeCounter = setTimeout(countDownStart, nextTime);
        }
      }
    }
  }
}

export function countdown(opts={}, callback, finaFun) {
  return new cdd(opts, callback, finaFun)
}

// 计时器类
class ct {
  constructor(props={}){
    this.timmer = null
    this.props = props
    this.interval = props.interval || props.step || 50
    if (props && (isFunction(props.callback) || isFunction(props.tick))) {
      this.cb = props.callback || props.tick
    }
    this.stat = {
      running: null
    }
    this.startTime = null
    this.pauseTime = 0
    this.gapTime = 0
  }

  /**
   * 小程序被切换到后台时，即onHide状态下，计时逻辑数据会丢失，导致计时失败
   * 因此需要对计时逻辑数据进行特殊处理
   * 
   * pause有两种状态
   * 1. 忽略间隔时间，暂停后重新开始，将接续暂停的时间，间隔时间为0
   * 2. 不忽略间隔时间， 暂停后重新开始，将跳跃补上间隔时间并继续
   * 
   * isback为true，将运行第二种暂停模式
   */
  pause(isback, cb){
    if (isFunction(isback)) {
      cb = isback
      isback = null
    }
    if (this.stat.running === 'running' || this.stat.running === 'continue') {
      clearInterval(this.timmer)
      this.stat.running = 'pause'
      this.pauseTime = isback ? 0 : new Date().getTime()
      if (isFunction(cb)) {
        cb(this.stat.running)
      }
    }
  }
  stat(){
    return this.stat.running
  }
  continue(cb){
    this.stat.running = 'continue'
    this.run()
    if (isFunction(cb)) {
      cb(this.stat.running)
    }
  }
  toggle(isback, cb){
    if (isFunction(isback)) {
      cb = isback
      isback = null
    }
    if (!this.stat.running) {
      this.run()
      if (isFunction(cb)) {
        cb(this.stat.running)
      }
      return
    }
    if (this.stat.running === 'running' || this.stat.running === 'continue') {
      this.pause(isback, cb)
      return
    }
    if (this.stat.running === 'pause') {
      this.continue(cb)
    }
  }
  stop(){
    if (this.stat.running) {
      this.stat.running = null
      this.gapTime = 0
      this.pauseTime = 0
      this.startTime = null
      clearInterval(this.timmer)
    }
  }
  start(param){
    this.run(param)
  }
  run(tick){
    let that = this
    let stat = this.stat
    let interval = this.interval
    if (isFunction(tick)){
      this.cb = tick
    }
    
    if (stat.running === 'running') {
      return
    }

    if (stat.running === 'pause') {

    }
    
    this.stat.running = 'running'
    if (!this.startTime) {
      this.startTime = new Date().getTime()
    }

    let startTime = this.startTime
    this.gapTime += this.pauseTime ? (new Date().getTime()) - this.pauseTime : 0
    let gapTime = this.gapTime
    if (this.cb) {
      this.timmer = setInterval(() => {
        let _time = new Date().getTime()
        let diffTime = _time - startTime - gapTime
        this.cb(diffTime)
      }, interval);
    }
  }
}

export function counter(opts) {
  if (isFunction(opts)) {
    let _cb = opts
    opts = { callback: _cb }
  }
  return new ct(opts)
}
