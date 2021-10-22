const Pager = require('../aotoo/core/index')
const lib = Pager.lib

export function createSideTab(params={}){
  const data = params.data
  const id = params.id || lib.suid('sidetab-')
  const current = params.current||0
  const tabs = []
  const contents = []
  const mid = id + '-' + 'menus'
  const cid = id + '-' + 'content'
  const mode = params.mode || 1    // 1 => swiper  2 => flatlist
  data.forEach((item, ii)=>{
    let title = item.title || item
    let content = item.content
    
    if (lib.isString(title)) {
      title = {title: title, attr: {sort: 'content-'+ii}}
    }

    if ( 
      content && 
      (lib.isString(content) || lib.isObject(content)) &&
      lib.isObject(title)
    ) {
      if (lib.isString(content)) content = {title: content, attr: {sort: 'menu-'+ii}}
      if (lib.isObject(title)) title['$$id'] = 'menu-'+ii
      if (lib.isObject(content)) content['$$id'] = 'content-'+ii

      tabs.push(title)
      contents.push(content)
    }
  })

  
  let   menuControlStat = false  // 是否由菜单控制swiper
  const menuList = {
    $$id: mid,
    data: tabs,
    listClass: 'sidetab-menus',
    itemClass: 'sidetab-menus-item',
    type: {
      is: 'scroll',
      'scroll-y': true,
      'scroll-x': false,
      "enable-flex": true,
      "scroll-into-view": 'menu-'+current
    },
    ready(){
      const $$ = this.activePage.getElementsById.bind(this.activePage)
      $$('menu-'+current).addClass('active')
    },
    itemMethod: {
      tap(e, param, inst){
        menuControlStat = true
        const that = this
        const $$ = this.activePage.getElementsById.bind(this.activePage)
        const attr = inst.attr()
        const toContentId = attr.sort
        const toIndex = parseInt(toContentId.replace('content-', ''))
        const contentBox = $$(cid)
        const customTap = params.tap
        inst.addClass('active', function(){
          inst.siblings().removeClass('active')
          let updateEntity = { 'type.current': toIndex }

          if (mode === 2) {
            updateEntity = {'type.scroll-into-view': toContentId}
          }

          contentBox.update(updateEntity, function(){
            setTimeout(() => {
              menuControlStat = false
            }, 50);
            if (lib.isFunction(customTap)) {
              customTap.call(that, e)
            }
          })
        })
      }
    }
  }

  const swiperContentList = {
    $$id: cid,
    data: contents,
    listClass: 'sidetab-content',
    itemClass: 'sidetab-content-item',
    type: {
      is: 'flatswiper',
      duration: 300,
      vertical: true,
      bindchange: 'onSwiperChange',
      current: current
    },
    methods: {
      onSwiperChange(e, param, inst){
        if (menuControlStat) return
        const that = this
        const $$ = this.activePage.getElementsById.bind(this.activePage)
        const detail = e.detail
        const current = detail.current
        const toMenuId = 'menu-'+current
        const menuBox = $$(mid)
        const menuInst = $$(toMenuId)
        const customBindChange = params.bindchange
        menuBox.update({ "type.scroll-into-view": toMenuId }, function(){
          menuInst.addClass('active', function(){
            menuInst.siblings().removeClass('active')
          })
          if (lib.isFunction(customBindChange)) {
            customBindChange.call(that, e)
          }
        })
      }
    }
  }


  const scrollContentList = {
    $$id: cid,
    data: contents,
    listClass: 'sidetab-content',
    itemClass: 'sidetab-content-item',
    itemStyle: 'height: 100vh',
    type: {
      is: 'flatlist',
      "scroll-y": true,
      "enable-flex": true,
      autoHide: false,
      "bindscroll": 'onSideBarScroll',
      "scroll-into-view": 'content-'+current
    },
    ready(){
      this.current = current;
      this.sidetabItems = []
      setTimeout(() => {
        this.sidetabItems = this.flatItems.map(item=>({...item}))
      }, 500);
    },
    methods: {
      onSideBarScroll(e){
        if (menuControlStat) return
        if (!this.sidetabItems.length) return
        const $$ = this.activePage.getElementsById.bind(this.activePage)
        const menuBox = $$(mid)
        const scrollEdge = e.detail.scrollTop || e.detail.scrollLeft
        this.sidetabItems.forEach((item, ii)=>{
          const edge = item.top
          let   gap = edge - scrollEdge
          if (gap > -20 && gap < 30) {
            if (this.current !== ii) {
              this.current = ii
              const toMenuId = 'menu-'+ii
              const menuInst = $$(toMenuId)
              menuBox.update({ "type.scroll-into-view": toMenuId }, function(){
                menuInst.addClass('active', function(){
                  menuInst.siblings().removeClass('active')
                })
              })
            }
          }
        })
      }
    }
  }

  let contentEntity = swiperContentList
  if (mode === 2) {
    contentEntity = scrollContentList
  }

  return {
    dot: [
      {"@list": menuList},
      {"@list": contentEntity},
    ],
    itemClass: 'sidetab ' + (params.itemClass||'')
  }
}