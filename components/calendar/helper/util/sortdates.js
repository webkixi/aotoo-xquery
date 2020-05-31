import { newDate } from "./newdate";
import { formatDate } from "./formatdate";
const Core = require('../../../aotoo/core/index')
const lib = Core.lib

export function sortDates(params) {
  if (lib.isArray(params)) {
    params = params.filter(item => {
      if (item.date) {
        item.date = formatDate(item.date)
        return item
      }
    })

    return params.sort((a, b) => {
      let astamp = newDate(a.date)
      let bstamp = newDate(b.date)
      return astamp - bstamp
    })
  }
}