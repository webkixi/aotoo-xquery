// mkGuaguaka
module.exports = function(params, cb) {
  let dft = {
    id: '',
    title: '',
    itemClass: 'guaguayes',
    eraser: 15,  //橡皮擦大小
    open: 25, // 开奖百分比
    masker: '#ccc',
    maskerTitle: '刮开此涂层',
  }

  let opts = Object.assign({}, dft, params)

  if (!opts.title) opts.title = '好好学习'

  return {
    itemClass: opts.itemClass,
    title: '',
    dot: [
      {
        title: '',
        itemClass: 'guagua-touchpad',
        catchtouchstart(e, param, inst){
          let touchs = e.changedTouches[0]
          let cTarget = e.currentTarget
          let dataset = cTarget.dataset
          let x = touchs.pageX
          let y = touchs.pageY
          let r = opts.eraser
          if (this.cavs) {
            this.eraser(x, y, r)
          }
        },
        catchtouchmove(e, param, inst){
          let touchs = e.changedTouches[0]
          let cTarget = e.currentTarget
          let dataset = cTarget.dataset
          let x = touchs.pageX
          let y = touchs.pageY
          let r = opts.eraser
          this.eraser(x, y, r)
        },
        catchtouchend(e, param, inst){
          setTimeout(() => {
            let persent = this.getFilledPercentage()
            if (persent>opts.open) {  // 刮开面积大于32%，开奖
              this.clean()
              if (typeof cb === 'function') {
                cb.call(this)
              }
            }
          }, 100);
        }
      }
    ],
    methods: {
      // canvas的绘图都是以左上角0,0为基点
      // 但我们需要定位canvas容器的位置，这里需要减去位移的位置，重置基点
      flatGap(x, y) {
        x = x - this.diffLeft
        y = y - this.diffTop
        return [x, y]
      },

      getFilledPercentage() {
        let width = this.canvas.width
        let height = this.canvas.height
        let imgData = this.cavs.getImageData(0, 0, width, height);
        // imgData.data是个数组，存储着指定区域每个像素点的信息，数组中4个元素表示一个像素点的rgba值
        let pixels = imgData.data;
        let transPixels = [];
        for (let i = 0; i < pixels.length; i += 4) {
          // 严格上来说，判断像素点是否透明需要判断该像素点的a值是否等于0，
          // 为了提高计算效率，这儿设置当a值小于128，也就是半透明状态时就可以了
          if (pixels[i + 3] < 128) {
            transPixels.push(pixels[i + 3]);
          }
        }
        // return (transPixels.length / (pixels.length / 4) * 100).toFixed(2) + '%'
        return (transPixels.length / (pixels.length / 4) * 100)
      },
      
      eraser(_x, _y, r){
        this.cavs.globalCompositeOperation = 'destination-out'
        let [x, y] = this.flatGap(_x, _y)
        this.cavs.beginPath()
        this.cavs.moveTo(x, y)
        this.cavs.arc(x, y, r, 0, Math.PI * 2, false)
        this.cavs.fill()
        this.cavs.closePath()
      },

      clean(){
        let canvas = this.canvas
        this.cavs.clearRect(0, 0, canvas.width, canvas.height)
      },

      reMasker(param){
        opts = Object.assign({}, opts, param)
        this.update({title: opts.title})
        this.masker()
      },

      masker(){
        let canvas = this.canvas
        
        if (opts.masker.charAt(0) === '#' || opts.masker.indexOf('rgb')===0) {
          this.cavs.fillStyle = opts.masker
          this.cavs.fillRect(0, 0, canvas.width, canvas.height)
          let top = this.container.height/2
          let left = this.container.width/2
  
          this.cavs.fillStyle = '#aaa'
          this.cavs.font = 'bold 30px "Gill Sans Extrabold"'
          this.cavs.textAlign = 'center'
          this.cavs.textBaseline = 'middle'
          this.cavs.fillText(opts.maskerTitle, left, top)
        } else {
          let that = this
          var img = canvas.createImage();
          // img.src = "/images/banner.jpg";
          img.src = opts.masker;
          img.onload = function(){
            that.cavs.drawImage(img, 0, 0, that.container.width, that.container.height)
          }
        }

      },

      __ready(){
        if (opts.id) {
          this.activePage[opts.id] = this
        }
        let query = wx.createSelectorQuery().in(this)
        query.selectAll(`.guaguayes`).boundingClientRect(ret => {
          this.container = ret && ret[0]
        }).exec(()=>{
          if (this.container) {
          this.diffTop = this.container.top
          this.diffLeft = this.container.left
          
          const canvasQuery = wx.createSelectorQuery()
          canvasQuery.select('#guagua-canvas')
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

              setTimeout(() => {
                this.update({title: opts.title})
              }, 200);
              this.masker()
            })
          }
        })
      }
    }
  }
}