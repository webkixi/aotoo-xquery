/**
 * xquery是一套小程序的开发工具库
 * 说明: 在小程序中搜索 xquery，更多demo和说明
 * 源码: https://github.com/webkixi/aotoo-xquery
 * 小程序代码片段: https://developers.weixin.qq.com/s/oONQs1mf7Uem
 */
const Pager = require('../../components/aotoo/core/index')
const mkCollapse = require('../../components/modules/collapse')
const lib = Pager.lib
const iKit = lib.innerKit
let source = require('../common/source')  

let key = 'JKDBZ-XZVLW-IAQR2-OROZ6-XR4G6-UYBD3'

// 搜索地区的...
function searchRegion(kw, region) {
  let opts = {
    keyword: encodeURI(kw),
    boundary: region ? `region(${encodeURI(region)}, 0)` : '',
    page_size: 10,
    page_index: 1,
    key
  }

  return new Promise((resolve, rej)=>{
    iKit.get('https://apis.map.qq.com/ws/place/v1/search', opts).then(res=>{
      resolve(res.data.data)
    })
  })
}

// 搜索附近的...
// function searchCircle(lat, lng, distance=1000) {
function searchCircle(kw, params={}) {
  let {lat, lng, distance} = params
  if (!lat && !lng) return 
  if (!distance) distance = 1000
  let opts = {
    keyword: encodeURI('快餐'),
    boundary: `nearby(${lat},${lng},${distance})`,
    orderby: '_distance', // _distance
    page_size: 20,
    page_index: 1,
    key
  }

  return new Promise((resolve, rej)=>{
    iKit.get('https://apis.map.qq.com/ws/place/v1/search', opts).then(res=>{
      resolve(res.data.data)
    })
  })
}

// 所在地的城市，省份等区域信息
function myCity(lat, lng) {
  return new Promise((resolve, rej)=>{
    let opts = {
      location: `${lat},${lng}`,
      key
    }
    
    iKit.get(`https://apis.map.qq.com/ws/geocoder/v1/`, opts).then(res => {
      resolve(res.data.result)
    })
  })
}


let locationPosition = null
let gData = {}

Pager({
  data: {
    collapsConfig: mkCollapse({
      data: [
        {
          title: '本地城市', 
          selected: true, 
          content: {
            title: '点击获取',
            aim(e, param, inst){
              if (locationPosition) {
                let loc = locationPosition
                if (gData.myCity) {
                  let {city, nation, province, city_code, adcode} = gData.myCity
                  inst.update({title: `国家: ${nation}，省份: ${province}，城市: ${city}`})
                } else {
                  myCity(loc.latitude, loc.longitude).then(res => {
                    gData.myCity = res.ad_info
                    let {city, nation, province, city_code, adcode} = gData.myCity
                    inst.update({title: `国家: ${nation}，省份: ${province}，城市: ${city}`})
                  })
                }
              }
            }
          }, 
        }, 
        {
          title: '搜索酒店，广州', 
          region: true,
          content: '搜索广州的酒店'
        },
        {
          title: '搜索快餐，附近1000米', 
          nearby: true,
          content: '附近的快餐'
        }
      ],
      tap(e, param){
        if (locationPosition) {
          if (param.region) {
            if (gData.region) {
              this.content(gData.region)
            } else {
              searchRegion('酒店', '广州').then(res=>{
                // item => ad_info{}, address, category, id, location{lat, lng}, tel, title
                let xxx = res.map(item=>item.title)
                gData.region = xxx
                setTimeout(() => this.content(xxx), 500);
              })
            }
          }

          if (param.nearby) {
            let loc = locationPosition
            if (gData.nearby) {
              this.content(gData.nearby)
            } else {
              searchCircle('快餐', {
                lat: loc.latitude,
                lng: loc.longitude,
                distance: 1000
              }).then(res=>{
                let xxx = res.map(item=>item.title)
                gData.nearby = xxx
                setTimeout(() => this.content(xxx), 500);
              })
            }
          }
        }
      },
    }),
    ...source
  },
  onLoad(){
    if (!key) {
      Pager.alert('请先开通腾讯位置服务，在小程序控制台中')
      return 
    }
    iKit.auth('userLocation').then(res => {
      wx.getLocation({
        type: 'wgs84',
        success(location) {
          locationPosition = location
        },
        fail() {}
      })
    }).catch(err => {
      Pager.alert('需要授权访问您的位置信息')
      wx.openSetting()
    })
  }
})
