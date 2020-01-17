/**
 * xquery是一套小程序的开发工具库
 * 说明: 在小程序中搜索 xquery，更多demo和说明
 * 源码: https://github.com/webkixi/aotoo-xquery
 * 小程序代码片段: https://developers.weixin.qq.com/s/KSoWN2mE7Lem
 */
const Pager = require('../../components/aotoo/core/index')
let lib = Pager.lib
let source = require('../common/source')

function mkTab(id=lib.suid('step_'), options) {
  return {
    $$id: id,
    listClass: 'tab-header',
    itemClass: 'tab-item',
    type: {
      "is": 'scroll',
      "scroll-y": true,
    },
    data: (
      options || [
        {title: '选项-1', id: 'sc-1', tap: 'onTap?id=1'},
        {title: '选项-2', id: 'sc-2', tap: 'onTap?id=2'},
        {title: '选项-3', id: 'sc-3', tap: 'onTap?id=3'},
        {title: '选项-4', id: 'sc-4', tap: 'onTap?id=4'},
        {title: '选项-5', id: 'sc-5', tap: 'onTap?id=5'},
        {title: '选项-6', id: 'sc-6', tap: 'onTap?id=6'},
        {title: '选项-7', id: 'sc-7', tap: 'onTap?id=7'},
        {title: '选项-8', id: 'sc-8', tap: 'onTap?id=8'},
        {title: '选项-9', id: 'sc-9', tap: 'onTap?id=9'},
      ]
    ),
    footer: {
      itemClass: 'tab-content',
      "@list": {
        listClass: 'swiper-content',
        itemClass: 'swiper-item',
        type: {
          is: 'swiper',
          bindchange: 'onSwiperChange',
          circular: false,
          duration: 300,
          vertical: true,
        },
        data: [
          {title: '内容-1', id: 'sw-1'},
          {title: '内容-2', id: 'sw-2'},
          {title: '内容-3', id: 'sw-3'},
          {title: '内容-4', id: 'sw-4'},
          {title: '内容-5', id: 'sw-5'},
          {title: '内容-6', id: 'sw-6'},
          {title: '内容-7', id: 'sw-7'},
          {title: '内容-8', id: 'sw-8'},
          {title: '内容-9', id: 'sw-9'},
        ]
      }
    },
    methods: {
      __ready(){
        this.swiperInst = this.find('.swiper-content').data[0]
        this.scrollInst = this
        this.scrollInst.find({id: 'sc-1'}).addClass('active')
        this.activePage.hooks.emit('set-content', {id: 'sw-1'}, this.swiperInst.find({id: 'sw-1'}))
        this.hasChangeContent = {'sw-1': true}
      },
      onTap(e, param, inst) {
        let that = this
        let id = param.id
        inst.siblings().removeClass('active')
        inst.addClass('active')
        this.swiperInst.update({"type.current": id-1}, function(){
          let hc = that.hasChangeContent
          let swId = 'sw-'+id
          if (!hc[swId]) {
            that.hooks.emit('tap-to', {id: swId}, that.swiperInst)
            that.hasChangeContent[swId] = true
          }
        })
      },
      onSwiperChange(e){
        let that = this
        this.scrollInst.forEach(item => item.removeClass('active'))
        let id = e.detail.currentItemId.replace('sw-', '')  
        id = parseInt(id)
        
        let scrollId = 'sc-'+id
        let activeIt = this.scrollInst.find({id: scrollId})
        activeIt.addClass('active')

        let intoId = id === 1 ? id : id-3
        this.update({ "type.scroll-into-view": 'sc-'+intoId }, function() {
          let hc = that.hasChangeContent
          let swId = 'sw-' + id
          if (!hc[swId]) {
            that.hooks.emit('switch-to', {id: swId}, that.swiperInst)
          }
        })
      }
    }
  }
}

Pager({
  data: {
    tabConfig: mkTab('tabselect'),
    ...source
  },
  onLoad(){
    this.hooks.once('set-content', function(param){
      if (param.id === 'sw-1') {
        this.update({
          title: '',
          "@list": {
            type: {
              "is": 'scroll',
              "scroll-y": true
            },
            listClass: 'item-one',
            itemClass: 'item-one-item',
            data: [
              {img: {src: '/images/banner.jpg', mode: 'aspectFit'}},
              {img: {src: '/images/huawei.jpg', mode: 'widthFix', itemStyle: 'width: 50px;'}, title: '手机'},
              {img: {src: '/images/huawei.jpg', mode: 'widthFix', itemStyle: 'width: 50px;'}, title: '手机'},
              {img: {src: '/images/huawei.jpg', mode: 'widthFix', itemStyle: 'width: 50px;'}, title: '手机'},
              {img: {src: '/images/huawei.jpg', mode: 'widthFix', itemStyle: 'width: 50px;'}, title: '手机'},
              {img: {src: '/images/huawei.jpg', mode: 'widthFix', itemStyle: 'width: 50px;'}, title: '手机'},
              {img: {src: '/images/huawei.jpg', mode: 'widthFix', itemStyle: 'width: 50px;'}, title: '手机'},
              {img: {src: '/images/huawei.jpg', mode: 'widthFix', itemStyle: 'width: 50px;'}, title: '手机'},
              {title: '手机'},
              {title: '手机'},
              {title: '手机'},
              {title: '手机'},
              {title: '手机'},
              {title: '手机'},
              {title: '手机'},
              {title: '手机'},
              {title: '手机'},
              {title: '手机'},
              {title: '手机'},
              {title: '手机'},
              {title: '手机'},
              {title: '手机'},
              {title: '手机'},
              {title: '手机'},
              {title: '手机'},
              {title: '手机'},
              {title: '手机'},
              {title: '手机'},
              {title: '手机'},
              {title: '手机'},
              {title: '手机'},
              {title: '手机'},
            ]
          }
          // title: '我是选项一',
          // img: {src: '/images/mk1.jpeg', mode: 'aspectFit'}
        })
      }
      if (param.id === 'sw-2') {
        this.update({
          img: {src: '/images/xquery.png', mode: 'aspectFit'},
          title: '我是选项二'
        })
      }
      if (param.id === 'sw-3') {
        this.update({
          title: '我是选项三',
          img: {src: '/images/mk3.jpeg', mode: 'aspectFit'}
        })
      }
    })
  },
  onReady(){
    let that = this
    let $tab = this.getElementsById('tabselect')
    $tab.hooks.on('tap-to', function(param) {
      // this.find({id: param.id}).update({title: '', "@item": { title: '啥哟' } })
      let target = this.find({id: param.id})
      that.hooks.emit('set-content', param, target)
    })
    $tab.hooks.on('switch-to', function (param) {
      let target = this.find({id: param.id})
      that.hooks.emit('set-content', param, target)
    })
  }
})
