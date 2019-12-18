/**
 * 作者： 天天修改
 * github: webkixi
 * 小程序的模板真是又长又臭
 */
const app = null //getApp()
const Core = require('../core/index')
const lib = Core.lib

// 数据模型
// const defaultListOptions = {
//   data: [
//     // String / Json 
//   ],
//   listClass: '',
//   listStyle: '',
//   itemClass: '',
//   itemStyle: '',
//   itemMethod: {},
// }

Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
    addGlobalClass: true
  },
  behaviors: [Core.listBehavior(app, 'list')],
  methods: {}
});