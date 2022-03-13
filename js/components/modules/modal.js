const Pager = require('../aotoo/core/index')
const lib = Pager.lib

let modalInstance = null

// 基于list组件定制
module.exports = function modal(params={}){
  const defaultConfig = {
    id: '',
    $$id: '',
    itemClass: 'message-modal',
    bodyClass: 'message-modal-body',
    titleClass: 'message-modal-titles',
    footerClass: 'message-modal-footer',
    showCancel: true,
    showConfirm: true,
    editable: false,
    mask: true
  }
  let   options = {...defaultConfig, ...params}
  const width = options.width || '90%'   // width|height必须带单位
  const height = options.height || '20%'
  if (lib.isNumber(width)) width = `${width}%`
  if (lib.isNumber(height)) height = `${height}%`
  delete options.width
  delete options.height

  function buildupInitStyle(param={}){
    const options = param.options || {}
    delete param.options;

    let w = options.width || param.width ||  width   // width|height必须带单位
    let h = options.height || param.height || height
    if (lib.isNumber(w)) w = `${w}%`
    if (lib.isNumber(h)) h = `${h}%`
    delete param.width
    delete param.height

    const styleConfig = {
      position: 'fixed',
      width: w,
      height: h,
      top: `calc(50% - calc(${h} / 1.7))`,
      left: `calc(50% - calc(${w} / 2))`
    }

    const sty = {...styleConfig, ...param}
    return Object.entries(sty).map(pair=> `${pair[0]}: ${pair[1]}` ).join(';')
  }

  const initConfig = {
    title: '',
    body: [],
    dot: [],
    itemStyle: buildupInitStyle(),
    // tap(e, param, inst){
    //   inst.addClass('active', ()=>{
    //     inst.showModal({
    //       title: '哈哈哈',
    //       content: '你好啊',
    //       editable: true
    //     })
    //     // wx.showModal({
    //     //   title: 'hahha',
    //     //   content: '哈哈哈',
    //     //   editable: true
    //     // })
    //   })
    // },
    created(){
      this.oldValue = ''  // cancel时返回该值
      this.value = ''
      this._fail = null
      this._success = null
      this._complete = null
    },
    ready(){
      modalInstance = this
      const myid = options.$$id || options.id
      if (myid) {
        wx[myid] = this
      }
    },
    methods: {
      showModal(param={}){
        this._fail = null
        this._success = null
        this._complete = null
        const bg = this.parent().find('.message-modal-bg')

        /**
         * title
         * content: '' || string || {}
         * showCancel: true
         * mask: true,
         * cancelColor: '#000000'
         * cancelText: '取消'
         * confirmText: '确定'
         * confirmColor: '576B95'
         * editable: false   boolean值 或者 textarea
         * placeholderText: ''
         * success(){}
         * fail(){}
         * complete(){}
         */

        const opts = Object.assign({}, options, param)
        if (opts.mask) {
          bg.addClass('active')
        }

        const cancelButton = {
          title: opts.cancelText||'取消',
          itemStyle: 'color: '+ opts.cancelColor||'#000000',
          itemClass: 'modal-button modal-cancel-button',
          tap: 'onCancel'
        }

        const confirmButton = {
          title: opts.confirmText||'确定',
          itemStyle: 'color: '+ opts.confirmColor||'#000000',
          itemClass: 'modal-button modal-confirm-button',
          tap: 'onConfirm'
        }

        const title = opts.title ? opts.title : null
        const dot = opts.showCancel ? [cancelButton, confirmButton] : opts.showConfirm ? [confirmButton] : null
        let   tmpInput = {
          placeholder: opts.placeholderText || '',
          bindconfirm: 'onKeyboardConfirm',
          bindfocus: 'onBindFocus',
          bindblur: 'onBindBlur',
          bindinput: 'onBindInput',
          bindkeyboardheightchange: 'onKeyboardPush',
          maxlength: 50,
          'cursor-spacing': '0.6em'
          // content: opts.content||' '
        }

        if (opts.editable) {

          // 自定义
          if (lib.isObject(opts.editable)) {
            const customConfig = opts.editable
            tmpInput = customConfig
          } else {
            if (typeof (opts.editable) === 'boolean' ) {
              tmpInput.value = ((lib.isString(opts.content) || lib.isNumber(opts.content)) && opts.content) || ''
              tmpInput.type = 'text'
              tmpInput._type = 'text'
              tmpInput = {'@input': tmpInput}
            } else if (opts.editable === 'textarea') {
              tmpInput.maxlength = -1
  
              if (!lib.isObject(opts.content)) {
                opts.content = {value: opts.content||''}
              }
              if (lib.isObject(opts.content)) {
                tmpInput = Object.assign(tmpInput, opts.content)
                tmpInput._type = 'textarea'
                tmpInput.bindinput = 'onBindInput?inputtype=textarea',
                tmpInput = {'@textarea': tmpInput}
              }
            }
            this.value = ((tmpInput['@input']||tmpInput['@textarea']||tmpInput).value) || ''
            this.oldValue = this.value
          }
        } else {
          tmpInput = opts.content
        }

        let itemCls = (title ? 'message-modal active ' : 'message-modal without-title active ') + (opts.itemClass||'')
        let itemSty = opts.editable === 'textarea' ? buildupInitStyle({width: 90, height: title ? 35 : 28, options: opts}) : buildupInitStyle({height: title ? 20 : 16, options: opts})
        if (!opts.showCancel) {
          itemSty+=';grid-template-columns: 1fr;'
        }

        const updateConfig = {
          title,
          itemStyle: itemSty,
          body: [tmpInput],
          dot,
          itemClass: itemCls,
        }

        this._fail = opts.fail
        this._success = opts.success
        this._complete = opts.complete
        this.update(updateConfig)
      },

      showAnnounce(param={}){
        this.showModal({
          title: param.title,
          content: param.content,
          showCancel: false,
          showConfirm: false,
          height: param.height || 50,
          width: param.width||86,
          itemClass: 'announce'
        })
      },

      onCancel(){
        const theSuccess = this._success
        const bg = this.parent().find('.message-modal-bg')
        bg && bg.removeClass('active')
        this.reset()
        if (lib.isFunction(theSuccess)) {
          theSuccess({
            content: this.oldValue,
            confirm: false,
            cancel: true
          })
        }
      },

      onConfirm(){
        const that = this
        const theSuccess = this._success
        const bg = this.parent().find('.message-modal-bg')
        if (lib.isFunction(theSuccess)) {
          theSuccess({
            content: this.value,
            confirm: true,
            cancel: false,
            close(){
              bg && bg.removeClass('active')
              that.reset()
            },
          })
        }
        bg && bg.removeClass('active')
        this.reset()
      },

      onKeyboardConfirm(e){
        this.value = e.detail.value
      },
      onKeyboardPush(){},

      onBindFocus(){},
      onBindBlur(){},
      onBindInput(e, param, inst){
        this.value = e.detail.value
      },
    }
  }

  const modalConfig = {
    ...initConfig,
    ...options
  }


  return {
    type: {
      is: 'exposed'
    },
    data: [
      {itemClass: 'message-modal-bg', tap(e, param, inst){
        inst.removeClass('active')
        modalInstance && modalInstance.onCancel()
      }},
      {...modalConfig}
    ]
  }
}


