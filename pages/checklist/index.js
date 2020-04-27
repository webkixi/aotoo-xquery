//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
const mkCheckList = require('../../components/modules/checklist')

Pager({
  data: {
    checkListConfig: mkCheckList({
      id: 'xxx',
      checkedType: 1,
      value: ['3'],
      data: [
        {title: 'aaa', value: '1', idf: 'aaa'},
        {title: '你好', value: '1-1', parent: 'aaa'},
        {title: '你妹', value: '1-2', parent: 'aaa'},

        {title: [
          {"@icon": {type: 'success', size: '24', style: 'margin: 4px 10px 0 0'},}, 
          'bbb'
        ], value: '2', idf: 'bbb'},
        {title: 'bbb-1', value: 'bbb-1', parent: 'bbb'},
        {title: 'bbb-2', value: 'bbb-2', parent: 'bbb'},
        {title: 'bbb-3', value: 'bbb-3', parent: 'bbb'},
        {title: 'bbb-4', value: 'bbb-4', parent: 'bbb'},
        {title: 'bbb-5', value: 'bbb-5', parent: 'bbb'},

        
        {title: 'ccc', value: '3', idf: 'ccc', checkListOption: {value: ['3-1'], selectAll: true}},
        { title: 'ccc-1', value: '3-1', idf: 'ccc-1', parent: 'ccc', checkListOption: { value: ['4-1'], checkedType: 2, selectAll: true}},
        {title: 'ccc-1-1', value: '4-1', parent: 'ccc-1'},
        {title: 'ccc-1-2', value: '4-2', parent: 'ccc-1'},
        {title: 'ccc-1-3', value: '4-3', parent: 'ccc-1'},

        {title: 'ccc-2', value: '3-2', idf: 'ccc-2', parent: 'ccc', checkListOption: {checkedType: 2}},
        {title: 'ccc-2-1', value: '5-1', parent: 'ccc-2'},
        {title: 'ccc-2-2', value: '5-2', parent: 'ccc-2'},
        {title: 'ccc-2-3', value: '5-3', parent: 'ccc-2'},
      ]
    })
  },

  onReady(){
    let xxx = this.xxx
    xxx.tap = function(allv) {
      console.log('=======0000', allv);
    }
    // setTimeout(() => {
    //   xxx.clear()
    // }, 2000);

    // setTimeout(() => {
    //   console.log('====== kkkk');
    //   xxx.clear('1')
    //   console.log(xxx.getValue());
    // }, 5000);
  }
})
