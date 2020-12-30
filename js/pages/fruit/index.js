/**
 * xquery是一套小程序的开发工具库
 * 说明: 在小程序中搜索 xquery，更多demo和说明
 * 源码: https://github.com/webkixi/aotoo-xquery
 * 小程序代码片段: https://developers.weixin.qq.com/s/oONQs1mf7Uem
 */
const Pager = require('../../components/aotoo/core/index')
const mkFruits = require('../../components/modules/fruit')
let source = require('../common/source')

Pager({
  data: {
    fruitConfig: mkFruits({
      id: 'fruitTable',
      max: 4,
      fruitsData: {
        4: {img: {src: '/images/huawei.jpg', mode: 'widthFix'}}
      }
    },
    function (param) {
      console.log(param);
      console.log(param.value);
    }),
    ...source
  }, 
  onReady(){
    setTimeout(() => {
      this.fruitTable.run()
    }, 2000);
  }
})
