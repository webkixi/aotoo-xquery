//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
const mkCheckList = require('../../components/modules/checklist')

Pager({
  data: {
    checkListConfig: mkCheckList({
      id: 'xxx',
      checkedType: 2,
      isSwitch: true,
      value: ['333'],
      data: [
        {title: '222', value: '222'},
        {title: '333', value: '333'},
        {title: '444', value: '444'},
        '========',
        {title: '666', value: '666'},
        {title: '777', value: '777'},
        {title: '888', value: '888'},
      ]
    })
  },

  onReady(){
    let xxx = this.xxx
    xxx.tap = function(allv) {
      console.log('=======0000', allv);
    }
  }
})
