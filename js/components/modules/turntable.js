const Pager = require('../../components/aotoo/core/index')
const lib = Pager.lib

function mkLight(lightNum = 18) {
  let items = []
  for (let i = 0; i < lightNum; i++) {
    let item = {title: ''}
    let deg = (360 / lightNum) * i
    item.itemStyle = `transform: rotate(${deg}deg)`;
    items.push(item)
  }
  return items
}

function mkBg(max=6) {
  let items = []
  for (let i = 0; i < max; i++) {
    let item = {title: ''}
    let deg = (360 / max) * i
    item.itemStyle = `transform: rotate(${deg}deg)`;
    items.push(item)
  }
  return items
}

function canvasBg(max=6, param, cb) {
  let {ctx, w1, h1, colors} = param
  let dyestuff = colors && colors.length >= 2 ? colors : ['#01a1dd', '#fffdec', '#fe5921', '#fffdec', '#fccc00', '#fffdec']
  for (let ii=0; ii<max; ii++) {
    let deg = (360 / max) * ii
    let endDeg = (360 / max) * (ii+1)
    let mycolor = dyestuff[ii] || (ii%2===0 ? dyestuff[0] : dyestuff[1])
    
    let startArc = (deg/360) * 2 * Math.PI
    let endArc = (endDeg/360) * 2 * Math.PI
    ctx.beginPath();
    ctx.moveTo(w1, h1);
    ctx.arc(w1, h1, w1, startArc, endArc)
    ctx.setFillStyle(mycolor);
    ctx.fill();
    ctx.save();
  }
  ctx.draw(true, function() {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 2*w1,
      height: 2*w1,
      destWidth: 2*w1,
      destHeight: 2*w1,
      canvasId: 'turntable-canvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        if (typeof cb === 'function') {
          cb(tempFilePath, res)
        }
      },
      fail: function (res) {
        console.log('----------  ', res)
      }
    })
    
  });
}

function createBg(max=6, param={}, cb) {
  if (lib.isFunction(param)) {
    cb = param
    param = {}
  }

  let context = this.activePage
  let ctx = wx.createCanvasContext("turntable-canvas", context);
  if (typeof max === 'function') {
    cb = max
    max = 6
  }
  wx.createSelectorQuery().select('#turntable-canvas-bg').boundingClientRect(function (rect) {
    let w1 = parseInt(rect.width / 2);
    let h1 = parseInt(rect.height / 2);
    canvasBg(max, {ctx, w1, h1, ...param}, function(bgPath, res) {
      cb(bgPath, res)
    })
  }).exec()
}

function mkGifts(max=6, data) {
  let items = []
  for (let i = 0; i < max; i++) {
    let item = {title: ''}
    let halfDeg = 360/max/2
    let deg = 90 + (360 / max) * i + halfDeg
    item.itemStyle = `transform: rotate(${deg}deg)`;
    if (data && data.length) {
      if (data[i]) {
        if (typeof data[i] === 'string') {
          item.title = data[i]
        } else {
          item = Object.assign(item, data[i])
        }
      } else {
        item.title = '谢谢参与'
        item.itemClass = 'no-gift'
      }
    } else {
      if (i%2===0) {
        item.title = '中奖了'
      } else {
        item.title = '谢谢参与'
        item.itemClass = 'no-gift'
      }
    }
    items.push(item)
  }
  return items
}

module.exports = function(params) {
  let dft = {
    id: '',
    data: [],
    colors: [], 
    times: 5,  // 默认转几圈
  }

  let config = dft

  if (lib.isArray(params)) {
    config.data = params
  } else {
    config = Object.assign({}, config, params)
  }

  let turntableMax = config.data.length

  return {
    listClass: 'turntable-wrap',
    data: [
      
      // 跑马灯
      {
        itemClass: 'light',
        "@list": {
          type: { is: 'exposed' },
          data: mkLight()
      }},
      
      // bg & gift
      {
        itemClass: 'turntable',
        animation: {},
        "@list": {
          type: { is: 'exposed' },
          data: [
            {
              itemClass: 'bgg',
              img: ''
            },
            // {
            //   itemClass: 'bg',
            //   "@list": {
            //     type: { is: 'exposed' },
            //     data: mkBg()
            //   }
            // },
            {
              itemClass: 'gift',
              "@list": {
                type: { is: 'exposed' },
                data: mkGifts(turntableMax, config.data)
              }
            },
          ]
        }
      },
      
      // 开始按钮
      {
        itemClass: 'pointer disabled',
        title: '点击抽奖',
        aim: 'runStart'
      },
    ],
    methods: {
      __ready(){
        this.times = config.times
        if (config.id) {
          this.activePage[config.id] = this
        }
        let that = this
        this.timmer = null
        this.running = false
        createBg.call(this, turntableMax, config, function(bgPath) {
          that.update({ [`data[1].@list.data[0].img`]: {src: bgPath, mode: 'widthFix'} })
        })
      },
      runStart(){
        if (this.running) return 
        this.running = true
        clearTimeout(this.timmer)

        let $data = config.data
        let $len = $data.length
        let $total = $len*10
        let num = 0
        let sum = 0  

        // 权重总数为 $total
        // 每一份数据都有10的基础权重
        // 指定权重的数据会抢占更过的权重
        // 先计算总共抢占的权重，基础权重10不计算在内
        $data.forEach(item=>{
          if (item && item.rate) {
            let rate = parseInt(item.rate)
            sum += (rate-10)
          }
        })

        // 除去抢占的权重，剩下的权重占总权重的比率为lastRate
        // 重新计算基础权重为 10 * lastRate
        let lastRate = ($total - sum) / $total  
        let rates = $data.map(item=>{

          // baseRate为以100权重为基，不论数据项为多少，均以百分比来计算
          // 比如有20项数据，基础权重10转化为10*(10/20)=5
          // 最终num为一个 <= 100的数，方便后面计算旋转角度
          let baseRate = 10/$len  
          let start = num
          let rate = 0
          if (item && item.rate) {
            let r = parseInt(item.rate)-10
            rate = ((r+10*lastRate)*baseRate)
          } else {
            rate = (10 * baseRate * lastRate)
          }
          num = num + rate 
          let end = num
          return [start, end]
        })
        if ($len>10) {
          let diff = 100 - rates[rates.length-1][1]
          rates[rates.length-1][1] = rates[rates.length-1][1]+diff
        }

        let randomRate = ~~(Math.random() * 100) // ~~ == Math.floor()

        // 这里可以打印 rates、randomRate数据了解
        // console.log(rates, randomRate);
        
        let selected = 0
        let selectedRate = 0
        for (let ii=0; ii<$len; ii++) {
          let item = rates[ii]
          if (randomRate>=item[0] && randomRate<=item[1]) {
            selected = ii;
            let gap = item[1]-item[0]
            let diff = randomRate-item[0]
            selectedRate = diff/gap
            break;
          }
        }

        let deg = (360 / $len) * selected
        let endDeg = (360 / $len) * (selected+1)
        let gapDeg = endDeg-deg

        let preDeg = this.times * 360
        // let preDeg = config.times * 360
        let targetDeg = parseInt(preDeg - deg - 90 - parseInt(gapDeg * selectedRate));

        let turntable = this.find('.turntable')
        let target = turntable.data[0]

        var anima = wx.createAnimation({
          duration: 5000,
          timingFunction: 'ease-out',
        })
        
        anima.rotate(0).step({ duration: 0 })
        target.update({ animation: anima.export() })

        setTimeout(() => {
          let suc = config.success
          let fail = config.fail
          let final = config.final
          let res = $data[selected]
          if (res && lib.isFunction(suc)) {
            suc(res)
          } else {
            if (lib.isFunction(fail)) {
              fail({message: '谢谢参与'})
            }
          }
          if (lib.isFunction(final)) {
            final(res||{message: '谢谢参与'})
          }
          // console.log($data[selected]||'谢谢参与');
          this.running = false
        } , 5200);

        this.timmer = setTimeout(() => {
          anima.rotate(targetDeg).step()
          target.update({
            animation: anima.export()
          })
        }, 50);
      }
    }
  }
}