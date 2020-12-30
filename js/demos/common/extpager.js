const Pager = require('../../components/aotoo/core/index')

// 批量补充Pager的配置
let commonConfig = {
  // 是每个页面支持分享
  onShareAppMessage: function () {}
}
// getElementsById
let fakePager = function (config) {
  let targetObject = Object.assign({}, config, commonConfig)
  Pager(targetObject)
}

Object.keys(Pager).forEach(key=>{
  fakePager[key] = Pager[key]
})

module.exports = fakePager