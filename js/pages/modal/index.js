//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
const mkButton = require('../../components/modules/button')
const modal = require('../../components/modules/modal')
const source = require('../common/source')

const modalcfg = modal({$$id: 'modalx'})

const longContent = `展示需要要的内容
展示需要要的内容展示需要要的内容展示需要要的内容展示需要要的内容展示需要要的内容展示需要要的内容展示需要要的内容展示需要要的内容展示需要要的内容
展示需要要的内容展示需要要的内容展示需要要的内容展示需要要的内容展示需要要的内容展示需要要的内容
展示需要要的内容展示需要要的内容展示需要要的内容展示需要要的内容展示需要要的内容

展示需要要的内容展示需要要的内容展示需要要的内容展示需要要的内容
展示需要要的内容展示需要要的内容展示需要要的内容
展示需要要的内容展示需要要的内容展示需要要的内容

展示需要要的内容展示需要要的内容展示需要要的内容
`

Pager({
  data: {
    modalConfig: modalcfg,
    ...source
  },
  onTap(){
    wx.modalx.showModal({
      title: '普通modal',
      content: '展示需要要的内容',
    })
  },
  onTap1(){
    wx.modalx.showModal({
      title: '无cancel按钮',
      content: '展示需要要的内容',
      showCancel: false
    })
  },
  onTap2(){
    wx.modalx.showModal({
      title: '长文',
      content: longContent,
      showCancel: false,
      showConfirm: false
    })
  },
  onTap3(){
    wx.modalx.showModal({
      title: '自定义宽高',
      content: longContent,
      height: 70,
      showCancel: false,
      showConfirm: false
    })
  },
  onTap4(){
    wx.modalx.showModal({
      title: 'text',
      placeholderText: '展示需要要的内容',
      editable: true,
      success(e){}
    })
  },
  onTap5(){
    wx.modalx.showModal({
      title: 'textarea',
      placeholderText: '编辑需要要的内容',
      editable: 'textarea',
      success(e){}
    })
  },
})
