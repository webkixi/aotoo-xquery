const Pager = require('../../aotoo/core/index')
const lib = Pager.lib
const sysinfo = wx.getSystemInfoSync()
const ratio = sysinfo.devicePixelRatio
/**
 createScrollbar({
   data: [],
   areaWidth: '',  以px为单位
   areaHeight: ''
   itemWidth: '',
   itemHeight: '',
   listClass: '',
   listStyle: '',
   itemClass: '',
   itemStyle: ''
 })
 */
const movableComponentAttrs = [
  'split',
  'scale-area',
  'areaClass',
  'areaStyle',
  'viewClass',
  'viewStyle',
  'itemWidth',
  'itemHeight',
  'areaWidth',
  'areaHeight',
  'x',
  'y',
  'direction',
  'animation',
  'damping',
  'inertia',
  'friction',
  'out-of-bounds',
  'viewClass',
  'viewStyle',
  'disable',
  'scale',
  'scale-min',
  'scale-max',
  'scale-value',
  'bindchange',
  'bindscale',
  'htouchmove',
  'vtouchmove'
]

export function createScrollbar(options={}) {
  const typeProps = {}
  const listProps = {}

  Object.keys(options).forEach(ky=>{
    if (movableComponentAttrs.includes(ky)) {
      typeProps[ky] = options[ky]
    } else {
      listProps[ky] = options[ky]
    }
  })
  let listStyle = listProps.listStyle || ''
  // if (listStyle.indexOf('relative') === -1 && listStyle.indexOf('absolute') === -1 ) {
  //   listProps.listStyle += ';position: relative;'
  // }
  listProps.itemStyle = (listProps.itemStyle||'') + `;flex: 0 0 auto;`

  const $$id = listProps.$$id || lib.suid('scrollbar-')
  const id = listProps.id || $$id

  const data = options.data || []
  let   split = typeProps.split || 0

  /* moveable-area 的样式类和内联样式 */
  const areaClass = typeProps.areaClass || ''
  let   areaStyle = typeProps.areaStyle || ''

  /* moveable-view 的样式类和内联样式 */
  let   viewClass = typeProps.viewClass || ''
  let   viewStyle = typeProps.viewStyle || ''

  /* itemWidth = (子项宽度 + 子项的margin值*2) */
  let  itemWidth = typeProps.itemWidth || 100
  let  itemHeight = typeProps.itemHeight || '100%'

  /* 
    moveable-area 的宽高 
    moveable-area 必须指定宽高
  */
  let  areaWidth = typeProps.areaWidth || '100%'
  let  areaHeight = typeProps.areaHeight || itemHeight
  
  /* dataWidth: 所有子项的宽度和(px) */
  let  dataWidth = 0
  let  maxLen = 1
  let  len = maxLen
  if (data.length) {
    data.forEach((item, ii)=>{
      dataWidth = ((ii+1)*itemWidth)
    })

    areaWidth = `calc(100% + calc(2 * calc(${dataWidth}px - 50% - ${itemWidth/2}px )))`
    areaWidth = typeProps.areaWidth || areaWidth
  }

  if (typeof itemHeight === 'number') {
    itemHeight = `${itemHeight}px`
  }

  split = `calc(-${dataWidth}px + 50% + ${itemWidth/2}px )`
  areaStyle += `; position: absolute; left: ${split}; width: ${areaWidth}; height: ${areaHeight};`
  viewStyle += `; display: flex; align-items: center; width: ${dataWidth}px; height: ${itemHeight};`

  const type = type || {}
  type.scrollbar = Object.assign({}, typeProps, {
    areaClass,
    areaStyle,
    viewClass,
    viewStyle,
    direction: 'horizontal',
    x: dataWidth,  // 默认 moveable-view的位置
    y: 0,
    bindchange: 'onBindchange',
  })


  let  preChooseItem = null
  let  curChooseItem = null
  return {
    $$id,
    id,
    type,
    created(){
      this.query = wx.createSelectorQuery().in(this)
    },
    ready(){
      const data = this.getData().data
      this.query.select('#'+id).boundingClientRect().exec(ret=>{
        const container = this.container = ret[0]
        this.splitPoint = (container.left + container.right) / 2 - itemWidth
        this.query.selectAll('.scrollbar-item').boundingClientRect((ret) => {
          this.queryItems = ret
        }).exec(()=>{
          const firstItem = data[0]
          firstItem.itemClass = (firstItem.itemClass||'') + ' active'
          this.update({
            'data[0]': firstItem
          })
        })
      })
    },
    methods: {
      to(index){
        let x = type.scrollbar.x
        const data = this.getData().data
        // 求 moveable-view 的x值
        for (let ii=0; ii<this.queryItems.length; ii++) {
          const item = this.queryItems[ii]
          if (ii === index) {
            const currentPoint = (item.left + item.right) / 2
            const diffx = currentPoint - this.splitPoint
            x = x - diffx
            this.update({
              'type.scrollbar.x': x,
            })
            break;
          }
        }
      },
      onBindchange(e, param, inst){
        const detail = e.detail
        const x = detail.x
        const splitLine = dataWidth
        const diffx = x - splitLine
        const data = this.getData().data
        for (let ii=0; ii<this.queryItems.length; ii++) {
          const item = this.queryItems[ii]
          const gap = diffx + (item.left - this.splitPoint)
          if (gap < 0 && Math.abs(gap) < item.width) {
            const tmpItem = curChooseItem || {}
            if (tmpItem.id === item.id) {
              break;
            } else {
              curChooseItem = item
              preChooseItem = tmpItem

              let  preItemDataIndex = -1
              let  preItemData = null
              if (preChooseItem && preChooseItem.id) {
                preItemDataIndex = data.findIndex(item=>item.id === preChooseItem.id)
                if (preItemDataIndex > -1) {
                  preItemData = data[preItemDataIndex]
                  preItemData.itemClass = preItemData.itemClass.replace(/ *active/ig, '')
                }
              }

              const currentItemData = data[ii]
              currentItemData.itemClass = (currentItemData.itemClass||'') + ' active'

              let updatePcke = {
                [`data[${ii}]`]: currentItemData
              }

              if (preItemData) {
                updatePcke = {
                  [`data[${ii}]`]: currentItemData,
                  [`data[${preItemDataIndex}]`]: preItemData
                }
              }

              this.update(updatePcke, function(){
                /**
                 * 响应回调
                 */
                if (lib.isFunction(typeProps.bindchange)) {
                  typeProps.bindchange.call(this, currentItemData, ii)
                }
              })

              break;
            }
          }
        }
      }
    },
    ...listProps
  }
}