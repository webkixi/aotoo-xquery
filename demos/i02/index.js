//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')

Pager({
  data: {
    targetConfig: {
      itemClass: 'sitem cat',
      img: {src: 'https://gw.alipayobjects.com/zos/alicdn/9nepwjaLa/Result.svg', itemStyle: 'width: 100px'},
      title: '标题',
    },
  },
  onLoad(param) {
    let pageTitle = param.pageTitle
    if (pageTitle) {
      wx.setNavigationBarTitle({
        title: pageTitle
      })
    }
  }
})
