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
  const listClass = 'touchbar '+ (params.listClass || '')
  const itemClass = 'touchbar-item '+ (params.itemClass || '')
  const current = params.current
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
    listClass: listClass,
    itemClass: itemClass, 
    created(){
      this.activeTimmer = null
      this.query = wx.createSelectorQuery().in(this)
    },
    ready(){
      this.positionItems(()=>{
        if (params.current || params.current === 0) {
          if (lib.isNumber(params.current)) {
            this.currentInstance = this.children[params.current]
            this.selectItem(params.current, {})
          }
        }
      })
    },
    methods: {
      positionItems(cb){
        const query = wx.createSelectorQuery().in(this)
        query.selectAll(`#${id} >>> .touchbar-item`).boundingClientRect().exec(ret=>{
          this.touchbarItems = ret[0]
          if (typeof cb === 'function') cb.call(this)
        })
      },
      selectItem(index, e){
        clearTimeout(this.activeTimmer);
        const that = this
        const targetId = 'touchbar-'+id+'-'+index
        // const parent = this.currentInstance.parent()
        // const targetInst = parent.children[index]
        const targetInst = this.children[index]
        
        if (targetInst.hasClass('active')) return
        if (e) {
          e.touchbarIndex = index
        }

        targetInst.addClass('active', function(){
          if (e && lib.isFunction(tap)) {
            tap.call(that, e, {}, targetInst)
          }
          this.activeTimmer = setTimeout(() => {
            targetInst.siblings().removeClass('active')
          }, 50);
        })

      },
      activeItem(e, {pageX, pageY}){
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
        const that = this
        const changedTouches = e.changedTouches[0]
        this.currentInstance = inst
        this.touchstartStat = true
        this.positionItems(function(){
          that.touchstartStat = false
          that.activeItem(e, changedTouches)
        })
      },
      catchtouchmove(e, param, inst){
        if (this.touchstartStat) return
        const changedTouches = e.changedTouches[0]
        this.activeItem(e, changedTouches)
      },
    }
  }
}