//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
const mkCheckList = require('../../components/modules/checklist')

// 单层结构，分隔符
const splitConfig = {
  id: 'xxx',
  checkedType: 2,
  // isSwitch: true,
  value: ['333'],
  data: [
    {title: '222', value: '222'},
    {title: '333', value: '333'},
    {title: '444', value: '444'},
    '========',
    {title: '666', value: '666'},
    {title: '777', value: '777'},
    ['======', '说明'],
    {title: '888', value: '888'},
  ]
}

// 二级分类
// const splitConfig = {
//   id: 'xxx',
//   value: ['111'],
//   data: [
//     {title: '111', value: '111', idf: 'aaa', checkListOption: {checkedType: 2, value: ['222']}},
//     {title: '222', value: '222', parent: 'aaa'},
//     {title: '333', value: '333', parent: 'aaa'},
//     {title: '444', value: '444', parent: 'aaa'},

//     {title: '555', value: '555', idf: 'bbb', checkListOption: {checkedType: 2, value: ['666', '777']}},
//     {title: '666', value: '666', parent: 'bbb'},
//     {title: '777', value: '777', parent: 'bbb'},
//     {title: '888', value: '888', parent: 'bbb'},
//   ]
// }

Pager({
  data: {
    checkListConfig: mkCheckList(splitConfig)
  },

  onReady(){
    let xxx = this.xxx
    xxx.tap = function(allv) {
      console.log('=======0000', allv);
    }

    setTimeout(() => {
      xxx.clear()  // 清除状态
      setTimeout(() => {
        xxx.checkedAll(false)
        // xxx.setValue(['222', '666']) // 填充数据
        setTimeout(() => {
          let res = xxx.getValue()
          console.log(res);
        }, 1000);
      }, 1000);
    }, 1000);
  }
})
