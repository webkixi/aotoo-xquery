export function newDate(timepoint) {
  if (timepoint) {
    if (timepoint.getDate && timepoint.getFullYear) return timepoint

    if (typeof timepoint === 'number') {
      return new Date(timepoint)
    }

    if (typeof timepoint === 'string') {
      let ary = timepoint.split('-')
      if (ary.length === 2) {
        timepoint += '-1'
      }
      timepoint = timepoint.replace(/\-/g, '/')
      // timepoint = timepoint.replace(/\:/g, '/')
      return new Date(timepoint)
    }
  } else {
    return new Date()
  }
}