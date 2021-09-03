/**
 * xquery是一套小程序的开发工具库
 * 说明: 在小程序中搜索 xquery，更多demo和说明
 * 源码: https://github.com/webkixi/aotoo-xquery
 * 小程序代码片段: https://developers.weixin.qq.com/s/KSoWN2mE7Lem
 */
const Pager = require('../../components/aotoo/core/index')
const lib = Pager.lib
const nav = lib.nav
const mkIndexList = require('../../components/modules/indexlist')
const searchbar = require('../../components/modules/searchbar')
const createTouchbar = require('../../components/modules/touchbarpro')
const source = require('../common/source')

const img = {src: '/images/xquery.png', mode: 'widthFix'}
function createIndexList(params={}){
  const data = params.data
  const id = params.id || lib.suid('indexlist-')
  const items = []
  const sorts = []
  data.forEach((item, ii)=>{
    if (lib.isString(item)) {
      item = {title: item}
    }
    if (lib.isObject(item)) {
      if (!item.idf) {
        item.touchoption = {
          slip: {
            autoDelete: false,
            slipLeft: [
              {title: '删除', aim: 'onDelete'}
            ]
          }
        }
        item.touchstart = function(){}
        item.touchmove = function(){}
        item.touchend = function(){}
        item.touchcancel = function(){}
      } else {
        sorts.push({title: item.title})
        item.id = 'indexlist-cat-' + (sorts.length - 1)
      }
      items.push(item)
    }
  })

  return {
    $$id: id, 
    id: id,
    data: items,
    type: {
      is: 'scroll',
      "scroll-y": true,
      "bindscroll": 'onScroll'
    },
    created(){
      this.query = wx.createSelectorQuery().in(this)
    },
    ready(){
      const $$ = this.activePage.getElementsById.bind(this.activePage)
      const touchbar = $$('touchbar-sidebar')
      touchbar.selectItem(0)
      this.xxx = this.query.selectAll('.itemroot').boundingClientRect(ret=>{
        this.catItems = ret
      })
    },
    methods: {
      onScroll(e){
        this.xxx.exec(()=>{
          this.catItems.forEach((cat, ii)=>{
            if (cat.top > -20 && cat.top < 20) {
              const $$ = this.activePage.getElementsById.bind(this.activePage)
              $$('touchbar-sidebar').selectItem(ii)
            }
          })
        })
      }
    },
    listClass: 'indexlist',
    itemClass: 'indexlist-item',
    touchbarData: sorts,
  }
}

const indexListConfig = createIndexList({
  id: 'indexlist-xxx',
  data: [
    {idf: 'A', title: 'A'},
    {img, title: '选项-1', parent: "A" },
    {img, title: '选项-1', parent: "A"},
    {img, title: '选项-1', parent: "A"},
    {img, title: '选项-1', parent: "A"},
    {img, title: '选项-1', parent: "A"},
    {img, title: '选项-1', parent: "A"},
    {img, title: '选项-1', parent: "A"},
    {img, title: '选项-1', parent: "A"},
    {img, title: '选项-1', parent: "A"},
    {img, title: '选项-1', parent: "A"},
    {img, title: '选项-1', parent: "A"},
    {img, title: '选项-1', parent: "A"},
    {img, title: '选项-1', parent: "A"},
    {img, title: '选项-1', parent: "A"},
    {img, title: '选项-1', parent: "A"},
    {idf: 'B', title: 'B'},
    {img, title: '选项-2', parent: "B"},
    {img, title: '选项-2', parent: "B"},
    {img, title: '选项-2', parent: "B"},
    {img, title: '选项-2', parent: "B"},
    {img, title: '选项-2', parent: "B"},
    {img, title: '选项-2', parent: "B"},
    {img, title: '选项-2', parent: "B"},
    {img, title: '选项-2', parent: "B"},
    {img, title: '选项-2', parent: "B"},
    {img, title: '选项-2', parent: "B"},
    {img, title: '选项-2', parent: "B"},
    {img, title: '选项-2', parent: "B"},
    {idf: 'C', title: 'C'},
    {img, title: '选项-2', parent: "C"},
    {img, title: '选项-2', parent: "C"},
    {img, title: '选项-2', parent: "C"},
    {img, title: '选项-2', parent: "C"},
    {img, title: '选项-2', parent: "C"},
    {img, title: '选项-2', parent: "C"},
    {img, title: '选项-2', parent: "C"},
    {img, title: '选项-2', parent: "C"},
    {img, title: '选项-2', parent: "C"},
    {img, title: '选项-2', parent: "C"},
    {img, title: '选项-2', parent: "C"},
    {img, title: '选项-2', parent: "C"},
    {idf: 'P', title: 'P'},
    {img, title: '选项-2', parent: "P"},
    {img, title: '选项-2', parent: "P"},
    {img, title: '选项-2', parent: "P"},
    {img, title: '选项-2', parent: "P"},
    {img, title: '选项-2', parent: "P"},
    {img, title: '选项-2', parent: "P"},
    {img, title: '选项-2', parent: "P"},
    {img, title: '选项-2', parent: "P"},
    {img, title: '选项-2', parent: "P"},
    {img, title: '选项-2', parent: "P"},
    {img, title: '选项-2', parent: "P"},
    {img, title: '选项-2', parent: "P"},
    {idf: 'Q', title: 'Q'},
    {img, title: '选项-2', parent: "Q"},
    {img, title: '选项-2', parent: "Q"},
    {img, title: '选项-2', parent: "Q"},
    {img, title: '选项-2', parent: "Q"},
    {img, title: '选项-2', parent: "Q"},
    {img, title: '选项-2', parent: "Q"},
    {img, title: '选项-2', parent: "Q"},
    {img, title: '选项-2', parent: "Q"},
    {img, title: '选项-2', parent: "Q"},
    {img, title: '选项-2', parent: "Q"},
    {img, title: '选项-2', parent: "Q"},
    {img, title: '选项-2', parent: "Q"},
  ]
})

const touchbarData = indexListConfig.touchbarData;  delete indexListConfig.touchbarData
const touchbarConfig = createTouchbar({
  id: 'touchbar-sidebar',
  data: touchbarData,
  tap(e){
    const $$ = this.activePage.getElementsById.bind(this.activePage)
    const index = e.touchbarIndex
    const targetId = 'indexlist-cat-'+index
    $$('indexlist-xxx') .update({
      "type.scroll-into-view": targetId
    })
  }
})

Pager({
  data: {
    indexList: indexListConfig,
    touchbar: touchbarConfig
  }
})
