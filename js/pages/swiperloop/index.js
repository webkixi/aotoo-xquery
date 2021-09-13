//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
let source = require('../common/source')
const sysInfo = wx.getSystemInfoSync()

const hasAppend = []

Pager({
  data: {
    containerStyle: null,
    listConfig: {
      listClass: 'swloop-list',
      itemClass: 'swloop-list-item',
      type: {
        is: 'swiper-loop',
        vertical: true,
        autoHide: false,
        bindchange: 'swiperChange',
        current: 0,
        duration: 300,
        current: 0,
        appendItems(context){
          const oriData = [8,9,10]
          const targetData = []
          oriData.forEach(item=>{
            const hasIt =  hasAppend.includes(item)
            if (!hasIt) {
              hasAppend.push(item)
              targetData.push(item)
            }
          })
          context.add(targetData)
        },

        // 一般不需要设置prependItems，
        // prependItems(context){
        // }
      },
      data: [1,2,3,4,5,6,7]
    },
    // ...source
  },
  onReady(){
    this.setData({containerStyle: `--safe-top: ${sysInfo.safeArea.top+10}px`})
  }
})
