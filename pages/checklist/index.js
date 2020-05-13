//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
const mkCheckList = require('../../components/modules/checklist')

// 两层结构
const levelConfig = mkCheckList({
  id: 'xxx',
  // mode: 3,
  // checkedType: 2,
  // isSwitch: true,
  value: ['333'],
  data: [
    {title: '222', value: '222', idf: '222'},
    {title: '333', value: '333', idf: '333'},

    {title: '444', value: '444', parent: '222'},
    {title: '666', value: '666', parent: '222'},
    {title: '6666', value: '6666', parent: '222'},
    {title: '6666', value: '6661', parent: '222'},
    {title: '6666', value: '6662', parent: '222'},
    {title: '6666', value: '6663', parent: '222'},
    {title: '6666', value: '6664', parent: '222'},
    {title: '6666', value: '6665', parent: '222'},
    {title: '6666', value: '6666', parent: '222'},
    {title: '6666', value: '6667', parent: '222'},
    {title: '6666', value: '6668', parent: '222'},
    {title: '6666', value: '6669', parent: '222'},

    {title: '777', value: '777', parent: '333'},
    {title: '888', value: '888', parent: '333'},
    {title: '8888', value: '8888', parent: '333'},
  ]
})

// 单层结构，分隔符
const splitConfig = mkCheckList({
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

Pager({
  data: {
    checkListConfig: levelConfig
  },

  onReady(){
    let xxx = this.xxx
    xxx.tap = function(allv) {
      console.log('=======0000', allv);
    }

    setTimeout(() => {
      xxx.clear()
    }, 3000);
  }
})
