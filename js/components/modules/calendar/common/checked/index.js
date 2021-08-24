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
  const $$ = this.activePage.getElementsById.bind(this.activePage)

  if (options.type === 'single') {
    deliverCustomCallback = eventSingle.call(this, {
      inst,
      options
    })
  }

  if (options.type === 'multiple') {
    deliverCustomCallback = eventMultiple.call(this, {
      inst,
      options
    })
  }

  if (options.type === 'range') {
    deliverCustomCallback = eventRange.call(this, {
      inst, 
      options,
      $$
    })
  }

  if (typeof options.tap === 'function' && deliverCustomCallback) {
    if (typeof deliverCustomCallback === 'object') {
      params = Object.assign({}, params, deliverCustomCallback)
    }
    options.tap.call(this, e, params, inst)
  }
}