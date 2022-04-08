import {hooks} from './hooks'
const app = require('../core/getapp')()
const ADHOOKS = hooks('ADS', true)
const sysInfo = wx.getSystemInfoSync()
const isDevtool = sysInfo.platform === 'devtools'

// 小程序广告id集合，手动输入
const ADIDS = Object.assign({
  excitation15: [],
  excitation30: [],
  custom: [],
  video: [],
  insert: [],
  bannder: [],
  bannderv: []
}, app.globalAd)

// 随机抽取广告id集合中的id，自动设置，无需处理
const selectedAd = {
  excitation15: null,  // 激励视屏广告15秒，异步, 直接执行方法，不需要引入模板
  excitation30: null,  // 激励视屏广告30秒，异步，直接执行方法，不需要引入模板
  insert: null,   // 插屏广告，异步，直接执行方法，不需要引入模板
  custom: null,  // 定制化广告，同步
  video: null,  // 秒视频广告，同步
  banner: null,   // 广告条，同步
  bannerv: null,   // 视频广告条，同步
}

let hassetAD = false
function randomAd(type='insert'){
  if (!hassetAD) {
    Object.keys(ADIDS).forEach(key=>{
      if (ADIDS[key]) hassetAD = true
    })
    if (!hassetAD) {
      console.warn('你还没有设置广告id，请先手动录入');
      return
    }
  }

  const ids = ADIDS[type]
  const len = ids.length
  let   index = 0
  if (len > 1) {
    index = Math.floor(Math.random()*(len+1));
  }
  selectedAd[type] = ids[index]
  return ids[index]
}

function createBannerControler(cb){
  const id = randomAd('banner')
  if (!id) {
    console.warn('你还没有录入任何banner广告条的id');
  }
  return id
}
function createBannervControler(cb){
  const id = randomAd('bannerv')
  if (!id) {
    console.warn('你还没有录入任何视频广告条的id');
  }
  return id
}

function createVideoControler(cb){
  const id = randomAd('video')
  if (!id) {
    console.warn('你还没有录入任何视频广告的id');
  }
  return id
}

function createCustomControler(){
  const id = randomAd('custom')
  if (!id) {
    console.warn('你还没有录入任何自定义广告的id');
  }
  return id

}


// 视频激励广告
function createExcitationControler(longVideo, cb){
  if (typeof longVideo === 'function') {
    cb = longVideo;
    longVideo = undefined
  }
  const type = longVideo ? 'excitation30' : 'excitation15'
  if (wx.createRewardedVideoAd) {
    const result = randomAd(type)
    if (!result) {
      console.warn('你还没有录入任何激励广告的id');
      ADHOOKS.emit('EXCITATION-ERROR')
      return
    } else {
      const adInstance = wx.createRewardedVideoAd({ adUnitId: selectedAd[type] })
      adInstance.offLoad()
      adInstance.offError()
      adInstance.offClose()
      adInstance.onLoad(() => {
        ADHOOKS.emit('EXCITATION-LOAD')
        /** 广告加载完成回调 */
      })
      adInstance.onError(() => {
        ADHOOKS.emit('EXCITATION-ERROR')
        /** 广告加载错误回调 */
      })
      adInstance.onClose(() => {
        /** 广告播放完成回调 */
        ADHOOKS.emit('EXCITATION-CLOSE')
      })
      if (typeof cb === 'function') cb(adInstance)
    }
  }
}

// 插屏广告
function createInsertAd(cb){
  const type = 'insert'
  if (wx.createRewardedVideoAd) {
    const result = randomAd(type)
    if (!result) {
      console.log('你还没有录入任何插屏广告的id');
      ADHOOKS.emit('INSERT-ERROR')
      return
    } else {
      const adInstance = wx.createInterstitialAd({ adUnitId: selectedAd[type] })
      adInstance.offLoad()
      adInstance.offError()
      adInstance.offClose()
      adInstance.onLoad(() => {
        ADHOOKS.emit('INSERT-LOAD')
        /** 广告加载完成回调 */
      })
      adInstance.onError(() => {
        ADHOOKS.emit('INSERT-ERROR')
        /** 广告加载错误回调 */
      })
      adInstance.onClose(() => {
        /** 广告播放完成回调 */
        ADHOOKS.emit('INSERT-CLOSE')
      })
      if (typeof cb === 'function') cb(adInstance)
    }
  }
}

// 激励视频广告
export function excitationAD(param={}, cb){
  const longVideo = param.longVideo

  ADHOOKS.once('EXCITATION-ERROR', function(){
    if (typeof cb === 'function') cb()
  })

  ADHOOKS.once('EXCITATION-CLOSE', function(){
    if (typeof cb === 'function') cb()
  })

  createExcitationControler(longVideo, controler=>{
    controler.show().catch(err=>{
      console.warn('激励视频广告显示失败')
      ADHOOKS.emit('EXCITATION-CLOSE')
    })
  })
}

// 插屏广告
export function insertAD(param={}, cb){
  ADHOOKS.once('INSERT-ERROR', function(){
    if (typeof cb === 'function') cb()
  })

  ADHOOKS.once('INSERT-CLOSE', function(){
    if (typeof cb === 'function') cb()
  })

  createInsertAd(controler=>{
    controler.show().catch((err) => {
      console.error(err)
      ADHOOKS.emit('INSERT-CLOSE')
    })
  })
}


// 广告条
// <ad unit-id="adunit-6ef7f824e0e72db7"></ad>
export function bannerAD(param={}, cb){
  createBannerControler()
  const selectedADid = selectedAd['banner']
  const adConfig = {
    type: 'ad',
    'unit-id': selectedADid,
  }
  if (typeof cb === 'function') cb(adConfig)
  return adConfig
}

// 视频广告条
// <ad unit-id="adunit-f6015bf057c554bc" ad-type="video" ad-theme="white"></ad>
export function bannervAD(param={}, cb){
  createBannervControler()
  const selectedADid = selectedAd['bannerv']
  const adConfig = {
    type: 'ad',
    'unit-id': selectedADid,
    'ad-type': 'video',
    'ad-theme': 'white'
  }
  if (typeof cb === 'function') cb(adConfig)
  return adConfig
}

// 视频帖广告条
// 开发者需在video标签中添加unit-id参数，其他参数参见video组件使用文档
// <video unit-id="adunit-e82626df8a43557d"></video>
export function videoAD(param={}, cb){
  createVideoControler()
  const selectedADid = selectedAd['video']
  const adConfig = {
    type: 'video',
    'unit-id': selectedADid,
  }
  if (typeof cb === 'function') cb(adConfig)
  return adConfig
}

// 视频帖广告条
// <ad-custom unit-id="adunit-5a7a9faae41036c1"></ad-custom>
export function customAD(param={}, cb){
  createCustomControler()
  const selectedADid = selectedAd['custom']
  const adConfig = {
    type: 'ad-custom',
    'unit-id': selectedADid,
  }
  if (typeof cb === 'function') cb(adConfig)
  return adConfig
}

function discharged(param){
  let accessPlay = true
  if (isDevtool) {
    accessPlay = (app.globalAd && app.globalAd.discharged) || false
  }
  return accessPlay
}

// ad('banner'), ad('video')
// ad('insert', [{}], function(){})  ad('excitation', [{}], function(){})
export function ad(type, param, cb) {
  if (!app.globalAd) {
    console.warn(`
您使用了广告配置，请在app.js中配置globalAd字段
globalAd: {
  discharged: false,  // 开发环境下是否放行广告，默认阻止
  banner: ['ad-id', '...'],  // banner广告
  bannerv: ['ad-id', '...'],  // 视频广告
  video: ['ad-id', '...'],   //视频贴片广告
  custom: ['ad-id', '...'],   //自定义
  insert: ['ad-id', '...'],   //插屏广告
  excitation: ['ad-id', '...'],   //激励视屏广告(15秒)
  excitation-long: ['ad-id', '...'],   //激励长视屏广告(30秒)
}
    `);
    return {}
  }
  if (typeof param === 'function') {
    cb = param
    param = {}
  }
  
  if (typeof type === 'object') {
    param = type
    
    type = param.type;
    delete param.type;

    cb = param.cb
    delete param.cb
  }

  const types = ['banner', 'bannerv', 'video', 'custom', 'insert', 'excitation', 'excitation-long']
  const typesFun = [bannerAD, bannervAD, videoAD, customAD, insertAD, excitationAD, excitationAD]
  if (types.indexOf(type) > -1) {
    const index = types.indexOf(type)
    const adFunction = typesFun[index]
    if (discharged(param)) {
      if (type === 'excitation-long') {
        param.longVideo = true
        adFunction(param, cb)
      } else if(['insert', 'excitation'].indexOf(type) > -1) {
        adFunction(param, cb)
      } else {
        return adFunction(param, cb)
      }
    }
  }
}
