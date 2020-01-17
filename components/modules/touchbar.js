/**
 * 生成一个touchbar，带刻度的列表
 * touchmove每经过一个刻度会触发一次
 */

const Pager = require('../aotoo/core/index')
let lib = Pager.lib

function indexs(params) {
  return {
    $$id: params.id,
    itemClass: 'touchbar-cat-item',
    data: params.data,
    methods: {
      __ready(){
        this.preItem = null
        this.value = null
        this.timmer = null
      },
      removeActive(cls){
        this.forEach(item=>{
          if (cls) {
            item.removeClass(cls)
          } else {
            item.removeClass('active')
          }
        })
      },
      selected(param, from='scroll', cb){
        if (this.value === param) return
        this.value = param
        if (param === null || param === -1) {
          clearTimeout(this.timmer)
          let preItem = this.preItem
          if (preItem) this.update({ [`data[${preItem.index}]`]: preItem.data })
          return
        }

        if (lib.isFunction(from)) {
          cb = from
          from = 'scroll'
        }

        let $data = this.data.$list.data[param]
        if (!$data) return
        let $itemClass = $data.itemClass
        
        $data.itemClass = $data.itemClass ? $data.itemClass + ' active' : ' active'
        if (this.preItem) {
          let preItem = this.preItem
          this.setData({ 
            [`$list.data[${param}]`]: $data, 
            [`$list.data[${preItem.index}]`]: preItem.data 
          })
        } else {
          this.setData({ [`$list.data[${param}]`]: $data })
        }
        $data.itemClass = $itemClass
        this.preItem = {index: param, data: $data}

        let tips = this.find(params.tipsId)
        if (from === 'touch') {
          lib.vibrateShort()
          // tips.addClass('.active')
          tips.setData({
            "$item.title": ($data.tips || $data.title),
            "$item.itemClass": tips.data.$item.itemClass + ' active',
          })
        }
        clearTimeout(this.timmer)
        this.timmer = setTimeout(() => {
          if (cb) {
            $data.__index = param
            cb.call(this, {data: $data})
          }
        }, 60);
      }
    }
  }
}

module.exports = function(param={}) {
  let $$id = param.id || 'touch-bar'
  let tipsId = lib.suid($$id+'_tips_')
  let touchbarId = lib.suid($$id+'_touchbar_')
  let enableTips = param.hasOwnProperty('enableTips') ? param.enableTips : true // 是否需要提示标签
  let enableTouch = param.hasOwnProperty('enableTouch') ? param.enableTouch : true // 是否允许touchmove，用于tab时有用

  // mode = 'tab' ，作为tab ? 未实现
  // this.hooks.on('onTouchStart', cb)
  // this.hooks.on('onTouchMove', cb)
  // this.hooks.on('onTouchPassPoint', cb)
  
  let touchbarCfgs = {
    id: touchbarId,
    data: param.data || [],
    tipsId
  }

  let direction = 'v'  // touchbar的方向
  let configs = {
    $$id,
    itemClass: 'touchbar-cat',
    "@list": indexs(touchbarCfgs),
    dot: (()=>{
      if (enableTips) {
        let tips = [{$$id: tipsId, title: ' ', itemClass: 'touchbar-cat-tips', itemStyle: ''}]
        return lib.isArray(enableTips) ? tips.concat(enableTips) : tips
      }
    })(),
    catchtouchstart: 'onTouch',
    catchtouchmove: 'onTouch',
    catchtouchend: 'onTouch',
    methods:{
      __ready(){
        let that = this
        let query = wx.createSelectorQuery().in(this)
        this.elements = null
        this.points = null
        this.current = null
        this.timmer = null
        this.zeroPos = false
        this.touchbar = this.find(touchbarId) // 索引列表实例
        this.tips = this.find(tipsId)
        query.selectAll('.touchbar-cat >>> .hlist').boundingClientRect(bar => {
          if (bar.length) {
            let container = bar[0]
            if (container.height > container.width) direction = 'v'
            if (container.height < container.width) direction = 'h'
          }
        }).exec(function() {
          query.selectAll('.touchbar-cat >>> .touchbar-cat-item').boundingClientRect(ret => {
            if (ret.length) {
              that.elements = ret
              that.points = ret.map((point, ii) => {
                return direction === 'v' ? point.bottom : point.right // 少了0这个点
              })
            }
          }).exec()
        })
                
      },
      setTouchbar(param){
        this.touchbar.update(param)
        setTimeout(() => {
          this.__ready()
        }, 300);
      },
      removeActive(param){
        this.touchbar.removeActive(param)
      },
      selected(param, cb){
        let that = this
        let elements = this.elements  // 
        this.touchbar.selected(param, function(item) {
          /** 如果激活项在屏幕外面，需要使用 item.__index找到elements中的对应数据做位移处理
           * 具体位置数据在elements中
           */
          // let index = item.__index
        })
      },
      onTouch(e){
        if (e.type === 'touchstart') this.onStart(e)
        if (e.type === 'touchmove') this.onMove(e)
        if (e.type === 'touchend') this.onEnd(e)
      },
      onEnd(e){
        this.timmer = setTimeout(() => {
          this.tips.removeClass('.active')
        }, 600);
      },
      filterPos(e){
        let changedToucheTarget = e.changedTouches[0]
        let {pageX, pageY} = changedToucheTarget
        let selects = []
        let pagePos = direction === 'v' ? pageY : pageX // pageX
        if (this.points) {
          selects = this.points.filter(point => point <= pagePos)
        }
        if (pagePos > this.points[0]) {
          this.zeroPos = false
        }
        if (selects.length === 0 && !this.zeroPos) {
          this.zeroPos = true
          clearTimeout(this.timmer)
          this.tips.removeClass('.active')
          this.hooks.emit('scrollTotop')
        }
        return selects
      },
      onStart(e){
        let that = this
        clearTimeout(this.timmer)
        let selects = this.filterPos(e)
        let changedToucheTarget = e.changedTouches[0]
        let len = selects.length
        this.touchbar.selected(len, 'touch', function(item) {
          item._point = changedToucheTarget
          that.hooks.emit('onTouchStart', item)
        })
      },
      onMove(e){
        if (!enableTouch) return
        let that = this
        let changedToucheTarget = e.changedTouches[0]
        this.hooks.emit('onTouchMove', changedToucheTarget)
        let selects = this.filterPos(e)
        let len = selects.length
        // if (len>0) len = len-1
        len = len -1
        this.touchbar.selected(len, 'touch', function(item) {
          item._point = changedToucheTarget
          that.hooks.emit('onTouchPassPoint', item)
        })
      },
    },
  }

  return {
    id: $$id,
    config: configs
  }
}