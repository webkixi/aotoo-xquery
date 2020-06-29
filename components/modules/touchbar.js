/**
 * 生成一个touchbar，带刻度的列表
 * touchmove每经过一个刻度会触发一次
 */

const Pager = require('../aotoo/core/index')
let lib = Pager.lib

function indexs(params) {
  let tap = params.tap

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
        let $data = this.data.$list.data[param]
        if (!$data) return
        let $itemClass = $data.itemClass

        let preItem = this.preItem
        if (preItem) {
          preItem.data = this.data.$list.data[preItem.index]
          preItem.data.itemClass = preItem.data.itemClass.replace(' active', '')
        }

        if (param === null || param === -1) {
          clearTimeout(this.timmer)
          if (preItem) this.update({ [`data[${preItem.index}]`]: preItem.data })
          return
        }

        if (lib.isFunction(from)) {
          cb = from
          from = 'scroll'
        }
        
        $data.itemClass = $data.itemClass ? $data.itemClass + ' active' : ' active'
        if (this.preItem && this.preItem.index!==param) {
          let preItem = this.preItem
          // this.setData({ 
            //   [`$list.data[${param}]`]: $data, 
            //   [`$list.data[${preItem.index}]`]: preItem.data 
            // })
            this.setData({ 
              [`$list.data[${param}].itemClass`]: $data.itemClass, 
              [`$list.data[${preItem.index}].itemClass`]: preItem.data.itemClass 
            })
        } else {
          // this.setData({ [`$list.data[${param}]`]: $data })
          this.setData({ [`$list.data[${param}].itemClass`]: $data.itemClass })
        }
        // $data.itemClass = $itemClass
        // this.preItem = {index: param, data: $data}
        this.preItem = {index: param}

        let tips = this.find(params.tipsId)
        if (from === 'touch') {
          lib.vibrateShort()
          // tips.addClass('.active')
          tips && tips.setData({
            "$item.title": ($data.tips || $data.title),
            "$item.itemClass": tips.data.$item.itemClass + ' active',
          })
        }
        $data.__index = param
        clearTimeout(this.timmer)
        this.timmer = setTimeout(() => {
          if (cb) {
            cb.call(this, {data: $data})
          }
        }, 50);
      }
    }
  }
}

function eventCallback(type, e, param, inst) {
  let evtName = type  // tap, longpress

  if (lib.isFunction(evtName)) {
    evtName.call(this, e, param, inst)
  }

  if (lib.isString(evtName)) {
    let acp = this.activePage
    let fun = acp && acp[evtName]
    if (lib.isFunction(fun)) {
      fun.call(acp, e, param, inst)
    }
  }
}

module.exports = function(param={}, forConfig) {
  let $$id = param.id || 'touch-bar'
  let tipsId = lib.suid($$id+'_tips_')
  let touchbarId = lib.suid($$id+'_touchbar_')
  let enableTips = param.hasOwnProperty('enableTips') ? param.enableTips : true // 是否需要提示标签
  let enableTouch = param.hasOwnProperty('enableTouch') ? param.enableTouch : true // 是否允许touchmove，用于tab时有用
  let tap = param.tap
  let containerClass = param.containerClass
  let containerStyle = param.containerStyle
  delete param.containerClass
  delete param.containerStyle

  // mode = 'tab' ，作为tab ? 未实现
  // this.hooks.on('onTouchStart', cb)
  // this.hooks.on('onTouchMove', cb)
  // this.hooks.on('onTouchPassPoint', cb)
  
  let touchbarCfgs = {
    id: touchbarId,
    data: param.data || [],
    tipsId,
    tap
  }

  let direction = 'v'  // touchbar的方向
  let configs = {
    $$id,
    itemClass: 'touchbar-cat ' + (containerClass||''),
    itemStyle: (containerStyle||''),
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
      reset(param, cb){
        let that = this
        if (this.touchbar) {
          this.touchbar.reset(param, function() {
            setTimeout(() => that.__ready(cb), 50);
          })
        }
      },
      update(param, cb){
        if (this.touchbar) {
          this.setTouchbar(param, cb)
        }
      },
      __ready(cb){
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
              that.elements = ret = ret.map((item, ii)=>{
                item.__index = ii
                return item
              })
              that.points = that.elements.map((point, ii) => {
                return direction === 'v' ? point.bottom : point.right // 少了0这个点
              })
            }
          }).exec(cb)
        })
      },
      setTouchbar(param, cb){
        let that = this
        this.touchbar.update(param, function() {
          setTimeout(() => that.__ready(cb), 50);
        })
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
      onTouch(e, param, inst){
        if (e.type === 'touchstart') this.onStart(e, param, inst)
        if (e.type === 'touchmove') this.onMove(e, param, inst)
        if (e.type === 'touchend') this.onEnd(e, param, inst)
      },
      onEnd(e){
        this.hooks.emit('onTouchEnd', e)
        this.timmer = setTimeout(() => {
          this.tips && this.tips.removeClass('.active')
        }, 600);
      },
      filterPos(e){
        let changedToucheTarget = e.changedTouches[0]
        let {pageX, pageY} = changedToucheTarget
        let selects = []
        let pagePos = direction === 'v' ? pageY : pageX // pageX
        // if (this.points) {
        //   selects = this.points.filter(point => point <= pagePos)
        // }
        if (this.elements ) {
          selects = this.elements.filter(ele=>{
            if (
              ele.left<=pageX && (pageX-ele.left)<=ele.width &&
              ele.top <= pageY && (pageY-ele.top)<=ele.height
            ){
              return ele
            }
          })
        }
        if (pagePos<this.points[0]) {
          this.zeroPos = true
          clearTimeout(this.timmer)
          this.tips && this.tips.removeClass('.active')
          this.hooks.emit('scrollTotop')
        } else {
          this.zeroPos = false
        }
        if (!selects.length) return
        let lastIndex = (selects[(selects.length - 1)] && selects[(selects.length - 1)].__index) || 0
        selects.__index = lastIndex
        return selects
      },
      onStart(e, param, inst){
        let that = this
        clearTimeout(this.timmer)
        let selects = this.filterPos(e)
        let changedToucheTarget = e.changedTouches[0]
        // let len = selects.length
        let len = selects.__index
        this.touchbar.selected(len, 'touch', function(item) {

          let _param = {
            target: item.data.target || item.data.to
          }

          let tmp = that.touchbar.find(item.data.attr['data-treeid'])
          let _inst = tmp&&tmp.getData()[0]

          param = Object.assign({}, param, _param)
          eventCallback.call(this, tap, e, param, _inst)

          item._point = changedToucheTarget
          item._event = e
          that.hooks.emit('onTouchStart', item)
        })
      },
      onMove(e, param, inst){
        if (!enableTouch) return
        let that = this
        let changedToucheTarget = e.changedTouches[0]
        this.hooks.emit('onTouchMove', changedToucheTarget)
        let selects = this.filterPos(e)
        if (selects) {
          // let len = selects.length
          let len = selects.__index
          // if (len>0) len = len-1
          // len = len -1
          this.touchbar.selected(len, 'touch', function(item) {

            let _param = {
              target: item.data.target || item.data.to
            }

            let tmp = that.touchbar.find(item.data.attr['data-treeid'])
            let _inst = tmp && tmp.getData()[0]

            param = Object.assign({}, param, _param)
            eventCallback.call(this, tap, e, param, _inst)

            item._point = changedToucheTarget
            that.hooks.emit('onTouchPassPoint', item)
          })
        }
      },
    },
  }

  if (forConfig) {
    return configs
  } else {
    return {
      id: $$id,
      config: configs
    }
  }
}