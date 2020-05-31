import { newDate } from "./newdate";

// 获取年月日
// 接受时间 戳或者/2019-10-1/2019:10:1 输入格式
// export function getYmd(year, month, day) {
export function getYmd(timepoint) {
  let nowDate = newDate()
  if (timepoint) nowDate = newDate(timepoint)
  let year = nowDate.getFullYear()
  let month = (nowDate.getMonth()+1)
  let day = nowDate.getDate()
  return {year, month, day}
}