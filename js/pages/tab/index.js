/**
 * xquery是一套小程序的开发工具库
 * 说明: 在小程序中搜索 xquery，更多demo和说明
 * 源码: https://github.com/webkixi/aotoo-xquery
 * 小程序代码片段: https://developers.weixin.qq.com/s/61dsH0mn7zed
 */
const Pager = require('../../components/aotoo/core/index')
let lib = Pager.lib
let source = require('../common/source')


function mkTab(id=lib.suid('step_'), options) {
  return {
    $$id: id,
    listClass: 'tab-header',
    itemClass: 'tab-item',
    data: (
      options || [
        {title: '选项-1', tap: 'onTap?id=1'},  // tap => bind:tap
        {title: '选项-2', aim: 'onTap?id=2'},  // aim => catch:tap
        {title: '选项-3', tap: 'onTap?id=3'},
      ]
    ),
    footer: {title: '', itemClass: 'tab-content'},
    methods: {
      __ready(){
        this.find({title: '选项-1'}).addClass('active')
        this.find('.tab-content').update({
          title: '我是选项一',
          img: {src: '/images/mk1.jpeg', itemStyle: 'width: 100px;', mode: 'aspectFit'}
        })
      },
      onTap(e, param, inst){
        if (inst) {
          inst.siblings().removeClass('active')
          inst.addClass('active')
        }
        switch(param.id) {
          case '1':
            this.footer.reset().update({
              title: '我是选项一',
              img: {src: '/images/mk1.jpeg', itemStyle: 'width: 100px;', mode: 'aspectFit'}
            })
            break;
          case '2':
            this.footer.reset().update({
              img: {src: '/images/xquery.png', itemStyle: 'width: 100px;', mode: 'aspectFit'},
              title: '我是选项二，顺序变了'
            })
            break;
          case '3':
            this.footer.reset().update({
              title: '我是选项三',
              img: {src: '/images/mk3.jpeg', itemStyle: 'width: 100px;', mode: 'aspectFit'}
            })
            break;
        }
      }
    }
  }
}

Pager({
  data: {
    tabConfig: mkTab('tabselect'),
    ...source
  },
})
