//index.js
//获取应用实例
const app = getApp()
import { catchPicturMainColor, uploadImages, uploadVideos, uploadFiles } from '../../components/modules/uploader/index'
const Pager = require('../../components/aotoo/core/index')
const source = require('../common/source')
const oriStyle = 'width: 200px; height: 200px; margin-top: 2em; border: 1px solid red; background-color: #fff;'

Pager({
  data: {
    uploaderConfig: uploadImages({
      count: 1,
      $$id: 'uploader_img',
    }),

    uploaderConfig1: uploadImages({
      count: 3,
      $$id: 'uploader_img1',
    }),

    uploaderConfig2: uploadImages({
      limit: 9,
      $$id: 'uploader_img2',
      listClass: 'friends'
    }),

    uploaderVideo: uploadVideos({
      $$id: 'uploader_mov',
    }),

    uploaderCloud: uploadImages({
      $$id: 'uploader_img_cloud',
    }),

    md: {
      content: `
# upload方法
通过设置\`$$id\`可以获取上传组件的实例，每个上传实例均可以使用upload方法，该方法是\`wx.upload\`及\`wx.cloud.uploadFile\`的混合模式，
参数请参考官方
`,
      listClass: 'uploader-readme'
    },

    ...source
  },
  onTap(e){
    const cloudUpInstance = this.getElementsById('uploader_img_cloud')
    wx.showModal({
      title: '说明',
      content: '没有初始化云空间，不会真实上传，请查看源码说明'
    })
    cloudUpInstance.upload({
      config: {env: 'xxxxxx'}   // 云空间 id
    })
  }
})
