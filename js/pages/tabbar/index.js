/**
 * xquery是一套小程序的开发工具库
 * 说明: 在小程序中搜索 xquery，更多demo和说明
 * 源码: https://github.com/webkixi/aotoo-xquery
 * 小程序代码片段: https://developers.weixin.qq.com/s/61dsH0mn7zed
 */
const Pager = require('../../components/aotoo/core/index')
let lib = Pager.lib
let nav = lib.nav
let mkTabbar = require('../../components/modules/tabbar')
let source = require('../common/source')

let datas = [
  {reddot: 9999, selected: true, aim: 'onTap?url=../calendar/index', img: '/images/chat.png', title: '微信'},  // tap => bind:tap
  {reddot: 999, aim: 'onTap?url=../tab/index', img: '/images/chat.png', title: '通信录',},  // tap => bind:tap
  {reddot: 99, aim: 'onTap?url=../itempop/index', img: '/images/chat.png', title: '发现'},  // tap => bind:tap
  {reddot: 9, aim: 'onTap?url=../indexlist/index', img: '/images/chat.png', title: '我'},  // tap => bind:tap
  {reddot: '00', aim: 'onTap?url=../indexlist/index', img: '/images/chat.png', title: '我'},  // tap => bind:tap
]


Pager({
  data: {
    tabConfig: mkTabbar('tabselect', datas),
    ...source
  }
})
