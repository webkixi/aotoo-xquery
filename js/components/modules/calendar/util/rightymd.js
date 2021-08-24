// 月份加减时，计算超出边界时的正确时间
// 如12月 + 1，1月 - 1
// 计算在指定日期上增减的新日期
export function rightDate(timepoint, count = 1) {
  let {year, month, day} = timepoint
  month = month + count
  let overflowYear = Math.floor(month/12)
  let rightMonth = month % 12 || 12
  if (rightMonth === 12) overflowYear = overflowYear - 1
  return {
    year: year + overflowYear,
    month: rightMonth,
    day
  }
}