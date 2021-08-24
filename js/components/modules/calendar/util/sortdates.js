import { newDate } from "./newdate";
import { formatDate } from "./formatdate";

const isArray = (params) => {
  if (typeof params === 'object') {
    return Array.isArray(params)
  }
}

export function sortDates(params) {
  if (isArray(params)) {
    let tmp = []
    params.forEach(item => {
      if (typeof item === 'string') {
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