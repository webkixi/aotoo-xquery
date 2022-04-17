//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
const modal = require('../../components/modules/modal')
const lib = Pager.lib

const modalcfg = modal({$$id: 'modalx'})

Pager({
  data: {
    modal: modalcfg,

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
          title: '弹窗',
          itemClass: 'nav-btn',
          tap(){
            wx.modalx.showModal({
              title: '兄dei，1分也是爱',
              height: 65,
              width: 85,
              content: {
                img: {src: '/images/wxzan.jpg'}
              }
            })
          }
        },

        {
          title: '弹窗1',
          url: '/pages/modal/index#class=nav-btn'
        },

        {
          title: '左滑菜单',
          url: '/pages/slip1/index#class=nav-btn'
        },

        {
          title: '列表demo',
          url: '/demos/list01/index#class=nav-btn'
        },

        {
          title: '文档说明(markdown)',
          url: '/pages/markdown/index#class=nav-btn'
        },

        {
          title: 'HTML',
          url: '/pages/html/index#class=nav-btn'
        },

        {
          title: 'UI示例(miaoui)',
          url: 'mp://wx3fb11e2debd4bb79#class=nav-btn plus',
          img: {src: '/images/miaoui.jpg'},
        },
        
        {
          title: '日历示例(魔芋日历)',
          url: 'mp://wxa57a87d303a63c7d#class=nav-btn plus',
          img: {src: '/images/xquery.png'},
        },
      ],
      itemClass: 'nav-item',
    }
  },
  onReady(){
    wx.modalx.showModal({
      title: '兄dei，1分也是爱',
      height: 65,
      width: 85,
      content: {
        img: {src: '/images/wxzan.jpg'}
      }
    })
  }
})
