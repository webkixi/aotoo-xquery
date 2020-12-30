//index.js
//获取应用实例
const Pager = require('../../components/aotoo/core/index')
const mkLocker = require('../../components/modules/locker')
let source = require('../common/source')


Pager({
  data: {
    lockConfig: mkLocker(function(values) {
      console.log(values);
      this.warning()
    }),
    ...source
  }
})
