import { newDate } from "./newdate";
import { getMonthData } from "./monthcount";

// 获取年月日
// 接受时间 戳或者/2019-10-1/2019:10:1 输入格式
// export function getYmd(year, month, day) {
export function getYmd(timepoint) {
  const nowDate = timepoint ? newDate(timepoint) : newDate()
  const year = nowDate.getFullYear()
  const month = nowDate.getMonth() + 1
  const day = nowDate.getDate()
  const timestamp = nowDate.getTime()
  const timestr = `${year}-${month}-${day}`
  const days = getMonthData(year, month, true)
  const hour = nowDate.getHours()
  const minute = nowDate.getMinutes()
  const second = nowDate.getSeconds()
  const millisecond = nowDate.getMilliseconds()

  return {year, month, day, days, timestamp, timestr, hour, second, millisecond, minute}
}