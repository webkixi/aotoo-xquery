const Pager = require('../../components/aotoo/core/index')
let lib = Pager.lib
let nav = lib.nav

function mkReddot(item) {
  if (item.reddot || item.reddot === 0) {
    let reddot = item.reddot.toString()
    let redClass = 'tab-item-red'

    if (reddot.length === 1) {
      redClass += ' len1'
    }
    if (reddot.length === 2) {
      redClass += ' len2'
    }
    if (reddot.length === 3) {
      redClass += ' len3'
    }

    item.reddot = reddot

    if (item.reddot.length > 3) {
      item.reddot = '∙∙∙'
      redClass += ' len4'
    }

    if (reddot === '00') {
      item.reddot = ''
      redClass = 'tab-item-red'
    }

    if (reddot === '000') {
      redClass = 'tab-item-red none'
    }

    item.dot = [{
      title: item.reddot,
      itemClass: redClass
    }]
  }
  return item
}

module.exports = function mkTabbar(id = lib.suid('tabbar_'), params) {
  let opts = {
    data: [],
    listClass: '',
    itemClass: ''
  }

  if (lib.isArray(id) || lib.isObject(id)) {
    params = id
    id = lib.suid('tabbar_')
  }

  params = lib.clone(params)

  if (lib.isArray(params)) {
    opts.data = params
  }

  if (lib.isObject(params)) {
    opts = Object.assign({}, opts, params)
  }

  opts.data = opts.data.map(item => {
    if (item.href) {
      item.aim = `onTap?url=${item.href}`
    }
    item.itemClass = item.itemClass || ''
    if (item.img) {
      let src = item.img.src || item.img
      let srcAry = src.split('||')
      item.img = {src: srcAry[0], mode: 'widthFix'}
      if (item.selected && srcAry[1]) {
        item.img = {src: srcAry[1], mode: 'widthFix'}
      }
      item.itemClass += ' tab-icon'
    }

    item = mkReddot(item)

    if (item.selected) {
      opts.selected = item
      item.itemClass += ' active'
    }

    return item
  })


  return {
    $$id: id,
    listClass: `tab-boxer ${opts.listClass}`,
    itemClass: `tab-item ${opts.itemClass}`,
    data: (
      opts.data || []
    ),
    methods: {
      reddot(index, num) {
        if (lib.isNumber(index)) {
          let findIt = this.find(index)
          if (findIt) {
            let $data = findIt.data[0].data
            $data.reddot = num
            $data = mkReddot($data)
            findIt.data[0].update({
              "dot": $data.dot
            })
          }
        }
      },
      onTap(e, param, inst) {
        inst.siblings().removeClass('active')
        inst.addClass('active')
        if (param.url) {
          // calendar/index
          nav.reLaunch({
            url: param.url
          })
        }
      }
    }
  }
}