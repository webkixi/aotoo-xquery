// 单击选择
export default function({
  inst
}){
  let   rangeChecked = this.rangeChecked||[]
  let   value = this.value || []
  const attr = inst.attr()
  const date = attr.timestr
  const params = {date, ...attr}
  const prevCheckedDate = rangeChecked[0]

  if (inst.hasClass('selected')) {
    inst.removeClass('selected')
    rangeChecked = rangeChecked.filter(dateobj=>dateobj.date !== date)
    value = value.filter(val=>val !== date)
  } else {
    inst.toggleClass('selected')
    rangeChecked = rangeChecked.concat({dateInst: inst, ...params})
    value = value.concat(date)
  }
  this.rangeChecked = rangeChecked
  this.value = value
  return true  // 返回true，允许执行用户的回调方法
}