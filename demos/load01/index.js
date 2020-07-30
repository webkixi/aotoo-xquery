//index.js
//获取应用实例
const app = getApp()
const Pager = require('../common/extpager')

Pager({
  data: {
    loading01: {itemClass: 'loading01 buttonx', title: 'loading01'},
    loading02: {itemClass: 'loading02 buttonx', title: 'loading02'},
    loading03: {itemClass: 'loading03 buttonx', title: 'loading03'},
    loading04: {itemClass: 'loading04 buttonx', title: 'loading04'},
    loading05: {itemClass: 'loading05 buttonx', title: 'loading05'},
    loading06: {itemClass: 'loading06 buttonx', title: 'loading06'},
    loading07: {itemClass: 'loading07 buttonx', title: 'loading07'},

    targetConfig: {
      listClass: 'boxer',
      data: [
        {itemClass: 'loading01', title: {title: 'loading01', itemClass: 'desc'}},
        {itemClass: 'loading02', title: {title: 'loading02', itemClass: 'desc'} },
        {itemClass: 'loading03', title: {title: 'loading03', itemClass: 'desc'} },
        {itemClass: 'loading04', title: {title: 'loading04', itemClass: 'desc'} },
        {itemClass: 'loading05', title: {title: 'loading05', itemClass: 'desc'} },
        {itemClass: 'loading06', title: {title: 'loading06', itemClass: 'desc'} },
        {itemClass: 'loading07', title: {title: 'loading07', itemClass: 'desc'} },
      ]
    },
  },
  onLoad(param) {
    let pageTitle = param.pageTitle
    if (pageTitle) {
      wx.setNavigationBarTitle({
        title: pageTitle
      })
    }
  }
})
