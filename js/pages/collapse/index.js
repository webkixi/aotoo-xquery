/**
 * xquery是一套小程序的开发工具库
 * 说明: 在小程序中搜索 xquery，更多demo和说明
 * 源码: https://github.com/webkixi/aotoo-xquery
 * 小程序代码片段: https://developers.weixin.qq.com/s/oONQs1mf7Uem
 */
const Pager = require('../../components/aotoo/core/index')
const mkCollapse = require('../../components/modules/collapse')
let source = require('../common/source')  

Pager({
  data: {
    collapsConfig: mkCollapse({
      data: [
        {title: '默认选中', selected: true, content: '希望疫情快点过去'}, 
        {title: '2', content: [
          {title: '点我', aim(){Pager.alert('响应事件')}},
          {title: 'y'},
          {title: 'z'},
        ]},
        { title: ' ',
          img: {src: '/images/chat.png', itemStyle: 'width: 30px;' },
          content: '在家呆着就是为社会做贡献!'
        },
        { title: '无效状态，不能点击', disabled: true },
        { title: '延时动态更新', content: 'xquery是一个小程序开发库', attr: {id: 'change'} },
        { title: '3', content: {
          title: '关注小程序',
          img: {src: '/images/xquery.png', itemStyle: 'width: 120px;'}
        }}, 
        { title: '你愿意...', content: {
          title: '咖啡就不要了，支持一杯豆浆也好的啊！',
          img: {src: '/images/wxzan.jpg', itemStyle: 'width: 200px;'}
        }}, 
        { title: '点我我就无效', attr: {id: 'disabled'}}, 
      ],
      tap(e, param){
        let ct = e.currentTarget
        let ds = ct.dataset
        let id = ds.id
        if (id === 'disabled') {
          this.disabled(true)
        }
        if (id === 'change') {
          setTimeout(() => {
            this.content('能很方便实现小程序的各种UI')
            setTimeout(() => {
              this.content([
                '关注我的小程序',
                '需要你的支持!'
              ])
              setTimeout(() => {
                this.content({
                  title: '点击放大图片',
                  img: {src: 'http://www.agzgz.com/myimgs/xquery.png', preview: true}
                })
              }, 2000);
            }, 2000);
          }, 2000);
        }
      },
    }),
    ...source
  }
})
