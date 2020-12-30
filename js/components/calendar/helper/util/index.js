import { rightYmd } from "./rightymd";
import { getYmd } from "./getymd";
import { formatDate } from "./formatdate";
import { newDate } from "./newdate";
import { sortDates } from "./sortdates";
import { isLeapYear } from "./isleapyear";
import { getWeekday } from "./getweekday";
import { getMonthCount, getNextMonthCount, getPreMonthCount } from "./monthcount";

export {
  rightYmd,
  getYmd,
  formatDate,
  newDate,
  sortDates,
  isLeapYear,
  getWeekday,
  getMonthCount, getNextMonthCount, getPreMonthCount
}

wx.clendarUtil = {
  rightYmd,
  getYmd,
  formatDate,
  newDate,
  sortDates,
  isLeapYear,
  getWeekday,
  getMonthCount, getNextMonthCount, getPreMonthCount
}