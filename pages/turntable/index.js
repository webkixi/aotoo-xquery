/**
 * xquery是一套小程序的开发工具库
 * 说明: 在小程序中搜索 xquery，更多demo和说明
 * 源码: https://github.com/webkixi/aotoo-xquery
 * 小程序代码片段: https://developers.weixin.qq.com/s/oONQs1mf7Uem
 */
const Pager = require('../../components/aotoo/core/index')
const turntable = require('../../components/modules/turntable')
let source = require('../common/source')

Pager({
  data: {
    turntableConfig: turntable({
      data: [{
          title: '三等奖'
        },
        '',
        '二等奖',
        '',
        {rate: 40, img: { src: '/images/chat.png', mode: 'widthFix', itemStyle: 'width: 28px;height:28px;' } },
        '',
        '',
        '',
        '',
        '',
      ],
      final(param){
        console.log(param);
      },
    }),
    ...source
  }, 
})
