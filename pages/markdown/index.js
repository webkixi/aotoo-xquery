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

这个项目包含完整的核心文件、一部分组件及基础demo, 你可以调整 app.json/pages 中页面的顺序在小程序开发工具中查看效果  

为了保持这个项目的干净纯粹，并没有做更多的东西  

可以关注下面这个小程序，查看更多的示例及说明

![xquery](/css/xquery.png#mode=aspectFit)
`
    },
  },

  onReady(){}
})
