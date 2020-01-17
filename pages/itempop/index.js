//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
let source = require('../common/source')

const popConfig = {
  $$id: 'modal',
  title: 'item组件实现的pop弹窗',
  itemClass: 'pop-class',
  body: [
    {"@md": ` ### 内容部分支持图文，列表，表单等结构 `}
  ],
  footer: [
    {title: '取消', aim: 'btn1'},
    {title: '同意', aim: 'btn2'},
  ],
  methods: {
    fromtop(){
      this.addClass('moveit')
    },

    close(){
      let thePager = this.activePage
      this.addClass('backtop')
      setTimeout(() => {
        this.removeClass('moveit backtop')
        thePager.setData({mask: false})
      }, 500);
    },

    btn1(){
      Pager.alert('你点击了取消，1秒后关闭')
      setTimeout(() => {
        this.close()
      }, 1000);
    },
    btn2(){
      Pager.alert('你点击了同意')
    }
  }
}


Pager({
  data: {
    mask: false,
    popConfig,
    ...source
  },

  closePop(e){
    let $modal = this.getElementsById('modal')
    $modal.close()
  },

  showPop(e){
    let $modal = this.getElementsById('modal')
    this.setData({mask: true})
    $modal.fromtop()
  },
})
