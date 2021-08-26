//index.js
//获取应用实例
const Pager = require('../../components/aotoo/core/index')
let lib = Pager.lib
let source = require('../common/source')

function createSteper(params={}){
  const max = params.max || 10
  const min = params.min || 0
  return {
    itemClass: 'steper',
    dot: [
      {$$id: 'reduce', title: '-', tap: 'onReduce', itemClass: 'steper-reduce'},
      {$$id: 'shower', title: '0', itemClass: 'steper-counter'},
      {$$id: 'plus', title: '+', tap: 'onPlus', itemClass: 'steper-plus'},
    ],
    methods: {
      onReduce(){
        const $$ = this.activePage.getElementsById.bind(this.activePage)
        const shower = $$('shower')
        if (this.count > min) {
          this.count--
          shower.update({title: this.count})
        }
      },
      onPlus(){
        const $$ = this.activePage.getElementsById.bind(this.activePage)
        const shower = $$('shower')
        if (this.count < max) {
          this.count++
          shower.update({title: this.count})
        }
      },
    },
    ready(){
      this.count = 0
    }
  }
}


Pager({
  data: {
    // steperConfig: mkSteper('steper'),
    steperConfig: createSteper('steper'),
    ...source
  },
})
