//index.js
//获取应用实例
import {createScrollbar} from '../../components/modules/scrollbar/index'
const Pager = require('../../components/aotoo/core/index')
let source = require('../common/source')

const xxx = createScrollbar({
  data: [ '哈', '哈', {title: '哈', image: '/images/agzgzlogo.jpg'}, '哈', '哈', '哈',
    '哈', '哈', '哈', '哈', '哈', '哈',
    '哈', '哈', '哈', '哈',
  ],
  $$id: 'islist',
  itemWidth: 65,
  listClass: 'scrollbar',
  itemClass: 'scrollbar-item',
  bindchange(data, index){
    if (data.image) {
      this.activePage.setData({
        content: {
          image: data.image
        }
      })
    } else {
      this.activePage.setData({
        content: data.title + index
      })
    }
  }
})


Pager({
  onTap(e){
    const scrollbar = this.getElementsById('islist')
    scrollbar.to(2)
  },
  data: {
    content: '内容展示',
    listConfig: xxx,
    ...source
  },
})
