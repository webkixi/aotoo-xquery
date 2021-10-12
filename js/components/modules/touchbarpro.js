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

  const hasInitChecked = []
  return {
    $$id: id,
    id: id,
    data: menus,
    listClass: listClass,
    itemClass: itemClass, 
    created(){
      this.activeTimmer = null
      if (lib.isFunction(params.created)) {
        params.created.call(this)
      } 
    },

    attached(){
      if (lib.isFunction(params.attached)) {
        params.attached.call(this)
      } 
    },

    detached(){
      if (lib.isFunction(params.detached)) {
        params.detached.call(this)
      } 
    },

    ready(){
      this.positionItems(()=>{
        this.currentInstance = this.children[(params.current||0)]
        this.touchbarIndex = (params.current||0)
        if ((params.current || params.current === 0) && !hasInitChecked.includes(id)) {
          // if (lib.isNumber(params.current)) {
          //   this.selectItem(params.current, {})
          // }
          hasInitChecked.push(id)
        }
        if (lib.isFunction(params.ready)) {
          params.ready.call(this)
        }
        this.hooks.emit('ready', this)
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
      reSelectItem(){
        if (!hasInitChecked.includes(id)) return
        this.selectItem((this.touchbarIndex||params.current||0), {})
      },
      selectItem(index, e, fromMove){
        clearTimeout(this.activeTimmer);
        const that = this
        const targetId = 'touchbar-'+id+'-'+index
        const targetInst = this.children[index]
        
        if (targetInst) {
          if (fromMove) {
            if (targetInst.uniqId === this.currentInstance.uniqId) return
          }
          if (targetInst.hasClass('active')) return

          this.currentInstance = targetInst

          if (e) {
            e.touchbarIndex = index
            this.touchbarIndex = index
          }
  
          if (e && lib.isFunction(tap)) {
            tap.call(that, e, {}, targetInst)
          }
  
          targetInst.addClass('active', function(){
            params.current = index
            targetInst.siblings().removeClass('active')
          })
  
          // this.activeTimmer = setTimeout(() => {
          //   if (e && lib.isFunction(tap)) {
          //     tap.call(that, e, {}, targetInst)
          //   }
          //   targetInst.addClass('active', function(){
          //     params.current = index
          //     targetInst.siblings().removeClass('active')
          //   })
          // }, 30);
        }


      },
      activeItem(e, {pageX, pageY}, fromMove){
        this.touchbarItems.forEach((item, ii)=>{
          if (
            (pageY > item.top && pageY < item.bottom) && 
            (pageX > item.left && pageX < item.right)
          ) {
            /** 渲染item */
            this.selectItem(ii, e, fromMove)
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
        this.activeItem(e, changedTouches, true)
      },
    }
  }
}