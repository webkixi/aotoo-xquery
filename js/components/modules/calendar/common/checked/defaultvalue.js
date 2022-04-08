import eventRange from './range'
import eventSingle from './single'

function setDefaultValue({
  $value, 
  validMonth, 
  options,
}){
  const value1 = $value[0]
  const value2 = $value[1]
  const allCheckMonth = $value.map(val=>`${val.year}-${val.month}`)
  const checkedMonth = []
  const $$ = this.activePage.getElementsById.bind(this.activePage)
  const rangeTip = options.rangeTip || []

  validMonth.forEach(month=>{
    const attr = month.attr
    const monthstr = `${attr.timepoint.year}-${attr.timepoint.month}`
    if (allCheckMonth.includes(monthstr)) {
      checkedMonth.push(attr.timepoint)
    }
  })

  /**
   * 单选
   */
  if (options.type === 'single') {
    const mon = checkedMonth[0]
    const monInst1 = $$(`${mon.year}-${mon.month}`)
    monInst1.forEach(bro=>{
      const broAttr = bro.attr()
      if (broAttr.timestr === value1.timestr) {
        // const inst = $$(broAttr.timestr)
        const inst = bro
        inst.toggleClass('selected', function(){
          // if (rangeTip[0]) {
          //   const $data = inst.getData()
          //   const $dot = $data.dot || []
          //   $dot.push(rangeTip[0])
          //   inst.update({dot: $dot})
          // }
        })
        this.rangeChecked = [{dateInst: inst, date: broAttr.timestr, ...broAttr}]
      }
    })
  }

  /**
   * 多选
   */
  if (options.type === 'multiple') {
    checkedMonth.forEach(mon=>{
      const monInst = $$(`${mon.year}-${mon.month}`)
      monInst.forEach(bro=>{
        const broAttr = bro.attr()
        if (broAttr.timestr === value1.timestr) {
          const inst = $$(broAttr.timestr)
          inst.toggleClass('selected')
          this.rangeChecked = (this.rangeChecked||[]).concat({dateInst: inst, date: broAttr.timestr, ...broAttr})
        }
      })
    })
  }

  /**
   * 区间选择
   */
  if (options.type === 'range') {
    const mon1 = checkedMonth[0]
    const mon2 = checkedMonth[1] || mon1
    const monInst1 = $$(`${mon1.year}-${mon1.month}`)

    monInst1.forEach(bro=>{
      const broAttr = bro.attr()
      if (broAttr.timestr === value1.timestr) {
        // const inst = $$(broAttr.timestr)
        const inst = bro
        this.rangeChecked = [{dateInst: inst, date: broAttr.timestr, ...broAttr}]
      }
      if (mon1.timestr === mon2.timestr) {
        if (broAttr.timestr === value2.timestr) {
          // const inst = $$(broAttr.timestr)
          const inst = bro
          this.rangeChecked[1] = {dateInst: inst, date: broAttr.timestr, ...broAttr}
        }
      }
    })

    if (mon1.timestr !== mon2.timestr) {
      const monInst2 = $$(`${mon2.year}-${mon2.month}`)
      monInst2.forEach(bro=>{
        const broAttr = bro.attr()
        if (broAttr.timestr === value2.timestr) {
          // const inst = $$(broAttr.timestr)
          const inst = bro
          this.rangeChecked[1] = {dateInst: inst, date: broAttr.timestr, ...broAttr}
        }
      })
    }

    if (this.rangeChecked.length === 2) {
      const that = this
      const tempValue2 = this.rangeChecked[1]
      const tempInst = tempValue2.dateInst
      this.rangeChecked = this.rangeChecked.splice(0, 1)
      const inst = this.rangeChecked[0].dateInst
      // inst.toggleClass('selected', function(){
      //   if (rangeTip[0]) {
      //     const $data = inst.getData()
      //     let   tip = rangeTip[0]
      //     let   $dot = $data.dot||[]
      //     let   $body = $data.body
      //     let   $footer = $data.footer

      //     if (typeof tip === 'string') {
      //       tip = {title: tip}
      //     }
      //     if (tip.body || tip.footer || tip.ready || tip.created || tip.attached) {
      //       $body = tip.body && ($body||[]).concat(tip.body)
      //       $footer = tip.footer && ($footer||[]).concat((tip.footer))
      //       $dot = tip.dot && ($dot||[]).concat((tip.dot))

      //       $body ? $data.body = $body : ''
      //       $footer ? $data.footer = $footer : ''
      //       $dot ? $data.dot = $dot : ''

      //       tip.ready ? $data.ready  = tip.ready : ''
      //       tip.created ? $data.created  = tip.created : ''
      //       tip.attached ? $data.attached  = tip.attached : ''
      //       inst.update($data)
      //     } else {
      //       $dot.push(tip)
      //       inst.update({dot: $dot})
      //     }
      //   }
      //   setTimeout(() => {
      //     eventRange.call(that, {
      //       startInst: inst,
      //       inst: tempInst,
      //       options,
      //       $$
      //     })
      //   }, 50);
      // })
      setTimeout(() => {
        eventRange.call(that, {
          inst: tempInst,
          options,
          $$
        })
      }, 50);
    }
  }
}


export default function checkedDefaultValue(param={}) {
  const {
    $value, 
    validMonth, 
    options,
    timePoint
  } = param
  return new Promise((resolve, reject) => {
    const value1 = $value[0]
    if (value1.year !== timePoint.year || value1.month !== timePoint.month) {
      return
    } else {
      setTimeout(() => {
        setDefaultValue.call(this, param)
        setTimeout(() => {
          resolve(true)
        }, 400);
      }, 300);
    }
  })
}