/**
 * xquery是一套小程序的开发工具库
 * 说明: 在小程序中搜索 xquery，更多demo和说明
 * 源码: https://github.com/webkixi/aotoo-xquery
 * 小程序代码片段: https://developers.weixin.qq.com/s/KSoWN2mE7Lem
 */
const Pager = require('../../components/aotoo/core/index')
let mkTab = require('../../components/modules/tabside')
let source = require('../common/source')

Pager({
  data: {
    tabConfig: mkTab('tabselect', {
      data: [
        {title: '选项-1'},
        {title: '选项-2'},
        {title: '选项-3'},
        {title: '选项-4'},
        {title: '选项-5'},
        {title: '选项-6'},
        {title: '选项-7'},
        {title: '选项-8'},
        {title: '选项-9'}
      ]}
    ),
    ...source
  },
  onReady(){
    let $tab = this.getElementsById('tabselect')
    $tab.hooks.once('set-content', function(param){
      if (param.id === 1) {
        this.update({
          title: '我是选项一',
          img: {
            src: '/images/mk1.jpeg',
            mode: 'aspectFit'
          }
        })
      }
      if (param.id === 2) {
        this.update({
          img: {src: '/images/xquery.png', mode: 'aspectFit'},
          title: '我是选项二'
        })
      }
      if (param.id === 3) {
        this.update({
          title: '我是选项三',
          img: {src: '/images/mk3.jpeg', mode: 'aspectFit'}
        })
      }
    })
  }
})
