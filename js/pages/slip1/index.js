//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
let source = require('../common/source')

Pager({
  data: {
    listConfig: {
      $$id: 'isList',

      // 列表容器样式，该容器包裹所有moveable-area容器
      listClass: 'slip-class',

      // 列表项样式，注意：列表项被包含在 moveable-view容器中
      itemClass: 'slip-item-class',
      type: {
        slip: {
          // 定义moveable-area的样式
          // 在item的 slipOptions 属性中定义同名属性将会覆盖此属性
          areaClass: 'shopping-car',
          
          // 定义moveable-view的样式
          // 在item的 slipOptions 属性中定义同名属性将会覆盖此属性
          areaItemClass: 'shopping-car-item',

          // 定义公共菜单
          // 在item中定义同名属性将会覆盖此属性
          // menus: [{String|Object}...]
          menus: [
            '哈哈',
            '嘿嘿'
          ],

          // 定义菜单宽度，可指定设置某一个菜单的宽度，注意：单位统一使用rpx
          // 在item中同名属性将会覆盖此属性
          // menuWidth: [{Number|String}...]
          // 如果某项菜单没有定义宽度，默认使用此属性的 0 子项定义的宽度
          menuWidth: [180, 180, 180]
        }
      },
      data: [

        {
          title: '侧滑菜单，自定义菜单', 
          menus: [
            {title: '嘎嘎'},
            {title: '呵呵'},
            {title: '删除', aim(e, param, inst){ 
              inst.parent().remove()
            }},
          ],
          menuWidth: [120]
        },


        '侧滑菜单，使用公共菜单',


        {
          title: '不弹出侧滑菜单，使用私有空菜单覆盖公共菜单',
          menus: []
        },

        {
          title: '商品内容',
          body: [
            {img: {src: '/images/shoes.jpg', mode: 'widthFix', itemStyle: 'width: 120rpx; height:120rpx; margin-right: 1em;'}},
            {dot: [
              '一双酷酷的鞋子',
              '大概侧滑菜单，并购买这双鞋'
            ]}
          ],
          menuWidth: [120, 120],
          menus: [
            '放弃',
            '购买'
          ],
          itemStyle: 'font-size: 36rpx;background-colro: #fff',
          bodyStyle: 'display: flex; font-size: 28rpx;margin-top: 0.5em;'
        }
      ]
    },
    ...source
  },
})
