//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
const lib = Pager.lib

Pager({
  data: {

    listConfig: {
      data: [
        {
          title: '导航面板',
          url: '/pages/navpad/index#class=nav-btn'
        },

        {
          title: '日历',
          url: '/pages/calendar/index#class=nav-btn'
        },

        {
          title: '列表demo',
          url: '/demos/list01/index#class=nav-btn'
        },

        {
          title: '文档说明',
          url: '/pages/markdown/index#class=nav-btn'
        },
      ],
      itemClass: 'nav-item',
    }
  }
})
