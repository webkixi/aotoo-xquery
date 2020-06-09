/**
 * 作者： 天天修改
 * github: webkixi
 * 小程序的模板真是又长又臭
 */
// const app = null //getApp()
const app = getApp()
const Core = require('../aotoo/core/index')
const lib = Core.lib
export const {
  // 是否闰年
  isLeapYear, 

  // 获取月份天数
  getMonthCount,

  // 获取月份1号是星期几
  getWeekday,

  // 获取上一个月的天数
  getPreMonthCount,

  // 获取下一个月的天数
  getNextMonthCount,

  // 转换日期字串为日期对象
  getYmd,

  // 兼容性new Date的写法，windows/mac/linux/ios/android
  newDate,

  // 为一组日期排序
  sortDates,

  // 格式化日期为 xxxx-xx-xx格式
  formatDate,

  
  completeMonth,
  monthListConfig,

  // 以月份数为统计标准，返回实例
  calendarMonths,
  
  // 以total为统计标准，返回实例
  calendarDays,

  // 取得系统阳历节日
  getFestival,

  // 设置系统阳历节日
  // 按照get的格式设置
  setFestival,

  // 取得系统农历节日
  getLunarFestival,

  // 设置系统农历节日
  // 按照get的格式设置
  setLunarFestival

  //24节气日不需要设置，直接在配置option.festival数组中设置需要的节气中文就行

} = require('./helper/index')

const {
  rightYmd
} = require('./helper/util/index')

const {
  getNavHeader
} = require('./helper/calendarheader')

const {
  weeksTils
} = require('./helper/weektils')

function initData(data={}, opts, cb) {
  if (lib.isFunction(opts)){
    cb = opts
    opts = null
  }

  let tmp = {}
  Object.keys(data).forEach(key=>{
    let val = data[key]
    if (lib.isObject(val)) val.__fromParent = this.uniqId
    tmp[key] = val
  })
  
  this.setData(tmp, cb)
}

function funInParent(ctx, f) {
  if (ctx.parentInst) {
    if (ctx.parentInst[f]) {
      return ctx.parentInst
    } else {
      return funInParent(ctx.parentInst, f)
    }
  }
}

function tintSelected(value=[]) {
  let that = this
  let val = value || this.value
  if (this.coptions.type === 'single') {
    val = [val[0]]
  }
  val.forEach(date => {
    if (date) {
      let inst = that.$month(date)
      if (inst) {
        inst.setChecked(date)
        that.hooks.one('emptyMonthChecked', function () {
          inst && inst.unChecked(date)
          // inst && inst.emptyChecked()
        })
      }
    }
  })
}

function tintRange(fromInit) {
  let that = this
  let value = this.value
  let activePage = this.activePage

  let startDate = getYmd(value[0])
  let endDate = getYmd(value[1])

  if (!endDate) return  // endDate必须有效磁能渲染range

  let startInstId = `${this.calenderId}-${startDate.year}-${startDate.month}`
  let startInst = this.rangeStartMonth || activePage.getElementsById(startInstId)
  let endInstId = `${this.calenderId}-${endDate.year}-${endDate.month}`
  let endInst = this.rangeEndMonth || activePage.getElementsById(endInstId)

  if (value[0] && !value[1] && fromInit) {
    setTimeout(() => {
      let target = startInst.setChecked(value[0])
      startInst.checkedIndex = null
      // this.rangeValue = [target]
    }, 100);
    return
  }

  this.hooks.off('empty-month-checked')
  this.hooks.one('empty-month-checked', function () {
    // if (!startInst) {
    //   startInst = activePage.getElementsById(startInstId)
    //   endInst = activePage.getElementsById(endInstId)
    // }

    if (startInst && endInst) {
      let smDate = startInst.getDate()
      let emDate = endInst.getDate()

      // 同年、同月的场景下，只执行一次，避免性能损耗
      // if (smDate.year === emDate.year && smDate.month === emDate.month) {
      //   startInst.hooks.emit('emptyChecked')
      // } else {
      //   startInst.hooks.emit('emptyChecked')
      //   endInst.hooks.emit('emptyChecked')
      // }
      if (smDate.year === emDate.year && smDate.month === emDate.month) {
        startInst.unChecked(that.rangeValue)
      } else {
        startInst.unChecked(that.rangeValue)
        // startInst.hooks.emit('emptyChecked')
        // endInst.hooks.emit('emptyChecked')
      }
    }
  })

  let startStamp = newDate(value[0]).getTime()
  let endStamp = newDate(value[1]).getTime()
  if (startStamp > endStamp) {
    value = [value[1]]
    this.hooks.emit('empty-month-checked')
  } else {
    if (startDate.month === endDate.month) {
      startInst && startInst.tint(value[0], value[1], 'selected', 'end', fromInit)
    } else {
      if (startInst) {
        startInst && startInst.tint(value[0], null, 'selected', 'start', fromInit)
        endInst && endInst.tint(null, value[1], 'selected', 'end', fromInit)
      }
    }
  }
}

/**
 * let calendar = {
 *  start: null, // 起始日期
 *  end: null, // 结束日期
 *  total: 180, 总共多少天  // 优先于end
 *  mode: 1, mode=1 scroll-view展现 mode=2 swiperview展示, mode=3 swiperview 纵向滚动 4 无限日历
 *  toolbox: [], // 需要显示的部分 header, footer, curDate, descript, 农历， 节假日
 *  lazy: true, // 默认启用懒加载
 * 
 *  header: {},
 *  footer: {},
 *  type: 'single', // 'range' 连续范围选择, 'multiple'多项选择
 *  rangeCount: 28, // 当type === 'range'时，rangeCount为区间大小，意味着区间允许选择多少天
 *  rangeMode: 1,   // rangeMode=1 仿去哪儿不会隐藏区间外月份   rangeMode=2 仿携程，默认 隐藏可选区间外月份
 *  rangeTip: [],  // 区选第一次点击，第二次点击附加的描述
 *  tap: callback,  //业务响应事件
 *  navTap: callback, // 横向滚动时，点击tab项的响应方法
 *  value: [], // 预设日期(一般从后台拿去，用于回显)，将value中的日期高亮显示
 *  rangeValue: []  // range模式下，第二次tap与第一次tap间的日期都会被放入该变量中，在tap的回调方法中可以读取该变量
 *  data: Array ['2020-5-3', '2020-7-9']  // 填充数据，如果没有start，日历组件将会依据data中的填充数据计算total天数并显示
 *  disable: true/false  全局无效
 *  date: Object|Function,  // 默认日期
 *  festival: Boolean|Array 为true时显示所有预定义的节日，数组时显示特定的节日  true | ['清明节’, '平安夜', '圣诞节'...] 能够带节的都是用'节'
 * }
 */

let defaultConfig = {
  header: null,
  footer: null,
  start: null,
  end: '',
  total: 0,
  mode: 2, // 1
  type: 'range',
  rangeCount: 28,
  rangeMode: 2,
  rangeValue: [],
  rangeTip: [],
  url: '',
  button: false,
  value: [],
  alignMonth: false,  // 平均每月日期数为42，swiper时对齐月容器高度
  festival: false,
  lunar: false,  // 是否显示农历
  // festival: true,
  // festival: ['春节'],
  // festival: [{title: '春节', content: {dot: ['春节']}}],
  toolbox: {
    header: true,
    footer: true,
    monthHeader: true,
    rangeEdge: null, //自定义边界日期，一般用于range选择
    discontinue: false  // 月份排序完全按照data数据中的日期排列，没有的月份会被忽略
  },
  date: null // 自定义默认日期
}

function adapter(source={}) {
  let that = this
  let coptions = Object.assign({}, defaultConfig, source)
  coptions.total = parseInt(coptions.total)
  coptions.mode = parseInt(coptions.mode)
  coptions.rangeCount = parseInt(coptions.rangeCount)
  coptions.rangeMode = parseInt(coptions.rangeMode)
  if (coptions.rangeTip.length >=2) {
    coptions.rangeTip = coptions.rangeTip.map(item=>{
      if (lib.isString(item)) {
        item = {title: item}
      }
      return item
    })
  } else {
    coptions.rangeTip = []
  }

  let {
    $$id,
    header,
    footer,
    start,
    end,
    total,
    mode,
    type,
    value,
    data,
    date,
    disable,
    festival,
    toolbox
  } = coptions
  this.coptions = coptions
  this.value = value || []  // 点选后的值
  // this.data = data || []  // 指定日期填充数据
  this.fillData = data || []  // 指定日期填充数据
  this.disable = disable || false  // 全局无效
  this.$$id = $$id 
  this.rangeValue = []  // range 选择区间的所有日期
  this.date = date // 默认日期填充数据
  this.allMonths = []  //计算后得到所有的月份

  this.allowBox = toolbox
  start = start && formatDate(start) || null
  this.fillData = this.fillData.map(item=>{
    if (lib.isString(item)) {
      return {date: item}
    }
    return item
  })

  if (lib.isFunction(coptions.tap)) {
    let funcId = lib.suid('calendar_tap_fun_')
    this[funcId] = coptions.tap
    coptions.tap = funcId
    this.coptions.tap = funcId
  }

  if (lib.isFunction(coptions.navTap)) {
    let funcId = lib.suid('calendar_navTap_fun_')
    this[funcId] = coptions.navTap
    coptions.navTap = funcId
    this.coptions.navTap = funcId
  }

  try {
    let dateList = null
    let currentYmd = getYmd()
    let selected = value[0] || new Date().getTime()
    let $weekTils = weeksTils(coptions)

    header = (this.allowBox.header && this.coptions.header) || null
    footer = (this.allowBox.footer && this.coptions.footer) || null

    if (this.fillData.length) {
      let fillData = this.fillData
      fillData = sortDates(fillData)
      if (this.fillData.length === 1) {
        let date = this.fillData[0].date
        let ymd = getYmd(date)
        start = date
        total = getMonthCount(ymd.year, (ymd.month-1)).length
        total = total - ymd.day
        if (total === 0) total = 99999
      } else {
        let fdate = start || fillData[0].date   // 在设置data的同时，如果设置了start，则起始日期以start标准
        let ldate = fillData[fillData.length-1].date
        let ftime = newDate(fdate).getTime()
        let ltime = newDate(ldate).getTime()
        let dayTime = 24*60*60*1000
        let days = parseInt((ltime-ftime)/dayTime)
        if ((ltime-ftime)%dayTime) {
          days++
        }
        this.fillData = fillData
        start = fdate
        total = days
      }
    }

    if (mode === 4) total = 150
    if (!total) throw new Error('必须指定范围天数, total')
    if (total) {
      this.total = total === 99999 ? 0 : total
      dateList = []

      let modeConfig = {
        is: 'scroll',
        "scroll-y": true,
        "bindscroll": '_bindscroll'
      }
  
      if (mode === 2 || mode === 3) {
        modeConfig = {
          is: 'swiper',
          bindchange: '_bindswiper'
        }
        if (mode === 3) {
          modeConfig.vertical = true
        }
      }
      
      if (mode === 4) {
        modeConfig = {
          is: 'swiper',
          bindchange: '_mode4swiper',
          bindtransition: '_mode4swiping',
          circular: true,
          current: 2
        }
        this.m4_ymd = getYmd()
        this.m4_current = 2
        let ymd = this.m4_ymd
        let month = ymd.month-2
        let year = ymd.year
        let _month = month <= 0 ? month + 12 : month
        year = month <= 0 ? year - 1 : year
        month = _month
        start = `${year}-${month}-1`
        total = 150
        this.value = []
      }
  
      let calendarItems = calendarDays.call(this, start, total)
  
      dateList = {
        $$id: this.calenderId,
        type: modeConfig,
        data: calendarItems,
        itemClass: 'calendar-list-item',
        listClass: 'calendar-list',
        methods: {
          __ready(){
            that.calendar = this
          }
        }
      }
  
      // 有值时候，跳转到首月位置，并设置选中状态
      if (this.value && this.value.length) {
        this.value = this.value.map(item=>formatDate(item))
        let value = that.value
        let value0 = value[0]
        let valueDate = getYmd(value0)
  
        let targetId = `id-${valueDate.year}-${valueDate.month}`
  
        // scroll-view 模式，跳转到第一个日期的位置
        // onReady后跳转
        if (mode === 1) {
          dateList.type['scrollIntoView'] = targetId
        }
        
        // swiper-view 跳转到响应的位置
        if (mode === 2 || mode === 3) {
          dateList.type['scrollIntoView'] = targetId
          calendarItems.forEach((item, ii)=>{
            if (item.id === targetId) {
              dateList.type['current'] = ii
            }
          })
        }
  
        // 传进来的value进行selected
        if (type === 'range') {
          this.hooks.one('onReady', function() {
            that.tintRange(true)
          })
        } else {
          this.hooks.one('onReady', function () {
            tintSelected.call(that, value)
          })
        }
      } else {
        this.hooks.on('onReady', function(){
          that.goto(start)
        })
      }
  
      // 头部
      // 如果是日历为横向swiper滚动，则需要添加一个年月导航
      header = getNavHeader.call(this, mode, {
        header, 
        getYmd
      }) || null
  
      if (header) header.$$id = this.headerId
      if (footer) footer.$$id = this.footerId
    }

    initData.call(this, {
      $weekTils,
      $header: header,
      $footer: footer,
      $dateList: dateList
    }, function () {
      that.renderCalender()
    })
  } catch (error) {
    console.error(error);
  }
}



// 基于item的组件
Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
    addGlobalClass: true
  },
  properties: {
    dataSource: {
      type: Object,
      observer(params){
        if (!this.init) {
          if (lib.isObject(params)) {
            this.rendered = false
            params = Object.assign({}, this.coptions, params)
            adapter.call(this, params)
          }
        }
      }
    }
  },
  data: {
    $weekTils: null,
    $header: null,
    $footer: null,
    $dateList: null,
    $popwin: null,
    $style: ''
  },
  behaviors: [Core.baseBehavior(app, 'calendar')],
  lifetimes: {
    created() {
      let that = this
      this.query = wx.createSelectorQuery().in(this)
      this.elements = {} // 日历容器, 月容器存放地址
      this.zoneItems = [] // 在显示区的对象, 当月实例进入显示区调用fillMonth方法填充月数据
      this.headerId = this.uniqId + '_header'
      this.footerId = this.uniqId + '_footer'
      this.calenderId = this.uniqId + '_calender'
      this.value = [] // checked的日期
      this.rendered = false
      this.currentMonth = null
      this.rangeStartMonth = null  // range 第一次点击的month实例
      this.rangeEndMonth = null // range 第二次点击的month实例

      // scroll-view跳转
      this.hooks.once('scroll-into-view', function(param={}){
        that.calendar.update({ "type.scroll-into-view": param.id })
      })

      // swiper 跳转
      this.hooks.once('swiper-current', function(param={}){
        let id = param.id
        id = id.replace('id-', '')
        if (that.header) {
          that.header.selected(id)
        }

        let instId = `${that.calenderId}-${id}`
        let monInst = that.activePage.getElementsById(instId)
        if (monInst.days.length > 35) {
          that.setData({ $style: `--append-date-item-height: var(--date-item-height)` })
        }
        if (param.index || param.index === 0){
          that.calendar.update({"type.current": param.index})
        }
      })
      
      // this.activePage.hooks.on('onReady', function() {
      this.hooks.once('render-calendar', function () {
        let coptions = that.coptions
        let mode = coptions.mode
        that.query.selectAll('.calendar').boundingClientRect((ret) => {
          if (ret && ret.length) {
            let ret0 = ret[0]
            that.elements.container = {
              top: ret0.top,
              left: ret0.left,
              right: ret0.right,
              bottom: ret0.bottom,
              width: ret0.width,
              height: ret0.height,
              dataset: ret0.dataset,

              deltaX: 0,
              deltaY: 0,
              scrollTop: 0,
              scrollLeft: 0,
              scrollWidth: ret0.width,
              scrollHeight: ret0.height,
            }
          }
        }).exec()
        let sysInfo = wx.getSystemInfoSync()
        that.sysInfo = sysInfo
        that.query.selectAll('.calendar >>> .calendar-list-item').boundingClientRect(ret => {
          if (ret && ret.length) {
            that.elements.items = ret.map(item=>{
              item.showed = false
              return item
            })
          }
        }).exec(()=>{
          // 延时为了不去污染orienDataSource，保证原始数据不被污染
          let $dl = that.data.$dateList
          if ($dl.type['scrollIntoView']) {
            let targetDate = $dl.type['scrollIntoView'].replace('id-', '')
            let index = $dl.type['current']
            that.goto(targetDate, {index})
          }
          that.display()
        })

        if (mode === 4) {
          let ymd = that.m4_ymd
          let currentDate = `${ymd.year}-${ymd.month}-${ymd.day}`
          let monInst = that.getMonthInstance(currentDate)
          if (monInst && monInst.days.length > 31) {
            that.setData({ $style: `--append-date-item-height: var(--date-item-height)` })
          }
        }
      })
    },
    attached: function() { //节点树完成，可以用setData渲染节点，但无法操作节点
      let properties = this.properties
      if (properties.dataSource) {
        adapter.call(this, properties.dataSource)
      }
    },
    ready(){
      let that = this
      if (that.$$id) {
        that.mount(that.$$id)
      }
      that.rendered = true
    }
  },
  methods: {
    renderCalender(){
      let that = this

      // this.activePage.doReady(true)
      that.hooks.once('done-display', function () {
        setTimeout(() => {
          that.hooks.emit('onReady')
        }, 100);
      })
      
      that.hooks.emit('render-calendar')
    },
    getFestival(){
      return getFestival()
    },

    setFestival(param){
      setFestival(param)
    },

    getLunarFestival(){
      return getLunarFestival()
    },

    setLunarFestival(param){
      setLunarFestival(param)
    },

    update(params, cb) {
      let that = this
      if (this.rendered) {
        // headerId
        // footerId
        // calenderId
        that.rendered = false
        this.setData({
          $header: null,
          $footer: null,
          $dateList: null
        }, function(){
          if (lib.isObject(params)) {
            params = Object.assign({}, this.coptions, params)
            adapter.call(this, params)
            that.renderCalender()
          }
        })
      } else {
        if (lib.isObject(params)) {
          params = Object.assign({}, this.coptions, params)
          adapter.call(this, params)
          that.renderCalender()
        }
      }
    },

    $month(date){
      let dateItem = null
      if (date) {
        let ymd = getYmd(date)
        let $date = `${ymd.year}-${ymd.month}-${ymd.day}`
        let monthInst = null
        this.calendar.children.forEach(ele=>{
          let eleYm = ele.getDate()
          if (eleYm.year === ymd.year && eleYm.month === ymd.month) {
            monthInst = ele
          }
        })
        if (monthInst) {
          let config = monthInst.getData()
          if (config.data.length) {
            return monthInst
          } else {
            monthInst.visible(true)
            monthInst.show()
            monthInst.fillMonth()
          }
          return monthInst
        }
      }
    },

    // 设置指定日期数据
    renderDate(param){
      this.hooks.emit('update-month-days', param)
      this.calendar.children.forEach(month=>{
        if (month.lazyDisplay) {
          month.fillMonth()
        }
      })
    },

    // 恢复原始月数据
    restore(date){
      if (date){
        let ymd = getYmd(date)
        this.calendar.children.forEach(month=>{
          let mon = month.getDate()
          if (mon.year === ymd.year && mon.month === ymd.month) {
            month.restore()
            if (month.lazyDisplay) {
              month.fillMonth()
            }
          }
        })
      } else {
        this.hooks.emit('restore-month-days')
      }
    },

    // 跳转到指定月份
    // mode 1 2 3 4
    goto(date, param={}){
      let coptions = this.coptions
      let mode = coptions.mode
      let allMonths = this.allMonths
      let ymd = getYmd(date)
      let ym = `${ymd.year}-${ymd.month}`

      let _date = date
      if (mode === 4) {
        let ym = this.m4_ymd
        _date = `${ym.year}-${ym.month}-1`
      }
      this.currentMonth = this.getMonthInstance(_date)

      if (mode === 1) {
        let id = `id-${ym}`
        this.hooks.emit('scroll-into-view', {id})
      }

      if (mode === 2 || mode === 3) {
        let index = param.index !== undefined ? param.index : null
        if (!index && index !== 0) {
          for (let ii=0; ii<allMonths.length; ii++) {
            let item = allMonths[ii]
            if (item.indexOf(ym) > -1) {
              index = ii
              break;
            }
          }
        }
        this.hooks.emit('swiper-current', {index, id: ym})
      }
    },

    setValue(date, param, cb){
      if (lib.isFunction(param)) {
        cb = param
        param = undefined
      }
      this.currentMonth = this.getMonthInstance(date)
      let coptions = this.coptions
      let type = coptions.type
      let activePage = this.activePage
      if (date) {
        let value = this.value
        let len = value.length
        let curDate = getYmd(date)
        let curStamp = newDate(date).getTime()
        let instId = `${this.calenderId}-${curDate.year}-${curDate.month}`
        let monInst = this.currentMonth || activePage.getElementsById(instId)
        
        // 单选
        if (type === 'single') {
          this.hooks.emit('emptyMonthChecked')  // 先清空所有已选项
          this.hooks.one('emptyMonthChecked', function () {
            monInst && monInst.unChecked(date)
            // monInst && monInst.emptyChecked()
          })
          value = [date]
        }
        
        // 多选
        // ????
        if (type === 'multiple') {
          if (value.indexOf(date) === -1) {
            this.hooks.one('emptyMonthChecked', function () {
              monInst && monInst.unChecked(date)
            })
            value.push(date)
          } else {
            let index = value.indexOf(date)
            if (index > -1) {
              value.splice(index, 1)
            }
          }
        }

        // 选择范围
        if (type === 'range') {
          if (len === 0 || len === 2) {
            this.rangeStartMonth = this.currentMonth
            this.value = value = [date]
            len = 1
            this.hooks.emit('empty-month-checked') // 清空所有选择日期
            this.hooks.emit('monthShowStat')
          } 

          if (len === 1) {
            if (value[0] !== date) {
              let zeroStamp = newDate(value[0]).getTime()
              if (curStamp > zeroStamp) {
                value[1] = date
              } else {
                if (curStamp < zeroStamp) {
                  let theMon = monInst || this.$month(zeroStamp)
                  if (theMon) {
                    theMon.emptyChecked()
                  }
                  value[0] = date
                }
              }
            }
            // // tintRange.call(this, value)
          }
        }

        this.value = value

        if (lib.isFunction(cb)) {
          cb(value)
        }
      }
    },

    // type=range时，渲染已选的日期颜色
    tintRange(param){
      tintRange.call(this, param)
    },

    tintSelected(val){
      tintSelected.call(this, val)
    },

    getValue(){
      return this.value
    },

    hasValue(date){
      if (date) {
        let value = this.value
        let index = value.indexOf(date)
        return index > -1 ? true : false
      }
    },

    removeValue(date, inst){
      if (date) {
        let value = this.value
        let index = value.indexOf(date)
        if (index > -1) {
          value.splice(index, 1)
          if (inst && inst.removeClass) {
            inst.removeClass('selected')
          }
        }
        this.value = value
      }
    },

    // 响应业务tap事件的回调方法
    selectDate(e, param, inst){
      let that = this
      let coptions = this.coptions
      let type = coptions.type
      let tapFun = coptions.tap
      let rangeCount = coptions.rangeCount
      let rangeTip = coptions.rangeTip

      let activePage = this.activePage
      e.currentTarget.dataset.date = param.date
      e.calendarType = param.type

      let value = this.value
      let len = value.length
      
      // if (param.type === 'month') {

      // }

      if (param.type === 'date') {
        if (type === 'range') {
          if (len === 1) {
            param.range = 'start'
            e.currentTarget.dataset.range = 'start'
          }
          if (len === 2) {
            // let ss = getYmd(value[0])
            // let ee = getYmd(value[1])
            // let dateDiff = 1

            // if (ss.month === ee.month) {
            //   dateDiff = ee.day - ss.day + 1
            // } else {
            //   let monDays = getMonthCount(ss.year, (ss.month - 1)).length
            //   let sDiff = monDays - ss.day + 1
            //   let eDiff = ee.day
            //   dateDiff = sDiff + eDiff
            // }

            // if (dateDiff > rangeCount) {
            //   this.removeValue(value[1], inst)
            // } else {
            //   this.tintRange()
            // }

            // param.dateDiff = dateDiff
            // e.currentTarget.dataset.dateDiff = dateDiff
            // param.range = 'end'
            // e.currentTarget.dataset.range = 'end'


            let ss = value[0]
            let ee = value[1]
            let ssDate = getYmd(value[0])
            let eeDate = getYmd(value[1])
            let ssStamp = newDate(value[0]).getTime()
            let eeStamp = newDate(value[1]).getTime()
            let diffStamp = eeStamp - ssStamp
            let dayTime = 24*60*60*1000
            let gap = 0
            if (diffStamp > 0) {
              this.rangeEndMonth = this.currentMonth
              gap = parseInt(diffStamp/dayTime)
              // if (diffStamp%dayTime) gap++
              // if (gap < rangeCount) {
              //   gap++
              //   this.tintRange()
              // } else {
              //   this.removeValue(value[1], inst)
              // }
              this.tintRange()
            } else {
              this.rangeEndMonth = null
              let instId = `${this.calenderId}-${ssDate.year}-${ssDate.month}`
              let monInst = this.currentMonth || activePage.getElementsById(instId)
              monInst.forEach(item => item.data.date === ss ? that.removeValue(ss, item) : '')
            }

            param.dateDiff = gap
            e.currentTarget.dataset.dateDiff = gap
            param.range = diffStamp < 0 ? 'start' : 'end'
            e.currentTarget.dataset.range = diffStamp < 0 ? 'start' : 'end'
          }
        }
      }

      if (tapFun) {
        if (this[tapFun]) {
          this[tapFun](e, param, inst)
        } else {
          let parent = funInParent(this, tapFun)
          if (parent) {
            parent[tapFun].call(this, e, param, inst)
          } else {
            if (typeof activePage[tapFun] === 'function') {
              activePage[tapFun].call(activePage, e, param, inst)
            }
          }
        }

        if (type === 'range' && rangeTip) {
          let startTip = rangeTip[0]
          let endTip = rangeTip[1]
          let $data = inst.getData()
          let $dot = $data.dot || []

          if (param.range === 'start') {
            if (lib.isObject(startTip)) {
              $dot.push(startTip)
            }
          }

          if (param.range === 'end') {
            if (lib.isObject(endTip)) {
              $dot.push(endTip)
            }
          }
          inst.update({ dot: $dot })
        }


        // if (param.range === 'end') {
        //   this.rangeValue = []
        // }
      }
    },

    // 切换下一月, 只适用于mode4
    nextMonth(e, param, inst){
      e.detail.current = this.m4_current + 1
      this.m4_dx = 1111
      this._mode4swiper(e)
    },

    // 切换上一月, 只适用于mode4
    prevMonth(e, param, inst){
      e.detail.current = this.m4_current - 1
      this.m4_dx = -1111
      this._mode4swiper(e)
    },

    // 获取月份的实例
    getMonthInstance(date){
      let activePage = this.activePage
      let target = getYmd(date)
      let monId = `${this.calenderId}-${target.year}-${target.month}`
      let theMon = activePage.getElementsById(monId)
      return theMon
    },

    // 获取日期实例
    getDateInstance(date){
      let activePage = this.activePage
      let target = getYmd(date)
      let monId = `${this.calenderId}-${target.year}-${target.month}`
      let theMon = activePage.getElementsById(monId)
      let theDate = null
      if (theMon) {
        theMon.forEach(function(item, ii){
          let data = item.data
          let date = data.date
          if (date) {
            if (data.day===target.day) {
              theDate = item
            }
          }
        })
      }
      return theDate
    },

    display(fromScroll){
      let that = this
      let activePage = this.activePage
      let zoneItems = this.zoneItems
      let outItems = []
      if (!zoneItems.length) {
        let dealItems = this.__computZoneItems()
        zoneItems = dealItems.zoneItems
        outItems = dealItems.outItems
      }
      if (zoneItems.length) {
        zoneItems.forEach(item=>{
          let {dataset, showed} = item
          let id = dataset.id  // calendar13_calender-2019-11
          let xxx = activePage.getElementsById(id)
          xxx.fillMonth()
        })
        zoneItems = []
        this.zoneItems = []
      }

      if (outItems.length) {
        outItems.forEach(item => {
          let {dataset, showed} = item
          let id = dataset.id  // calendar13_calender-2019-11
          let xxx = activePage.getElementsById(id)
          xxx.emptyMonth()
        })
      }
      if (!fromScroll) this.hooks.emit('done-display')
    },
    _bindscroll(e){
      if (this.elements.container) {
        let detail = e.detail
        let container = this.elements.container
        container.deltaX = detail.deltaX
        container.deltaY = detail.deltaY
        container.scrollTop = detail.scrollTop
        container.scrollLeft = detail.scrollLeft
        container.scrollWidth = detail.scrollWidth
        container.scrollHeight = detail.scrollHeight
        this.display(true)
      }
    },

    _mode4swiping(e){
      let dx = e.detail.dx
      this.m4_dx = (dx - (this.m4dx||dx))
      this.m4dx = dx
    },
    _mode4swiper(e){
      if (e.type === 'change' && Math.abs(this.m4_dx)===1111) return
      
      // swiper items = 5的场景
      this.m4_current = this.m4_current !== undefined ? this.m4_current : 2
      let ym = (this.m4_currentDate && getYmd(this.m4_currentDate)) || this.m4_ymd
      if (this.m4_dx > 0) {
        ym = rightYmd(ym, 1)
      } else {
        ym = rightYmd(ym, -1)
      }
      let start = `${ym.year}-${ym.month}-1`
      this.m4_currentDate = start
      
      let activePage = this.activePage
      let detail = e.detail
      let current = detail.current
      current = current > 4 ? 0 : current < 0 ? 4 : current
      let monInst = this.calendar.children[current]
      let header = monInst.children[0]
      let navHeader = this.activePage.getElementsById(this.headerId)
      let navHeaderData = navHeader.getData()
      let navHeaderTitle = navHeaderData.title
      let myDate = ym.year + '年' + ym.month + '月'
      navHeaderTitle[1] = myDate
      navHeader.update({ title: navHeaderTitle }) 
      this.currentMonth = monInst

      
      this.m4_current = current
      this.m4_ymd = ym
      
      let site = 0
      let ymd = Object.assign({}, ym)
      if (this.m4_dx > 0) {
        site = current -3 > -1 ? current - 3 : (current - 3) + 5
        ymd = rightYmd(ymd, 2)
      } else {
        site = current + 3 < 5 ? current + 3 : (current + 3) - 5
        ymd = rightYmd(ymd, -2)
      }
      start = `${ymd.year}-${ymd.month}-1`
      let count = getMonthCount(ymd.year, (ymd.month - 1), true)
      let calendarItems = calendarDays.call(this, start, count - 1)
      let _data = calendarItems[0]['@list']._data
      let preMonInst = this.calendar.children[site]
      let preHeader = preMonInst.children[0]
      preMonInst.year = ymd.year
      preMonInst.month = ymd.month
      preHeader.update({ title: ymd.month })
      preMonInst.fillMonth(_data)

      if (!this.coptions.alignMonth) {
        if (monInst.days.length > 31) {
          this.setData({ $style: `--append-date-item-height: var(--date-item-height)` })
        }else {
          this.setData({ $style: `--append-date-item-height: 0px;` })
        }
      }

      let $ym = monInst.getDate()
      if ($ym.year === ym.year && $ym.month === ym.month) {
        if (Math.abs(this.m4_dx)>1000) {
          this.calendar.update({ 'type.current': current })
        } else {
          if (!monInst.lazyDisplay) monInst.fillMonth()
        }
      }
    },

    _bindswiper(e){
      let activePage = this.activePage
      let detail = e.detail
      let current = detail.current
      let items = this.elements.items
      let item = items[current]
      if (item) {
        let that = this
        let {dataset, showed} = item
        let id = dataset.id  // calendar13_calender-2019-11
        let theMon = activePage.getElementsById(id)
        this.currentMonth = theMon
        if (!theMon.lazyDisplay) theMon.fillMonth()
        let ym = id.replace(this.calenderId+'-', '')
        if (theMon.days.length > 35) {
          this.setData({ $style: `--append-date-item-height: var(--date-item-height)` })
        }else {
          this.setData({ $style: `--append-date-item-height: 0px;` })
        }
        this.header.selected(ym)
      }
      // if (!theMon.lazyDisplay) theMon.fillMonth()

      // console.log('========= ppppp');
      // console.log(items);
    },

    __computZoneItems(){
      // bottom: 320
      // dataset: {
      //   id: "calendar13_calender-2019-11",
      //   treeid: "index-14"
      // }
      // height: 320
      // id: ""
      // left: 0
      // right: 414
      // top: 0
      // width: 414

      let mode = this.coptions.mode   //mode=1 scroll-view  mode=2 swiper
      if (mode === 2 || mode === 3) return this.__computZoneItemsSwiper()

      let that = this
      let container = this.elements.container
      let ctop = container.top
      let cbottom = container.bottom
      let cheight = container.height
      let items = this.elements.items
      let scrollTop = container.scrollTop
      let scrollHeight = container.scrollHeight
      let zoneItems = this.zoneItems
      let outItems = []
      items.forEach(item => {
        let {top, left, right, bottom, width, height, showed} = item
        top = top - scrollTop
        bottom = bottom - scrollTop
        if (!showed ) {
          if (bottom <= cbottom && bottom > (ctop - cheight) ) {
            item.showed = true
            zoneItems.push(item)
          } else {
            if (top >= ctop && top < cbottom + cheight) {
              item.showed = true
              zoneItems.push(item)
            }
          }
          // if ( top < 2 * cbottom && top >= ctop ) {
          //   item.showed = true
          //   zoneItems.push(item)
          // }
        }
        // || ((bottom < (ctop-cheight/2)) && bottom >= ctop))
        // if (!showed && (top < cbottom && top >= ctop || bottom < cbottom && bottom > ctop)) {
        //   item.showed = true
        //   zoneItems.push(item)
        // } else {
        //   if (showed) {
        //     if (bottom < 0 && Math.abs(bottom)>cheight) {
        //       item.showed = false
        //       outItems.push(item)
        //     }

        //     if (top>cheight && top>(cbottom+cheight)) {
        //       item.showed = false
        //       outItems.push(item)
        //     }
        //   }
        // }
      })
      this.zoneItems = zoneItems
      return {zoneItems, outItems}
    },

    __computZoneItemsSwiper(){
      let that = this
      let container = this.elements.container
      let cleft = container.left
      let cright = container.right*2
      let cwidth = container.width
      let items = this.elements.items
      let scrollLeft = container.scrollLeft
      let scrollWidth = container.scrollWidth

      let zoneItems = this.zoneItems
      let outItems = []
      items.forEach(item => {
        let {top, left, right, bottom, width, height, showed} = item
        left = left - scrollLeft
        right = right - scrollLeft

        if (!showed && (left<cright && left>=cleft || right < cright && right > cleft)) {
          item.showed = true
          zoneItems.push(item)
        } else {
          if (showed) {
            if (right < 0 && Math.abs(right)>cwidth) {
              item.showed = false
              outItems.push(item)
            }

            if (left>cwidth && left>(cright+cwidth)) {
              item.showed = false
              outItems.push(item)
            }
          }
        }
      })
      this.zoneItems = zoneItems
      return {zoneItems, outItems}
    }
  }
})