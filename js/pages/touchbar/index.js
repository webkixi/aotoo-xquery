//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
const createTouchbar = require('../../components/modules/touchbarpro')
const source = require('../common/source')

Pager({
  data: {
    listConfig: createTouchbar({
      data: ['a', 'b', 'c', 'd', 'e', 'f'],
      tap(){
        console.log('======= 333');
      }
    }),
    ...source
  }
})

