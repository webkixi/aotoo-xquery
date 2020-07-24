//index.js
//获取应用实例
const app = getApp()
const Pager = require('../common/extpager')
const lib = Pager.lib

const srcs = [
  { src: 'http://www.agzgz.com/imgs/wxavatar6.jpg', itemStyle: 'width: 48px;' },
  { src: 'http://www.agzgz.com/imgs/wxavatar6.jpg', itemStyle: 'width: 48px;'},
  { src: 'http://www.agzgz.com/imgs/wxavatar5.jpg', itemStyle: 'width: 48px;' },
  { src: 'http://www.agzgz.com/imgs/wxavatar4.jpg', itemStyle: 'width: 48px;' },
  { src: 'http://www.agzgz.com/imgs/wxavatar3.jpg', itemStyle: 'width: 48px;' },
  { src: 'http://www.agzgz.com/imgs/wxavatar3.jpg', itemStyle: 'width: 48px;' },
  { src: 'http://www.agzgz.com/imgs/wxavatar2.png', itemStyle: 'width: 48px;' },
  { src: 'http://www.agzgz.com/imgs/wxavatar1.png', itemStyle: 'width: 48px;' },
  { src: 'http://www.agzgz.com/imgs/wxavatar.png', itemStyle: 'width: 48px;' },
  { src: 'http://www.agzgz.com/imgs/wxavatar.png', itemStyle: 'width: 48px;' },
]

const src = () => {
  let index = Math.floor(Math.random() * 10);
  // return srcs[index]
  return srcs[0]
}


function itemInfo(params) {
  let badgeNum = params[0] === '00' ? '' : params[0]
  let badgeLen = badgeNum === '00' ? '' : 'len'+badgeNum.length
  badgeNum = badgeNum.length === 4 ? '∙∙∙' : badgeNum

  return [
    {title: badgeNum, itemClass: `badge ${badgeLen}`},
    {title: (params[1]||'下午4:30'), itemClass: 'message'}
  ]
}

function mkBody(title, info) {
  return {
    title,
    dot: itemInfo([info, '下午4:30'])
  }
}

const menusData = [
  {
    id: 'nav-1',
    img: src(),
    ...mkBody(['queryui', '这个UI框架很简单!'], '8')
  },

  {
    id: 'nav-2', 
    img: src(), 
    ...mkBody(['queryui', '这个UI框架很简单!'], '78'),
  },

  {
    id: 'nav-3',
    img: src(),
    ...mkBody(['queryui', '这个UI框架很简单!'], '00'),
  },

  {
    id: 'nav-4',
    img: src(),
    ...mkBody(['queryui', '这个UI框架很简单!'], '9999'),
  },

  {
    id: 'nav-5', 
    img: src(),
    ...mkBody(['queryui', '这个UI框架很简单!'], '22'),
  },
  
  {id: 'nav-6', img: src()},
  {id: 'nav-7', img: src()},
  {id: 'nav-8', img: src()},
  {id: 'nav-9', img: src()},
  {id: 'nav-10', img: src()},
  {id: 'nav-11', img: src()},
  {id: 'nav-12', img: src()},
  {id: 'nav-13', img: src()},
  {id: 'nav-14', img: src()},
  {id: 'nav-15', img: src()},
  {id: 'nav-16', img: src()},
  {id: 'nav-17', img: src()},
  {id: 'nav-18', img: src()},
  {id: 'nav-19', img: src()},
  {id: 'nav-20', img: src()},
  {id: 'nav-21', img: src()},
  {id: 'nav-22', img: src()},
  {id: 'nav-23', img: src()},
  {id: 'nav-24', img: src()},
  {id: 'nav-25', img: src()},
  {id: 'nav-26', img: src()},
  {id: 'nav-27', img: src()},
  {id: 'nav-28', img: src()},
]



Pager({
  data: {
    targetConfig: {
      $$id: 'menus-slip-view',
      listClass: 'demo-slip-list',
      itemClass: 'demo-slip-list-item',
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
  }
})
