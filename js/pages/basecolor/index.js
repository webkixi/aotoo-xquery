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
      async onPreview(res){
        const {tempFilePaths} = res
        const resImageObj = await catchPicturMainColor(tempFilePaths[0])
        const bgColorStyle = 'background-color:' + resImageObj.rgba+';'
        const targetStyle = oriStyle.replace('background-color: #fff;', bgColorStyle)
        this.activePage.setData({
          'demoConfig.itemStyle': targetStyle
        })
      }
    }),

    demoConfig: {
      itemStyle: oriStyle
    },

    ...source
  },
  onReady(){
    const uploader = this.getElementsById('uploader_img')
  }
})
