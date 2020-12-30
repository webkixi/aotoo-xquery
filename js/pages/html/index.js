//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
let source = require('../common/source')

Pager({
  data: {
    htmlConfig: {
      options: {
        img: {mode: 'scaleToFill'}
      },
      listClass: 'card-it',
      content: `
<div class="card-container">
  <div class="for-img">
    <img class="card-img" src="https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/2c16238f786e4f93bdb175d7bf21aa47.jpg" />
  </div>
  <h3 class="for-title" style="border: 1px solid red;">
    Redmi K30
  </h3>
  <p class="for-desc">
    120Hz流速屏，全速热爱
  </p>
  <p class="for-price">
    1599元起
  </p>
</div>
`
    },
    ...source
  },

  onReady(){}
})
