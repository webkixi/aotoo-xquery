function adapter(max=3, data={}) {
  let count = max * max
  let ary = Array.from(new Array(count), (item, jj) => jj + 1);
  let firstRow = Array.from(new Array(max), (item, jj) => jj);
  let lastRow = Array.from(firstRow, (item, jj) => ((ary.length - 1) - jj)).reverse();
  let jj = 1
  let tmp = []
  ary = ary.map((item, ii) => {
    let itemClass = 'valide'
    let id = 'fruit-'+ii
    let sortIndex = null
    if (
      !firstRow.includes(ii) &&
      !lastRow.includes(ii) &&
      (ii % max < (max - 1) && ii % max > 0)
    ) {
      itemClass = 'inValide'
      item = ''
    } else {
      if (firstRow.includes(ii)) {
        sortIndex = jj
        jj ++
      } else if(lastRow.includes(ii)){
        tmp.unshift(ii)
      } else if (ii%max === 0) {
        tmp.unshift(ii)
      } else if (ii%max === (max-1)) {
        item = jj
        sortIndex = jj
        jj++
      }
    }

    let rate = 100/max-1
    return {
      id,
      sortIndex,
      title: item, 
      itemClass,
      // itemStyle: `width: calc(${rate}%);height: calc(${rate}%);margin:0.5%`
    }
  })

  tmp.forEach(index=>{
    ary[index].title = jj
    ary[index].sortIndex = jj
    jj++
  })

  let rate = 100/max-1
  ary = ary.map((item, ii) => {
    let sortIndex = item.sortIndex
    let fruit = data[sortIndex]
    if (sortIndex) {
      item.value = sortIndex
      item.itemStyle = `width: calc(${rate}%);height: calc(${rate}%);margin:0.5%`
    } else {
      item.itemStyle = `width: calc(${rate+1}%);height: calc(${rate+1}%);`
    }
    if (sortIndex && fruit) {
      item = Object.assign({}, item, fruit)
      if (fruit.img) {
        if (!fruit.title) delete item.title
      }
      item.sortIndex = sortIndex
    }
    return item
  })

  return ary
}

// mkFruits
module.exports = function(params, cb) {
  let dft = {
    id: '',  // 实例id，page ready中可调用
    listClass: 'fruit-machine', // 容器类名
    fruitsData: {}, // 配置每一个有效奖品
    max: 3 // 水果盘的基础数
  }

  if (typeof params === 'function') {
    cb = params
    params = null
  }

  let opts = Object.assign({}, dft, params)

  return {
    listClass: opts.listClass,
    itemClass: 'fruit-item',
    data: adapter(opts.max, opts.fruitsData),
    methods: {
      flatGap(x, y){
        x = x - this.diffLeft
        y = y - this.diffTop
        return [x, y]
      },
      rect(point){
        let [x, y] = this.flatGap(point.left, point.top)
        let dx = point.width
        let dy = point.height
        this.cavs.shadowOffsetX = 2
        this.cavs.shadowOffsetY = -2
        this.cavs.shadowColor = 'red'
        this.cavs.shadowBlur = 50
        this.cavs.lineWidth = 5
        this.cavs.strokeStyle = 'red'
        // this.cavs.fillStyle = 'red'
        // console.log(x, y, dx, dy);
        let canvas = this.canvas
        this.cavs.clearRect(0, 0, canvas.width, canvas.height)
        this.cavs.strokeRect(x+5, y+5, dx-10, dy-10)
      },
      run(){
        if (this.isRunning) return
        
        let num = Math.ceil(Math.random() * 10);
        let ring = num < 3 ? 3 : num > 6 ? 5 : 3 //跑圈数
        this.runningCount = ring * opts.max * 4 - 4 + num // 跑格子数

        let index = this.runningIndex // 第几个格子开始跑
        let count = this.runningCount
        let len = this.sortPoints.length

        let start = 0  // 开始时间
        let begin = index  // 开始位置
        let end = index + count  // 终点位置
        let during = 5000

        const easeInOutQuart = function (t, b, c, d) {
          if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
          return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        }

        const steper = () => {
          // 当前的运动位置
          // tween大类： Linear Quad Cubic Quart Quint Sine Expo Circ Elastic Back Bounce
          // tween小类： easeIn easeOut easeInOut
          var left = easeInOutQuart(start, begin, end, during);
          let idx = parseInt(left)
          let _idx = idx
          start = start + 17;

          if (idx <= end) {
            if (idx >= len) {
              idx = idx % len
            }
            this.runningIndex = idx
            let one = this.sortPoints[idx]
            let point = one.position
            this.rect(point)
          }

          if (_idx >= end-1) {
            start = start + 17
          }

          // 时间递增
          if (start <= during) {
            this.canvas.requestAnimationFrame(steper);
          } else {
            function appendStep(count) {
              if (count) {
                let idx = ++this.runningIndex
                if (idx >= len) idx = 0
                this.runningIndex = idx
                let one = this.sortPoints[idx]
                let point = one.position
                this.rect(point)
                count--
                appendStep.call(this, count)
              } else {
                if (typeof cb === 'function') {
                  let idx = this.runningIndex
                  let one = this.sortPoints[idx]
                  cb.call(this, one)
                }
              }
            }

            appendStep.call(this, 1)

            // 动画结束，这里可以插入回调...
            // callback()...
          }
        };
        steper();
      },
      __ready(){
        if (opts.id) {
          this.activePage[opts.id] = this
        }
        
        this.isRunning = false
        this.runningIndex = 0  // 第几个格子开始跑

        let query = wx.createSelectorQuery().in(this)
        query.selectAll(`.fruit-machine`).boundingClientRect(ret => {
          this.container = ret && ret[0]
        }).exec(() => {
          if (this.container) {
            this.diffTop = this.container.top
            this.diffLeft = this.container.left
            
            const canvasQuery = wx.createSelectorQuery()
            canvasQuery.select('#fruit-canvas')
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

              query.selectAll(`.fruit-machine .fruit-item`).boundingClientRect(ret => {
                let $data = this.getData().data
                this.sortPoints = []
                this.points = $data.map(item=>{
                  let id = item.id
                  let t = ret.find(it=>it.id===id)
                  if (t) {
                    item.position = {
                      left: t.left,
                      top: t.top,
                      right: t.right,
                      bottom: t.bottom,
                      width: t.width,
                      height: t.height
                    }
                  }
                  if (item.sortIndex || item.sortIndex === 0) this.sortPoints.push(item)
                  return item
                })

                this.sortPoints = this.sortPoints.sort((a, b)=>a.sortIndex-b.sortIndex)
                let point0 = this.sortPoints[0].position
                this.rect(point0)
                this.runningIndex = 1
                // this.run()
              }).exec()
            })

          }
        })
      }
    }
  }
}