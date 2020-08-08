//index.js
//获取应用实例
const app = getApp()
const Pager = require('../common/extpager')
const mkButton = require('../../components/modules/button')

const buttonConfig = mkButton({
  id: 'button',
  title: 'Button',
})

Pager({
  data: {
    targetConfig: buttonConfig
  },
  onReady(){
    let $button = this['button']
    setTimeout(() => {
      $button.countdown(20000)
    }, 1000);
  }
})
