import { newDate } from "./newdate";
// 3.获得某年某月的 1号 是星期几，这里要注意的是 JS 的 API-getDay() 是从 [日-六](0-6)，返回 number
export function getWeekday(year, month) {
  let date = new Date(year, month, 1);
  return date.getDay();
}