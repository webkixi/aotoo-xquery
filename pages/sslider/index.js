//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
const mkSslider = require('../../components/modules/sslider')
let source = require('../common/source')

Pager({
  data: {
    screenConfig: mkSslider({
      bindchange(value){
        console.log(value);
      }
    }),
    ...source
  },
})
