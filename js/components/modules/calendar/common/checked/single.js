// 单击选择
export default function({
  inst
}){
  let   rangeChecked = this.rangeChecked
  const attr = inst.attr()
  const date = attr.timestr
  const params = {date, ...attr}
  const prevCheckedDate = rangeChecked[0]
  if (prevCheckedDate) {
    const prevCheckedInst = prevCheckedDate.dateInst
    if (prevCheckedInst.uniqId !== inst.uniqId) {
      inst.toggleClass('selected')
      prevCheckedInst && prevCheckedInst.reset()
      this.rangeChecked = [{dateInst: inst, ...params}]
    }
  } else {
    inst.toggleClass('selected')
    this.rangeChecked = [{dateInst: inst, ...params}]
  }
  this.value = [date]
  return true  // 返回true，允许执行用户的回调方法
}