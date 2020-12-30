//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
const lib = Pager.lib

Pager({
  data: {
    demosConfig: {
      itemClass: 'nav-item',
      title: '列表demo',
      url: '/demos/list01/index#class=nav-btn'
    },

    pagesConfig: {
      itemClass: 'nav-item',
      title: '文档说明',
      url: '/pages/markdown/index#class=nav-btn'
    }
  }
})
