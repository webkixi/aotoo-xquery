/**
 * xquery是一套小程序的开发工具库
 * 说明: 在小程序中搜索 queryui，更多demo和说明
 * 源码: https://github.com/webkixi/aotoo-xquery
 */
const Pager = require('../../components/aotoo/core/index')
const mkChecklist = require('../../components/modules/checklist')
const mkDropdown = require('../../components/modules/dropdown')
let source = require('../common/source')

const checkListConfig = {
  "@list": mkChecklist({
    containerClass: 'checklist-container',
    value: ['1'],
    data: [
      {title: 'aaa', value: '1', idf: 'aaa', checkListOption: {value: ['1-1']}},
      {title: '你好', value: '1-1', parent: 'aaa'},
      {title: '你妹', value: '1-2', parent: 'aaa'},

      {title: 'bbb', value: '2', idf: 'bbb', checkListOption: {value: ['2-2']}},
      {title: '你好', value: '2-1', parent: 'bbb'},
      {title: '你妹', value: '2-2', parent: 'bbb'},

      {title: 'ccc', value: '3', idf: 'ccc', checkListOption: {value: ['3-1']}},
      {title: '你好', value: '3-1', parent: 'ccc'},
      {title: '你妹', value: '3-2', parent: 'ccc'},

      {title: 'ddd', value: '4', idf: 'ddd', checkListOption: {value: ['3-1']}},
      {title: '你好', value: '4-1', parent: 'ddd', idf: 'fff', checkListOption: {checkedType: 2}},
      {title: '你好', value: '4-2', parent: 'fff'},
      {title: '你好', value: '4-3', parent: 'fff'},
      {title: '你好', value: '4-4', parent: 'fff'},
      {title: '你好', value: '4-5', parent: 'fff'},
      {title: 'eee', value: '4-2', parent: 'ddd', idf: 'eee', checkListOption: {checkedType: 2}},
      {title: '微信', value: '5-1', parent: 'eee'},
      {title: '抖音', value: '5-2', parent: 'eee'},
      {title: '淘宝', value: '5-3', parent: 'eee'},
    ],
    tap(param) {
      if (param.tapItem && param.tapItem.checkedType !== 2) {
        this.activePage['xxx'].closePop()
      }
      if (param.value === '3') {
        this.clear('1')
      }
      console.log(param);
    },
  }, true)
}

Pager({
  data: {
    tabConfig: mkDropdown({
      id: 'xxx',
        data: [
        {title: '选项-1'},  // tap => bind:tap
        {title: '选项-2'},  // aim => catch:tap
        {title: '选项-3'},
        {title: '选项-3'},
      ],
      tap(item, index){
        if (index === 0) {
          this.updateContent({ ...checkListConfig })
          let title = this.getTitle()
          // console.log(title);
        }
      }
    }),
    ...source
  },
})
