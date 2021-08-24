import { isLeapYear } from "./isleapyear";
import { getYmd } from "./getymd"

export function getMonthData(year, month, isCount) {
  const monthDays = [
    31, 28, 31, 30,
    31, 30, 31, 31,
    30, 31, 30, 31
  ];
  const relativeMonth = month -1
  if (isLeapYear(year)) {
    monthDays[1] = 29
  }

  if (isCount) {
    return monthDays[relativeMonth]
  }

  return Array.from(new Array(monthDays[relativeMonth]), (tmp, index) => {
    return getYmd(`${year}-${month}-${(index + 1)}`)
  });
}