//index.js
//获取应用实例
import {getMainColor} from './common/imgmaincolor'
const Pager = require('../../aotoo/core/index')
const lib = Pager.lib

export async function cropper(){}  // https://github.com/we-plugin/we-cropper

// 获取图片的主色调
export async function catchPicturMainColor(imgurl){
  let wid = 300
  let hgt = 150
  const dpr = wx.getSystemInfoSync().pixelRatio

  // 创建离屏 2D canvas 实例
  const canvas = wx.createOffscreenCanvas({type: '2d', width: wid, height: hgt})
  // 获取 context。注意这里必须要与创建时的 type 一致
  const context = canvas.getContext('2d')
  context.scale(dpr, dpr)


  // 创建一个图片
  const image = canvas.createImage()
  // 等待图片加载
  await new Promise(resolve => {
    image.onload = resolve
    image.src = imgurl // 要加载的图片 url
  })

  wid = image.width
  hgt = image.height
  canvas.width = wid
  canvas.height = hgt

  // // 把图片画到离屏 canvas 上
  context.clearRect(0, 0, wid, hgt)
  context.drawImage(image, 0, 0, wid, hgt)

  // // 获取画完后的数据
  const imgData = context.getImageData(0, 0, wid, hgt)
  // console.log(imgData);

  return getMainColor(imgData)
}

// 图片上传
export function uploadImages(param={}){
  param.type = 'image'
  return uploader(param)
}

// 视频上传
export function uploadVideos(param={}){
  param.type = 'video'
  return uploader(param)
}

// 文件上传
export function uploadFiles(param={}){
  param.type = 'file'
  return uploader(param)
}

// 数据适配器
function adapterUploader(data, options) {
  const rightData = []
  const guideImages = options.guideImages || ['+']  // 引导图
  const deleteButton = options.deleteButton // 删除按钮
  let   myData = []
  let   count = options.count || 1  // 页面显示上传按钮个数
  let   isMultiUpload = false
  // if (data.length > count && count === 1) {
  if (options.limit > count && count === 1) {
    isMultiUpload = true
    count = data.length
  }

  if (guideImages.length<count) {
    const lastGuidItem = guideImages[(guideImages.length-1)]
    for(let ii=0; ii<count; ii++) {
      if (!guideImages[ii]) {
        guideImages.push(lastGuidItem)
      }
      // if (ii >= guideImages.length) {
      //   guideImages.push(lastGuidItem)
      // }
    }
  }

  for (let ii=0; ii < count; ii++) {
    let content = guideImages[ii] || guideImages[0]
    if (data[ii]) {  // 数据回填
      content = data[ii]
    }
    myData.push(content)
  }

  if (myData.length > 9) {
    myData = myData.splice(0, 9)
  } else {
    // 小于9张图片，自动补一个 + 按钮在最后
    // if (isMultiUpload && myData.length < 9) {  // max = 9
    //   myData.push( (guideImages[myData.length] || guideImages[0]) )
    // }

    // 小于9张图片，自动补一个 + 按钮在最后
    if (isMultiUpload && myData.length < 9) {  // max = 9
      if (options.count === 1) {
        if (myData.length < options.limit) {
          myData.push( (guideImages[myData.length] || guideImages[0] ))
        }
      } else {
        myData.push( (guideImages[myData.length] || guideImages[0]) )
      }
    }
  }

  myData.forEach((item, ii)=>{
    const uindex = lib.suid('up-item-')
    let   isActionButton = false
    if (
      item === guideImages[ii] || 
      item === guideImages[0] || 
      (lib.isObject(item) && item.isActionButton)) 
    {
      isActionButton = true
      if (!lib.isObject(item)) item = {title: item, itemClass: 'upload-guid-item', isActionButton: true}
    } else {
      if (lib.isString(item)) {
        item = {img: {src: item, mode: 'aspectFill'}}
      }
      let deleteDot = {title: 'x', itemClass: 'uploader-delete-item-button', aim: `onDeleteSelf?uindex=${uindex}&index=${ii}`}  // 删除当前图片，并保留当前栅格
      if (deleteButton) {
        if (lib.isString(deleteButton)) {
          deleteButton = {title: deleteButton}
        }
        if (lib.isObject(deleteButton)) {
          deleteDot = Object.assign({}, deleteDot, deleteButton, {aim: `onDeleteSelf?uindex=${uindex}&index=${ii}`})
        }
      }
      item.dot = [deleteDot]
      item.attr = {uindex}
    }
    if (typeof item === 'object') {
      item.uindex = uindex
      if (isActionButton) {
        item.aim = `onChooseMedia?uindex=${uindex}&index=${ii}`  // 准备上传图片
      } else {
        if (options.previewTap && lib.isString(options.previewTap)) {
          item.aim = options.previewTap
        } else {
          item.aim = `onChooseMedia?uindex=${uindex}&index=${ii}`  // 准备上传图片
        }
      }

      if (item.callback) {
        const callback = item.callback
        const oriContext = item.context
        delete item.callback
        delete item.context
        const tempContext = {
          deleteSelf(){
            oriContext.onDeleteSelf({}, {uindex}, null)
          },
          preview(_content={}){
            if (_content) {
              const keys = Object.keys(_content)
              if (keys.length > 0) {
                _content.uindex = uindex
                _content && oriContext.findAndUpdate({uindex}, _content)
              }
            }
          }
        }
        callback.call(tempContext, item)
      }
      rightData.push(item)
    }
  })
  return rightData
}

function _preview(options) {
  const onPreview = options.onPreview
  const res = this.chooseResult
  const {tempFiles} = res
  let   data = this.getData().data
  if (options.sortByDesc) {
    data = data.reverse()   // 转成正序后处理数据，输出时再倒叙输出
  }

  if (this.selectPoint) {
    const {uindex, index} = this.selectPoint
    let   selectIndex = index
    
    for (let ii=0; ii<data.length; ii++) {
      const item = data[ii]
      if (item.uindex === uindex) {
        selectIndex = ii;
        break;
      }
    }
    // uploadType==='file'的预览图没有处理 ???
    tempFiles.forEach((file, ii)=>{
      const {previewPath, path, size} = file
      let   previewContent = previewPath || {title: file.name}
      if (lib.isFunction(onPreview)) {
        const temp = onPreview.call(this, file, selectIndex)
        if (temp && !lib.isEmpty(temp)) {
          previewContent = temp
        }
        if (lib.isFunction(previewContent)) {
          const callback = previewContent
          previewContent = previewPath ? {img: {src: previewPath, mode: 'aspectFill'}} : {title: file.name}
          previewContent.context = this
          previewContent.callback = callback
        }
      }
      if (options.count !== 1) {  // 限制了预览图片数及可上传图片数
        if (selectIndex < data.length) {
          data[selectIndex] = previewContent
        }
      } else {
        data[selectIndex] = previewContent  // count=1 & limit=1，只能预览并选择一张图片，limit没指定,count=1，表示可预览并选择多个图片
      }
      selectIndex++
    })
    const $data = adapterUploader(data, options)


    const that = this
    function beforeUpload(){
      if (lib.isFunction(options.beforeUpload)) {
        options.beforeUpload.call(that, $data)
      }
    }

    if (options.sortByDesc) {
      this.update($data.reverse(), beforeUpload)
    } else {
      this.update($data, beforeUpload)
    }
  }
}

/*
uploader({
  前端参数
  data: [...],  要显示的图片，用于数据回填，交互等
  count: n,  显示多少个上传按钮
  limit: n,   选择多少个上传图片
  type: '',  上传类型  
  guideImages: [],  data项为空时默认显示的内容，比如 + 号
  onPreview: function(){},  点击上传按钮，选中文件后的回调，用户可自定义预览的内容(基于item)  
  previewTap: string, 预览列表中，点击预览图片，用户自定义的方法名称
  beforeUpload: function(){}, 上传之前，预览之后的最后一刻
  onUploaded: function(){},  上传完成后的回调  
  onDelete: function(){},  删除预览图片时的回调
  sortByDesc: false,  是否倒叙预览图片列表
  {...}  小程序上传组件的参数，这些参数参考小程序官方组件说明，这些参数包含 图片上传参数，视频上传参数，文件上传参数

  后端上传参数，统一配置: 
  url: '',   后端上传api
  header: {},  后端上传需要指定的特殊参数，如token  
  formData: {}, 后端上传参数，如title等
  timeout: 10000,  上传超时

  小程序云上传参数，统一配置
  cloud: {
    path: '', 云上传基础目录，会与文件名拼接成云文件名,
    config: {
      env: ''  小程序云id
    }
  }, 
})

activePage.uploader = context
*/

export function uploader(options, cb){
  options.count = options.count || 1
  options.limit = options.limit || 1
  const uploadType = options.type || 'image'
  
  // 上传用的参数
  let   url = options.url  // 是否有指定的后端服务器，否则使用云上传
  const header = options.header || {}
  const formData = options.formData || {}
  const timeout = options.timeout || 10000  // 10秒超时

  // 云上传配置
  const cloud = options.cloud || {}

  // 用户交互
  const onPreview = options.onPreview
  const onUploaded = options.onUploaded
  const onDelete = options.onDelete
  
  // 显示用的参数
  const data = adapterUploader((options.data || []), options)
  let   limit = options.limit || 1; // 限制一次性上传的图片数量

  if ((limit < options.count) && limit !== 1) {
    limit = options.count
  }

  // if (uploadType === 'video' || uploadType === 'file') {
  //   limit = 1
  // }

  return {
    $$id: (options.$$id || options.id),
    data,
    created(){
      if (!options['$$id']) {
        const instanceName = 'uploader_'+uploadType;
        this.activePage[instanceName] = this
      }
    },
    ready: options.ready,
    methods: {
      onDeleteSelf(e, param, inst){
        const that = this
        const {uindex, index} = param
        const data = this.getData().data
        
        const realIndex = this.findIndex({uindex})
        const realItem = data[realIndex]
        if (lib.isFunction(onDelete)) onDelete.call(that, realItem)

        if (options.count === 1 && limit > 1) {  // 删除元素
          if (data.length === 1) {
            const $data = adapterUploader([], options)
            this.update({data: $data})
          } else {
            this.delete({uindex}, function(){
              const data = that.getData().data
              // const rightData = data.filter(item=>!item.title)
              const rightData = data.filter(item=>!item.isActionButton)
              const $data = adapterUploader(rightData, options)
              this.update({data: $data})
            })
          }
        } else {  // 清空元素
          const item = inst.parent()
          item.reset()
        }
      },
      preview(){
        // const that = this
        // if (lib.isFunction(onPreview)) {
        //   const tmp = onPreview.call(this, this.chooseResult)
        //   if (tmp) {
        //     if (tmp.then) {
        //       tmp.then(res=>{
        //         if (lib.isArray(tmp)) {
        //           this.chooseResult['tempFiles'] = tmp
        //         }
        //         if (lib.isObject(tmp) && lib.isArray(tmp.tempFiles)) {
        //           this.chooseResult = tmp
        //         }
        //         _preview.call(this, options)
        //       })
        //     } else {
        //       if (lib.isArray(tmp)) {
        //         this.chooseResult['tempFiles'] = tmp
        //       }
        //       if (lib.isObject(tmp) && lib.isArray(tmp.tempFiles)) {
        //         this.chooseResult = tmp
        //       }
        //       _preview.call(this, options)
        //     }
        //   } else {
        //     _preview.call(this, options)
        //   }
        // } else {
        //   _preview.call(this, options)
        // }
        _preview.call(this, options)
      },
      onChooseMedia(e, param, inst){
        const that = this
        this.selectPoint = param
        if (uploadType === 'image') {
          wx.chooseImage({
            count: limit,
            sizeType: options.sizeType || ['original', 'compressed'],
            sourceType: options.sourceType || ['album', 'camera'],
            success(res){
              const newTempFiles = []
              const {tempFiles} = res
              tempFiles.map((file, ii)=>{
                const {path} = file
                wx.getImageInfo({
                  src: path,
                  success(infoRes) {
                    const newfile = Object.assign(file, infoRes)
                    newfile.previewPath = path
                    newTempFiles.push(newfile)
                    if (newTempFiles.length === tempFiles.length){
                      res.tempFiles = newTempFiles
                      that.chooseResult = res
                      that.preview()
                    }
                  },
                  fail(err){
                    console.log(err);
                  }
                })
              })
            },
            fail(err){
              console.log(err);
            }
          })
        }

        else if (uploadType === 'video') {
          //  不带缩略图
          // wx.chooseVideo({
          //   compressed: options.compressed||true,
          //   maxDuration: options.maxDuration||60,
          //   camera: options.camera||'back',
          //   sourceType: options.sourceType||['album', 'camera'],
          //   success(res){
          //     wx.getVideoInfo({
          //       src: res.tempFilePath,
          //       success: function(infoRes){
          //         that.chooseResult = Object.assign(res, infoRes)
          //         that.preview()
          //       }
          //     })
          //   }
          // })

          // res = ['tempFilePath', 'width', 'height', 'duration', 'size', 'thumbTempFilePath']
          wx.chooseMedia({
            count: limit,
            mediaType: ['video'],
            maxDuration: options.maxDuration||60,
            camera: options.camera||'back',
            sourceType: options.sourceType||['album', 'camera'],
            success(_res){
              let res = _res.tempFiles[0]
              wx.getVideoInfo({
                src: res.tempFilePath,
                success: function(infoRes){
                  res = Object.assign(res, infoRes, {path: res.thumbTempFilePath}, {previewPath: res.thumbTempFilePath})
                  _res.tempFiles[0] = res
                  that.chooseResult = _res
                  that.preview()
                },
                fail(err){
                  console.log(err);
                  res = Object.assign(res, {path: res.thumbTempFilePath}, {previewPath: res.thumbTempFilePath})
                  _res.tempFiles[0] = res
                  that.chooseResult = _res
                  that.preview()
                },
                complete(res){

                }
              })
            }
          })
        }

        else if (uploadType === 'file') {
          wx.chooseMessageFile({
            count: limit,
            type: 'file',
            extension: options.extension||['.txt'],
            success(res){
              that.chooseResult = res
              that.preview()
            },
            fail(err){
              console.log(err);
            }
          })
        }

        else {
          wx.chooseMessageFile({
            count: limit,
            type: 'all',
            success(res){
              that.chooseResult = res
              that.preview()
            },
            fail(err){
              console.log(err);
            }
          })
        }
      },

      compress(){},

      // 实例.upload({...})
      upload(param={}){
        const that = this
        param = Object.assign({header, formData, timeout}, param)
        const successCb = param.success;
        delete param.success;

        const failCb = param.fail;
        delete param.fail;

        const completeCb = param.complete;
        delete param.complete;

        url = param.url || url

        if (this.chooseResult) {
          if (url) {
            /** 
             * const xxx = 上传实例.upload({  // 必须先选择上传的文件，不能直接执行
             *   url: 'node/java api',  如 upload/index
             *   success(){},
             *   fail(){},
             *   complete(){}
             * })
             * xxx.then(res=>{ ... })
            */
            if (uploadType === 'video') {
              const {tempFilePath, duration, size, width, height} = this.chooseResult
              return new Promise((resolve, reject) => {
                wx.uploadFile({
                  url,
                  filePath: tempFilePath,
                  name: options.name || 'file',  // 后端接收到文件的字段
                  success: function(res){
                    if (typeof successCb === 'function') successCb.call(that, res)
                    if (typeof onUploaded === 'function') onUploaded.call(that, res)
                    resolve(res)  
                  },
                  ...param,
                })
              })
            } else {
              const {tempFiles} = this.chooseResult
              const P = tempFiles.map((file, ii)=>{
                return new Promise((resolve, reject)=>{
                  const {path, size, name, type, time} = file
                  wx.uploadFile({
                    url,
                    filePath: path,
                    name: options.name || 'file',
                    success: function(res){
                      if (typeof successCb === 'function') successCb.call(that, res, ii)
                      if (typeof onUploaded === 'function') onUploaded.call(that, res, ii)
                      resolve(res)
                    },
                    fail(err){
                      if (typeof failCb === 'function') failCb.call(that, err, ii)
                      reject(err)
                    },
                    ...param,
                  })
                })
              })

              return Promise.all(P)
            }
          } else {
            /** 
             * const xxx = 上传实例.upload({  // 必须先选择上传的文件，不能直接执行
             *   cloudPath: 'cat prefix',  如 aaa 或者 aaa/bbb, 组件内部将上传文件名与该目录合并成云上的具体地址
             *   config: {env: '...'},  // 指定上传云id
             *   success(res){},
             *   fail(err){},
             *   complete(res){}
             * })
             * xxx.then(res=>{ ... })
            */

            const {tempFiles} = this.chooseResult
            const P = tempFiles.map((file, ii)=>{
              const cloudPath  = param.cloudPath || cloud.path
              const config = param.config || cloud.config || {}
              return new Promise((resolve, reject)=>{
                const {path, size, name, type, time} = file
                const cloudFile = cloudPath ? cloudPath + '/' + name : name
                wx.cloud.uploadFile({
                  cloudPath: cloudFile,
                  filePath: path,
                  config,
                  success(res){
                    if (typeof successCb === 'function') successCb.call(that, res, ii)
                    if (typeof onUploaded === 'function') onUploaded.call(that, res, ii)
                    resolve(res)
                  },
                  fail(err){
                    if (typeof failCb === 'function') failCb.call(that, err, ii)
                    reject(err)
                  },
                  ...param,
                })
              })
            })

            return Promise.all(P)
          }
        }
      }
    },
    listClass: 'uploader ' + (options.className || options.listClass || ''),
    itemClass: 'uploader-item'
  }
}