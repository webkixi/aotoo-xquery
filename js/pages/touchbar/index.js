//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
const mkTouchbar = require('../../components/modules/touchbar')

const touchList = [
  {img: {src: '/images/chat.png', itemStyle: 'width: 32px;'}, target: 'logo.jpg'},
  {title: '众筹', target: 'mk1.jpeg'},
  {title: '众筹', target: 'mk2.jpeg'},
  {title: '众筹', target: 'mk3.jpeg'},
  {title: '众筹', target: 'wxzan.jpg'},
  {title: '众筹', target: 'xquery.png'},
]

Pager({
  data: {
    showpan: {
      $$id: 'showpan',
      itemClass: 'show-pan',
      img: {
        src: '/images/huawei.jpg'
      }
    },

    touchbarConfig: mkTouchbar({
      data: touchList,
      enableTips: false,
      tap(e, param, inst){
        let showpan = this.activePage.getElementsById('showpan')
        showpan.update({
          img: {src: `/images/${param.target}`}
        })
      }
    }, true),

    touchbarConfig1: mkTouchbar({
      data: touchList,
      enableTips: false,
      tap(e, param, inst){
        let showpan = this.activePage.getElementsById('showpan')
        showpan.update({
          img: {src: `/images/${param.target}`}
        })
      }
    }, true),
  },

  onReady(){
    // const $item = this.getElementsById('isItem')
    // setTimeout(() => {
    //   $item.update({
    //     title: 'item组件可以实现非常丰富的ui结构'
    //   })
    // }, 3000);
  }
})
