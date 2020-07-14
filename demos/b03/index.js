//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')

Pager({
  data: {
    targetConfig: {
      title: 'Button',
      itemClass: 'button button-pop',
    },
  }
})
