//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
const lib = Pager.lib

let storeValue = {}
let storeValids = {}
let storeContex = {}
let storeAttrs = {}
let selectAllValue = {}

function setClass(item, cls) {
  if (item.itemClass) {
    item.itemClass = item.itemClass.replace(cls, '')
    item.itemClass = `${item.itemClass} ${cls}`
  } else {
    item.itemClass = cls
  }
  return item
}

function adapter(opts) {
  let params = preAdapter(opts).data

  let checkedClass = opts.checkedClass
  let checkedContainerClass = opts.checkedContainerClass
  let checkedBoxClass = opts.checkedBoxClass
  let checkedBoxItemClass = opts.checkedBoxItemClass

  opts.data = params.map((item, ii) => {

    // 设置分割栏
    // 数组定义分割栏
    if (lib.isArray(item)) {
      if (item[0].indexOf('===') === 0) {
        if (lib.isString(item[1])) {
          item = '=== '+item[1]
        }
        if (lib.isObject(item[1])) {
          let nItem = item[1]
          nItem = setClass(nItem, 'checklist-split')
          return nItem
        }
      }
    }

    // 设置分割栏
    // 字符串表达分割栏
    if (lib.isString(item) && item.indexOf('===')===0) {
      let res = item.split(' ')
      if (res.length > 1) {
        return {itemClass: 'checklist-split', title: res[1]}
      } else {
        return {itemClass: 'checklist-split'}
      }
    }

    if (lib.isString(item)) {
      item = {title: item}
    }

    // 设置为switch
    if (opts.isSwitch && opts.checkedType===2) {
      if (item.isSwitch !== false) {
        item['@switch'] = {
          itemClass: 'checklist-switch',
          bindchange: 'onBindSWchange?value='+item.value+'&index='+ii,
        }

        if (opts.value.indexOf(item.value)>-1) {
          item["@switch"].checked = true
        }
      }
    } else {
      if (opts.value.indexOf(item.value) > -1) {
        item = setClass(item, checkedClass)
      }
    }

    if (lib.isArray(item.content)) {
      item.content = mkCheckList(item.content)
    }

    // 设置descript
    if (item.desc) {
      item.itemClass = 'checklist-item-desc'
      item.dot = (item.dot||[]).concat(item.desc)
    }
    return item
  })

  return opts
}

function getChilds(item, datas, opts) {
  const idf = item.idf
  item.content = []
  datas.forEach(it=>{
    if (it.parent === idf) {
      if (it.idf) {
        it = getChilds(it, datas, opts)
      }
      // let nit = lib.clone(it)
      let nit = it
      delete nit.idf
      delete nit.parent
      item.content.push(nit)
    }
  })

  let checkListOption = {
    rootId: opts.$$id,
    checkedType: 1,
    value: []
  }

  if (item.checkListOption) {
    checkListOption = Object.assign(checkListOption, item.checkListOption)
  }

  if (item.content.length) {
    item.content = mkCheckList({
      data: item.content,
      ...checkListOption
    })
  }
  return item
}

function preAdapter(opts) {
  let optsData = opts.data
  let tmpAry = []
  let hasContent = false
  optsData.forEach(item=>{

    if (item.content) {
      hasContent = true
      tmpAry.push(item)
      return
    }

    if (!item.idf && !item.parent) {
      tmpAry.push(item)
    } else {
      if (item.idf && !item.parent) {
        item = getChilds(item, lib.clone(optsData), opts)
        delete item.idf
        tmpAry.push(item)
      }
    }
  })

  // 扁平数据自动设置content
  if (tmpAry.length && tmpAry.length !== optsData.length) {
    hasContent = true
    opts.data = tmpAry
  }

  // 当content为true时，表示有子集
  if (hasContent) {
    opts.mode = 2
    opts.checkedType = 1
  }

  return opts
}

function fillSelectAllValue(ckuniqId, item, $v) {
  let v = item.value
  if ($v) {
    v = $v + '--' + v
  }

  let $content = item.content
  if ($content) {
    // let uniqid = $content.checklistUniqId
    $content.data.forEach(it => {
      fillSelectAllValue(ckuniqId, it, v)
    })
  } else {
    if (v.indexOf('9999') === -1) {
      selectAllValue[ckuniqId].push(v)
    }
  }
}

function mkCheckList(params, init) {

  let dft = {
    mode: 1,
    checkedType: 1, // 1为单选， 2为多选
    isSwitch: false,  // 启用switch
    value: [],
    data: [],
    footer: null,

    checkedContainerClass: 'checklist-container',
    checkedBoxClass: 'checklist-box',
    checkedBoxItemClass: 'checklist-item',
    checkedClass: 'checked',
    footerId: null,

    checklistUniqId: lib.uuid('ck-list-'),
    separator: '--',

    selectAll: false,
    tap: null,  // 选取值响应方法
  }

  if (lib.isArray(params)) {
    params = {data: params}
  }

  let opts = Object.assign({}, dft, params)

  if (init) {
    storeValue = {}
    storeValids = {}
    storeAttrs = {}
    storeContex = {}
    selectAllValue = {}

    opts.$$id = lib.suid('checklist-root-')
  }

  // opts.checklistUniqId = lib.uuid('ck-list-')

  let footer = opts.footer
  let checkedClass = opts.checkedClass
  let checkedContainerClass = opts.checkedContainerClass
  let checkedBoxClass = opts.checkedBoxClass
  opts = adapter(opts)

  let childHasContent = false

  for (let ii=0; ii<opts.data.length; ii++) {
    let item = opts.data[ii]
    if (item.content) {
      childHasContent = true
      break;
    }
  }

  if (childHasContent) {
    if (opts.selectAll) {
      opts.data.unshift({
        title: '不限',
        value: '9999',
        content: mkCheckList({
          rootId: (opts.$$id || opts.rootId),
          data: [{title: '不限', value: '9999'}]
        })
      })
    }
  } else {
    if (opts.selectAll) {
      opts.data.unshift({
        title: '不限',
        value: '9999'
      })
    }
  }


  let checkedBoxItemClass = 'checklist-item' + (opts.checkedType === 2 ? ' multi-select' : '') // 单选还是多选类名
  opts.checkedBoxItemClass = checkedBoxItemClass

  // 两栏模式
  // 固定父级为单选
  // 固定父级不能为switch
  if (opts.mode === 2) {
    opts.footerId = lib.suid('checklist-content-')
    checkedContainerClass = 'checklist-container two-column'
    footer = {
      $$id: opts.footerId,
      itemClass: 'checklist-content'
    }
    opts.checkedType = 1
    opts.isSwitch = false
  }

  // 单选模式时，默认值为数组0项
  if (opts.checkedType === 1 && opts.value.length > 1) {
    opts.value = [opts.value[0]]
  }

  if (opts.checkedType === 2 && opts.isSwitch) { // 为switch时，保持原始样式
    checkedBoxItemClass = 'checklist-item'
  }

  return {
    checklistUniqId: opts.checklistUniqId,
    containerClass: checkedContainerClass,
    listClass: checkedBoxClass,
    itemClass: checkedBoxItemClass, 
    data: opts.data,
    footer: footer,
    itemMethod: {
      aim(e, param, inst) {
        if (opts.isSwitch && opts.checkedType === 2) return // 启用switch，则使tap无效
        let parent = inst.parent()
        let $data = inst.getData()
        let $val = $data.value
        let $content = $data.content
        let treeid = $data.attr['data-treeid']
        let rootInst = this.getRoot()

        let $value = this.value
        let $tmpIndex = $value.indexOf($val)
        let $footer = this.footerInst

        if (opts.checkedType === 1) this.value = [] // 如果是单选，先清空值
        
        if ($val === '9999') {
          selectAllValue[opts.checklistUniqId] = [] // 将全选的值区别存放在selectAllValue全局中
        }

        let hasRadio = false  // 当前状态是否是选中状态(单选)

        this.forEach((item, ii) => {
          let $v = item.data.value
          if ($val === '9999') {
            item.removeClass(checkedClass)
            fillSelectAllValue(opts.checklistUniqId, item.data)
          } else {
            if ($v === '9999') {
              item.removeClass(checkedClass)
            }
          }

          if (item.treeid === treeid) {
            if (item.hasClass(checkedClass)) {
              if (opts.checkedType === 2) {
                item.removeClass(checkedClass)
                if ($tmpIndex > -1) {
                  this.value.splice($tmpIndex, 1) // 移除value
                  let $validIndex = this.valids.indexOf(ii)
                  if ($validIndex > -1) {
                    this.valids.splice($validIndex, 1)
                  }
                }
              } else {
                // 选中状态且 opts.checkedType === 1 时
                hasRadio = true
              }
            } else {
              // 为非选中状态时
              item.addClass(checkedClass)
              this.setValueValid($val, ii, item.data)
              // this.setValueValid($val, ii, $data)
            }
          } else {
            if (opts.checkedType === 1) {
              item.removeClass(checkedClass)  //清除所有非命中项的 checked
            }
          }
        })

        if ($content && $footer) {
          if (!hasRadio) $footer.fillContent($content)
        } else {
          rootInst.fromLeaf = true
          this.hooks.emit('set-valid-stat', this)
        }
      }
    },
    methods: {
      setValueValid (val, index, data){
        this.currentValue = val
        this.currentValueIndex = index
        const $value = this.value

        if ($value.indexOf(val) === -1) {
          this.value.push(val)
        }

        if (this.valids.indexOf(index) === -1) {
          this.valids.push(index)
        }

        // 
        if (data && !data.content && opts.checkedType === 1) {
          this.valids = [index]
        }


        // 全选状态设置
        if (val === '9999') {
          if (!data || (data && !data.content)) {
            this.value = ['9999']
            this.valids = [index]
          }
        } else {
          // 必须没有子集才能清除状态
          if (!data || (data && !data.content)) {
            let aidx = $value.indexOf('9999')
            if (aidx > -1) {
              this.value.splice(aidx, 1)
              let vidx = this.valids.indexOf(0)
              if (vidx>-1) {
                this.valids.splice(vidx, 1)
              }
            }
          }
        }

        storeValue[opts.checklistUniqId] = this.value
        storeValids[opts.checklistUniqId] = this.valids
        storeAttrs[opts.checklistUniqId] = data.attr
      },
      onBindSWchange(e, param, inst){
        let $val = param.value
        let $index = param.index
        let stat = e.detail.value
        if (stat) {
          this.setValueValid($val, $index)
        } else {
          let $idx = this.value.indexOf($val)
          let $validIdx = this.valids.indexOf($index)
          if ($idx > -1) {
            this.value.splice($idx, 1)
          }
          if ($validIdx > -1){
            this.valids.splice($validIdx, 1)
          }
        }
      },
      validIt(stat=true, childValue){
        const currentValue = this.currentValue
        const currentValueIndex = this.currentValueIndex
        const currentContent = this.currentContent
        let $valids = this.valids

        this.forEach((item, ii)=>{
          let value = item.data.value
          let validIdx = $valids.indexOf(ii)


          if (childValue) {
            if (childValue === '9999'){
              if (currentValue === '9999' && value !== '9999') {
                stat = false
              }
            } else {
              if (value === '9999' && validIdx > -1) {
                item.removeClass('.valid')
                $valids.splice(validIdx, 1)
                if (item.data.content) {
                  let uniqId = item.data.content.checklistUniqId
                  selectAllValue[uniqId] = []
                  storeValids[uniqId] = []
                  storeValue[uniqId] = []
                }
                return
              }
            }
          }

          if (validIdx>-1) {
            if (ii === currentValueIndex && stat === false) {
              item.removeClass('.valid')
              $valids.splice(validIdx, 1)
            } else {
              if (childValue === '9999' && currentValue === '9999' && value!=='9999') {
                if (!stat) {
                  item.removeClass('.valid')
                  if (validIdx > -1) {
                    $valids.splice(validIdx, 1)
                    if (item.data.content) {
                      let uniqId = item.data.content.checklistUniqId
                      storeValue[uniqId] = []
                      storeValids[uniqId] = []
                    }
                  }
                }
              } else {
                if (!item.hasClass('.valid')) {
                  item.addClass('.valid')
                }
              }
            }
          } else {
            if (ii === currentValueIndex && stat) {
              $valids.push(ii)
              item.addClass('.valid')
            }
          }
        })
        this.valids = $valids
        storeValids[opts.checklistUniqId] = $valids
      },
      __ready(){
        const that = this
        const checkedClass = opts.checkedClass
        this.checklistUniqId = opts.checklistUniqId
        storeContex[opts.checklistUniqId] = this

        // 防止无限次取实例(用于获取footerInst)
        if (this.getInstanceCount === undefined) {
          this.getInstanceCount = 0
        } else {
          this.getInstanceCount++
        }

        if (this.getInstanceCount > 8) {
          console.warn('不能获取实例，请检查配置');
          return 
        }
        
        this.value = storeValue[opts.checklistUniqId] || opts.value || []
        this.valids = storeValids[opts.checklistUniqId] || []

        this.currentValue = null
        this.currentValueIndex = null
        this.currentContent = null

        if (opts.$$id) {
          this.allValue = []
          this.activePage[opts.$$id] = this
          if (opts.id) {
            this.activePage[opts.id] = this
          }
          if (lib.isFunction(opts.tap)){
            this.tap = opts.tap
          }
          this.getValue = () => {
            return this.allValue
          }
          function clearRelationValids(item) {
            if (item.content) {
              const uniqId = item.content.checklistUniqId
              storeValids[uniqId] = []
              storeValue[uniqId] = []
              storeAttrs[uniqId] = {}
              selectAllValue[uniqId] = []
              storeContex[uniqId] = null
              item.content.data.forEach(it=>{
                clearRelationValids(it)
              })
            }
          }
          
          this.clear = (val) => {
            if (val) {
              this.forEach((item, ii)=>{
                let value = item.data.value
                let reStr = `^${value}\-\-`
                let re = new RegExp(reStr)
                if (value === val) {
                  item.removeClass(`valid ${checkedClass}`)
                  let vidx = this.valids.indexOf(ii)
                  this.valids.splice(vidx, 1)
                  storeValids[this.checklistUniqId] = this.valids
                  clearRelationValids(item.data)
                  this.allValue = this.allValue.filter(it => !re.test(it))
                }
              })
            } else {
              storeValue = {}
              storeValids = {}
              storeAttrs = {}
              storeContex = {}
              selectAllValue = {}
            }
          }
        }

        this.getRoot = function() {
          if (opts.rootId||opts.$$id) {
            return that.activePage[(opts.rootId||opts.$$id)]
          }
        }

        // 获取父级实例
        function getRightParent(ctx) {
          let inst = ctx.parent()
          if (inst) {
            if (inst.hasOwnProperty('value') && inst.hasOwnProperty('onBindSWchange')) {
              return inst
            } else {
              return getRightParent(inst)
            }
          } 
        }


        // 设置父级状态
        function setParentStat(theParent) {
          // theParent.currentContent.value = that.value
          if (!that.value.length) {
            theParent.validIt(false)
          } else {
            if (!that.valids.length) {
              theParent.validIt(false)
            } else {
              theParent.validIt(true, that.currentValue)
            }
          }
          theParent.hooks.emit('set-valid-stat', theParent)
        }

        let allValue = []

        /**
         * 
         * @param {*} ctx mkCheckList的实例
         * @param {*} ckuniqId mkCheckList实例对象配置文件唯一id
         * @param {*} val 用于拼接的value值
         */
        function getAllValue(ctx, ckuniqId, val) {
          let $valids = storeValids[ckuniqId] || []
          let $attrs = storeAttrs[ckuniqId] || {}

          ctx.forEach((item, ii) => {
            const $data = item.data
            if ($valids.indexOf(ii)>-1) {
              let value = $data.value
              let theValue = val ? val + opts.separator + value : value // separator: --

              if (theValue && theValue.indexOf('9999') > -1) {
                let sv = selectAllValue[ckuniqId]
                let prefixValue = theValue.replace('9999', '')
                sv.forEach(subvalue => {
                  let thev = prefixValue + subvalue
                  if (allValue.indexOf(thev)===-1) {
                    allValue.push(thev)
                  }
                })
              }else if ($data.content) {
                let $ckuniqId = $data.content.checklistUniqId
                let context = storeContex[$ckuniqId]
                getAllValue(context, $ckuniqId, theValue)
              } else {
                // 补上属性
                if ($attrs) {
                  let tmp = {}
                  Object.keys($attrs).forEach(key=>{
                    if (key!=='data-treeid') {
                      tmp[key] = $attrs[key]
                    }
                  })
                  if (Object.keys(tmp).length) {
                    theValue = lib.formatToUrl(theValue, tmp)
                  }
                }
                if (allValue.indexOf(theValue)===-1) {
                  allValue.push(theValue)
                }
              }
            }
          })
        }

        this.hooks.once('set-valid-stat', function (ctx) {
          if (opts.$$id) {
            allValue = []
            getAllValue(ctx, opts.checklistUniqId)
            that.allValue = allValue
            if (that.fromLeaf) {
              that.fromLeaf = false
              if (lib.isFunction(that.tap)) {
                that.tap({
                  value: that.currentValue,
                  index: that.currentValueIndex,
                  allValue: allValue
                })
              }
              // console.log('===== allvalue', allValue);
            }
          } else {
            if (that.parentInstance) {
              setParentStat(that.parentInstance)
            } else {
              setTimeout(() => {
                let theParent = getRightParent(ctx)
                if (theParent) {
                  that.parentInstance = theParent
                  setParentStat(theParent)
                }
              }, 34);
            }
          }
        })

        if (opts.mode === 2) {
          this.footerInst = Pager.getElementsById(opts.footerId)
          let $footer = this.footerInst
          if (!$footer) {
            setTimeout(this.__ready, 50);
            return
          }

          $footer.fillContent = function (_content) {
            let $content = _content
            that.currentContent = $content
            if ($content) {
              $footer.reset()
              if (lib.isObject($content)) {
                if ($content.data) {
                  $footer.update({ "@list": $content })
                } else {
                  $footer.update({ "@item": $content })
                }
              } else if (lib.isString($content)) {
                $footer.update({ "@md": $content })
              } else if (lib.isArray($content)) {
                $footer.update({ "@list": mkCheckList($content) })
              }
            }
          }
        }

        let $value = this.value
        let renderContentStat = false
        this.forEach((it, ii) => {
          it.removeClass(checkedClass)
          let item = it.data
          if (item.value && $value.indexOf(item.value) > -1) {
            this.setValueValid(item.value, ii, item)
            it.addClass(checkedClass)

            if (item.content && this.footerInst) {
              renderContentStat = true
              this.footerInst.fillContent(item.content)
            } else {
              // this.hooks.emit('set-valid-stat', this)
            }
          } else {
            // renderContentStat = true
            // this.hooks.emit('set-valid-stat', this)
          }
        })
        if (!renderContentStat) {
          this.hooks.emit('set-valid-stat', this)
        }
      }
    }
  }
}


Pager({
  data: {
    checkListConfig: mkCheckList({
      id: 'xxx',
      // mode: 2,
      value: ['3'],
      data: [
        // {title: 'aaa', value: '1', isSwitch: false, desc: {title: '尾巴'}},
        {title: 'aaa', value: '1', idf: 'aaa'},
        {title: '你好', value: '1-1', parent: 'aaa'},
        {title: '你妹', value: '1-2', parent: 'aaa'},

        {title: [
          {"@icon": {type: 'success', size: '24', style: 'margin: 4px 10px 0 0'},}, 
          'bbb'
        ], value: '2', idf: 'bbb'},
        {title: 'bbb-1', value: 'bbb-1', parent: 'bbb'},
        {title: 'bbb-2', value: 'bbb-2', parent: 'bbb'},
        {title: 'bbb-3', value: 'bbb-3', parent: 'bbb'},
        {title: 'bbb-4', value: 'bbb-4', parent: 'bbb'},
        {title: 'bbb-5', value: 'bbb-5', parent: 'bbb'},


        // {title: 'ccc', value: '3', content: mkCheckList({
        //   value: ['11'],
        //   checkedType: 2,
        //   data: [
        //     {title: '11', value: '11'},
        //     {title: '22', value: '22', content: mkCheckList({
        //       checkedType: 2,
        //       data: [
        //         {title: 'xx', value: 'xx'},
        //         {title: 'yy', value: 'yy'},
        //         {title: 'zz', value: 'zz'},
        //       ]
        //     })},
        //     {title: '33', value: '33'},
        //   ]
        // })},
        
        {title: 'ccc', value: '3', idf: 'ccc', checkListOption: {value: ['3-1'], selectAll: true}},
        { title: 'ccc-1', value: '3-1', idf: 'ccc-1', parent: 'ccc', checkListOption: { value: ['4-1'], checkedType: 2, selectAll: true}},
        {title: 'ccc-1-1', value: '4-1', parent: 'ccc-1'},
        {title: 'ccc-1-2', value: '4-2', parent: 'ccc-1'},
        {title: 'ccc-1-3', value: '4-3', parent: 'ccc-1'},

        {title: 'ccc-2', value: '3-2', idf: 'ccc-2', parent: 'ccc', checkListOption: {checkedType: 2}},
        {title: 'ccc-2-1', value: '5-1', parent: 'ccc-2'},
        {title: 'ccc-2-2', value: '5-2', parent: 'ccc-2'},
        {title: 'ccc-2-3', value: '5-3', parent: 'ccc-2'},

        // {title: 'ddd', value: '4'},
        // {title: 'eee', value: '5'},
        // {title: 'fff', value: '6'},
        // {title: 'ggg', value: '7'},
        // {title: 'hhh', value: '8'},
      ]
    }, true)
  },

  onReady(){
    // let xxx = this.xxx
    // xxx.tap = function(allv) {
    //   console.log('=======0000', allv);
    // }
    // setTimeout(() => {
    //   console.log('====== kkkk');
    //   xxx.clear('1')
    //   console.log(xxx.getValue());
    // }, 5000);
  }
})
