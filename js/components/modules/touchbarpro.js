/**
 * 生成一个touchbar，带刻度的列表
 * touchmove每经过一个刻度会触发一次
 */

const Pager = require('../aotoo/core/index')
let lib = Pager.lib

module.exports = function createTouchbar(params={}){
  const data = params.data||[]
  const tap = params.tap
  const id = params.id || lib.suid('touchbar-')
  const menus = []
  data.forEach((item, ii)=>{
    if (lib.isString(item) || lib.isNumber(item)){} {
      item = {title: item}
    }
    if (lib.isObject(item)) {
      const $$id = 'touchbar-'+id+'-'+ii
      item.attr = {id: $$id}
      item['$$id'] = $$id
      menus.push(item)
    }
  })

  return {
    $$id: id,
    id: id,
    data: menus,
    listClass: 'touchbar',
    itemClass: 'touchbar-item', 
    created(){
      this.activeTimmer = null
      this.query = wx.createSelectorQuery().in(this)
    },
    ready(){
      this.query.selectAll(`#${id} >>> .touchbar-item`).boundingClientRect().exec(ret=>{
        this.touchbarItems = ret[0]
        // console.log(ret);
      })
    },
    methods: {
      selectItem(index, e){
        clearTimeout(this.activeTimmer);
        const targetId = 'touchbar-'+id+'-'+index
        const $$ = this.activePage.getElementsById.bind(this.activePage)
        const targetInst = $$(targetId)
        if (targetInst.hasClass('active')) return
        if (e) {
          e.touchbarIndex = index
        }
        targetInst.addClass('active', function(){
          if (e && lib.isFunction(tap)) {
            tap.call(targetInst, e)
          }
          this.activeTimmer = setTimeout(() => {
            targetInst.siblings().removeClass('active')
          }, 50);
        })
      },
      activeItem(e, {pageX, pageY}){
        const that = this
        const $$ = this.activePage.getElementsById.bind(this.activePage)
        this.touchbarItems.forEach((item, ii)=>{
          if (
            (pageY > item.top && pageY < item.bottom) && 
            (pageX > item.left && pageX < item.right)
          ) {
            /** 渲染item */
            this.selectItem(ii, e)
          }
        })
      }
    },
    itemMethod: {
      catchtouchstart(e, param, inst){
        const changedTouches = e.changedTouches[0]
        this.activeItem(e, changedTouches)
      },
      catchtouchmove(e, param, inst){
        const changedTouches = e.changedTouches[0]
        this.activeItem(e, changedTouches)
      },
    }
  }
}