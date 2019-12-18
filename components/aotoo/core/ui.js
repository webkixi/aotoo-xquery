export function alert(text='', suc, cce) {
  let title = ''
  let content = text
  let props = {}
  let property = ['cancelText', 'cancelColor', 'confirmText', 'confirmColor']
  if (text && typeof text == 'object') {
    title = text.title || ''
    content = text.content || ''
    property.forEach(kn => {
      if (text.hasOwnProperty(kn)) {
        props[kn] = text[kn]
      }
    })
  }


  if (typeof cce === 'function' || typeof suc === 'function') {
    let dftProps = {
      title,
      content,
      success(res) {
        if (res.confirm) {
          suc && suc() // success
        } else if (res.cancel) {
          cce && cce() // cancel
        }
      }
    }
    let target = Object.assign({}, dftProps, props)
    wx.showModal(target)
  } else {
    wx.showModal({
      content,
      showCancel: false
    });
  }

}