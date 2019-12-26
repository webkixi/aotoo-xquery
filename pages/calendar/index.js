//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')

Pager({
  data: {
    calendarConfig: {
      $$id: 'calendar',
      mode: 1,
      type: 'single',
      total: 180,
      festival: true,
      tap: 'onTap'
    }
  },

  onTap(e, param, inst){
    const ca = this.getElementsById('calendar')
    let value = ca.getValue()
    console.log(value)
  }
})
