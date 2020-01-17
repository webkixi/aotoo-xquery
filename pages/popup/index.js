//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
let source = require('../common/source')

Pager({
  data: {
    popConfig: {
      $$id: 'modal',
      title: '窗口标题'
    },
    ...source
  },

  onReady(){
    const modal = this.getElementsById('modal')
    setTimeout(() => {
      modal.pop_top({
        title: '飞雪连天射白鹿'
      })

      setTimeout(() => {
        modal.reset().pop_bot({
          title: '笑书神侠倚碧鸳'
        })

        setTimeout(() => {
          modal.reset().toast_mid({
            title: '别人笑我太疯癫'
          })

          setTimeout(() => {
            modal.reset().message({
              title: '我笑他人看不穿'
            })
          }, 2000);
        }, 1000);
      }, 1000);
    }, 1000);
  }
})
