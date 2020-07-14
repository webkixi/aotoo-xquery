//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')

Pager({
  data: {
    targetConfig: {
      itemClass: 'sitem cat',
      img: [
        {src: 'http://www.agzgz.com/imgs/Result.svg', itemStyle: 'width: 80px'},
        {src: 'http://www.agzgz.com/imgs/Result.svg', itemStyle: 'width: 80px'},
        {src: 'http://www.agzgz.com/imgs/Result.svg', itemStyle: 'width: 80px'},
      ],
      title: '标题',
    },
  }
})
