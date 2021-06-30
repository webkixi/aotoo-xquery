/**
 * 作者： 天天修改
 * github: webkixi
 * 小程序的模板真是又长又臭
 */
const app = null //getApp()
const Core = require('../aotoo/core')
const lib = Core.lib

const defaultConfig = {
  limit: 3,   // 限制只能上传3张图片
  count: 1,   // 默认显示多少个上传按钮
  picker: 5,  // 一次允许选择的图片数量
  imgSize: 5*1024*1024,  // 图片大小不能超过这个大小
  server: '',  // 图片上传的服务器地址，允许值  'cloud'或php、node等服务器地址
  addone: {  // 添加图片按钮
    title: '+',
    itemClass: 'uploads-addone'
  },
  closeone: {
    title: 'x', 
    itemClass: 'uploads-delet'
  },
  thumbnail: false
}

const extKeys = [
  // 'is',
  'listClass',
  'itemClass',
  'show', 
  // 'limit', 
  // 'count', 
  // 'picker', 
  // 'imgSize', 
  // 'server', 
  // 'addone', 
  'closeone' 
]

function isAddOne(param) {
  return param.itemClass && param.itemClass.indexOf('uploads-addone') > -1 ? true : false
}

// add new one fun
function addOneButton(data, props) {
  const lastOne = data[data.length-1]
  let _addone = lib.clone(props.addone)
  if (!lastOne || !isAddOne(lastOne)) {
    _addone.aim = 'uploadAction?index=' + data.length
    data.push(_addone)

    // props.addone.aim = 'uploadAction?index=' + data.length
    // data.push(props.addone)
  } else {
    lastOne.aim = 'uploadAction?index=' + (data.length-1)
  }
  return data
}

function generateData(dataSource, cb) {
  let props = {}
  const lsCls = dataSource.listClass
  dataSource.listClass = lsCls ? 'uploads-container ' + lsCls : 'uploads-container'

  Object.keys(dataSource).forEach(key=>{
    if (key!=='data') {
      let val = dataSource[key]
      props[key] = val
      switch (key) {
        case 'thumbnail':
          if (val === true) {
            props[key] = {width: 200, height: 200}
          }
          if (lib.isNumber(val)) {
            props[key] = {width: val, height: 0}
          }
          if (lib.isString(val)) {
            let vals = val.split(':')
            let wid = parseInt(vals[0])
            let hgt = vals[1]&&parseInt(vals[1]) || 0
            props[key] = {width: wid, height: hgt}
          }
          break;
      }
      if (extKeys.indexOf(key) == -1) {
        // delete dataSource[key]
      }
    }
  })

  if (!dataSource.data) dataSource.data = []

  if (lib.isObject(dataSource) && lib.isArray(dataSource.data)) {
    dataSource.data.filter((item, ii)=>{
      if (typeof item == 'string') item = { img: item }
      if (lib.isObject(item)) {
        if (item.img) {
          let img = item.img
          if (lib.isString(img)) img = { src: img }
          if (lib.isObject(img)) {
            img.catchtap = 'showAction?index='+ii
            img.itemClass = img.itemClass ? img.itemClass.indexOf('thumbnail') == -1 ? 'thumbnail ' + img.itemClass : img.itemClass : 'thumbnail'
            img.mode = dataSource.imgMode ? dataSource.imgMode: 'widthFix'
          }
          item.img = img
        }
        if (!isAddOne(item)) {
          let _closeone = lib.clone(props.closeone)
          _closeone.aim = 'deletAction?index=' + ii
          item.dot = [
            _closeone
            // { title: 'x', tap: 'deletAction?index=' + ii, itemClass: 'uploads-delet'}
          ]
          let cls = item.itemClass || item.class
          item.itemClass = cls ? 'uploads-item ' + cls : 'uploads-item'
        } else {
          item.aim = 'uploadAction?index=' + ii
        }
      }
      return item
    })

    if (dataSource.data.length < props.limit) {
      dataSource.data = addOneButton.call(this, dataSource.data, props)
    }

    if (dataSource.data.length < props.count) {
      const diff = props.count - dataSource.data.length
      const appendOne = []
      for(let ii=0; ii<diff; ii++) {
        let _addone = lib.clone(props.addone)
        _addone.aim = 'uploadAction?index=' + (ii + dataSource.data.length)
        appendOne.push(_addone)
        
        // appendOne.push({
        //   title: '+',
        //   itemClass: 'uploads-addone',
        //   aim: 'uploadAction?index=' + (ii + dataSource.data.length)
        // })
      }
      dataSource.data = dataSource.data.concat(appendOne)
    }
  }

  dataSource.__fromParent = this.uniqId

  this.setData({ 
    props,
    $list: dataSource
  }, cb)
}

/**
 * data: [
 *  {title: 'tabName'},
 *  {title: 'tabName'},
 *  {title: 'tabName'},
 *  {title: 'tabName'},
 * ],
 * $$id: 'some id',
 * count: 3  // 限制上传的数量
 * listClass: '',
 * itemClass: '',
 * show: true
 */

// 基于item的组件
Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
    addGlobalClass: true
  },
  properties: {
    dataSource: Object,
  },
  data: {
    popshow: {},
    mycanvasId: lib.suid('canvas_')
  },
  behaviors: [Core.listBehavior(app, 'uploads')],
  lifetimes: {
    created: function(){
      const that = this
      this.popid = this.uniqId + '_pop'
      this.chooseImages = false
      this._value = undefined
      this.hooks.once('myupdate', function (param) {
        let props = that.data.props
        if (lib.isArray(param)) {
          let resource = {data: param, ...props}
          generateData.call(that, resource)
        } 
      })
    },
    attached: function() { //节点树完成，可以用setData渲染节点，但无法操作节点
      let properties = this.properties
      let dataSource = lib.clone(properties.dataSource)
      if (dataSource['$$id']) {
        this['$$myid'] = dataSource['$$id']
        delete dataSource['$$id']
      }
      this.setData({
        canvasWidth: 300,
        canvasHeight: 300,
        popshow: {
          $$id: this.popid,
          title: {title: '图片预览', itemStyle: 'margin-left: 10px'},
        }
      })

      dataSource = Object.assign({}, defaultConfig, dataSource)
      generateData.call(this, dataSource)
    },
    ready: function() {
      const that = this
      const cavsid = this.data.mycanvasId
      this.existing = []
      const popid = this.popid
      this.mount(this['$$myid'])
      that.popView = Core.getElementsById(popid)
      // this.activePage.hooks.on('onReady', function() {
      // })
      this.canvas = wx.createCanvasContext(cavsid, that);
    }
  },
  methods: {
    // 设置已经存在的图片
    setExist(param){
      if (lib.isObject(param)) param = [param]
      if (lib.isArray(param)) {
        this.hooks.emit('myupdate', param)
      }
    },

    // 获得已上传的图片
    value(){
      const props = this._getCountLimit()
      const existing = this._value || props.existing
      const result = existing.map(item=>{
        return {img: item.img}
      })
      return result.length ? result : undefined
    },

    _getCountLimit: function () {
      const props = this.data.props
      this.existing = this.data.$list.data.filter((item, ii)=> {
        if (!isAddOne(item)){
          item.index = ii
          return item
        }
      })
      return {
        imgSize: props.imgSize,
        picker: props.picker,
        limit: props.limit,
        thumbnail: props.thumbnail,
        size: this.existing.length,
        existing: this.existing
      }
    },

    // 缩放所有上传的图片
    _scalePics(data){
      const props = this._getCountLimit()
      const upFiles = data || props.existing
      let thumbnail = props.thumbnail
      const realFiles = []
      upFiles.forEach(item => {
        if (item && item.img) {
          if (lib.isString(item)) {
            realFiles.push(item)
          }
          if (lib.isString(item.img)) {
            realFiles.push(item.img)
          }
          if (lib.isString(item.img.src)) {
            realFiles.push(item.img.src)
          }
        }
      })
      
      // 是否缩略图
      if (thumbnail) {
        const every = realFiles.map(img => this._scalePicture(img, props))
        return Promise.all(every).then(res => {
          return res
        })
      } else {
        return new Promise((resolve, rej) => {
          const imgfiles = upFiles.map(item=>{
            return lib.isString(item.img) 
              // isString(item.img)
              ? {img: item.img} 

              // isObject(item.img)
              : {img: item.img.src}  

            // if (lib.isString(item.img)) {
            //   return {img: item.img}
            // }
            // if (lib.isObject(item.img)) {
            //   return {img: item.img.src}
            // }
          })
          return resolve(imgfiles)
        })
      }
    },

    // 缩放一张图片
    _scalePicture(tempFilePaths, props) {
      const that = this
      const theCanvas = this.canvas
      const thumbnail = props.thumbnail
      const cavsid = this.data.mycanvasId
      let wid = thumbnail.width
      let hgt = thumbnail.height
      return new Promise((resolve, rej) => {
        wx.getImageInfo({
          src: tempFilePaths,
          success: function (res) {
            let ratio = 2;
            let canvasWidth = res.width
            let canvasHeight = res.height;

            if (wid == 0) wid = canvasWidth
            if (hgt == 0) hgt = canvasHeight

            // 保证宽高均在200以内
            while (canvasWidth > wid || canvasHeight > hgt) {
              //比例取整
              canvasWidth = Math.trunc(res.width / ratio)
              canvasHeight = Math.trunc(res.height / ratio)
              ratio++;
            }

            //设置canvas尺寸
            that.setData({
              canvasWidth: canvasWidth,
              canvasHeight: canvasHeight
            }) 

            theCanvas.drawImage(tempFilePaths, 0, 0, canvasWidth, canvasHeight)
            theCanvas.draw(false, setTimeout(() => {
              wx.canvasToTempFilePath({
                canvasId: cavsid,
                fileType: 'jpg',
                success: function (res) {
                  resolve(res)
                },
                fail: function (error) {
                  console.log(error)
                  rej(error)
                }
              }, that)
            }, 100))
            
            //下载canvas图片
          },
          fail: function (error) {
            console.log(error)
            rej(error)
          }
        })
      })
    },
    
    upload: async function(param, cb) {
      let props = this.data.props
      let upFiles = this._getCountLimit().existing
      // let upFiles = param ? param : this._getCountLimit().existing

      if (typeof param === 'function') {
        cb = param
        param = {}
      }

      if (this.chooseImages) {
        this.chooseImages = false
      } else {
        return upFiles
      }

      let imgs = upFiles
      let thumbnail = (param && param.hasOwnProperty('thumbnail') && param.thumbnail) || props.thumbnail
      if (thumbnail) {
        imgs = await this._scalePics(upFiles)
      }

      let $imgs = imgs.map((item, ii)=>{
        return {
          img: {src: (item.tempFilePath||item.img)},
          index: ii
        }
      })
      if (props.server) {
        let _res = await Core.upload({
          url: props.server,
          type: 'img',
          filePath: $imgs
        })

        if (typeof cb === 'function') {
          cb(_res)
        }

        let res = []
        _res.forEach(obj=>{
          if (obj.statusCode == 200 || obj.statusCode == '200'){
            res.push({img: obj.fileID})
          }
        })
        this._value = res
        return res
      }
    },
    chooseWxImage: function (type, param) {
      let that = this
      let props = this.data.props
      let $list = this.data.$list
      let mydata = this.data.$list.data
      let select = parseInt(param.index)
      let countLimit = this._getCountLimit(param)

      let instantUploadImage = props.instantUploadImage  // boolean, default is false
      let uploadVerify = props.uploadVerify // function, default is null
      wx.chooseImage({
        count: countLimit.picker,
        sizeType: ["original", "compressed"],
        sourceType: [type],
        success: function (res) {
          var addImgsPaths = res.tempFilePaths;
          var addImgs = res.tempFiles;
          var addLen = addImgs.length;
          if (addLen) {
            that.chooseImages = true  // 确实选取了图片
            let overNum = select + addLen - countLimit.limit
            let accessImgs = addImgsPaths
            let startIndex = select
            let offset = overNum < 0 ? addLen+1 : countLimit.limit-select
            if (overNum > 0) {
              addImgsPaths.splice(addLen - overNum)
              accessImgs = addImgsPaths
            }

            if (lib.isFunction(uploadVerify)) {
              let tmp = []
              accessImgs.forEach((item, ii) => tmp.push(addImgs[ii]))
              uploadVerify.call(that, tmp, next)
            } else {
              next()
            }

            function next(imgs, cb) {
              let overImgSize = false

              if (typeof imgs === 'function') {
                cb = imgs
                imgs = null
              }

              if (imgs && imgs.length) {
                if (imgs.length !== accessImgs.length) return
                accessImgs = imgs
              }

              for (let ii = 0; ii < accessImgs.length; ii++) {
                let item = accessImgs[ii]
                let size = addImgs[ii].size
                if (size > countLimit.imgSize) {
                  overImgSize = true
                  break;
                }
                mydata[startIndex] = { img: { src: item } }
                startIndex++
              }

              if (overImgSize) {
                let xx = countLimit.imgSize / 1024 / 1024
                xx = 0 | xx
                Core.alert(`图片大小超出`)
                return
              }

              $list.data = mydata
              generateData.call(that, $list)
              if (instantUploadImage) {
                return that.upload(cb)
              }
            }
            
          }
        },
      })
    },

    uploadAction: function (e, param) {
      const that = this
      const $list = this.data.$list
      const uploadBeforeChoose = $list.uploadBeforeChoose

      let uploadChooseConfig = {
        itemList:["从相册中选择", "拍照"],
        itemColor: "#f7982a",
        success: function (res) {
          if (!res.cancel) {
            if (res.tapIndex == 0) {
              that.chooseWxImage("album", param);
            } else if (res.tapIndex == 1) {
              that.chooseWxImage("camera", param);
            }
          }
        }
      }

      if (typeof uploadBeforeChoose === 'function' ) {
        uploadChooseConfig = Object.assign({}, uploadChooseConfig, uploadBeforeChoose.call(that))
      } 

      wx.showActionSheet(uploadChooseConfig)
    },

    showAction: function (e, param) {
      this._getCountLimit()
      const select = parseInt(param.index)
      let existing = lib.clone(this.existing)
      let selected
      existing = existing.map(item => {
        if (item.index === select) selected = item.index
        delete item.dot
        return item
      })
      if (param) {
        const previewPictures = {
          '@list': {
            type: {
              is: 'swiper'
            },
            listClass: 'bs-e3e3e3-list',
            itemClass: 'ss-focus flex-row item padding-normal',
            data: existing
          },
          // itemClass: 'frozen'
        }

        const props = this.data.props
        if (props.modal && lib.isFunction(props.modal)){
          props.modal(previewPictures)
        } else {
          this.popView.reset().bot_full(
            {
              '@list': {
                type: {
                  is: 'swiper'
                },
                listClass: 'bs-e3e3e3-list',
                itemClass: 'ss-focus flex-row item padding-normal',
                data: existing
              },
              // itemClass: 'frozen'
            }
          )
        }

        // const data = this.getData().data
        // let img = ''
        // if (data) {
        //   const index = parseInt(param.index)
        //   const item = data[index]
        //   if (item.img) {
        //     if (lib.isString(item.img)) img = item.img
        //     if (lib.isObject(item.img)) {
        //       img = item.img.src
        //     } 
        //   }
        // }
        // if (img) {
        //   img = 'http://localhost:8600'+img
        //   console.log(img)
        //   wx.previewImage({
        //     current: img, // 当前显示图片的http链接
        //     urls: [img] // 需要预览的图片http链接列表
        //   })
        // }
      }
    },

    deletAction: function (e, param) {
      const props = this.data.props
      if (param) {
        const index = parseInt(param.index)
        let $list = this.data.$list
        let mydata = this.data.$list.data
        if (props.count > 1) {
          mydata[index] = {
            title: '+',
            itemClass: 'uploads-addone',
            tap: 'uploadAction?index=' + index
          }
        } else {
          mydata.splice(index, 1)
        }
        $list.data = mydata
        generateData.call(this, $list, props.deleteCallback)
      }
    }
  }
})
