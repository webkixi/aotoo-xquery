const Pager = require('../aotoo/core/index')
const lib = Pager.lib

function complyCb(params = {}) {
  let {
    e,
    cb, 
    context,
  } = params
  let board = this.backBoard
  if (lib.isFunction(cb)) {
    cb.call(this, e, board)
  }
  if (lib.isString(cb)) {
    if (context) {
      if (lib.isFunction(context[cb])) {
        context[cb].call(context, e, board)
      }
    }
  }
}

module.exports = function(params={}, context) {
  let $$id = params.$$id || 'searchBar'
  let formClass = 'search-bar ' + params.formClass || params.itemClass || ''
  let placeholder = params.placeholder || '搜索'
  let bindfocusCb = params.bindfocus
  let bindinputCb = params.bindinput
  let bindblurCb = params.bindblur
  let bindconfirmCb = params.bindconfirm
  let boardData = params.data || []
  return {
    "@form": {
      $$id,
      formClass,
      data: [
        {
          input: [
          {
            id: 'search-text',
            type: 'text',
            placeholder,
            inputClass: 'search-text',
            bindfocus: 'onBindfocus',
            bindinput: 'onBindinput',
            eye: 'search-clean'
          },
          {id: 'btn', type: 'span', value: {itemClass: 'search-cancel', title: '取消', aim: 'onSearchCancel'}},
          {id: 'pop', type: 'span', value: {
            itemClass: 'search-pop', 
            catchtouchstart: 'stopPropagation',
            catchtouchmove: 'stopPropagation',
            catchtouchend: 'stopPropagation',
            "@list": {
              listClass: 'search-board',
              data: boardData
            }
          }},
        ]}
      ],
      methods: {
        __ready(){
          if (context) {
            context[$$id] = this
            this.timmer = null
          }
          this.popBox = this.find('.search-pop').data[0]
          this.backBoard = this.popBox.children[0]
          this.ctx = context || this.activePage || null
        },
        openCloseEey(e, param, inst){
          this.empty('search-text')
        },
        stopPropagation(){},  // 阻止事件传递
        onSearchCancel(e, param, inst){
          this.empty('search-text')
          this.removeClass({
            'search-text': '.active',
            'btn': '.active',
            'pop': '.active'
          })
        },
        onBindconfirm(e, param, inst) {
          let context = this.ctx
          complyCb.call(this, {
            e,
            cb: bindconfirmCb,
            context,
          })
        },
        onBindinput(e, param, inst){
          let context = this.ctx
          clearTimeout(this.timmer)
          this.timmer = setTimeout(() => {
            complyCb.call(this, {
              e,
              cb: bindinputCb,
              context,
            })
          }, 1000);
        },
        onBindfocus(e, param, inst){
          let context = this.ctx
          this.addClass({
            'search-text': '.active',
            'btn': '.active',
            'pop': '.active'
          })
          setTimeout(() => {
            complyCb.call(this, {
              e,
              cb: bindfocusCb, 
              context,
            })
          }, 500);
        }
      }
    }
  }
}