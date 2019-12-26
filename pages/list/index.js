//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')

Pager({
  data: {
    listConfig: {
      $$id: 'isList',
      listClass: 'anyListClassName',
      itemClass: 'list-item-class',
      itemMethod: {
        tap(e, param, inst){
          console.log(e)
        }
      },
      data: [
        'xquery的基础item组件',
        {title: 'xquery的基础item组件', itemClass: 'aaa'},
        'xquery的基础item组件',
        'xquery的基础item组件',
        'xquery的基础item组件',
        'xquery的基础item组件',
        'xquery的基础item组件',
        'xquery的基础item组件',
        'xquery的基础item组件',
        'xquery的基础item组件',
        'xquery的基础item组件',
      ]
    }
  },

  onReady(){
    const $item = this.getElementsById('isList')
    // setTimeout(() => {
    //   $item.update({
    //     title: 'item组件可以实现非常丰富的ui结构'
    //   })
    // }, 3000);
  }
})
