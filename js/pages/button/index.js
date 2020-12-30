//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
const mkButton = require('../../components/modules/button')
let source = require('../common/source')

Pager({
  data: {
    itemConfig: mkButton({
      id: 'button',
      title: '按钮',
      itemClass: 'btn',
      tap(){
        if (this.disabled) return
        this.loading()
        setTimeout(() => {
          this.loaded()
        }, 3000);
      }
    }),
    ...source
  },
})
