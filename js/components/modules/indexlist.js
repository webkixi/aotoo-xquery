/**
 * 生成一个索引列表页
 * 类似于微信通讯录
 */

const Pager = require('../aotoo/core/index')
let lib = Pager.lib
let mkTouchbar = require('./touchbar')

const mockData = [
  {title: '好好学习', itemStyle: 'height: 80px'},
  {idf: 'A', title: 'A'},
  {
    img: {src: '/images/xquery.png', mode: 'widthFix'}, 
    title: '选项-1', 
    parent: "A"
  },
  {title: '选项-1', parent: "A"},
  {title: '选项-1', parent: "A"},
  {title: '选项-1', parent: "A"},
  {title: '选项-1', parent: "A"},
  {title: '选项-1', parent: "A"},
  {title: '选项-1', parent: "A"},
  {title: '选项-1', parent: "A"},
  {title: '选项-1', parent: "A"},
  {idf: 'B', title: 'B'},
  {title: '选项-2', parent: "B"},
  {title: '选项-2', parent: "B"},
  {title: '选项-2', parent: "B"},
  {title: '选项-2', parent: "B"},
  {title: '选项-2', parent: "B"},
  {title: '选项-2', parent: "B"},
  {idf: 'Z', title: 'Z'},
  {title: '选项-4', parent: "Z"},
  {title: '选项-4', parent: "Z"},
  {title: '选项-4', parent: "Z"},
  {title: '选项-4', parent: "Z"},
  {title: '选项-4', parent: "Z"},
  {title: '选项-4', parent: "Z"},
  {title: '选项-4', parent: "Z"},
  {title: '选项-4', parent: "Z"},
  {title: '选项-4', parent: "Z"},
]

function adapter(data=[]) {
  let sorts = []
  let opts = data.map(item=>{
    if (item.idf && item.idf.charAt(0)!=='_') {
      item.id = item.id || 'sort-'+item.idf
      sorts.push({
        title: item.title||item.idf,
        to: item.id
      })
    }
    return item
  })

  return {
    options: opts,
    sorts
  }
}

module.exports = function (id=lib.suid('step_'), data, options={}) {
  if (id && !lib.isString(id)) {
    if (lib.isObject(data)) {
      options = data
    }
    data = id
    id = null
  }

  // 追加按钮
  let touchoption = null
  let attachButton = options.attachButton
  if (attachButton && lib.isArray(attachButton)) {
    touchoption= {
      slip: {
        autoDelete: false,
        slipLeft: attachButton,
      }
    }
  }

  // let attachButton = options.attachButton
  // if (lib.isObject(attachButton) || lib.isArray(attachButton)) {
  //   if (lib.isArray(attachButton)) {
  //     attachButton = attachButton.map(item => {
  //       if (lib.isString(item)) return {title: item, _aim: 'onAttachButton'}
  //       if (lib.isObject(item)) {
  //         if (item.aim || item.tap) {
  //           item._aim = item.aim || item.tap
  //           delete item.aim
  //           delete item.tap
  //         }
  //       }
  //       return item
  //     })
  //   }
  //   attachButton = {dot: [].concat(attachButton)}
  // } else if (lib.isString(attachButton)) {
  //   let title = attachButton
  //   attachButton = { dot: [{title, _aim: 'onAttachButton'}] }
  // } else {
  //   if (attachButton === true) attachButton = { dot: [{title: '测试', _aim: 'onAttachButton'}] }
  // }
  // if (attachButton && attachButton.dot[1]) {
  //   attachButton.dot[1].itemClass = 'two'
  // }

  let result = adapter( (data||mockData) )
  let datas = result.options
  let sorts = result.sorts
  let preTouchbarConfig = {
    data: sorts,
    ...options
  }
  preTouchbarConfig.tap = null
  let touchbarConfig = mkTouchbar(preTouchbarConfig)

  return {
    $$id: id,
    listClass: 'sortlist-container',
    itemClass: 'sortlist-item',
    data: datas,
    footer: touchbarConfig.config,
    type: {
      "is": 'scroll',
      "scroll-y": true,
      "bindscroll": 'onScroll'
    },
    itemMethod: {
      touchoption,
      touchstart(e, param, inst){
        // console.log(inst);
        inst = inst.data[0]
        if (inst.hasClass('itemroot')) return
        if (this.touchPoint.preInst) {
          if (inst.hasClass('float-left')) {
            this.touchPoint.preInst.removeClass('float-left two')
            return
          } else {
            this.touchPoint.preInst.removeClass('float-left two')
          }
        }
        
        this.longpressDone = false
        this.touchmove = false
        this.touchPoint.start = e.changedTouches[0]
        
        clearTimeout(this.touchtimmer)
        this.touchtimmer = setTimeout(() => {
          let cb = options.longpress
          if (lib.isFunction(cb)) cb.call(this, e, param, inst)
          this.longpressDone = true
        }, 600);
      },
      touchmove(e, param, inst){
        inst = inst.data[0]
        this.touchmove = true
        // if (!attachButton) return
        // if (inst.hasClass('itemroot')) return
        // clearTimeout(this.touchtimmer)
        // let start = this.touchPoint.start
        // let {pageX, pageY} = e.changedTouches[0]
        // let diffx = (pageX-start.pageX)
        // let diffy = (pageY-start.pageY)
        // let absDiffx = Math.abs(diffx)
        // let absDiffy = Math.abs(diffy)

        // if (this.fixedY) {
        //   e.changedTouches[0] = start
        // }

        // if (absDiffy < absDiffx) {
        //   this.fixedY = true
        //   e.changedTouches[0].pageY = start.pageY
        //   e.changedTouches[0].clientY = start.clientY
        //   e.changedTouches[0].offsetY = start.offsetY
        // }

        // if (absDiffx > 60 && absDiffy < absDiffx) {
        //   if (diffx < 0) {
        //     if (inst.hasClass('float-left')) return
        //     if (this.touchPoint.preInst) {
        //       this.touchPoint.preInst.removeClass('float-left two')
        //     }

        //     // 现在只有通用型附加按钮，没有个性化附加按钮
        //     // 暂时只支持一个附加按钮
        //     // 在业务中添加响应方法 onAttachButton
        //     if (attachButton) {
        //       let $data = Object.entries(inst.getData())[0][1]
        //       let $attr = $data
        //       attachButton.dot[0].attr = $attr
        //       inst.update(attachButton)
        //     }
        //     inst.addClass('float-left')
        //     this.touchPoint.preInst = inst
        //   }

        //   if (diffx > 0) {
        //     if (!inst.hasClass('float-left')) return
        //     inst.removeClass('float-left two')
        //   }
        // }
      },
      touchend(e, param, inst){
        inst = inst.data[0]
        if (inst.hasClass('itemroot')) return
        clearTimeout(this.touchtimmer)
        if (this.touchmove) {
          this.fixedY = false
        } else {
          if (!this.longpressDone) {
            let cb = options.tap
            if (lib.isFunction(cb)) cb.call(this, e, param, inst)
            if (lib.isString(cb)) this.activePage[cb] && this.activePage[cb].call(this, e, param, inst)
          }
        }
      },
    },
    methods: {
      __ready(){
        let that = this
        let query = wx.createSelectorQuery().in(this)
        this.idfs = null
        this.touchbarEvent = false  // 是否touchbar操作
        this.touchPoint = {
          start: null,
          preInst: null,
        }
        this.touchmove = false
        this.touchtimmer = null
        query.selectAll('.sortlist-container .itemroot').boundingClientRect(ret => {
          if (ret.length) {
            this.idfs = ret
            this.tops = ret.map(item=>item.top)
          }
        }).exec()
        this.current = null
        this.touchbar = this.find(touchbarConfig.id)
        this.touchbar.hooks.on('scrollTotop', function(params) {
          that.update({ "type.scroll-top": 0 })
        })
        this.touchbar.hooks.on('onTouchEnd', function (e) {
          that.touchbarEvent = false
        })
        this.touchbar.hooks.on('onTouchStart', function (param) {
          // if (!that.touchbarEvent) that.update({ "type.scroll-top": (that.scrollTop||0) })
          that.touchbarEvent = true
          let target = param.data.target || param.data.to
          let ctx = {
            intoView(param){
              that.update({ "type.scroll-into-view": (param||target) })
            }
          }
          if (that.hooks.hasOn('onTouchStart')) {
            that.hooks.emit('onTouchStart', param, ctx)
          } else {
            ctx.intoView()
          }
        })

        this.touchbar.hooks.on('onTouchPassPoint', function (param) {
          let target = param.data.target || param.data.to
          let ctx = {
            intoView(param){
              that.update({ "type.scroll-into-view": (param||target) })
            }
          }
          if (that.hooks.hasOn('onTouchPassPoint')) {
            that.hooks.emit('onTouchPassPoint', param, ctx)
          } else {
            ctx.intoView()
          }
        })
      },

      onScroll(e){
        if (this.touchbarEvent) return
        if (this.idfs) {
          let tops = this.tops
          let detail = e.detail
          let scrollTop = detail.scrollTop
          this.scrollTop = scrollTop

          let selects = tops.filter(top=>top<=scrollTop)
          let len = selects.length
          if (this.touchbar) {
            if (scrollTop<tops[0]){
              this.current = null
              this.touchbar.value = null
              this.touchbar.removeActive()
              this.touchbar.selected(this.current)
            } else {
              if (this.current !== (len-1)) {
                // this.current = len && (len-1)
                this.current = (len-1)
                this.touchbar.selected(this.current)
              }
            }
          }
        }
      }
    },
  }
}