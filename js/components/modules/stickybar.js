module.exports = function (params = {}) {
  let itemClass = 'sticky-bar'
  let type = params.type || 'top'
  if (type === 'bottom') itemClass += ' bottom'
  if (params.itemClass) itemClass += ' ' + params.itemClass
  params.itemClass = itemClass

  if (!params.title) params.title = '按钮'
  return params
}