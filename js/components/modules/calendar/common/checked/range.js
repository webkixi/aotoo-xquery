function renderRangeTip(rangeTip, index, inst){
  inst.toggleClass('selected')
  if (rangeTip[index]) {
    const $data = inst.getData()
    let   tip = rangeTip[index]
    let   $dot = $data.dot
    let   $body = $data.body
    let   $footer = $data.footer

    if (typeof tip === 'string') {
      tip = {title: tip}
    }
    if (tip.body || tip.footer || tip.ready || tip.created || tip.attached) {
      $body = tip.body && ($body||[]).concat(tip.body)
      $footer = tip.footer && ($footer||[]).concat((tip.footer))
      $dot = tip.dot && ($dot||[]).concat((tip.dot))

      $body ? $data.body = $body : ''
      $footer ? $data.footer = $footer : ''
      $dot ? $data.dot = $dot : ''

      tip.ready ? $data.ready  = tip.ready : ''
      tip.created ? $data.created  = tip.created : ''
      tip.attached ? $data.attached  = tip.attached : ''
      inst.update($data)
    } else {
      $dot.push(tip)
      inst.update({dot: $dot})
    }
  }
}

// 区间选择
export default function({
  inst, 
  options,
  $$,
  e
}){
  let   deliverCustomCallback = true
  let   rangeChecked = this.rangeChecked
  const attr = inst.attr()
  const date = attr.timestr
  const params = {date, ...attr}
  const len = rangeChecked.length

  const daystamp = 24 * 60 * 60 * 1000
  const rangeCount = options.rangeCount
  const rangeTip = options.rangeTip

  if (len === 0) {
    renderRangeTip(rangeTip, 0, inst)
    params.range = 'start'
    rangeChecked = [{dateInst: inst, ...params}]
  } 
  
  else if (len === 1) {
    this.rangeSelect = []
    const startDate = rangeChecked[0]
    const startInst = startDate.dateInst
    const startAttr = startInst.attr()
    const endAttr   = params

    const diffdays = parseInt((endAttr.timestamp - startDate.timestamp) / daystamp)
    params.dateDiff = diffdays
    if (diffdays > rangeCount) {
      deliverCustomCallback = params
      return deliverCustomCallback
    }

    // 区间日期
    if (endAttr.timestamp > startAttr.timestamp) {
      const dateSelect = this.rangeSelect
      startInst.siblings().forEach(bro=>{
        const broAttr = bro.attr()
        if ( broAttr.timestamp > startAttr.timestamp &&
          broAttr.timestamp < endAttr.timestamp &&
          broAttr.month === startAttr.month
        ) {
          dateSelect.push({broInst: bro, ...broAttr})
        }
      })

      let lastSelect = dateSelect[(dateSelect.length-1)] || startAttr


      let diffMonth = 0
      if (lastSelect.year === endAttr.year) {
        diffMonth = endAttr.month - lastSelect.month - 1
      } else {
        if (endAttr.year > lastSelect.year) {
          diffMonth = (12 - lastSelect.month + (endAttr.month - 1))
        }
      }
      if (diffMonth > 0) {
        for (let ii=1; ii<=diffMonth; ii++) {
          const middleDatePoint = rightDate(startAttr, ii)
          const middleMonth = `${middleDatePoint.year}-${middleDatePoint.month}`
          const middleMonthInst = $$(middleMonth)
          middleMonthInst.forEach(bro=>{
            const broAttr = bro.attr()
            if (broAttr.month === middleDatePoint.month) {
              dateSelect.push({broInst: bro, ...broAttr})
            }
          })
        }
        lastSelect = dateSelect[(dateSelect.length-1)]
      }

      if (lastSelect) {
        if (lastSelect.month < endAttr.month || lastSelect.year < endAttr.year) {
          inst.siblings().forEach(bro=>{
            const broAttr = bro.attr()
            if ( broAttr.timestamp < endAttr.timestamp ) {
              dateSelect.push({broInst: bro, ...broAttr})
            }
          })
          lastSelect = dateSelect[(dateSelect.length-1)]
        }
      }

      const tempSelect = [startInst, ...dateSelect, inst]
      tempSelect.forEach((select, ii)=>{
        const selectInst = select.broInst || select
        if (select.broInst) {
          selectInst.toggleClass('range')
        } else {
          if (ii === 0) {
            if (!e) {
              renderRangeTip(rangeTip, 0, selectInst)
            }
          } else {
            renderRangeTip(rangeTip, 1, selectInst)
          }
        }
      })

      this.rangeSelect = dateSelect
      params.range = 'end'
      rangeChecked[rangeChecked.length] = {dateInst: inst, ...params}
    } else if(endAttr.timestamp < startAttr.timestamp) {
      renderRangeTip(rangeTip, 0, inst)
      startInst.reset()
      params.range = 'start'
      rangeChecked = [{dateInst: inst, ...params}]
    } else {
      if (endAttr.timestamp === startAttr.timestamp) {
        inst.reset()
        deliverCustomCallback = false
        this.rangeChecked = []
        this.rangeSelect  = []
      }
    }
  } 
  
  else if (len >= 2) {
    const reStartInst = inst
    let   lazeTime = 30
    const tempSelect = [this.rangeChecked[0], ...this.rangeSelect, this.rangeChecked[1]]
    tempSelect.forEach((selected, ii)=>{
      const inst = selected.dateInst || selected.broInst
      inst.reset()
      if (inst.data.id === reStartInst.data.id) {
        lazeTime = 100
      }
    })

    setTimeout(() => {
      renderRangeTip(rangeTip, 0, reStartInst)
    }, lazeTime);

    this.rangeChecked = []
    this.rangeSelect  = []

    

    params.range = 'start'
    rangeChecked = [{dateInst: inst, ...params}]
  }
  this.rangeChecked = rangeChecked

  if (this.rangeChecked.length === 2) {
    this.value = [rangeChecked[0].date, rangeChecked[1].date]
  }

  deliverCustomCallback = params
  return deliverCustomCallback
}