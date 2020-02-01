const Pager = require('../../components/aotoo/core/index')
const lib = Pager.lib

function mkData(data) {
  let xxx = data || [1, 2, 3, 4, 5, 6, 7, 8, 9]
  return xxx.map((item, ii)=>{
    let idx = ii+1
    return {
      title: item,
      attr: {id: `p-${idx}`},
      value: item
    }
  })
}

// mkLocker
module.exports = function(params, cb) {
  let dft = {
    id: '',
    listClass: 'gestureLocker',
    data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    pointColor: '#1cd574',
    lineColor: '#1cd574',
    drawPoint: null  // 传入一个方法，每次确认标记点时响应
  }

  if (lib.isFunction(params)) {
    cb = params
    params = null
  }

  if (lib.isArray(params)) {
    params = {data: params}
  }

  let opts = Object.assign({}, dft, params)

  return {
    data: mkData(opts.data),
    listClass: opts.listClass,
    itemClass: 'lock-item',
    itemMethod: {
      catchtouchstart(e, param, inst){
        let touchs = e.changedTouches[0]
        let cTarget = e.currentTarget
        let dataset = cTarget.dataset
        let points = this.points
        let _points = this._points
        let id = dataset.id
        let item = points[id]
        let pageX = touchs.pageX
        let pageY = touchs.pageY

        let selected = this.pickPoint(pageX, pageY)

        if (selected) {
          let {center} = selected
          let {x, y, r} = center
          if (this.cavs) {
            this.hooks.on('draw-point', function() {
              this.drawPoint(x, y, r)
            })
            this.drawPoint(x, y, r)
          }
        }
      },
      catchtouchmove(e){
        const now = e.timeStamp
        const duration = now - this.prev
        // 由于小程序canvas效率低下，帧频率大于60丢弃
        // canvas 2d性能有很大的提升，但仍然保留以提升性能
        if (duration < Math.floor(1000 / 60)) return;
        this.prev = now

        let touchs = e.changedTouches[0]
        let cTarget = e.currentTarget
        let dataset = cTarget.dataset
        let points = this.points
        let _points = this._points
        let pageX = touchs.pageX
        let pageY = touchs.pageY

        let id = dataset.id
        let item = this.lastSelected || points[id]
        let {x, y, r} = item.center
        
        this.hooks.emit('clear-rect', {}, this)
        this.hooks.emit('draw-point', {}, this)
        
        let selected = this.pickPoint(pageX, pageY)
        if (selected) {
          let tcenter = selected.center
          let tx = tcenter.x, ty = tcenter.y, tr = tcenter.r
          let edge = selected.edge
          this.hooks.on('draw-point', function(param) {
            // rectPoint
            let willRender = param.willRender || false
            let clearRect = this.clearRect
            let rp = {start: {x: clearRect[0], y: clearRect[1]}, end: {x: clearRect[2], y: clearRect[3]} }
            if (edge.left.x>=rp.start.x && edge.left.y>=rp.start.y) {
              willRender = true
            } else if (edge.right.x>=rp.start.x && edge.right.y>=rp.start.y) {
              willRender = true
            } else if (edge.bottom.x>=rp.start.x && edge.bottom.y>=rp.start.y) {
              willRender = true
            } else if (edge.top.x>=rp.start.x && edge.top.y>=rp.start.y) {
              willRender = true
            }
            if (willRender) {
              this.drawPoint(tx, ty, tr)
            }
            this.drawLine(x, y, tx, ty)
          })
          this.drawPoint(tx, ty, tr)
          this.drawLine(x, y, tx, ty)
        } else {
          this.drawLine(x, y, pageX, pageY)
        }
      },
      catchtouchend(){
        let that = this
        let values = this.value
        if (lib.isFunction(cb)) {
          let context = {
            clear(){ that.clear() },
            warning(){ that.warning() }
          }
          cb.call(context, values)
        }
      }
    },
    methods: {
      warning(){
        let opc = opts.pointColor
        let olc = opts.lineColor
        opts.pointColor = 'red'
        opts.lineColor = 'red'
        this.hooks.emit('clear-rect', {}, this)
        this.hooks.emit('draw-point', {willRender: true}, this)
        setTimeout(() => {
          opts.pointColor = opc
          opts.lineColor = olc
          this.clear()
        }, 1000);
      },
      clear(){
        this.value = []
        this._points = this._points.map(item => {
          let dataset = item.dataset
          let id = dataset.id
          this.points[id].selected = false
          item.selected = false
          return item
        })
        this.hooks.off('clear-rect')
        this.hooks.off('draw-point')
        this.lastSelected = null
        this.cavs.clearRect(0, 0, 400, 400)
      },
      pickPoint(pageX, pageY){
        let selected = null
        let points = this.points
        let _points = this._points
        for (let ii=0; ii<_points.length; ii++) {
          let one = _points[ii]
          let id = one.dataset.id
          let {left, top, right, bottom, width, height} = one
          if (
            (pageX>left && pageX<right) && 
            (pageY>top && pageY<bottom) && 
            !points[id].selected
          ) {
            selected = one;
            points[id].selected = true
            _points[ii].selected = true
            break;
          }
        }
        if (selected) {
          this.value.push(selected.value)
          this.lastSelected = selected
          if (lib.isFunction(opts.drawPoint)) {
            opts.drawPoint(selected.value)
          }
        }
        return selected
      },

      // canvas的绘图都是以左上角0,0为基点
      // 但我们需要定位canvas容器的位置，这里需要减去位移的位置，重置基点
      flatGap(x, y){
        x = x - this.diffLeft
        y = y - this.diffTop
        return [x, y]
      },

      drawPoint(_x, _y, r){
        let [x, y] = this.flatGap(_x, _y)
        this.cavs.beginPath()
        this.cavs.moveTo(x, y)
        this.cavs.fillStyle = opts.pointColor
        this.cavs.arc(x, y, r / 3, 0, Math.PI * 2, true)
        this.cavs.fill()
        this.cavs.closePath()
      },

      drawLine(_x, _y, _px, _py){
        let [x, y] = this.flatGap(_x, _y)
        let [px, py] = this.flatGap(_px, _py)

        this.cavs.strokeStyle = opts.lineColor
        this.cavs.beginPath()
        this.cavs.lineWidth = 3
        this.cavs.moveTo(x, y)
        this.cavs.lineTo(px, py)
        this.hooks.once('clear-rect', function () {
          let rect = []
          if (px > x) {
            if (py < y) {
              rect = [x - 2, py - 2, px + 2, y]
            } else {
              rect = [x - 2, y - 2, px + 2, py + 2]
            }
          } else {
            if (py < y) {
              rect = [px - 2, py - 2, x, y]
            } else {
              rect = [px - 2, y-2, x, py + 2]
            }
          }
          this.clearRect = rect
          this.cavs.clearRect(rect[0], rect[1], rect[2], rect[3])
        })
        this.cavs.stroke()
        this.cavs.closePath()
      },

      __ready() {
        let that = this
        this.value = []
        this.prev = 0
        this.container = null

        wx.showLoading({})

        if (opts.id) {
          this.activePage[opts.id] = this
        }

        let query = wx.createSelectorQuery().in(this)
        query.selectAll(`.${opts.listClass}`).boundingClientRect(ret=>{
          this.container = ret && ret[0]
        }).exec(()=>{
          if (this.container) {
            const cwidth = this.container.width
            const cheight = this.container.height
            this.diffTop = this.container.top
            this.diffLeft = this.container.left
            
            const canvasQuery = wx.createSelectorQuery()
            canvasQuery.select('#canvasLocker')
              .fields({ node: true, size: true })
              .exec((res) => {
                const canvas = res[0].node
                const ctx = canvas.getContext('2d')
                this.canvas = canvas
                this.cavs = ctx
  
                const dpr = wx.getSystemInfoSync().pixelRatio
                canvas.width = res[0].width * dpr
                canvas.height = res[0].height * dpr
                ctx.scale(dpr, dpr)
              })
            
            query.selectAll(`.${opts.listClass} .lock-item`).boundingClientRect(ret => {
              if (ret.length) {
                let $data = this.getData().data
                this.points = {}
                this._points = ret.map(item => {
                  let dataset = item.dataset
                  let id = dataset.id
                  let findIt = $data.find((item)=>{
                    return item.attr&&item.attr.id === id
                  })
                  if (findIt) {
                    item.value = findIt.value
                  }
                  let {top, left, width} = item
                  let r = parseInt(width / 2)
                  let x = left + r
                  let y = top + r
                  item.center = {x, y, r}  // 中心点和半径
                  item.edge = { // 四个边界点
                    left: {x: x-r, y},
                    top: {x, y: y-r},
                    right: {x: x+r, y},
                    bottom: {x, y: y+r}
                  }
                  this.points[id] = item
                  return item
                })
              }
            }).exec(() => {
              setTimeout(() => {
                wx.hideLoading()
              }, 1000);
            })
          }
        })
      }
    }
  }
}