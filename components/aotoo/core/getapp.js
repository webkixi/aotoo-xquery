let likeGlobalApp = {}

let tmp = null
module.exports = function(app, isParam) {
  if (getApp) {
    tmp = app || (isParam ? getApp(app) : getApp())
  } else {
    tmp = likeGlobalApp
  }

  if (tmp && !tmp.__active_page__) {
    tmp.__active_page__ = []
  }

  return tmp
}