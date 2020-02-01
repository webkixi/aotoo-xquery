//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
let source = require('../common/source')

Pager({
  data: {
    htmlConfig: {
      listClass: 'card-it',
      content: `
## 关于本项目    
项目demo包含小程序常用tab, 分类tab，幸运转盘，markdown， html，手势密码，索引列表等  

项目基于xquery库开发，所有组件均可独立使用  

为保持本项目干净， 无包含路由等相关逻辑，请修改app.json，切换不同demo演示

## 关于xquery
xquery是一个小程序的开发工具库, 基于原生开发。关注下面这个小程序，包含各个组件个多的演示及使用说明

![xquery](/css/xquery.png#mode=aspectFit)
`
    },
    ...source
  }
})
