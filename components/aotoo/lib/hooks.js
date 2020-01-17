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

class _hooks {
  constructor(props={}) {
    let max = 0
    let expireTime = 0
    let storage = props.storage
    if (isObject(storage)) {
      storage = props.storage.localstorage  // 是否启用本地存储
      max = props.storage.max || 0
      expireTime = props.storage.expire || 0
      delete props.storage.localstorage
    }
    this.storage = storage
    this.namespace = props.namespace
    this.actions = {}
    this.storeData = {}
    this.expireData = {}
    this.expireDataKey = this.namespace + `-expire-data`
    if (this.storage) {
      let oldData = wx.getStorageSync(this.namespace)
      let oldExpireData = wx.getStorageSync(this.expireDataKey)
      this.storeData = oldData || {}
      this.expireData = oldExpireData || {}
    }

    this.syncTimmer = null

    // lru
    this.max = max
    this.shadowData = {}

    // 超时，设置所有变量的默认超时时间
    this.expire = expireTime
  }

  destory() {
    this.syncData(null, 'destory')
    this.actions = {}
    this.storeData = {}
    this.expireData = {}
    // wx.clearStorageSync()
  }

  getInfo(){
    return this.storage ? wx.getStorageInfoSync() : this.storeData
  }

  setItem(key, val, expire) {
    if (!key) return

    if (val && val.$$value && val.$$timestamp) {
      this.storeData[key] = val
    } else {
      this.storeData[key] = {
        $$value: val,
        $$hit: 1,
        $$timestamp: (new Date()).getTime()
      }
    }

    expire = expire || this.expire
    if (expire && isNumber(expire)) {
      let timestamp = (new Date()).getTime()
      let expireTime = timestamp + expire
      let gapTime = expire
      expire = {
        expire: expireTime,
        gap: gapTime
      }
      this.expireData[key] = expire
    }

    this.syncData(key, 'set')
  }

  syncData(key, type){
    if (this.max) {
      let shadowData = this.shadowData
      let storeData = this.storeData
      let expireData = this.expireData
      
      if (type === 'set') {
        let res = this.emit('cache-set', storeData[key].$$value)  // 此时数据已存在
        if (res && res.length) {
          storeData[key].$$value = res[0]
        }
      }
      
      if (type === 'get') {
        if (shadowData[key] && !storeData[key]) {
          storeData[key] = shadowData[key]
          delete shadowData[key]
        }
        let res = this.emit('cache-get', storeData[key].$$value)
        if (res && res.length) {
          storeData[key].$$value = res[0]
        }
      }

      if (type === 'delete') {
        this.emit('cache-delete', ((storeData[key] && storeData[key].$$value) || {}))
        delete shadowData[key]
        delete storeData[key]
        delete expireData[key]
      }

      if (type === 'destory') {
        let allData = Object.assign(shadowData, storeData)
        this.emit('cache-destory', allData)
        this.storeData = {}
        this.expireData = {}
      }
      
      let max = this.max
      let len = Object.keys(this.storeData).length
      if (len > max) {
        this.emit('cache-switch', shadowData)
        shadowData = storeData
        storeData = {[key]: shadowData[key]}
        delete shadowData[key]
      }

      this.shadowData = shadowData
      this.storeData  = storeData
      this.expireData = expireData
    }


    if (this.storage) {
      clearTimeout(this.syncTimmer)
      this.syncTimmer = setTimeout(() => {
        wx.setStorageSync(this.namespace, this.storeData)
        wx.setStorageSync(this.expireDataKey, this.expireData)
      }, 1000);
    }
  }

  /**
   * orin: true: 返回源数据; false: 返回$$value
   */
  getItem(key, orin){
    if (key) {
      if (key === '*') {
        return this.storeData
      }
      let res
      let _res = this.storeData[key]
      if (!_res) {
        _res = this.shadowData[key]
      }
      if (_res) {
        _res.$$hit += 1
        res = _res.$$value
        this.syncData(key, 'get')

        let expire = this.expireData[key]
        if (expire) {
          let expireTime = expire.expire
          let gapTime = expire.gap
          let nowTime = new Date().getTime()
          if (expireTime && (expireTime > nowTime)) {
            return orin ? _res : res
          } else {
            this.delete(key)
          }
        } else {
          return orin ? _res : res
        }
      }
    }
  }

  append(key, val, expireDate){
    if (key) {
      let res, expireTime, gapTime
      let _res = this.getItem(key, 'full')
      res = _res && _res.$$value
      let expire = this.expireData[key]
      if (isArray(res)) {
        res = res.concat(val)
      } else if (isObject(res)) {
        res = isObject(val) ? Object.assign(res, val) : Object.assign(res, {[suid('val_')]: val})
      } else {
        if (isObject(val) || isArray(val)) res = val
        else {
          res = {[suid('val_')]: val}
        }
      }

      if (expire) {
        expireTime = expire.expire + (new Date()).getTime()
        gapTime = expire.gap
        this.expireData[key] = {
          expire: expireTime,
          gap: gapTime
        }
      }
      
      _res = {
        $$value: res,
        $$hit: _res ? _res.hit : 1,
        $$timestamp: (new Date()).getTime()
      }
      this.setItem(key, _res, expireDate)
    }
  }

  delete(key){
    if (key) {
      if (key === '*') {
        this.clear()
      } else {
        this.storeData[key] = null
        this.expireData[key] = null
        this.shadowData[key] = null
      }
      this.syncData(key, 'delete')
    }
  }
  
  clear(){
    this.destory()
    if (this.storage) {
      wx.removeStorage({key: this.namespace})
      wx.removeStorage({key: this.expireDataKey})
    }
    // wx.clearStorageSync()
  }

  // ========= 下面为钩子方法 ===========
  on(key, cb) {
    let myActions = this.actions
    const hooksActionUniqId = suid('hooks_action_')
    if (cb) {
      cb['hooksActionUniqId'] = hooksActionUniqId
    }
    if (isString(key)) {
      if (myActions[key]) {
        myActions[key] = [].concat(myActions[key]).concat(cb)
      } else {
        myActions[key] = [cb]
      }
    }
  }
  reverseOn(key, cb) {
    let myActions = this.actions
    const hooksActionUniqId = suid('hooks_action_')
    if (cb) {
      cb['hooksActionUniqId'] = hooksActionUniqId
    }
    if (isString(key)) {
      if (myActions[key]) {
        myActions[key] = [].concat([cb], myActions[key])
      } else {
        myActions[key] = [cb]
      }
    }
  }
  hasOn(key){
    let myActions = this.actions
    return myActions[key] ? myActions[key].length ? true : false : false
  }
  off(key, fun) {
    if (isString(key)) {
      if (key === '*') {
        this.actions = {}
        return
      }
      if (fun && typeof fun === 'function') {
        let hooksActionUniqId = fun.hooksActionUniqId || fun.name
        if (hooksActionUniqId) {
          let theFuns = this.actions[key]
          let selectFunIndex=-1
          if (theFuns) {
            theFuns.forEach(($f, ii) => {
              if ($f['hooksActionUniqId'] == hooksActionUniqId || $f.name === hooksActionUniqId) {
                selectFunIndex = ii
              }
            })
            if (~selectFunIndex) {
              theFuns.splice(selectFunIndex, 1)
            }
          }
        }
      } else {
        delete this.actions[key]
      }
    }
  }
  
  emit(key, param, ctx=null) {
    if (isString(key)) {
      if (this.actions[key]) {
        const vals = []
        const funs = this.actions[key]
        funs.forEach(fun => {
          if (isFunction(fun)) {
            const res = fun.call(ctx, param)
            if (res) vals.push(res) 
            else {
              if (typeof res === "boolean") {
                vals.push(res)
              } else {
                vals.push(undefined)
              }
            }
            if (fun.onlyonetime) {
              this.off(key, fun)
            }
          }
        })
        if (vals.length) {
          return vals
        }
      }
    }
  }

  fire(key, param, ctx=null) {
    const vals = []
    function _fire(funcs=[]) {
      if (funcs.length) {
        const fun = funcs.shift()
        const res = fun.call(ctx, param)
        vals.push(res)
        _fire(funcs)
      } else {
        return vals
      }
    }

    if (isString(key) && this.actions[key]) {
      _fire(this.actions[key])
      if (vals.length) return vals
    }
  }

  one(key, cb) {
    if (key && typeof cb == 'function') {
      function mycb() { return cb.apply(this, arguments) }
      mycb.onlyonetime = true
      this.on(key, mycb)
    }
  }

  once(key, cb) {
    let myActions = this.actions
    if (isString(key) && isFunction(cb)) {
      myActions[key] = [cb]
    }
  }
}

let myhooks = {}
export function hooks(namespace, storage) {
  if (isString(namespace)) {
    if (!myhooks[namespace]) {
      myhooks[namespace] = new _hooks({storage, namespace})
    }
    return myhooks[namespace]
  }
}