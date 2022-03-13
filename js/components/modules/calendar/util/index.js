import { rightDate } from "./rightymd";
import { getYmd } from "./getymd";
import { formatDate } from "./formatdate";
import { newDate } from "./newdate";
import { sortDates } from "./sortdates";
import { isLeapYear } from "./isleapyear";
import { getWeekday, weeksInMonth, weeksInYear } from "./getweekday";
import { getMonthData } from "./monthcount";
import { calendar as lunar } from '../common/lunar'
export {
  rightDate,
  getYmd,
  formatDate,
  newDate,
  sortDates,
  isLeapYear,
  getWeekday,
  getMonthData,
  lunar,
  weeksInMonth,
  weeksInYear
}

wx.clendarUtil = {
  rightDate,
  getYmd,
  formatDate,
  newDate,
  sortDates,
  isLeapYear,
  getWeekday,
  getMonthData
}