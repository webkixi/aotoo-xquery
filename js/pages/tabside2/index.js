/**
 * xquery是一套小程序的开发工具库
 * 说明: 在小程序中搜索 xquery，更多demo和说明
 * 源码: https://github.com/webkixi/aotoo-xquery
 * 小程序代码片段: https://developers.weixin.qq.com/s/KSoWN2mE7Lem
 */
import {createSideTab} from '../../components/modules/tabsidepro'
const Pager = require('../../components/aotoo/core/index')
const source = require('../common/source')

Pager({
  data: {
    tabConfig: createSideTab({
      data: [
        {title: '标签1', content: '内容1'},
        {title: '标签2', content: '内容2'},
        {title: '标签3', content: {
          "@list": {
            data: [
              {title: '1'},
              {title: '2'},
              {title: '3'},
              {title: '4'},
            ]
          }
        }},
        {title: '标签4', content: {
          title: '内容4', 
          img: {src: '/images/mk1.jpeg', mode: 'widthFix', itemStyle: 'width: 200rpx;'}
        }},
      ],
      mode: 2,  // mode=1 swiper, mode=2 scroll
      tap(e){
        /** 菜单栏点击时触发 */
      },
      bindchange(e){
        /** 右侧swiper滑动时触发 */
      }
    }),
    ...source
  }
})