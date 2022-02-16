import { newDate } from "./newdate";
import { getMonthData } from "./monthcount";

// 获取年月日
// 接受时间 戳或者/2019-10-1/2019:10:1 输入格式
export function getYmd(timepoint) {
  const daystamp = 24 * 60 * 60 * 1000
  let nowDate = timepoint ? newDate(timepoint) : newDate()
  let year = nowDate.getFullYear()
  let month = nowDate.getMonth() + 1
  let day = nowDate.getDate()
  let timestamp = nowDate.getTime()
  let timestr = `${year}-${month}-${day}`
  let days = getMonthData(year, month, true)
  let hour = nowDate.getHours()
  let minute = nowDate.getMinutes()
  let second = nowDate.getSeconds()
  let millisecond = nowDate.getMilliseconds()

  function offset(num){
    if (num) {
      const offsetstamp = timestamp + daystamp * num
      return getYmd(offsetstamp)
    }
  }
  return {year, month, day, days, timestamp, timestr, hour, second, millisecond, minute, offset}
}