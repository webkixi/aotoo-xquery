import { rightDate } from "./rightymd";
import { getYmd } from "./getymd";
import { formatDate } from "./formatdate";
import { newDate } from "./newdate";
import { sortDates } from "./sortdates";
import { isLeapYear } from "./isleapyear";
import { getWeekday } from "./getweekday";
import { getMonthData } from "./monthcount";

export {
  rightDate,
  getYmd,
  formatDate,
  newDate,
  sortDates,
  isLeapYear,
  getWeekday,
  getMonthData
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