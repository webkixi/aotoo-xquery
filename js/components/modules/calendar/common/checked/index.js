import eventSingle from './single'
import eventMultiple from './multiple'
import eventRange from './range'
import checkedDefaultValue from './defaultvalue'

export {
  eventSingle,
  eventMultiple,
  eventRange,
  checkedDefaultValue
}

export function eventIndex(e, {
  inst,
  options,
}){
  const $data = inst.getData()
  const attr = inst.attr()
  const date = attr.timestr
  let   params = {date, ...attr, lunarDate: $data.lunarDate}
  let   deliverCustomCallback = true
  let   prevCheckedInst = null
  const $$ = this.activePage.getElementsById.bind(this.activePage)

  if (options.type === 'single') {
    const prevCheckedDate = this.rangeChecked[0]
    if (prevCheckedDate) {
      prevCheckedInst = prevCheckedDate.dateInst
    }
    deliverCustomCallback = eventSingle.call(this, {
      e,
      inst,
      options
    })
  }

  if (options.type === 'multiple') {
    deliverCustomCallback = eventMultiple.call(this, {
      e,
      inst,
      options
    })
  }

  if (options.type === 'range') {
    deliverCustomCallback = eventRange.call(this, {
      e,
      inst, 
      options,
      $$
    })
  }

  if (deliverCustomCallback) {
    if (options.type === 'single') {
      inst.prevCheckedInst = prevCheckedInst
    }

    if (e.type === 'tap') {
      if (typeof options.tap === 'function') {
        if (typeof deliverCustomCallback === 'object') {
          params = Object.assign({}, params, deliverCustomCallback)
        }
        options.tap.call(this, e, params, inst)
      }
    }

    if (e.type === 'longpress') {
      if (typeof options.longpress === 'function') {
        if (typeof deliverCustomCallback === 'object') {
          params = Object.assign({}, params, deliverCustomCallback)
        }
        options.longpress.call(this, e, params, inst)
      }
    }
  }

}