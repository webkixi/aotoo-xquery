const Core = require('../../../aotoo/core/index')
const lib = Core.lib

export function newDate(timepoint) {
  if (timepoint) {
    if (timepoint.getDate && timepoint.getFullYear) return timepoint

    if (lib.isNumber(timepoint)) {
      return new Date(timepoint)
    }

    if (lib.isString(timepoint)) {
      timepoint = timepoint.replace(/\-/g, '/')
      timepoint = timepoint.replace(/\:/g, '/')
      return new Date(timepoint)
    }
  } else {
    return new Date()
  }
}