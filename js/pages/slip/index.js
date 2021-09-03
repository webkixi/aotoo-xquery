//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
let source = require('../common/source')

Pager({
  data: {
    listConfig: {
      $$id: 'isList',
      listClass: 'slip-class',
      itemClass: 'slip-item-class',
      type: {
        is: 'flatlist',   // 高性能列表； list/scroll/swiper/flatlist/flatswiper/sweper-loop
        slip: {
          width: '100vw',
          height: '180rpx',
          menuWidth: [160, 160, 160],
          menus: [
            {title: '嘿嘿'},
            {title: '删除', aim(e, param, inst){ 
              inst.parent().remove()
            }},
          ],
        },
      },
      data: [
        {
          title: 'queryui的基础item组件111', 
          menus: [
            {title: '嘎嘎'},
            {title: '呵呵'},
            {title: '删除', aim(e, param, inst){ 
              inst.parent().remove()
            }},
          ]
        },
        'queryui的基础item组件',
        'queryui的基础item组件',
        'queryui的基础item组件',
        'queryui的基础item组件',
        'queryui的基础item组件',
        'queryui的基础item组件',
        'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
        // 'queryui的基础item组件',
      ]
    },
    ...source
  },

  onReady(){
    const $list = this.getElementsById('isList')
    setTimeout(() => {
      $list.append([
        'queryui的基础item组件',
        'queryui的基础item组件',
        'queryui的基础item组件',
        'queryui的基础item组件',
      ])
    }, 3000);
  }
})
