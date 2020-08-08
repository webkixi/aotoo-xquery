//index.js
//获取应用实例
const app = getApp()
const Pager = require('../common/extpager')

Pager({
  data: {
    targetConfig: {
      itemClass: 'sitem dropdown',
      title: [
        '请选择',
        { itemClass: 'icono-caretDown' }
      ],
      tap: 'onTap',
      body: [
        {title: '选项一', id: '1', aim: 'onOption?id=1&title=选项一'},
        {title: '选项二', id: '2', aim: 'onOption?id=2&title=选项二'},
        {title: '选项三', id: '3', aim: 'onOption?id=3&title=选项三'},
        {title: '选项四', id: '4', aim: 'onOption?id=4&title=选项四'},
      ],
      methods: {
        close(){
          this.removeClass('active')
        },
        __ready(){
          let defaultSelect = this.find({id: '3'})
          let $sel = defaultSelect
          $sel.addClass('active')
          let defaultTitle = '选项三'
          this.update({ 'title[0]': defaultTitle })
        },
        onOption(e, param, inst){
          inst.siblings().removeClass('active')
          inst.addClass('active')
          let title = param.title
          this.update({ 'title[0]': title })
        }
      }
    },
  },
  onTap(e, param, inst) {
    inst.toggleClass('active')
  }
})
