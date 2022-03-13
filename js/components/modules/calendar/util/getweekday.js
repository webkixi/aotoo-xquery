import { getYmd } from "./getymd";


// 3.获得某年某月的 1号 是星期几，这里要注意的是 JS 的 API-getDay() 是从 [日-六](0-6)，返回 number
export function getWeekday(year, month, day=1) {
  month = month - 1
  const date = new Date(year, month, day);
  return date.getDay();
}

// 日期在该月是第几周
// 星期天属于下一周
export function weeksInMonth(param){
  const ymd = getYmd(param)
  let count = getMonthWeek(ymd.year, ymd.month, ymd.day)
  let day = getWeekday(ymd.year, ymd.month, ymd.day)  //星期几
  if (day === 0) {
    count++
  }
  return count
}

// 日期在今年是第几周
// 星期天属于下一周
export function weeksInYear(param){
  const ymd = getYmd(param)
  let count = getYearWeek(ymd.year, ymd.month, ymd.day)
  let day = getWeekday(ymd.year, ymd.month, ymd.day)  //星期几
  if (day === 0) {
    count++
  }
  return count
}

function getMonthWeek(a, b, c) {
  /*
  a = d = 当前日期
  b = 6 - w = 当前周的还有几天过完(不算今天)
  a + b 的和在除以7 就是当天是当前月份的第几周
  */
  var date = new Date(a, parseInt(b) - 1, c), w = date.getDay(), d = date.getDate();
  return Math.ceil(
    (d + 6 - w) / 7
  );
};

function getYearWeek(a, b, c) {
  /*
  date1是当前日期
  date2是当年第一天
  d是当前日期是今年第多少天
  用d + 当前年的第一天的周差距的和在除以7就是本年第几周
  */
  var date1 = new Date(a, parseInt(b) - 1, c), date2 = new Date(a, 0, 1),
    d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
  return Math.ceil(
    (d + ((date2.getDay() + 1) - 1)) / 7
  );
};