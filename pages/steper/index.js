//index.js
//获取应用实例
const Pager = require('../../components/aotoo/core/index')
let lib = Pager.lib

function mkSteper(id=lib.suid('step_'), min, max, step=1) {
  return {
    $$id: id,  // 实例id
    itemClass: 'steper-class',  // 容器样式类
    title: [
      {title: '-', aim: 'reduce', itemClass: 'steper-reduce'},
      {title: '0', aim: 'custom', itemClass: 'steper-counter'},
      {title: '+', aim: 'plus', itemClass: 'steper-plus'},
    ],
    methods: {
      __ready(){  // item实例初始化执行，组件ready后执行
        this.count = 0 // 初始值
        this.min = min||0  // 最小值
        this.max = max||10 // 最大值
        this.step = step||1 // 步进值
        this.stat = { // 按钮状态
          reduce: true,
          plus: true,
          count: true
        }
      },
      /**
       * 减值，允许外部调用
       * reduce([e], [param], [inst])
       * e {Boolean|Number|event}
      */
      reduce(e, param, inst){
        let step = this.step

        if (!inst) {
          inst = this.children[0]
        }

        // 设置减号无效，sku场景需求
        if (e === false) {
          this.stat.reduce = false
          inst.addClass('disable')
        }

        // 设置减号有效，sku场景需求
        if (e === true) {
          this.stat.reduce = true
          inst.removeClass('disable')
        }

        // 直接设置步进值
        if (typeof e === 'number') {
          step = e
        }

        this.count -= step
        if (this.count <= this.min) {
          this.count = this.min
          this.stat.reduce = false
          inst.addClass('disable') // 小于等于最小值减号无效
        }

        if (this.count < this.max && !this.stat.plus) { // 加号无效时激活+号
          this.stat.plus = true
          let $plus = inst.siblings('steper-plus') // 兄弟加号实例
          $plus.removeClass('disable')
        }
        this.changeNum(inst)
        this.hooks.emit('reduce', {count: this.count}, this) // 减号钩子

      },
      /**
       * 加值，允许外部调用
       * plus([e], [param], [inst])
       * e {Boolean|Number|event}
       */
      plus(e, param, inst){
        let step = this.step

        if (!inst) {
          inst = this.children[2]
        }

        // 设置加号无效, sku场景需求
        if (e === false) {
          this.stat.plus = false
          inst.addClass('disable')
        }
        // 设置加号有效，sku场景需求
        if (e === true) {
          this.stat.plus = true
          inst.removeClass('disable')
        }
        // 设置步进值
        if (typeof e === 'number') {
          step = e
        }

        this.count += step
        if (this.count >= this.max) {
          this.count = this.max
          this.stat.plus = false
          inst.addClass('disable')
        }
        if (this.count > this.min && !this.stat.reduce) { // 减号无效时激活减号
          this.stat.reduce = true
          let $reduce = inst.siblings('steper-reduce')  // 兄弟减号实例
          $reduce.removeClass('disable')
        }
        this.changeNum(inst)
        this.hooks.emit('plus', {count: this.count}, this)  // // 加号钩子
      },
      /**
       * 更新数字，允许外部调用
       * changeNum([inst])
       * inst {Object} 
       */
      changeNum(inst){
        let count = this.count
        if (typeof inst === 'number') {  // 直接设置count值
          count = inst
          inst = undefined
        }

        if (!inst) {
          inst = this.children[1]
        }

        let $counter = inst.siblings('steper-counter') // 兄弟显示区域实例
        $counter.update({
          title: count
        })
      }
    }
  }
}

Pager({
  data: {
    steperConfig: mkSteper('steper'),
  },
  onReady(){
    let $steper = this.getElementsById('steper')
    $steper.hooks.on('plus', function(param) {
      if (this.count === 10) {
        Pager.alert('不能再多了，仓库没货了')
      }
    })
    $steper.hooks.on('reduce', function(param) {
      if (param.count <= 0) {
        Pager.alert('大哥，买点啊')
      }
    })
  }
})
