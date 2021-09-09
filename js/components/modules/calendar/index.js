//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../aotoo/core/index')
const lib = Pager.lib

import { 
  eventSingle,
  eventMultiple,
  eventRange,
  eventIndex,
  checkedDefaultValue
} from './common/checked/index'

import { 
  getYmd,
  rightDate,
  formatDate,
  newDate,
  sortDates,
  isLeapYear,
  getWeekday,
  getMonthData,
  setFestival,
  getFestival,
  setLunarFestival,
  getLunarFestival,
} from './util/index'

import { fillMonth } from './common/fillmonth'

export {
  getFestival,
  getLunarFestival,
  setFestival,
  setLunarFestival,
  getMonthData,
  getYmd,
  rightDate
}

const defaultWeekStr = '一二三四五六日';
function weeksTils(weekStr) {
  const weekdefine = weekStr || defaultWeekStr
  const weeksData = weekdefine.split('').map(day=>day)
  return {
    $$id: 'week-tils',
    data: weeksData,
    listClass: 'calendar-weektils',
    itemClass: 'calendar-weektils-item'
  }
}

function adapterRangeTip(tip=[]){
  return tip.map(item=>{
    if (typeof item === 'string') {
      item = {title: item}
    }
    if (lib.isObject(item)) {
      return item
    }
    return null
  })
}

let parentContext = null
let waitingForRenderDefaultValue = true
function getOneMonthConfig(timestr, options, $value=[]){
  const timePoint = getYmd(timestr)  // [ 2021-8-1, 2021-9-1 ]
  const monthData = fillMonth(timePoint, options)
  const monthTitle = timePoint.year + '年' + timePoint.month + '月'
  let   scaleItemHeightClass = ''
  if (monthData.length > 35) {
    scaleItemHeightClass = 'scale'
  }

  const optionsMonthHeader = options.monthHeader === false ? false : (options.monthHeader || (options.toolbox && options.toolbox.monthHeader))

  let monthHeader = {title: monthTitle, itemClass: 'calendar-month-header'}
  if (optionsMonthHeader === false) {
    monthHeader = null
  }
  if (lib.isObject(optionsMonthHeader)) {
    monthHeader = optionsMonthHeader
  }
  if (lib.isFunction(optionsMonthHeader)) {
    monthHeader = optionsMonthHeader(monthHeader) || monthHeader
  }

  return {
    $$id: `mon-${timePoint.year}-${timePoint.month}`,
    id: `mon-${timePoint.year}-${timePoint.month}`,
    __key: `mon-${timePoint.year}-${timePoint.month}`,
    attr: {timepoint: timePoint},
    "@list": {
      id: `${timePoint.year}-${timePoint.month}`,
      $$id: `${timePoint.year}-${timePoint.month}`,
      header: monthHeader,
      data: monthData,
      itemMethod: {
        aim: 'onDateSelect'
      },
      itemClass: 'date-item',
      listClass: 'date-list '+scaleItemHeightClass,
      containerClass: 'date-list-wrap',
      ready(){
        if ($value.length) {
          if (options && options.__getValidMonth) {
            const validMonth = options.__getValidMonth()
            checkedDefaultValue.call(parentContext, {$value, validMonth, options, timePoint})
            .then(res=>{
              waitingForRenderDefaultValue = false
            })
          }
        } else {
          waitingForRenderDefaultValue = false
        }
      }
    }
  }
}

/**
 * 以天为单位生成日历
 * @param {Date/timestamp} timestart 开始时间，为空则自动从当前开始
 * @param {Number} total 结束时间，后多少天
 * 通过结算得到结束时间的年月日，用 calendarMonths 方法生成日历
 */
export function getValidMonth(startPoint, total=30, options={}, $value) {
  let   {year, month, day} = startPoint
  const {endPoint} = options

  const manyYear = endPoint.year - year
  const manyMonth = (manyYear - 1) * 12 + (12 - month) + endPoint.month
  const validMonth = []
  options.__getValidMonth = () => validMonth
  for (let ii=0; ii<=manyMonth; ii++) {
    const tmpMonth = month + ii
    const followMonth = tmpMonth % 12 || 12
    if (followMonth === 1 && ii !== 0) year++
    const timestr = `${year}-${followMonth}-1`
    const monthConfig = getOneMonthConfig.call(this, timestr, options, $value )
    validMonth.push(monthConfig)
  }
  return validMonth
}

const defaultConfig = {
  $$id: 'calendar',
  date: null,  // Object|Function
  data: [],    // [{date: 'xxxx-xx-x', content: {title: '???'}}]
  lunar: false,
  festival: false,
  type: 'single',  // single, range, multiple
  rangeCount: 30,
  rangeTip: [],  // rangeTip: ['开始', {title: '结束'}]  用于range事件点击 开始提示，结束提示
  mode: 1,
  tap: null,
  value: [],   // value: ['2021-9-23', '2021-9-25'],
  header: {'@list': weeksTils(), itemClass: 'week-box'},
  monthHeader: null
  // start, 


  // 兼容之前的写法
  // toolbox: {monthHeader}   
}

function mkCalendarConfigs(timestart, total=30, opts={}){
  if (total === 99999) total = 0
  const day = 24*60*60*1000
  let   startPoint = getYmd(timestart)
  let   endTime = startPoint.timestamp + (total*day)
  let   endPoint = getYmd(endTime)
  const options = Object.assign({}, defaultConfig, opts)

  // 通过 data 数据计算开始/结束时间点
  if (options.data.length) {
    let  filterdata = options.data.filter(item=> (lib.isObject(item) && item.date && item.content) )
    if (filterdata.length) {
      let  tmpdata = ([...filterdata]).map(item=>(getYmd(item.date)))
      tmpdata = tmpdata.sort((a, b) => (a.timestamp - b.timestamp) )
      startPoint = tmpdata[0]
      timestart  = startPoint.timestr
      endTime = tmpdata[tmpdata.length-1].timestamp
      endPoint = tmpdata[tmpdata.length-1]
    }
    options.data = filterdata
  }

  options.startPoint = startPoint
  options.endPoint = endPoint
  let $value = (options.value||[]).map(val=>{
    if (lib.isString(val)) {
      val = {date: val}
    }
    if (lib.isObject(val)) {
      return getYmd(val.date)
    }
  })

  options.rangeTip = adapterRangeTip((options.rangeTip||[]))

  if ($value.length) {
    if (options.type === 'single') {
      $value = $value.slice(0, 1)
    }
    if (options.type === 'range') {
      if ($value[1].timestamp < $value[0].timestamp) {
        console.warn('区选第二时间不能大于第一时间');
        $value = []
        options.value = []
      }
      if (!$value[1]) {
        $value = []
        options.value = []
      }
    }
  }

  // scroll-view mode 1
  let calendarMode = {
    is: 'flatlist',
    screens: 1,
    autoHide: false,
  }

  // swiper-view
  if (options.mode === 2) {
    calendarMode = {
      is: 'flatswiper',
      screens: 1,
      autoHide: false,
      duration: 300,
    }
  }

  // 万年历
  if (options.mode === 3) {
    calendarMode = {
      is: 'swiper-loop',
      autoHide: false,
      bindchange: 'swiperChange',
      current: 0,
      type: 'single',
      duration: 300,
      appendItems(util){
        const instack = util.instack
        const lastItem = instack[instack.length - 1]
        let   timepoint = endPoint
        if (lastItem) {
          const monthStr = lastItem['@item']['@list'].id
          timepoint = getYmd(monthStr+'-1')
        }

        const appends = []
        for (let ii=1; ii<3; ii++) {
          const targetPoint = rightDate(timepoint, ii)
          const timestr = `${targetPoint.year}-${targetPoint.month}-${targetPoint.day}`
          const monthConfig = getOneMonthConfig(timestr, options, [])
          appends.push(monthConfig)
        }
        util.add(appends)
      },
      prependItems(util){
        const action = util.action
        const outstack = util.outstack
        const lastItem = outstack[outstack.length-1]
        const timepoint = (lastItem && getYmd(lastItem['@list'].id+'-'+1)) || startPoint
        const appends = []
        for (let ii=1; ii<3; ii++) {
          const targetPoint = rightDate(timepoint, -(ii))
          const timestr = `${targetPoint.year}-${targetPoint.month}-${targetPoint.day}`
          const monthConfig = getOneMonthConfig(timestr, options, [])
          appends.push(monthConfig)
        }
        util.add(appends)
      }
    }
    options.data = []
    options.header['@list'].header = {
      title: `${startPoint.year}-${startPoint.month}`, 
      itemClass: 'calendar-weektils-header', 
      $$id: 'calendar-weektils-header',
      dot: [
        {title: '今', itemClass: 'button-today', aim(e, param, inst){
          app.hooks.emit('goto-today')
        }}
      ]
    }
    options.header['@list'].listClass += ' mode3'
    options.monthHeader = false
  }

  // swiper-view
  if (lib.isFunction(options.mode)) {
    calendarMode = options.mode(calendarMode) || calendarMode
  }

  if (lib.isObject(options.mode)) {
    calendarMode = Object.assign(calendarMode, options.mode)
  }

  if ([3, '3'].includes(calendarMode.is)){
    calendarMode.is = 'swiper-loop'
    options.mode = 3
  }
  if ([2, '2'].includes(calendarMode.is)){
    calendarMode.is = 'flatswiper'
    options.mode = 2
  }
  if ([1, '1'].includes(calendarMode.is)){
    calendarMode.is = 'flatlist'
    options.mode = 1
  }

  // 设置滚动到指定位置
  if ($value.length) {
    const startPoint = $value[0]
    const jumpTargetId = `box-mon-${startPoint.year}-${startPoint.month}`
    if (options.mode === 1) {
      calendarMode['scroll-into-view'] = jumpTargetId
      calendarMode['scroll-with-animation'] = true
    }

    if (options.mode === 2) {
      let index = 0
      for (let ii=0; ii<validMonth.length; ii++) {
        const item = validMonth[ii]
        if (item.id === jumpTargetId.replace('box-', '')) index = ii
      }
      calendarMode['current'] = index
    }
  }

  let validMonth = getValidMonth.call(this, startPoint, total, options, $value)

  let timmer_change_month = null
  return {
    $$id: options.$$id,
    header: options.header,  // week til bar
    data: validMonth,
    type: calendarMode,
    itemClass: 'flatlist-item calendar-list-item',
    listClass: 'calendar-list',
    containerClass: 'calendar',
    created(){
      this.rangeChecked = []
      this.rangeSelect  = []
      this.value = options.value
      this.validMonth = validMonth
      this.getValue = function(){
        return this.value
      }
      parentContext = this
    },
    ready(){
      const that = this
      const screens = this.screens
      const current = calendarMode.current
      const $$ = this.activePage.getElementsById.bind(this.activePage)

      app.hooks.once('goto-today', function(){
        that.reset(function(){
          if (current === that.swiperCurrent) {
            const currentItemId = screens[current].id
            that.changeCalendarHeader(currentItemId)
          }
        })
      })
    },
    methods: {
      getValue(){
        return this.value
      },
      changeCalendarHeader(screenId, params={}){
        const title = params.title
        clearTimeout(timmer_change_month)
        screenId = screenId.replace('box-', '')
        const $$ = this.activePage.getElementsById.bind(this.activePage)
        const monthStr = $$(screenId).getData()['@list'].id
        const header = $$('calendar-weektils-header')
        this.currentTimepoint = getYmd(monthStr+'-1')
        timmer_change_month = setTimeout(() => {
          if (lib.isFunction(options.bindchange)) {
            const result = options.bindchange.call(header, {title: monthStr}) || {title: monthStr}
            header.update(result)
          } else {
            header.update({title: monthStr})
          }
          
        }, 50);
      },
      swiperChange(e){
        const detail = e.detail
        const currentItemId = detail.currentItemId
        this.changeCalendarHeader(currentItemId)
      },
      onDateSelect(e, param, inst){
        if (inst.hasClass('invalid')) return
        if (!waitingForRenderDefaultValue) {
          eventIndex.call(this, e, { inst, options })
        }
      }
    }
  }
}

export default function initCalendar(opts){
  let   start = opts.start || null
  const total = opts.total || 90
  const solarFestival = opts.solarFestival
  const lunarFestival = opts.lunarFestival



  /**
   * 自定义节假日
      initCalendar({
        solarFestival: {  // 阳历节日
          "1-1": '元旦节',
          "3-7": '女神节'
          "8-18": '电商节'
        },

        lunarFestival: {
          "1-1": 春节
        }
      })
   */

  // 自定义阳历节假日
  if (lib.isObject(solarFestival)) {
    Object.keys(solarFestival).forEach(date=>{
      let content = solarFestival[date]
      if (lib.isString(content) || lib.isArray(content)) {
        solarFestival[date] = {title: content}
      }
    })
    setFestival(solarFestival)
    delete opts.solarFestival
  }

  // 自定义农历节假日
  if (lib.isObject(lunarFestival)) {
    Object.keys(lunarFestival).forEach(date=>{
      let content = lunarFestival[date]
      if (lib.isString(content) || lib.isArray(content)) {
        lunarFestival[date] = {title: content}
      }
    })
    setLunarFestival(lunarFestival)
    delete opts.lunarFestival
  }



  // mode=3 万年历
  // 需要锁定几项配置
  if (opts.mode && opts.mode === 3 || 
    (lib.isObject(opts.mode) && (mode.is === 3 || mode.is === '3' || mode.is === 'swiper-loop'))
  ) {
    opts.type = 'single'
    const today = getYmd()
    const startDay = `${today.year}-${today.month}-1`
    opts.data = [{date: startDay, content: {}}]
    for (let ii=1; ii<7; ii++) {
      const nextDate = rightDate(today, ii)
      opts.data.push({
        date: `${nextDate.year}-${nextDate.month}-1`,
        content: {}
      })
    }
  }
  return mkCalendarConfigs(start, total, opts)
}
