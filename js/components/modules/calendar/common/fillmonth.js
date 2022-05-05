import {
  calendar as lunar
} from './lunar'

import { 
  getYmd,
  rightDate,
  formatDate,
  newDate,
  sortDates,
  isLeapYear,
  getWeekday,
  getMonthData,
} from '../util/index'

const Pager = require('../../../aotoo/core/index')
const lib = Pager.lib

function adapterCustomDates(data=[]){
  const tmpDates = {}
  data.forEach(date=>{
    let obj = date
    if (lib.isString(date)) {
      obj = {date: date, content: null}
    }
    if (obj.date && obj.content && lib.isObject(obj.content)) {
      obj.timepoint = getYmd(obj.date)
      tmpDates[obj.timepoint.timestr] = obj
    }
  })
  return tmpDates
}

export function fillMonth(timepoint, options={}){
  const defaultDate = options.date        // 默认日期数据
  const isFestival = options.festival     // 开启节日
  const isLunar = options.lunar           // 显示农历
  const isAlignMonth = options.alignMonth // 对齐swiper日历
  const isDisabled = options.disabled     // 全局无效

  let   customFestival = isFestival
  const customDates = adapterCustomDates((options.data||[])) || {}  // 用户自定义日期
  const customDate = options.date || {}

  const today = getYmd()
  const startPoint = ((options.startPoint && options.startPoint.timestr === today.timestr) ? today : options.startPoint) || today
  const endPoint = options.endPoint
  
  const {year, month, day} = timepoint
  const nextMonthDate = rightDate(timepoint, 1)
  const prevMonthDate = rightDate(timepoint, -1)
  
  const currentMonth = getMonthData(year, month)
  const nextMonth = getMonthData(nextMonthDate.year, nextMonthDate.month)
  const prevMonth = getMonthData(prevMonthDate.year, prevMonthDate.month)


  // 当月1号是星期几
  const fistMondayOfWeek = getWeekday(year, month) || 7;  

  // 补充天数
  const patchBefore = fistMondayOfWeek - 1
  const patchAfter  = (42 - patchBefore - currentMonth.length) % 7
  let   pathcBeforeDays = patchBefore ? prevMonth.slice(-1 * patchBefore) : []
  let   pathcAfterDays  = nextMonth.slice(0, patchAfter)
  let   monthDays = currentMonth

  pathcBeforeDays = pathcBeforeDays.map(date=>{
    date.itemClass = 'patch-before invalid'
    date.position = 'patch-before'
    return date
  })

  monthDays = monthDays.map(date=>{
    date.itemClass = 'valid'
    return date
  })

  pathcAfterDays = pathcAfterDays.map(date=>{
    date.itemClass = 'patch-after invalid'
    date.position = 'patch-after'
    return date
  })

  // 去掉节日数组中每个节日的 ’节‘ 字，方便比较
  if (lib.isArray(customFestival) && customFestival.length) {
    customFestival = customFestival.map(fest=>fest.replace('节', ''))
  }


  const fullMonthDays = [].concat(pathcBeforeDays, monthDays, pathcAfterDays)
  return fullMonthDays.map((item, ii)=>{
    let {
      year, 
      month, 
      day, 
      itemClass, 
      timestamp, 
      timestr,
      days,
      position,
    } = item

    const lDate = lunar.solar2lunar(year, month, day)

    // const {
    //   Animal, // 生肖  例：牛
    //   IDayCn, // 中文农历日期  例：十二
    //   Term, // 节气
    //   astro, // 星座 例：狮子座
    //   cDay,  // 阳历几号 
    //   cMonth,  // 阳历月份
    //   cYear,   // 阳历年份
    //   festival, // 节假日  例：建军节
    //   gzDay, // 干支日期 例：辛已
    //   gzMonth, // 干支月份 例：乙未
    //   gzYear,  // 干支年 例：辛丑
    //   isLeap,  // 是否闰年 例：false
    //   isTerm, // 是否节气
    //   isToday,  // 是否当天 
    //   lDay,  // 农历几号，数字
    //   lMonth,  // 农历月份，数字
    //   lYear,   // 农历年份
    //   lunarDate,  // 农历日期，数字字符串
    //   lunarFestival, // 农历节假日 例：端午节
    //   nWeek, // 星期几， 数字
    //   ncWeek, // 星期几，中文 例：星期三
    // } = lunar.solar2lunar(year, month, day)

    if ( timestamp < startPoint.timestamp && month === startPoint.month && day < startPoint.day) {
      if (options.mode !== 3) {
        itemClass += ' invalid'
      }
    }

    let res = {
      // $$id: timestr,
      id: timestr,
      __key: timestr,
      title: today.timestr === timestr ? '今天' : day,
      attr: {year, month, day, timestamp, timestr, days},
      dot: [],
      itemClass,
      lunarDate: lDate,
      solarDate: item
    }

    if (today.timestr === timestr && !position) {
      res.itemClass = res.itemClass + ' today'
    }

    // 是否显示节日
    let festival = lDate.festival || lDate.lunarFestival || lDate.Term || ''
    if (isFestival) {

      if (lib.isArray(customFestival) && customFestival.length) {
        if (!customFestival.includes( festival.replace('节', '') )) {
          festival = false
        }
      }

      if (festival) {
        const lunarFestival = lDate.lunarFestival
        const term = lDate.Term
        const sunerFestival = lDate.festival
        lunarFestival && res.dot.push({
          title: lunarFestival,
          itemClass: 'lunar-date'
        })
        sunerFestival && res.dot.push({
          title: sunerFestival,
          itemClass: 'lunar-date'
        })
        term && res.dot.push({
          title: term,
          itemClass: 'lunar-date'
        })
      }
    }

    // 是否显示农历日期
    if (isLunar) {
      if (isFestival && festival) {
        /** do nothing */
      } else {
        res.dot.push({
          title: (lDate.lunarFestival || lDate.IDayCn),
          itemClass: 'lunar-date'
        })
      }
    }

    // 全局无效
    if (isDisabled) {
      res.disabled = true
      if (res.itemClass.indexOf('invalid') === -1) {
        res.itemClass += ' invalid'
      }
    }

    if (timestamp > endPoint.timestamp && !isDisabled) {
      if (options.mode !== 3) {
        res.disabled = true
        if (res.itemClass.indexOf('invalid') === -1) {
          res.itemClass += ' invalid'
        }
      }
    }

    // 全局配置指定日期内容
    if (lib.isObject(customDate) && !position) {
      res.dot = (res.dot || []).concat((customDate.dot||[]))
      delete customDate.dot

      res.body = (res.body || []).concat((customDate.body||[]))
      delete customDate.body

      res.footer = (res.footer || []).concat((customDate.footer||[]))
      delete customDate.footer

      res = Object.assign({}, res, customDate)
    }

    if (lib.isFunction(customDate) && !position) {
      res = customDate(res) || res
    }

    // 合并用户的数据
    let userDate = customDates[timestr]
    if (userDate) {
      const {timepoint, date, content} = userDate
      const {year, month, day, timestamp, timestr} = timepoint
      res.dot = (res.dot || []).concat((content.dot||[]))
      delete content.dot

      res.body = (res.body || []).concat((content.body||[]))
      delete content.body

      res.footer = (res.footer || []).concat((content.footer||[]))
      delete content.footer

      res = Object.assign({}, res, content)

      if (res.disabled) {
        if (res.itemClass.indexOf('invalid') === -1) {
          res.itemClass += ' invalid'
        }
      }
    }

    if (position) {
      delete res.$$id
    }

    return res
  })
}