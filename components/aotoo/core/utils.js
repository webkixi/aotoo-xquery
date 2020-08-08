// import path from 'path'
const lib = require('../lib/index')
const path = {
  basename: function basename(str) {
    var idx = str.lastIndexOf('/')
    idx = idx > -1 ? idx : str.lastIndexOf('\\')
    if (idx < 0) {
      return str
    }
    return str.substring(idx + 1);
  },
  extname: function (filename) {
    if (!filename || typeof filename != 'string') {
      return false
    };
    let a = filename.split('').reverse().join('');
    let b = a.substring(0, a.search(/\./)).split('').reverse().join('');
    return b
  }
}

export function post(url, data={}, param={}, method='POST') {
  return new Promise((resolve, reject)=>{
    let postParam = {
      url, // 仅为示例，并非真实的接口地址
      method,
      data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        resolve(res)
      },
      error: function (e) {
        // reject('网络出错');
        reject(e)
      }
    }
    postParam = Object.assign(postParam, param)
    postParam.fail = postParam.error
    if (postParam.url) wx.request(postParam)
  })
}

export function _get(url, data, param ) {
  return post(url, data, param, 'GET')
}

function getImgRealPath(obj) {
  if (lib.isString(obj)) return obj
  if (lib.isObject(obj)) {
    return obj.path ? obj.path : obj.src ? obj.src : obj.img ? obj.img.src ? obj.img.src : obj.img : ''
  }
}

function formDataName(param) {
  const basename = path.basename(param)
  const extname = '.'+path.extname(basename)
  return basename.length > 20 ? lib.uuid('upimg_', 12) + extname : basename
}

function doUpload(param) {
  if (param.url == 'cloud') {
    param.cloudPath = param.formData.name
    wx.cloud.uploadFile(param)
  } else {
    wx.uploadFile(param)
  }
}

function _up(params) {
  if (Array.isArray(params.filePath)){
    wx.showLoading({ title: '上传中...' })
    const every = []
    params.filePath.forEach(one=>{
      one = getImgRealPath(one)
      if (one) {
        const p = new Promise((rs, rj) => {
          let nParams = {}
          Object.keys(params).forEach(key => {
            if (key == 'filePath') {
              one = one.src ? one.src : one
              nParams[key] = one
            } else {
              if (key == 'formData') {
                params[key].name = formDataName(one)
                nParams[key] = params[key]
              } else {
                nParams[key] = params[key]
              }
            }
          })
          nParams.success = function(res) { rs(res) }
          nParams.error = function(err) { rj(err) }
          nParams.fail = function(err) { rj(err) }
          doUpload(nParams)
        })
        every.push(p)
      }
    })
    return Promise.all(every).then(res=>{
      wx.hideLoading()
      return res
    })
  } else {
    return new Promise((resolve, reject) => {
      const oldSuccess = params.success
      const oldError = params.error
      params.success = function(res) {
        wx.hideLoading()
        if (typeof oldSuccess == 'function') { oldSuccess(res) }
        resolve(res)
      }
  
      params.error = function(err) {
        if (typeof oldError == 'function') { oldError(err) }
        reject(err)
      }
  
      params.fail = params.error
      params.filePath = getImgRealPath(params.filePath)
      params.formData.name = formDataName(params.filePath)
      doUpload(params)
    })
  }
}

export function upload(url, data, param={}) {
  if (lib.isObject(url)) param = url
  let postParam = {
    url: url, // 仅为示例，并非真实的接口地址
    type: 'img',
    name: 'file',
    filePath: '',
    header: {
      'content-type': 'application/json' // 默认值
    },
    data: data || {},
    // success(res) {},
    // error: function (e) {}
  }
  postParam = Object.assign(postParam, param)
  postParam.formData = postParam.data
  delete postParam.data
  if (postParam.url && postParam.filePath) {
    return _up(postParam)
  } else {
    return Promise.resolve(`url和filePath参数为必填项，url请填写服务器地址, filePath请填写上传图片地址`)
  }
}


export function usualKit(ctx, options) {
  return new UsualKit(ctx, options)
}

export function _cloud (url, param, ctx) {
  if (lib.isString(url)) {
    if (/^[\\\/]/.test(url)) url = url.substr(1)
    let urls = url.split('/')
    let api = urls[0]
    let $url = urls.slice(1)
    if ($url.length) {
      $url = $url.join('/')
    } else {
      $url = 'index'
    }
    param.$url = $url

    const re = /(add|update|set|delete|remove)/
    if (api) {
      return new Promise((resolve, reject) => {
        wx.cloud.callFunction({
          name: api,
          data: param || {},
          success: res => {
            // if (re.test(param.$url)) {
            //   that.cloud('one/site/upVersion')
            // }
            if (ctx) that.hooks.emit('response', param)
            resolve(res)
          },
          fail: err => {
            if (ctx) that.hooks.emit('cloud_fail')
            reject(err)
          }
        })
      })
    }
  }
} 

class UsualKit {
  constructor(ctx, options) {
    this.ctx = ctx
    this.options = options
    this.hooks = lib.hooks(lib.suid('kit_'))
  }

  post(){
    return post.apply(this, arguments)
  }

  get(url, data, param) {
    return post.call(this, url, data, param, 'GET')
  }

  upload(){
    return upload.apply(this, arguments)
  }

  // 获取用户是否获得某权限
  auth(scopeType) {
    const scopes = ['userInfo', 'userLocation', 'address', 'invoiceTitle', 'invoice', 'werun', 'record', 'writePhotosAlbum', 'camera']
    return new Promise((resolve, rej) =>{
      function erro(err) {
        console.error(err);
        return rej(err)
      }
      wx.getSetting({
        success(res){
          let stat = res.authSetting[`scope.${scopeType}`]
          if (!stat) {
            if (scopeType === 'userInfo') {
              // return resolve(stat)
              return erro(stat)
            }
          }
          wx.authorize({
            scope: `scope.${scopeType}`,
            success: res => resolve(true),
            fail: err => erro(err)
          })
        },
        fail: err => erro(err)
      })
    })
    // if (scopes.indexOf(scopeType) > -1) {
    //   return new Promise((resolve, reject) => {
    //     wx.getSetting({
    //       success: res => {
    //         if (!res.authSetting[`scope.${scopeType}`]) {
    //           wx.authorize({
    //             scope: `scope.${scopeType}`,
    //             success: res => resolve(true),
    //             fail: err => reject(err)
    //           })
    //         } else {
    //           resolve(true)
    //         }
    //       },
    //       fail: err => reject(err)
    //     })
    //   })
    // }
  }

  /**
   * inst.cloud('one/user/get', {...})  // 获取用户信息  one 云端接口名
   */
  cloud(url, param={}) {
    return _cloud(url, param, this)
    // if (lib.isString(url)) {
    //   if (/^[\\\/]/.test(url)) url = url.substr(1)
    //   let urls = url.split('/')
    //   let api = urls[0]
    //   let $url = urls.slice(1)
    //   if ($url.length) {
    //     $url = $url.join('/')
    //   } else {
    //     $url = 'index'
    //   }
    //   param.$url = $url

    //   return this.c_fun(api, param)
    // }
  }

  // 调用云方法
  c_fun(name, param) {
    const that = this
    const re = /(add|update|set|delete|remove)/
    if (name) {
      return new Promise((resolve, reject) => {
        wx.cloud.callFunction({
          name,
          data: param || {},
          success: res => {
            // if (re.test(param.$url)) {
            //   that.cloud('one/site/upVersion')
            // }
            that.hooks.emit('response', param)
            resolve(res)
          },
          fail: err => {
            that.hooks.emit('cloud_fail')
            reject(err)
          }
        })
      })
    }
  }

  // 销毁该实例
  destory() {
    this.ctx = null
    this.options = null
  }
}