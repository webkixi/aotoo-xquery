/**
 * xquery是一套小程序的开发工具库
 * 说明: 在小程序中搜索 xquery，更多demo和说明
 * 源码: https://github.com/webkixi/aotoo-xquery
 * 小程序代码片段: https://developers.weixin.qq.com/s/oONQs1mf7Uem
 */
const Pager = require('../../components/aotoo/core/index')
const lib = Pager.lib
let source = require('../common/source')
const mkAppstoreList = require('../../components/modules/appstorelist')

Pager({
  data: {
    appstoreList: mkAppstoreList([
      {
        title: [
          'Demo',
          '仿appstore列表'
        ],
        IMG: { src: 'http://www.agzgz.com/myimgs/other/long.jpg'},
        "@md": `
###### 仿今日推荐
# 仿appstore今日推荐  

本以为会比较简单，没想到却出乎意料的难，扣各种细节，再加上小程序动画性能不给力，只能说尽力了。  

这个版本依然不算完美，下滑关闭没做，左滑关闭也不算流畅，demo图片也不好找。  

吐槽一下小程序事件方法不能动态阻止冒泡，像JS那样就能够很方便实现交互，现在的做法是动态换模板，因为必须将bind方法改为catch方法
阻止弹层的滑动影响到底层的滑动，结果就是弹出弹层时，图片会闪烁一下

小程序的动画能力真的还需要更加加强，本来计划用wxs来写动画交互效果，后来想想还是放弃了，wxs这货太难调试，api方法又不完善
本以为会比较简单，没想到却出乎意料的难，扣各种细节，再加上小程序动画性能不给力，只能说尽力了。  

这个版本依然不算完美，下滑关闭没做，左滑关闭也不算流畅，demo图片也不好找。  

吐槽一下小程序事件方法不能动态阻止冒泡，像JS那样就能够很方便实现交互，现在的做法是动态换模板，因为必须将bind方法改为catch方法
阻止弹层的滑动影响到底层的滑动，结果就是弹出弹层时，图片会闪烁一下

小程序的动画能力真的还需要更加加强，本来计划用wxs来写动画交互效果，后来想想还是放弃了，wxs这货太难调试，api方法又不完善
本以为会比较简单，没想到却出乎意料的难，扣各种细节，再加上小程序动画性能不给力，只能说尽力了。  

这个版本依然不算完美，下滑关闭没做，左滑关闭也不算流畅，demo图片也不好找。  

吐槽一下小程序事件方法不能动态阻止冒泡，像JS那样就能够很方便实现交互，现在的做法是动态换模板，因为必须将bind方法改为catch方法
阻止弹层的滑动影响到底层的滑动，结果就是弹出弹层时，图片会闪烁一下

小程序的动画能力真的还需要更加加强，本来计划用wxs来写动画交互效果，后来想想还是放弃了，wxs这货太难调试，api方法又不完善
`
      },
      {
        IMG: { src: 'http://www.agzgz.com/myimgs/other/gtx1.jpg', dark: true },
        title: [
          'Demo',
          '仿appstore列表'
        ],
      },
      {
        title: [
          'Demo',
          '仿appstore列表',
          '好好学习，天天向上'
        ],
        IMG: { src: 'http://www.agzgz.com/myimgs/other/gtx2.jpg', dark: true },
      },
      {
        title: [
          'Demo',
          '仿appstore列表'
        ],
        img: { src: 'http://www.agzgz.com/myimgs/other/gtx1.jpg' },
      },
      { 
        img: { src: 'http://www.agzgz.com/myimgs/other/long.jpg'},
        title: [
          '演示',
          '仿appstore列表',
          '一直很喜欢appstore的效果',
        ],
      },
      { 
        IMG: { src: 'http://www.agzgz.com/myimgs/other/long.jpg'},
        title: '仿appstore列表',
        banner: {
          img: { src: '/images/chat.png', itemStyle: 'width: 32px;' },
          title: 'banner展示的demo',
        }
      },
      {
        title: [
          '今日主题',
          '关于如何网上上课',
          {
            img: {src: '/images/chat.png'},
            title: [
              '好好学习啊',
              '才能天天向上的嘛'
            ]
          },
          'ccccc',
          'ccccc',
          'ddddd',
          'ddddd',
          'ddddd',
          'ddddd',
          'ddddd',
        ]
      },
      '22222',
    ]),
    ...source
  },
})
