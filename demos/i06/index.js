//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')

Pager({
  data: {
    targetConfig: {
      itemClass: 'sitem',
      dot: [
        {itemClass: 'badge'}
      ]
    },
    targetConfig1: {
      itemClass: 'sitem',
      dot: [
        {title: 9, itemClass: 'badge len1'}
      ]
    },
    targetConfig2: {
      itemClass: 'sitem',
      dot: [
        {title: 99, itemClass: 'badge len2'}
      ]
    },
    targetConfig3: {
      itemClass: 'sitem',
      dot: [
        {title: 999, itemClass: 'badge len3'}
      ]
    },
    targetConfig4: {
      itemClass: 'sitem',
      dot: [
        {title: '∙∙∙', itemClass: 'badge len4'}
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
