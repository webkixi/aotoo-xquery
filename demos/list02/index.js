//index.js
//获取应用实例
const app = getApp()
const Pager = require('../common/extpager')
const lib = Pager.lib

const adjustment = 4 // 调整菜单滚动时的居中位置

const menusData = [
  {title: '要闻' , id: 'nav-1', itemClass: 'active'},
  { title: '视频' , id: 'nav-2'},
  {title: '推荐' , id: 'nav-3'},
  {title: '抗疫' , id: 'nav-4'},
  {title: '科技' , id: 'nav-5'},
  {title: '军事' , id: 'nav-6'},
  {title: '国际' , id: 'nav-7'},
  {title: '广州' , id: 'nav-8'},
  {title: '广东' , id: 'nav-9'},
  {title: '游戏' , id: 'nav-10'},
  {title: '娱乐' , id: 'nav-11'},
  {title: '体育' , id: 'nav-12'},
  {title: '军事' , id: 'nav-13'},
  {title: 'NBA' , id: 'nav-14'},
  {title: '财经' , id: 'nav-15'},
  {title: '汽车' , id: 'nav-16'},
  {title: '电影' , id: 'nav-17'},
  {title: '美食' , id: 'nav-18'},
  {title: '新时代', id: 'nav-19'},
  {title: '电视剧', id: 'nav-20'},
  {title: '综艺' , id: 'nav-21'},
  {title: '时尚' , id: 'nav-22'},
  {title: '健康' , id: 'nav-23'},
  {title: '育儿' , id: 'nav-24'},
  {title: '情感' , id: 'nav-25'},
  {title: '小康' , id: 'nav-26'},
  {title: '眼界' , id: 'nav-27'},
]

const contentData = [
  {
    title: '要闻' , id: 'board-1',
    dot: [
      {img: {src: '/images/mk1.jpeg', itemStyle:'width: 100%; margin-top: 10px;'}},
    ]
  },
  {
    title: '视频' , 
    id: 'board-2',
    dot: [
      {img: {src: '/images/banner.jpg', itemStyle:'width: 100%; margin-top: 10px;'}},
      {img: {src: '/images/banner.jpg', itemStyle:'width: 100%; margin-top: 10px;'}},
      {img: {src: '/images/banner.jpg', itemStyle:'width: 100%; margin-top: 10px;'}},
    ]
  },
  {title: '推荐' , id: 'board-3'},
  {title: '抗疫' , id: 'board-4'},
  {title: '科技' , id: 'board-5'},
  {title: '军事' , id: 'board-6'},
  {title: '国际' , id: 'board-7'},
  {title: '广州' , id: 'board-8'},
  {title: '广东' , id: 'board-9'},
  {title: '游戏' , id: 'board-10'},
  {title: '娱乐' , id: 'board-11'},
  {title: '体育' , id: 'board-12'},
  {title: '军事' , id: 'board-13'},
  {title: 'NBA' , id: 'board-14'},
  {title: '财经' , id: 'board-15'},
  {title: '汽车' , id: 'board-16'},
  {title: '电影' , id: 'board-17'},
  {title: '美食' , id: 'board-18'},
  {title: '新时代',id: 'board-19'},
  {title: '电视剧',id: 'board-20'},
  {title: '综艺' , id: 'board-21'},
  {title: '时尚' , id: 'board-22'},
  {title: '健康' , id: 'board-23'},
  {title: '育儿' , id: 'board-24'},
  {title: '情感' , id: 'board-25'},
  {title: '小康' , id: 'board-26'},
  {title: '眼界' , id: 'board-27'},
]

Pager({
  data: {

    // menus，由list组件构建
    targetConfig: {
      $$id: 'menus-scroll-view',
      listClass: 'demo-scroll-list',
      itemClass: 'demo-scroll-list-item',

      // 将listView，转换成scroll-view
      type: {
        'is': 'scroll',
        'scroll-y': true,
        'enable-flex': true,
        'scroll-with-animation': true
      },
      methods: {
        scrollMenus(selectIndex){
          this.selectItem('nav-'+selectIndex)
        },

        scrollIntoView(id) {
          this.update({ 'type.scroll-into-view': id })
        },

        // 激活当前项并滚动到合适位置
        selectItem(id){
          if (id === this.selectId) return
          else {
            this.selectId = id
          }
          let idNumber = parseInt(id.replace('nav-', '')) // 提取index部分

          // scroll-into-view要跳转的id(menus)
          let jumpMenuId = null
          if (idNumber - adjustment > 0) {
            jumpMenuId = 'nav-' + (idNumber - adjustment)
          } else {
            jumpMenuId = 'nav-1'
          }

          this.forEach(item=>{
            let data = item.getData()
            let $id = data.id
            if ($id === id) {
              item.addClass('active') // 激活当前选项

              // 菜单区域滚动到位置
              this.scrollIntoView(jumpMenuId)
            } else {
              item.removeClass('active')
            }
          })
        }
      },
      itemMethod: {
        aim(e, param, inst){  // aim为catch:tap的别名
          let contentScrollView = Pager.getElementsById('content-scroll-view')  // 指向内容展示区域的实例

          // 获得当前点击对象的id
          let id = inst.getData().id  
          
          // scroll-into-view要跳转的id(content)
          let jumpContentId = null
          jumpContentId = id.replace('nav-', 'board-')

          this.selectItem(id)
          contentScrollView && contentScrollView.scrollIntoView(jumpContentId)
        }
      },
      data: menusData,
    },

    // content，由list组件构建
    targetBoard: {  
      $$id: 'content-scroll-view',
      type: {
        'is': 'scroll',
        'scroll-y': true,
        'enable-flex': true,
        // 'scroll-with-animation': true,
        'bindscroll': 'onBindscroll'
      },
      listClass: 'board-list',
      itemClass: 'board-item-sub',
      data: contentData,
      methods: {
        __ready(){  //组件加载完成后自动运行
          this.scrollTimmer = null
          this.eventType = 'scroll'
          this.menuInstance = Pager.getElementsById('menus-scroll-view')

          let query = wx.createSelectorQuery().in(this)
          query.selectAll('.board-list >>> .board-item-sub').boundingClientRect(ret => {
            if (ret.length) {
              this.elements = ret = ret.map((item, ii) => {
                item.__index = ii+1
                return item
              })
              this.points = this.elements.map((point, ii) => {
                return point.bottom // 少了0这个点
              })
            }
          }).exec()
        },
        scrollIntoView(id){
          let that = this
          this.eventType = 'tap'
          clearTimeout(this.scrollTimmer)
          this.scrollTimmer = setTimeout(() => this.update({ 'type.scroll-into-view': id }, ()=>{
            this.hooks.one('menus-tap-scroll', function(){
              that.eventType = 'scroll'
            })
          }), 100);
        },
        onBindscroll(e){
          if (this.eventType === 'tap') {  // 阻止menus的tap事件后触发scroll方法
            this.hooks.emit('menus-tap-scroll')  
            return
          }
          let scrollTop = e.detail.scrollTop
          let selects = []
          if (this.points) {
            selects = this.points.filter(point => point <= scrollTop)
          }

          let selectIndex = selects.length + 1
          this.menuInstance.scrollMenus(selectIndex)
        }
      }
    }
  },
  
  onLoad(param) {
    let pageTitle = param.pageTitle
    if (pageTitle) {
      wx.setNavigationBarTitle({
        title: pageTitle
      })
    }
  },
  
})
