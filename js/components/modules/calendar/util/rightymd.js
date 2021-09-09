// 月份加减时，计算超出边界时的正确时间
// 如12月 + 1，1月 - 1
// 计算在指定日期上增减的新日期
export function rightDate(timepoint, count = 1) {
  let {year, month, day} = timepoint
  let tmp = month + count
  let rightMonth = -1
  let rightYear = year

  if (tmp < 0) {
    let $tmp = Math.abs(tmp)
    let overYear = Math.floor($tmp/12)
    let overMonth = 12 - $tmp%12
    
    rightYear = rightYear - overYear
    if (($tmp/12) >= overYear) {
      rightYear = year - overYear - 1
    }

    rightMonth = overMonth
  }
  
  if (tmp === 0) {
    rightMonth = 12
    rightYear = year - 1
  } 

  if (tmp > 0) {
    let overYear = Math.floor(tmp/12)
    let overMonth = tmp%12 || 12
    
    rightYear = rightYear + overYear - 1
    if ((tmp/12) > overYear) {
      rightYear = year + overYear
    }

    rightMonth = overMonth
  } 

  return {
    year: rightYear,
    month: rightMonth,
    day
  }

  // let {year, month, day} = timepoint
  // month = month + count
  // let overflowYear = Math.floor(month/12)
  // let rightMonth = month % 12 || 12
  // if (rightMonth === 12) overflowYear = overflowYear - 1
  // return {
  //   year: year + overflowYear,
  //   month: rightMonth,
  //   day
  // }

}