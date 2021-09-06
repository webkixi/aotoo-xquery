//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
  globalAd: {
    // 不改这里，以后放的都是我的广告，那我就谢谢你了^_^
    discharged: true,
    banner: [  // banner广告 ad标签
      'adunit-6ef7f824e0e72db7',
    ],
    bannerv: [  // 视频广告, ad标签
      'adunit-f6015bf057c554bc'
    ],
    video: [  // 视频贴片广告, video标签
      'adunit-e82626df8a43557d'
    ],
    custom: [  // 自定义广告，ad-custom标签
      'adunit-5a7a9faae41036c1'
    ],
    insert: [  // 插屏广告，无需标签
      'adunit-01c539b82586ad3b'
    ],
    excitation: [],  // 激励视屏广告，无需标签
    "excitation-long": []  // 激励视频广告长，无需标签
  }
})