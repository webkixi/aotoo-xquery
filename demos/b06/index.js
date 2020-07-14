//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
const mkButton = require('../../components/modules/button')

const buttonConfig = mkButton({
  id: 'button',
  title: 'Button',
  tap(){
    if (this.disabled) return
    this.loading()
    setTimeout(() => {
      this.loaded()
    }, 2000);
  }
})

Pager({
  data: {
    targetConfig: buttonConfig
  },
  onReady(){
    let $button = this['button']
    setTimeout(() => {
      $button.loading()
      setTimeout(() => {
        $button.loaded()
      }, 2000);
    }, 1000);
  }
})
