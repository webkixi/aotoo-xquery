export function alert(text='', suc, cce) {
  let title = ''
  let content = text
  let props = {}
  let property = ['cancelText', 'cancelColor', 'confirmText', 'confirmColor']

  if (typeof text === 'string' && typeof suc === 'object') {
    props = suc
    suc = null
  }

  if (typeof text == 'object' && !Array.isArray(text)) {
    title = text.title || ''
    content = text.content || ''
    property.forEach(kn => {
      if (text.hasOwnProperty(kn)) {
        props[kn] = text[kn]
      }
    })
  }

  if (typeof text === 'object' && Array.isArray(text)) {
    let title = text[0]
    let content = text[1]
    props = text[2] || suc || {}
    if (typeof content === 'object') {
      props = content
      content = title
      title = ''
    }
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
    if (typeof suc === 'string') {
      title = content
      content = suc
      suc = null
      wx.showModal({
        title,
        content,
        showCancel: false
      });
    } else {
      wx.showModal({
        content,
        showCancel: false
      });
    }
  }
}