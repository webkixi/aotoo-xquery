function _long(cb) {
  wx.vibrateLong({
    success() {
      if (typeof cb === 'function') cb()
    }
  })
}

function _short(cb) {
  wx.vibrateShort({
    success() {
      if (typeof cb === 'function') cb()
    }
  })
}

function loopVibrate(v, time, cb) {
  let count = parseInt(time / 15);
  let index = 0;
  let interval = setInterval(function () {
    v()
    index++;
    if (index > count) {
      clearTimeout(interval);
      interval = null;
      if (typeof cb === 'function') cb()
    }
  }, 15)
}

export function vibrateLong(time, cb) {
  if (time && typeof time === 'number') {
    loopVibrate(_long, time, cb)
  } else {
    if (typeof time === 'function') cb = time
    _long(cb)
  }
}

export function vibrateShort(time, cb) {
  if (time && typeof time === 'number') {
    loopVibrate(_short, time, cb)
  } else {
    if (typeof time === 'function') cb = time
    _short(cb)
  }
}