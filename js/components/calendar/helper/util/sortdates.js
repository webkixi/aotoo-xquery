import { newDate } from "./newdate";
import { formatDate } from "./formatdate";
const Core = require('../../../aotoo/core/index')
const lib = Core.lib

export function sortDates(params) {
  if (lib.isArray(params)) {
    let tmp = []
    params.forEach(item => {
      if (lib.isString(item)) {
        item = {date: item}
      }
      
      if (item.date) {
        item.date = formatDate(item.date)
      }

      tmp.push(item)
    })

    params = tmp

    return params.sort((a, b) => {
      let astamp = newDate(a.date)
      let bstamp = newDate(b.date)
      return astamp - bstamp
    })
  }
}