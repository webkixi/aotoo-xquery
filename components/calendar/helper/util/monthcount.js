import { isLeapYear } from "./isleapyear";

// 2.获得每个月的日期有多少，注意 month - [0-11]
export function getMonthCount(year, month, isCount) {
  let arr = [
    31, null, 31, 30,
    31, 30, 31, 31,
    30, 31, 30, 31
  ];
  let count = arr[month] || (isLeapYear(year) ? 29 : 28);
  if (isCount) return count
  return Array.from(new Array(count), (item, value) => value + 1);
}

// 4.获得上个月的天数
export function getPreMonthCount(year, month) {
  if (month === 0) {
    return getMonthCount(year - 1, 11);
  } else {
    return getMonthCount(year, month - 1);
  }
}

// 5.获得下个月的天数
export function getNextMonthCount(year, month) {
  if (month === 11) {
    return getMonthCount(year + 1, 0);
  } else {
    return getMonthCount(year, month + 1);
  }
}