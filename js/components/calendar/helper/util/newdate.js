const Core = require('../../../aotoo/core/index')
const lib = Core.lib

export function newDate(timepoint) {
  if (timepoint) {
    if (timepoint.getDate && timepoint.getFullYear) return timepoint

    if (lib.isNumber(timepoint)) {
      return new Date(timepoint)
    }

    if (lib.isString(timepoint)) {
      let ary = timepoint.split('-')
      if (ary.length === 2) {
        timepoint += '-1'
      }
      timepoint = timepoint.replace(/\-/g, '/')
      timepoint = timepoint.replace(/\:/g, '/')
      return new Date(timepoint)
    }
  } else {
    return new Date()
  }
}