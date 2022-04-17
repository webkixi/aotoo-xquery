import { rightDate } from "./rightymd";
import { getYmd } from "./getymd";
import { formatDate } from "./formatdate";
import { newDate } from "./newdate";
import { sortDates } from "./sortdates";
import { isLeapYear } from "./isleapyear";
import { getWeekday, weeksInMonth, weeksInYear } from "./getweekday";
import { getMonthData } from "./monthcount";
import { calendar as lunar } from '../common/lunar'

function diffDay(d1, d2){
  const day = 24 * 60 * 60 * 1000
  if (d1 && d2) {
    if (typeof d1 !== 'object' && typeof d2 !== 'object') {
      d1 = getYmd(d1)
      d2 = getYmd(d2)
    }
    let   diffstamp = d2.timestamp - d1.timestamp
    let   elds = diffstamp % day
    if (Math.abs(diffstamp) < day) {
      diffstamp = 0
      if (d1.day === d2.day) {
        elds = 0
      } else {
        elds = 1
      }
    }

    let   days = parseInt(diffstamp / day)
    if (elds) {
      days = days >= 0 ? days+1 : days-1
    }
    return days
  }
}

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
  weeksInYear,
  diffDay
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