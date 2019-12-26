//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')

Pager({
  data: {
    itemConfig: {
      $$id: 'isItem',
      title: 'xquery的基础item组件',
      itemClass: 'anyClassName'
    }
  },

  onReady(){
    const $item = this.getElementsById('isItem')
    setTimeout(() => {
      $item.update({
        title: 'item组件可以实现非常丰富的ui结构'
      })
    }, 3000);
  }
})
