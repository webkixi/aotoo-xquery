//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
let source = require('../common/source')
import createCalendar, {getYmd, lunar} from '../../components/modules/calendar/index'

const today = getYmd()
const lDate = lunar.solar2lunar(today.year, today.month, today.day)
today.lunarDate = lDate

const startDay = today.offset(3)
const endDay = today.offset(7)

Pager({
  data: {
    calendarConfig: createCalendar({
      mode: 1,  // 使用scroll-view展示日历
      type: 'range',  // 区间选择
      value: [startDay, endDay], 
      rangeTip: ['入住', '离店'],  // 默认区选的头、尾提示
      total: 180,  // 展示天数
      tap(e, param, inst){  // 点击后的回调方法
        console.log(param);
      }, 
    }),
    ...source
  }
})
