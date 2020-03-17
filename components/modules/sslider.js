const Pager = require('../../components/aotoo/core/index')
const lib = Pager.lib

// mkSslider
module.exports = function(params) {
  let dft = {
    id: lib.suid('sslider'),
    min: 0,
    max: 10,
    step: 1,
    value: [0, 10],
    blockSize: 30,
    button: [{}, {}],
    content: null,
    bindchange: null,
    bindchanging: null,
    smooth: false, 
    tip: true,
    disable: false,
    frontColor: '#ccc',
    backColor: '#2b832b'
  }

  let opts = Object.assign({}, dft, params)
  let content = opts.content

  const touchEvent = {
    touchoption: {
      sslider: {
        min: opts.min,
        max: opts.max,
        step: opts.step
      }
    },
    catchtouchstart(e){
      if (opts.tip) {
        if (e.currentTarget.id && e.currentTarget.id.indexOf('_1')>-1) {
          let $tip = this.find('#$$slider_tip_1')
          $tip.addClass('active')
        }
    
        if (e.currentTarget.id && e.currentTarget.id.indexOf('_2')>-1) {
          let $tip = this.find('#$$slider_tip_2')
          $tip.addClass('active')
        }
      }
    },
    catchtouchmove(e, param, inst) {
      if (opts.disable) return
      let sliderDetail = e.sliderDetail
      let value = sliderDetail.value
      
      if (opts.tip) {
        if (e.currentTarget.id && e.currentTarget.id.indexOf('_1')>-1) {
          let $tip = this.find('#$$slider_tip_1')
          $tip.update({title: value[0]})
        }
    
        if (e.currentTarget.id && e.currentTarget.id.indexOf('_2')>-1) {
          let $tip = this.find('#$$slider_tip_2')
          $tip.update({title: value[1]})
        }
      }

      if (lib.isFunction(opts.bindchanging)) {
        opts.bindchanging(value)
      }
    },
    catchtouchend(e, param, inst){
      if (opts.disable) return
      this.oneDrawTime = null
      let sliderDetail = e.sliderDetail
      let value = sliderDetail.value
      this.value = value
      // console.log(this.value);
      if (lib.isFunction(opts.bindchange)) {
        opts.bindchange(value)
      }

      if (opts.tip) {
        if (e.currentTarget.id && e.currentTarget.id.indexOf('_1') > -1) {
          let $tip = this.find('#$$slider_tip_1')
          $tip.removeClass('.active')
        }

        if (e.currentTarget.id && e.currentTarget.id.indexOf('_2') > -1) {
          let $tip = this.find('#$$slider_tip_2')
          $tip.removeClass('.active')
        }
      }
    }
  }

  return {
    title: content,
    $$id: 'isItem',
    dot: [],
    itemClass: opts.disable ? 'mut-slider disable' : 'mut-slider', // 允许一个页面多个slider，需要设置指定类名
    touchoption: { ssliderAixs: true },
    touchstart(){},
    methods: {
      __ready(){
        if (params && params.id) {
          this.activePage[params.id] = this
        }

        let value = opts.value
        let blockSize = opts.blockSize
        this.value = value
        let smooth = opts.smooth
        let disable = opts.disable
        let fcolor = opts.frontColor
        let bcolor = opts.backColor
        let halfBlockSize = parseInt(blockSize/2)

        let query = wx.createSelectorQuery().in(this)
        query.selectAll(`.mut-slider`).boundingClientRect(ret => {
          this.ret = ret[0]
          let {left, right, top, bottom, width, height} = this.ret  // 轴的rect属性
          let {max, min, step } = touchEvent.touchoption.sslider
          let perWidth = width/max*step
          let surplus = 0 // width%max // 剩余多少加到数组刻度最后一个数据上
          let scalsPx = Array.from(new Array((max+1)), (x, ii)=>perWidth*ii+left)
          let scals = Array.from((scalsPx), (x, ii) => step * ii)
          scalsPx[scalsPx.length-1] = scalsPx[scalsPx.length-1] + surplus
          touchEvent.touchoption.sslider.value = value
          touchEvent.touchoption.sslider.frontColor = fcolor
          touchEvent.touchoption.sslider.backColor = bcolor
          touchEvent.touchoption.sslider.smooth = smooth
          touchEvent.touchoption.sslider.disable = disable
          touchEvent.touchoption.sslider.blockSize = blockSize
          touchEvent.touchoption.sslider.perWidth = perWidth // 单位宽(px)
          touchEvent.touchoption.sslider.scalsPx = scalsPx  // px刻度数组，包含left
          touchEvent.touchoption.sslider.scals = scals  // 单位刻度数组
          touchEvent.touchoption.sslider.rect = {left, right, top, bottom, width, height}

          let edge = {}
          let leftIndex = scals.indexOf(value[0])
          if (leftIndex > -1) edge.left = scalsPx[leftIndex+1]
          let rightIndex = scals.indexOf(value[1])
          if (rightIndex > -1) edge.right = scalsPx[rightIndex-1]
          touchEvent.touchoption.sslider.edge = edge

          let valuePx = [0, max*perWidth]
          let value0Index = scals.indexOf(value[0])
          if (value0Index > -1) {
            valuePx[0] = scalsPx[value0Index]-left-halfBlockSize
          }
          let value1Index = scals.indexOf(value[1])
          if (value1Index > -1) {
            valuePx[1] = scalsPx[value1Index]-left-halfBlockSize
          }

          let toppx = -(blockSize/2-height/2)
          if (height > blockSize) {
            toppx = height/2 - blockSize/2
          }

          let leftStyle = `;left: ${valuePx[0]}px; top: ${toppx}px; width: ${blockSize}px; height: ${blockSize}px;`
          let rightStyle = `;left: ${valuePx[1]}px; top: ${toppx}px; width: ${blockSize}px; height: ${blockSize}px;`
          let axisStyle = `;--tip-left:${blockSize/2}px; --back-color: ${bcolor}; --tip-color: blue; --block-size: ${blockSize}; --half-block-size: ${blockSize/2}; background: linear-gradient(0.25turn, #${fcolor} ${valuePx[0]+halfBlockSize}px, ${bcolor} ${valuePx[0]+halfBlockSize}px, ${bcolor} ${valuePx[1]+halfBlockSize}px, #${fcolor} ${valuePx[1]+halfBlockSize}px);`

          let handLeft = null, handRight = null

          if (opts.button) {
            opts.button = [].concat(opts.button)
            if (opts.button.length === 1) {
              handLeft = Object.assign({}, opts.button[0], touchEvent)
            } else if (opts.button.length > 1) {
              handLeft = Object.assign({}, opts.button[0], touchEvent)
              handRight = Object.assign({}, opts.button[opts.button.length-1], touchEvent)
            }
          }

          if (!handLeft) handLeft = {}

          if (handLeft) {
            handLeft.itemClass = handLeft.itemClass ? 'sslider-handle '+handLeft.itemClass : 'sslider-handle'
            handLeft.itemStyle = handLeft.itemStyle ? leftStyle + handLeft.itemStyle : leftStyle
            handLeft.id = '$$slider_1'
            if (opts.tip) {
              handLeft.dot = [{
                $$id: '$$slider_tip_1',
                itemClass: 'handle-tip',
                title: value[0]
              }]
            }
          }

          if (handRight) {
            handRight.itemClass = handRight.itemClass ? 'sslider-handle '+handRight.itemClass : 'sslider-handle'
            handRight.itemStyle = handRight.itemStyle ? rightStyle + handRight.itemStyle : rightStyle
            handRight.id = '$$slider_2'
            if (opts.tip) {
              handRight.dot = [{
                $$id: '$$slider_tip_2',
                itemClass: 'handle-tip',
                title: value[1]
              }]
            }
          }
          
          if (handRight === null) {
            valuePx[1] = scalsPx[scalsPx.length-1] - left - halfBlockSize
            edge.right = scalsPx[scalsPx.length-1]
          }

          if (content) {
            if (lib.isArray(content)) {
              content = {title: content, itemStyle, axisStyle}
            }
            if (lib.isObject(content)) {
              content.itemStyle = content.itemStyle ? axisStyle + content.itemStyle : axisStyle
            }
          } else {
            content = {itemStyle: axisStyle}
          }
          
          this.update({
            dot: [
              handLeft,
              handRight
            ],
            ...content
          })
        }).exec()
      }
    }
  }
}