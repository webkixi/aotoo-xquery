//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')

Pager({
  data: {
    htmlConfig: {
      listClass: 'card-it',
      content: `
## aotoo-xquery
xquery是一个小程序的开发工具库  

![xquery](/css/xquery.png#mode=aspectFit)
`
    },
  },

  onReady(){}
})
