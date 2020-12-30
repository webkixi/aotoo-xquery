// 月份加减时，计算超出边界时的正确时间
// 如12月 + 1，1月 - 1
export function rightYmd(ym, count = 1) {
  ym.month += count
  let monthDiff = (ym.month % 12)
  // let yearDiff = Math.abs(monthDiff) > 0 ? parseInt(ym.month / 12) : parseInt(ym.month / 12)-1
  let yearDiff = monthDiff > 0 ? parseInt(ym.month / 12) : parseInt(ym.month / 12) - 1
  ym.year += yearDiff
  ym.month = monthDiff === 0 ? 12 : monthDiff < 0 ? monthDiff + 12 : monthDiff
  return ym
}