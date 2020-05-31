// 生成日历的导航头部
// mode = 2 / 3，生成scroll-view list的头部
// mode = 4 生成固定头部，包含上一月，下一月按钮

// param.header 是否有从外部传入的header
export function getNavHeader(mode, param = {}) {
  let {header, getYmd} = param
  let that = this
  let theHeader = header || {}

  if (mode === 4) {
    let curMonth = this.allMonths[2]
    let ymd = getYmd(curMonth)
    let myDate = `${ymd.year}-${ymd.month}-1`
    let attrDate = `${ymd.year}-${ymd.month}`
    theHeader = {
      id: `menus-${ymd.year}-${ymd.month}`,
      title: [
        {title: '上一月', aim: `prevMonth?ym=${myDate}`},
        `${ymd.year}年${ymd.month}月`,
        {title: '下一月', aim: `nextMonth?ym=${myDate}`}
      ],
      attr: {
        date: attrDate
      },
      containerClass: 'calendar-nav',
      itemClass: 'calendar-nav-item mode4',
    }
    return theHeader
  }

  if (mode === 2 || mode === 3) {
    let allMonths = this.allMonths.map(item=>{
      let ymd = getYmd(item)
      let myDate = `${ymd.year}-${ymd.month}-1`
      let attrDate = `${ymd.year}-${ymd.month}`
      return {
        id: `menus-${ymd.year}-${ymd.month}`,
        title: `${ymd.year}-${ymd.month}`,
        aim: `gotoMonth?ym=${myDate}`,
        attr: {date: attrDate}
      }
    })
    theHeader['@list'] = {
      type: {
        is: 'scroll',
        'scroll-x': true,
      },
      data: allMonths,
      listClass: 'calendar-nav',
      itemClass: 'calendar-nav-item',
      methods: {
        __ready(){
          that.header = this
          this.selectedElement = ''
        },
        moveTo(){
          // let sysInfo = that.sysInfo
          // console.log(sysInfo);
          // let query = wx.createSelectorQuery().in(this)
          // query.selectAll('.calendar-nav >>> .calendar-nav-item').boundingClientRect(ret => {
          //   if (ret.length) {
          //     // console.log(ret);
          //   }
          // }).exec()
        },
        selected(date){
          if (this.selectedElement===date) return
          this.selectedElement = date
          // this.moveTo()
          // console.log(this.data.$list.data);
          let datas = this.data.$list.data
          let len = datas.length
          let index = -1
          this.forEach((item, ii) => {
            let $date = item.data.title
            if ($date === date) {
              index = ii
              item.addClass('.selected')
            } else {
              if (item.hasClass('.selected')) item.removeClass('.selected')
            }
          })
          if (~index) {
            let target = -1
            if (index === 0) {
              target = 0 
              this.update({ "type.scroll-left": 0 })
            } else {
              target = index - 3
              if (target > -1) {
                let targetItem = datas[target]
                let targetId = targetItem.id
                this.update({ "type.scroll-into-view": targetId })
              }
            }
          }
          // let findIt = this.find({date})
          // if (findIt) {
          //   this.forEach(item=>item.removeClass('selected'))
          //   findIt.addClass('selected')
          // }
        },
        gotoMonth(e, param, inst){
          let coptions = that.coptions
          let navTap = coptions.navTap
          let activePage = that.activePage
          // inst.siblings().removeClass('selected')
          // inst.addClass('selected')

          // let curDate = getYmd(param.ym)
          // let instId = `${that.calenderId}-${curDate.year}-${curDate.month}`
          // let monInst = activePage.getElementsById(instId)
          that.goto(param.ym)

          if (navTap) {
            if (that[navTap]) {
              that[navTap](e, param, inst)
            }
            if (typeof activePage[navTap] === 'function') {
              activePage[navTap].call(activePage, e, param, inst)
            }
          }
        }
      }
    }
    return theHeader
  }
}