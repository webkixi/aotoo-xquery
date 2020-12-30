//index.js
//获取应用实例
const app = getApp()
const Pager = require('../common/extpager')

Pager({
  data: {
    targetConfig: {
      itemClass: 'sitem cat',
      img: {src: 'https://gw.alipayobjects.com/zos/alicdn/9nepwjaLa/Result.svg', itemStyle: 'width: 100px'},
      title: '标题',
    },
  },
})
