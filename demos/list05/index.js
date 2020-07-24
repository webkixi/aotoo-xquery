//index.js
//获取应用实例
const app = getApp()
const Pager = require('../common/extpager')
const lib = Pager.lib

function layoutPicTitle(params) {
  return {
    "@item": {
      id: params[0],
      img: {src: params[2], itemStyle: 'width: 100%;', preview: false},
      title: params[1],
      itemClass: 'appstore-item'
    }
  }
}

function layoutTitlePic(params) {
  return {
    "@item": {
      id: params[0],
      title: params[1],
      img: {src: params[2], itemStyle: 'width: 100%;', preview: false},
      itemClass: 'appstore-item reverse'
    }
  }
}

function layoutCoverPicTitle(params, isDark) {
  let darkClass = ''
  if (isDark) darkClass = ' dark'
  return {
    "@item": {
      id: params[0],
      title: params[1],
      img: {src: params[2], itemStyle: 'width: 100%;', preview: false},
      itemClass: 'appstore-item cover' + darkClass
    }
  }
}

function layoutCoverPicTitleBar(params){
  let pan = params[1][2]
  if (lib.isArray(pan)) {
    params[1][2] = {
      itemClass: 'banner',
      dot: pan
    }
  }
  let tmp = layoutCoverPicTitle(params)
  tmp["@item"].itemClass = tmp["@item"].itemClass + ' bar'
  return tmp
}

function layoutCoverPicTitleBarDark(params) {
  let tmp = layoutCoverPicTitleBar(params)
  tmp["@item"].itemClass += ' dark'
  return tmp
}

function layoutCoverPicTitleDark(params) {
  return layoutCoverPicTitle(params, true)
}

const menusData = [
  {
    ...layoutCoverPicTitle([
      'nav-3',
      ['星空故事汇', `仰望星空，那是我们向往的地方`, '科幻故事，探索太空，发现未知星系'],
      'http://www.agzgz.com/imgs/glasy.jpg',
    ])
  },
  {
    ...layoutPicTitle([
      'nav-1', // id
      ['小程序QUERYUI框架', '无需繁复、冗余de模板', 'template-less，用JS搞定所有事情'], // 小分类，标题，描述
      'http://www.agzgz.com/imgs/itemlist.jpg', // 图片
    ])
  },
  {
    ...layoutCoverPicTitleDark([
      'nav-4',
      ['探索', `想和你一直这样走下去`, '即将出发的旅程'],
      'http://www.agzgz.com/imgs/appstorecover-1.jpg',
    ])
  },
  {
    ...layoutCoverPicTitle([
      'nav-5',
      ['战神系列故事', `战栗的奥林匹斯众神们`],
      'http://www.agzgz.com/imgs/kts1.jpg',
    ])
  },
  {
    ...layoutTitlePic([
      'nav-6',
      ['生活解决方法', '随手翻译手中拿'],
      'http://www.agzgz.com/imgs/itemlist.jpg',
    ])
  },
  {
    ...layoutCoverPicTitleBarDark([
      'nav-7',
      [
        '星空故事汇', 
        `仰望星空，那是我们要探索的地方`, 
        [
          'app1',
          'app2',
          'app3',
          'app4'
        ]
      ],
      'http://www.agzgz.com/imgs/appstorecover-1.jpg',
    ])
  },
  {
    ...layoutCoverPicTitle([
      'nav-8',
      ['小米', `握不住的晶莹剔透 \n小米MIX`, '四面环绕屏，现正推出ALPHA版'],
      'http://www.agzgz.com/imgs/mob.jpg',
    ])
  },
]

Pager({
  data: {

    targetConfig: {
      $$id: 'menus-appstore-view',
      listClass: 'demo-list',
      itemClass: 'card demo-list-item',

      // 将listView，转换成scroll-view
      type: {
        'is': 'scroll',
        'scroll-y': true,
        'enable-flex': true,
      },

      data: menusData,
    },
  },
  
  onLoad(param) {
    let pageTitle = param.pageTitle
    if (pageTitle) {
      wx.setNavigationBarTitle({
        title: pageTitle
      })
    }
  },
  
})
