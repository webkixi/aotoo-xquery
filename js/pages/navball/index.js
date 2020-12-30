//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
const mkNavball = require('../../components/modules/navball')
let source = require('../common/source')

const md = `
# 导航球
模仿华为手机的导航球，个人意志很喜欢导航球的便捷  

* 支持自定义单机事件(tap), 默认功能后退一页
* 支持自定义双击事件(doubleTap)，默认回到首页  
* 支持自定义长按事件(longpress)，默认回首页  
`

Pager({
  data: {
    readmeData: {
      itemClass: 'navball-readme',
      "@md": md
    },
    navballConfig: mkNavball({
      tap() {
        console.log('======= 2222');
      },
      doubleTap() {},
      longpress() {}
    }),
    ...source
  },
})