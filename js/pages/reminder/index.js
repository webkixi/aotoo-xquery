/**
 * xquery是一套小程序的开发工具库
 * 说明: 在小程序中搜索 xquery，更多demo和说明
 * 源码: https://github.com/webkixi/aotoo-xquery
 * 小程序代码片段: https://developers.weixin.qq.com/s/oONQs1mf7Uem
 */
const Pager = require('../../components/aotoo/core/index')
let lib = Pager.lib
let shareConfig = {}

function reminder(ctx, durationTime=3) {
  let query = wx.createSelectorQuery().in(ctx)
  let rate = 1
  let startY = 110
  let endY = 110
  let duration = durationTime * 1000

  function inner() {
    if (duration === 0) {
      ctx.clearAnimation('.reminder-container >>> #idTitle')
      ctx.animate('.reminder-container >>> #idTitle', [
        { translateY: 0, rotate: 90},
      ])
    } else {
      ctx.animate('.reminder-container >>> #idTitle', [
        { translateY: `${startY}%`, rotate: 90},
        { translateY: `-${endY}%`, rotate: 90},
      ], duration, function() {
        ctx.clearAnimation('.reminder-container >>> #idTitle')
        inner(ctx, durationTime, reminder)
      })
    }
  }

  query.selectAll(`.reminder-container >>> #idTitle`).boundingClientRect(ret => {
    let rHeight = ret[0].height
    let cHeight = ctx.container.height
    rate = rHeight/cHeight
    startY = startY * rate
    endY = endY * rate
  }).exec(inner)
}

function _changeFontSize(inst, fz) {
  let title = '小'
  switch (fz) {
    case 100:
      title = '小'
      break;
    case 150:
      title = '中'
      break;
    case 180:
      title = '大'
      break;
  }
  setTimeout(() => inst.update({title}), 200);
  if (this) reminder(this, shareConfig.fontSpeed)
}

function _changeFontSpeed(inst, speed) {
  this.clearAnimation('.reminder-container >>> #idTitle')
  switch (speed) {
    case 0:
      inst.update({title: '停'})
      break;
    case 8:
      inst.update({title: '0.5x'})
      break;
    case 4:
      inst.update({title: '0.75x'})
      break;
    case 3:
      inst.update({title: '1x'})
      break;
    case 1.5:
      inst.update({title: '2x'})
      break;
  }
  reminder(this, speed)
}

function _changeFontType(inst, fontType) {
  let reType = / *font\-type\-([\w|' '])*/g
  let xxx = Pager.getElementsById('change-title')
  let oldClass = xxx.getData().itemClass
  oldClass = oldClass.replace(reType, '')

  switch (fontType) {
    case 'douyin':
      inst.update({title: '闪'})
      xxx.update({itemClass: oldClass + ' font-type-douyin'})
      break;
    case 'shake':
      inst.update({title: '抖'})
      xxx.update({itemClass: oldClass + ' font-type-shake'})
      break;
    case 'halo':
      inst.update({title: 'H'})
      xxx.update({itemClass: oldClass + ' font-type-halo'})
      break;
    default:
      inst.update({title: '平'})
      xxx.update({itemClass: oldClass})
      break;
  }
}

function _changeBackground(inst, bg) {
  // 更改背景
  let re = / *background\-([\w])*/g
  let xxx = Pager.getElementsById('reminder-barrage')
  let _myclass = ' background-' + bg
  let itemClass = xxx.getData().itemClass || ''
  let myclass = itemClass.replace(re, '') + _myclass

  let bgtitle = null
  switch (bg) {
    case 'blink':
      bgtitle = 'DJ'
      break;
    case 'shan':
      bgtitle = '闪'
      break;
    case 'red':
      bgtitle = '红'
      break;
    case 'black':
      bgtitle = '黑'
      break;
    case 'blue':
      bgtitle = '蓝'
      break;
    case 'green':
      bgtitle = '绿'
      break;
    case 'white':
      bgtitle = '白'
      break;
    case 'gray':
      bgtitle = '灰'
      break;
  }
  setTimeout(() => bgtitle && inst.update({title: bgtitle}), 200);
  xxx.update({itemClass: myclass})
}

function mkHandleBarrage(params) {
  let dft = {
    title: '分享蛋睦弹幕，全场整齐划一',
    fontSize: 100,
    fontSpeed: 8,
    fontType: 'red',
    background: 'black'
  }

  shareConfig= {}
  shareConfig = Object.assign({}, dft, params)

  return {
    $$id: 'reminder-barrage',
    itemClass: 'reminder-container',
    tap() {
      if (!this.toggleTool) {
        this.toggleTool = true
        this.animate('.reminder-container >>> .reminder-fontcommon', [
          { opacity: 0},
        ])
        this.animate('.reminder-container >>> .reminder-tool', [
          { opacity: 0},
        ])
      } else {
        this.toggleTool = false
        this.clearAnimation('.reminder-container >>> .reminder-fontcommon')
        this.clearAnimation('.reminder-container >>> .reminder-tool')
      }
    },
    dot: [
      {
        $$id: 'change-title',
        id: 'idTitle',
        title: shareConfig.title,
        itemClass: 'reminder-title',
        itemStyle: '',
      },
      {
        $$id: 'reminder-tool',
        itemClass: 'reminder-tool',
        "@input": {
          id: 'message',
          maxlength: 30,
          placeholder: '输入文字，分享蛋睦',
          itemClass: 'reminder-text',
          bindblur: 'onBindblur',
          bindkeyboardheightchange: 'onBindfocus',
          value: shareConfig.title,
          tap: 'stopp'
        },
      },
    ],
    body: [
      {
        itemClass: 'minijump',
        img: {src: '/images/logo.jpg', itemStyle: 'width: 48px; border-radius: 50%;'},
        aim(){
          wx.navigateToMiniProgram({
            appId: 'wxa57a87d303a63c7d',
            faile(e){
              console.log(e);
            }
          })
        }
      },
      {
        title: '小',
        $$id: 'change-font-size',
        itemClass: 'reminder-fontcommon reminder-fontsize',
        aim(e, param, inst){
          let app = getApp()
          let re = / *font\-size: *[\d]{1,3}px;/g
          let globalReminder = app.globalReminder
          let fontSize = globalReminder.fontSize
          // let index = Math.ceil(Math.random() * (fontSize.length-1))
          let index = this.index
          if (index === undefined) {
            index = 0
            this.index = 0
          } else {
            index = (++this.index)
            if (index > (fontSize.length-1)) {
              this.index = 0
              index = 0
            }
          }

          let xxx = Pager.getElementsById('change-title')
          let oldStyle = xxx.getData().itemStyle
          oldStyle = oldStyle&&oldStyle.replace(re, '') || ''
          let fz = fontSize[index]
          let style = `${oldStyle}; font-size: ${fz}px;`
          shareConfig.fontSize = fz
          _changeFontSize.call(this, inst, fz)
          this.doneUpdate({itemStyle: style}, xxx)
        }
      },
      {
        title: '平',
        $$id: 'change-font-type',
        itemClass: 'reminder-fontcommon reminder-fontType',
        aim(e, param, inst){
          let app = getApp()
          let re = / *\-\-barrage\-ani: *([\w|\-]*);?/g
          let globalReminder = app.globalReminder
          let fontType = globalReminder.fontType
          // let index = Math.ceil(Math.random() * (fontSize.length-1))
          let index = this.index
          if (index === undefined) {
            index = 0
            this.index = 0
          } else {
            index = (++this.index)
            if (index > (fontType.length - 1)) {
              this.index = 0
              index = 0
            }
          }

          let ft = fontType[index]
          shareConfig.fontType = ft
          _changeFontType(inst, ft)
        }
      },
      {
        title: '1x',
        $$id: 'change-font-speed',
        itemClass: 'reminder-fontcommon reminder-speed',
        aim(e, param, inst){
          let app = getApp()
          let globalReminder = app.globalReminder
          let fontSpeed = globalReminder.fontSpeed
          let index = this.index
          if (index === undefined) {
            index = 0
            this.index = 0
          } else {
            index = (++this.index)
            if (index > (fontSpeed.length - 1)) {
              this.index = 0
              index = 0
            }
          }
          shareConfig.fontSpeed = fontSpeed[index]
          _changeFontSpeed.call(this, inst, fontSpeed[index])
        }
      },
      {
        title: '黑',
        $$id: 'change-background',
        itemClass: 'reminder-fontcommon reminder-back',
        aim(e, param, inst){
          let app = getApp()
          let globalReminder = app.globalReminder
          let background = globalReminder.background
          let index = this.index
          if (index === undefined) {
            index = 0
            this.index = 0
          } else {
            index = (++this.index)
            if (index > (background.length - 1)) {
              this.index = 0
              index = 0
            }
          }
          shareConfig.background = background[index]
          _changeBackground(inst, background[index])
        }
      },
    ],
    methods: {
      stopp(){},
      doneUpdate(param, inst){
        let style = param.itemStyle
        if (style) {
          style = style.replace(/;;/g, ';')
          param.itemStyle = style
        }
        inst.update(param)
      },
      onBindfocus(e){
        let detail = e.detail
        let kbHeight = detail.height
        let tool = Pager.getElementsById('reminder-tool')
        if (kbHeight === 0) {
          tool.css(' ')
        }

        if (kbHeight && kbHeight > 0) {
          tool.css(`bottom: ${kbHeight-40}px;`)
        }
      },
      onBindblur(e){
        let detail = e.detail
        let value = detail.value
        if (value && value.length > 2) {
          let xxx = Pager.getElementsById('change-title')
          shareConfig.title = value
          xxx.update({title: value})
        }
      },
      __ready(){
        let app = getApp()
        app.globalReminder = {
          fontSize: [100, 150, 180],
          fontSpeed: [0, 8, 4, 3, 1.5],
          fontType: ['douyin', 'shake', 'halo', 'none'],
          background: ['blink', 'shan', 'red', 'black', 'blue', 'green', 'white', 'gray']
        }
        let query = wx.createSelectorQuery().in(this)
        query.selectAll(`.reminder-container`).boundingClientRect(ret => {
          this.container = ret && ret[0]
        }).exec(() => {
          let $changeTitle = Pager.getElementsById('change-title')
          let $changeFontSize = Pager.getElementsById('change-font-size')
          let $changeFontType = Pager.getElementsById('change-font-type')
          let $changeFontSpeed = Pager.getElementsById('change-font-speed')
          let $changeBackground = Pager.getElementsById('change-background')

          if (shareConfig.fromShare) {
            $changeTitle.update({title: shareConfig.title})
            this.update({ "dot[1].@input.value": shareConfig.title })
          }
          
          _changeFontSize($changeFontSize, shareConfig.fontSize)
          _changeFontType($changeFontType, shareConfig.fontType)
          _changeFontSpeed.call(this, $changeFontSpeed, shareConfig.fontSpeed)
          _changeBackground($changeBackground, shareConfig.background)

          reminder(this, shareConfig.fontSpeed)
        })
      }
    }
  }
}

Pager({
  data: {
    reminderConfig: mkHandleBarrage(),
  }, 
})
