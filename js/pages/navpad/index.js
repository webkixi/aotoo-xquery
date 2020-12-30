/**
 * 源码: https://github.com/webkixi/aotoo-xquery
 */
const Pager = require('../../components/aotoo/core/index')
const mkNavpad = require('../../components/modules/navpad')

Pager({
  data: {
    navpadConfig: mkNavpad({
      id: 'abc'
    }),
  }
})
