const Pager = require('../../components/aotoo/core/index')
const lib = Pager.lib
const storeCommon = lib.hooks('CHECK-LIST')

function setClass(item, cls) {
  if (item.itemClass) {
    item.itemClass = item.itemClass.replace(cls, '')
    item.itemClass = `${item.itemClass} ${cls}`
  } else {
    item.itemClass = cls
  }
  return item
}

function adapter(opts, init) {
  let params = preAdapter(opts, init).data

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
      if (item.desc) {
        item.isSwitch = false
      }
      
      if (item.isSwitch !== false) {
        item['@switch'] = {
          itemClass: 'checklist-switch',
          bindchange: 'onBindSWchange?value='+item.value+'&index='+ii,
        }

        if (lib.isObject(opts.isSwitch)) {
          item['@switch'] = Object.assign(item['@switch'], opts.isSwitch)
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

function getChilds(item, datas, opts, index, init) {
  const idf = item.idf
  item.content = []
  datas.forEach((it, ii)=>{
    if (it.parent === idf) {
      if (it.idf) {
        it = getChilds(it, datas, opts, ii, init)
      }
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
    item.itemClass = item.itemClass && item.itemClass + ' checklist-category' || 'checklist-category'
    
    // 其他筛选
    checkListOption.parentValue = item.value
    // checkListOption.parentValueIndex = index
    if (opts.mode === 3) {
      checkListOption.fromBody = true
    }

    item.content = mkCheckList({
      data: item.content,
      ...checkListOption
    })

    if (opts.mode === 3) {
      let maxCount = opts.maxCount
      item.itemClass = item.itemClass.replace('checklist-category', 'checklist-pad')
      item.content.type = {
        is: 'exposed'
      }
      if (item.content.data.length > maxCount) {
        // console.log(item.content.data);
        item.content.data = item.content.data.map((it, ii)=>{
          if (lib.isString(it)) {
            it = {title: it, value: it}
          }

          if (lib.isObject(it) && ii > (maxCount-1)) {
            it.itemClass = it.itemClass ? it.itemClass + ' disN' : 'disN'
          }
          return it
        })
        item.title = [].concat(item.title).concat({title: '展开', targetId: item.content.checklistUniqId, containerClass: 'unfold', aim(e, param, inst){

          let $data = inst.getData()
          let targetId = $data.targetId
          this.children.forEach(ele=>{
            if (ele.$$is === 'list' && ele.checklistUniqId === targetId) {
              if (ele.__unfork) {
                inst.update({title: '展开'})
                inst.removeClass('fold')
                ele.__unfork = false
                ele.forEach((element, ii)=>{
                  if (ii > (maxCount-1)) {
                    element.addClass('disN')
                  }
                })
              } else {
                inst.update({title: '收起'})
                inst.addClass('fold')
                ele.__unfork = true
                ele.forEach((element, ii)=>{
                  element.removeClass('disN')
                })
              }
            }
          })
        }})
      }
      item.body = [item.content]
      delete item.content
    }
  } else {
    delete item.content
  }


  return item
}

function preAdapter(opts, init) {
  let optsData = opts.data
  let tmpAry = []
  let hasContent = false
  optsData.forEach((item, ii)=>{

    if (item.content) {
      hasContent = true
      if (lib.isFunction(item.content)) {
        item.content.checklistUniqId = lib.uuid('ck-list-')
        item.itemClass = item.itemClass && item.itemClass + ' checklist-category' || 'checklist-category'
        delete item.idf
        delete item.parent
      }
    }

    if (!item.idf && !item.parent) {
      tmpAry.push(item)
    } else {
      if (item.idf && !item.parent) {
        item = getChilds(item, lib.clone(optsData), opts, ii, init)
        delete item.idf
        tmpAry.push(item)
      }
    }
  })

  // 扁平数据自动设置content
  if (tmpAry.length && tmpAry.length !== optsData.length) {
    if (opts.mode !==3 ) hasContent = true
    opts.data = tmpAry
  }
  
  // 当content为true时，表示有子集
  if (hasContent) {
    opts.mode = 2
    opts.checkedType = 1
  }

  return opts
}

function mkCheckList(params, init) {

  let dft = {
    mode: 1,
    checkedType: 1, // 1为value互斥单选， 2为多选
    onlyValid: false, // valid互斥关系 true为互斥， false不互斥
    isSwitch: false,  // 启用switch，只有checkedType === 2时有效
    value: [],  // 默认值
    data: [],  // 配置数据
    footer: null,  // 自动设置

    maxCount: 9,  // mode为3的时候有效，块状选择时有效

    checkedContainerClass: 'checklist-container',
    checkedBoxClass: 'checklist-box',
    checkedBoxItemClass: 'checklist-item',
    checkedClass: 'checked',
    footerId: null,

    checklistUniqId: lib.uuid('ck-list-'),
    separator: '--',  // allValue的分隔符

    selectAll: false,  // 是否设置全选选项
    tap: null,  // 选取值响应方法

    show: true
  }

  if (lib.isArray(params)) {
    params = {data: params}
  }

  let opts = Object.assign({}, dft, params)

  if (init) {
    if (!opts.data.length) {
      throw new Error('数据项data不能为空')
    }
    opts.$$id = lib.suid('checklist-root-')
    storeCommon.setItem(opts.$$id, {
      storeValue: {},
      storeValids: {},
      storeContent: {},
      storeAttrs: {},
      storeContex: {},
      selectAllValue: {}
    })
  }

  let storeHooks = storeCommon.getItem((opts.rootId||opts.$$id))
  let {
    storeValue,
    storeValids,
    storeContent,
    storeAttrs,
    storeContex,
    selectAllValue
  } = storeHooks

  let footer = opts.footer
  let checkedClass = opts.checkedClass
  let checkedContainerClass = opts.checkedContainerClass
  let checkedBoxClass = opts.checkedBoxClass
  opts = adapter(opts, init)

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
        itemClass: 'checklist-category',
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

  // 如果没有设置默认值时，则默认第一条数据的value为默认值
  function setDefaultValue(config, root) {
    let cklistId = config.checklistUniqId
    if (!config.value || !config.value.length) {
      if (config.data[0].content && !lib.isFunction(config.data[0].content)) {
        config.value = [].concat(config.data[0].value)
        config.valids = [0]
      }
    } else {
      let $value = config.value
      let $data = config.data
      let $valid = []
      $data.forEach((it, ii)=>{
        if ($value.indexOf(it.value) > -1) {
          $valid.push(ii)
        } else {
          if (it.content && it.content.value && it.content.value.length) {
            $valid.push(ii)
          }
        }
      })
      config.valids = $valid
    }
    storeValue[cklistId] = config.value
    storeValids[cklistId] = config.valids
  }

  if (opts.mode !== 3) {
    setDefaultValue(opts, true)
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

  if (opts.mode === 3) {
    opts.checkedType = 1
    opts.isSwitch = false
  }

  // 单选模式时，默认值为数组0项
  if (opts.checkedType === 1 && opts.value.length > 1) {
    opts.value = [opts.value[0]]
  }

  if (opts.checkedType === 2 && opts.isSwitch) { // 为switch时，保持原始样式
    checkedBoxItemClass = 'checklist-item checklist-switch'
  }

  // 选中当前分类的所有选项
  function fillSelectAllValue(ckuniqId, item, $v) {
    let v = item.value
    if (!v) return
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

  // 清除相关选项的所有数据
  function clearRelationValids(item, _clearStat) {
    let content = item.content || (item.body&&item.body[0])
    if (content) {
      const uniqId = content.checklistUniqId
      if (_clearStat) {
        if (storeContex[uniqId]) {
          storeContex[uniqId].forEach(item => {
            item.removeClass(opts.checkedClass + ' valid')
          })
        }
      } else {
        content.value = []
        storeValids[uniqId] = []
        storeValue[uniqId] = []
        storeAttrs[uniqId] = {}
        selectAllValue[uniqId] = []
        if (storeContex[uniqId]) {
          storeContex[uniqId].value = []
          storeContex[uniqId].valids = []
          storeContex[uniqId].forEach(item=>{
            item.removeClass(opts.checkedClass + ' valid')
          })
        } else {
          // storeContex[uniqId] = null
        }
      }
      
      content.data.forEach(it => {
        clearRelationValids(it, _clearStat)
      })
    }
  }

  function reviewAllValueAndValids(params, asset) {
    let ckId = asset.checklistUniqId
    let data = asset.data
    let $value = storeValue[ckId] || []
    storeValue[ckId] = $value
    params.forEach(val => {
      let vals = val.split(opts.separator)
      let $v = vals.shift()
      data.forEach(item=>{
        let $data = item
        let $content = $data.content || $data.body
        // if (val.indexOf($data.value) === 0) {
        if ($v === $data.value) {
          if ($value.indexOf($v) === -1) {
            storeValue[ckId] = $value = $value.concat($v)
          }
          if ($content && vals.length) {
            let sonVal = vals.join(opts.separator)
            reviewAllValueAndValids([sonVal], $content)
          }
        }
      })
    })



    // let $value = context.value || []
    // let ckId = context.checklistUniqId
    // params.forEach(val=>{
    //   context.forEach(item => {
    //     let $data = item.data
    //     let $content = $data.content || $data.body
    //     if (val.indexOf($data.value) === 0) {
    //       if ($value.indexOf($data.value) === -1) {
    //         context.value = context.value.concat($data.value)
    //       }
    //       if ($content) {
    //         let cklistId = $content.checklistUniqId
    //         let inst  = storeContex[cklistId]
    //         let vals = val.split(opts.separator) 
    //         vals.shift()
    //         if (vals.length) {
    //           let sonVal = vals.join(opts.separator)
    //           reviewAllValueAndValids([sonVal], inst)
    //         }
    //       }
    //     }
    //   })
    // })
  }

  return {
    checklistUniqId: opts.checklistUniqId,
    containerClass: checkedContainerClass,
    listClass: checkedBoxClass,
    itemClass: checkedBoxItemClass, 
    value: opts.value,
    data: opts.data,
    footer: footer,
    show: opts.show,
    itemMethod: {
      aim(e, param, inst) {
        if (opts.isSwitch && opts.checkedType === 2) return // 启用switch，则使tap无效
        let parent = inst.parent()
        let $data = inst.getData()
        if ($data.desc) return  // 如果有desc描述部分，则不响应选择tap事件
        let $val = $data.value||$data.title
        let $title = $data.title
        let $content = $data.content
        let treeid = $data.attr['data-treeid']
        let rootInst = this.getRoot()

        let $value = this.value
        let $tmpValueIndex = $value.indexOf($val)
        let $footer = this.footerInst

        if (opts.checkedType === 1) {
          this.value = [] // 如果是单选，先清空值
          storeValue[this.checklistUniqId] = []
        }
        if (opts.onlyValid) this.valids = []
        
        if ($val === '9999') {
          selectAllValue[opts.checklistUniqId] = [] // 将全选的值区别存放在selectAllValue全局中
        }

        let hasRadio = false  // 当前状态是否是选中状态(单选)
        let hasChecked = true  // 当前是否选中状态 (多选/switch)

        this.forEach((item, ii) => {
          let $v = item.data.value
          if ($val === '9999' && $v !== '9999') {
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
                hasChecked = false
                item.removeClass(checkedClass + ' valid')
                if ($tmpValueIndex > -1) {
                  this.value.splice($tmpValueIndex, 1) // 移除value
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
            }
          } else {
            if (opts.checkedType === 1) {
              item.removeClass(checkedClass)  //清除所有非命中项的 checked
            }
          }
        })

        storeValue[this.checklistUniqId] = this.value
        storeValids[this.checklistUniqId] = this.valids

        if ($content && $footer) {
          if (!hasRadio) $footer.fillContent($content)
        } else {
          rootInst.fromLeaf = true
          rootInst.tapItem = {
            checked: hasChecked,
            checkedType: opts.checkedType,
            title: this.currentTitle,
            value: this.currentValue
          }
          this.hooks.emit('set-valid-stat', this)
        }
      }
    },
    methods: {
      setValueValid (val, index, data={}){
        if (!lib.isString(val)) val = ''
        this.currentValue = val
        this.currentValueIndex = index
        this.currentTitle = data.title
        const $value = this.value

        if ($value.indexOf(val) === -1) {
          this.value.push(val)
        }

        if (this.valids.indexOf(index) === -1) {
          let stat = false
          if (data.content) {
            let cklistId = data.content.checklistUniqId
            // if (data.content.value.length) {
            //   stat = true
            // }
            if (storeValue[cklistId] && storeValue[cklistId].length) {
              stat = true
            }
          } else {
            stat = true
          }
          if (stat) {
            this.valids.push(index)
          }
        }

        // 
        if (data && !data.content && !data.body && opts.checkedType === 1) {
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

        // storeValue[opts.checklistUniqId] = this.value
        // storeValids[opts.checklistUniqId] = this.valids
        storeAttrs[opts.checklistUniqId] = data.attr
      },
      onBindSWchange(e, param, inst){
        let $val = param.value
        let $index = parseInt(param.index)
        let $item = null
        this.forEach((item, ii)=>{
          if ($index === ii) {
            $item = item.data
          }
        })
        let stat = e.detail.value
        let hasChecked = true
        if (stat) {
          $val = $val || $item.title
          this.setValueValid($val, $index, $item)
        } else {
          hasChecked = false
          let $idx = this.value.indexOf($val)
          let $validIdx = this.valids.indexOf($index)
          if ($idx > -1) {
            this.value.splice($idx, 1)
            // storeValue[opts.checklistUniqId] = this.value
          }
          if ($validIdx > -1){
            this.valids.splice($validIdx, 1)
            // storeValids[opts.checklistUniqId] = this.valids
          }
        }
        storeValue[this.checklistUniqId] = this.value
        storeValids[this.checklistUniqId] = this.valids
        let rootInst = this.getRoot()
        rootInst.fromLeaf = true
        rootInst.tapItem = {
          checked: hasChecked,
          checkedType: opts.checkedType,
          title: this.currentTitle,
          value: this.currentValue
        }
        this.hooks.emit('set-valid-stat', this)
      },
      validIt(stat=true, childValue){
        const currentValue = this.currentValue
        const currentValueIndex = this.currentValueIndex
        const currentContent = this.currentContent
        let $valids = this.valids

        if (this.value.indexOf(currentValue)===-1) {
          this.value.push(currentValue)
        }

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
            } else {
              let rootInst = this.getRoot()
              if (rootInst.fromLeaf) {
                if (opts.onlyValid) {   // 单value，单valid
                  item.removeClass('.valid')
                  clearRelationValids(item.data)
                }
              }
            }
          }
        })
        this.valids = $valids
        storeValue[this.checklistUniqId] = this.value
        storeValids[this.checklistUniqId] = this.valids
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
        this.valids = storeValids[opts.checklistUniqId] || opts.valids || []
        storeValue[opts.checklistUniqId] = this.value
        storeValids[opts.checklistUniqId] = this.valids

        if (this.value.indexOf('9999')>-1) {
          selectAllValue[this.checklistUniqId] = []
          this.forEach(it=>{
            let $data = it.data
            let $v = $data.value
            if ($v !== '9999') {
              fillSelectAllValue(this.checklistUniqId, $data)
            }
          })
          this.value = ['9999']
          this.valids = [0]
          storeValue[opts.checklistUniqId] = this.value
          storeValids[opts.checklistUniqId] = this.valids
        }

        this.currentValue = null
        this.currentValueIndex = null
        this.currentTitle = null
        this.currentContent = null
        this.tapItem = {}   // 叶子节点点击对象的title, value
        this._value = null //内部使用的value，通过getValue对外暴露

        if (opts.id) {
          this.activePage[opts.id] = this
        }

        if (opts.$$id) {
          this.$$id = opts.$$id
          this.allValue = []
          this.activePage[opts.$$id] = this
          if (opts.id) {
            this.activePage[opts.id] = this
          }
          if (lib.isFunction(opts.tap)){
            this.tap = opts.tap
          }
          this.getValue = () => {
            if (!this._value) {
              this.hooks.emit('set-valid-stat', this)
            }
            return this._value
          }
          
          this.clear = (val, _clearStat) => {
            if (val) {
              this.forEach((item, ii)=>{
                let value = item.data.value
                let reStr = `^${value}\-\-`
                let re = new RegExp(reStr)
                if (value === val) {
                  item.removeClass(`valid ${checkedClass}`)
                  if (_clearStat) {
                    clearRelationValids(item.data, _clearStat)
                  } else {
                    let vidx = this.valids.indexOf(ii)
                    this.valids.splice(vidx, 1)
                    storeValids[this.checklistUniqId] = this.valids
                    clearRelationValids(item.data)
                    this.allValue = this.allValue.filter(it => !re.test(it))
                    this._value.allValue = this.allValue
                  }
                }
              })
            } else {
              this.forEach(item => {
                item.removeClass(checkedClass + ' valid')
                clearRelationValids(item.data, _clearStat)
              })
              let cklistId = this.checklistUniqId
              if (!_clearStat) {
                storeValue[cklistId] = []
                storeValids[cklistId] = []
              }
              this.hooks.emit('set-valid-stat', this)
            }
          }

          this.clearState = (val) => {
            this.clear(val, true)
          }

          this.review = (param) => {
            this.setValue(param)
          }

          this.setValue = (param) => {
            if (param) {
              reviewAllValueAndValids(param, this.getData())
            }
            this.hooks.emit('set-value-valid', {}, this)
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
          let pValue = opts.parentValue
          // let pIndex = opts.parentValueIndex
          let pIndex = theParent.findIndex({value: pValue})
          if (opts.fromBody) { // 事件是由body中的实例传递过来的
            theParent.currentValue = pValue
            theParent.currentValueIndex = pIndex
          }
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
        let allTitle = []
        let subValues = []
        function initValidItem(item, val) {
          if (item.content || item.body) {
            let clid = (item.content||item.body).checklistUniqId
            let $v = storeValue[clid] || []
            // subValues = subValues.concat((item.content&&(item.content.value||[])) || (item.body&&(item.body[0].value||[])) || [])
            subValues = subValues.concat($v)
            if (val) {
              subValues = subValues.map(v=>val+opts.separator+v)
            }
            let $data = (item.content&&item.content.data) || (item.body&&item.body[0].data)
            if ($data) {
              $data.forEach(it => {
                let theVal = val ? val + opts.separator + it.value : it.value
                initValidItem(it, theVal)
              })
            }
          }
        }

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
              if (!value && lib.isString($data.title)) {
                value = $data.title
              }
              let theValue = val ? val + opts.separator + value : value // separator: --

              if (theValue && theValue.indexOf('9999') > -1) {
                let sv = selectAllValue[ckuniqId] || []
                let prefixValue = theValue.replace('9999', '')
                sv.forEach(subvalue => {
                  let thev = prefixValue + subvalue
                  if (allValue.indexOf(thev)===-1) {
                    allValue.push(thev)
                  }
                })
              }else if ($data.content) {
                let theContent = $data.content
                if (lib.isFunction(theContent)) {
                  let functionid = theContent['functionid']
                  theContent = storeContent[functionid]
                }
                let $ckuniqId = theContent.checklistUniqId
                let context = storeContex[$ckuniqId]
                if (context) {
                  getAllValue(context, $ckuniqId, theValue)
                } else {
                  subValues = []
                  initValidItem($data, theValue)
                  allValue = allValue.concat(subValues)
                }
              } else if ($data.body){
                let $ckuniqId = $data.body[0].checklistUniqId
                let context = storeContex[$ckuniqId]
                getAllValue(context, $ckuniqId, theValue)
              } else {
                // 补上属性
                let theAttrs = $data.attr || $attrs
                if (theAttrs) {
                  let tmp = {}
                  Object.keys(theAttrs).forEach(key=>{
                    if (key!=='data-treeid') {
                      tmp[key] = theAttrs[key]
                    }
                  })
                  if (Object.keys(tmp).length) {
                    theValue = lib.formatToUrl(theValue, tmp)
                  }
                }
                if (allValue.indexOf(theValue)===-1) {
                  allValue.push(theValue)
                  allTitle.push($data.title)
                }
              }
            }
          })
        }

        this.hooks.once('set-valid-stat', function (ctx) {
          if (opts.$$id) {
            allValue = []
            allTitle = []
            getAllValue(ctx, opts.checklistUniqId)
            that.allValue = allValue
            let _value = {
              title: that.currentTitle,
              value: that.currentValue,
              index: that.currentValueIndex,
              tapItem: that.tapItem,
              allValue: allValue,
              allTitle: allTitle
            }
            that._value = _value
            if (that.fromLeaf) {
              that.fromLeaf = false
              if (lib.isFunction(that.tap)) {
                that.tap(_value)
              }
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

            // 动态生成checkedlist用于填充footer
            // 需要手动指定mode=2
            if (lib.isFunction(_content)) {
              _content['functionid'] = lib.suid('function-content-id-')
              let checklistUniqId = _content['checklistUniqId']
              const context = {
                fillContent(param){
                  let theContent = null
                  if (lib.isObject(param)){
                    param.rootId = opts.$$id || opts.rootId
                    param.checklistUniqId = checklistUniqId
                    theContent = mkCheckList(param)
                  }
                  if (lib.isArray(param)) {
                    theContent = mkCheckList({ 
                      rootId: (opts.$$id || opts.rootId),
                      checklistUniqId,
                      data: param 
                    })
                  }
                  if (theContent) {
                    storeContent[_content['functionid']] = theContent
                    $footer.fillContent(theContent)
                  }
                }
              }
              if (opts.mode !== 2) {
                console.warn('需要指定mode参数为2');
              } else {
                _content.call(context)
              }
              return
            }

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

        this.checkedAll = function(stat=true) {
          if (opts.checkedType ===2) {
            let tmp = []
            let tmpValids = []
            let pv = opts.parentValue
            let pi = opts.parentValueIndex
            this.forEach((item, ii)=>{
              if (stat) {
                tmpValids.push(ii)
                if (opts.isSwitch && item.data['@switch']) {
                  let switchCfg = item.data['@switch']
                  switchCfg.checked = true
                  item.update({ '@switch': switchCfg })
                } else {
                  item.addClass(opts.checkedClass)
                }
                let theV = pv ? pv + opts.separator + item.data.value : item.data.value
                tmp.push(theV)
              } else {
                if (opts.isSwitch && item.data['@switch']) {
                  let switchCfg = item.data['@switch']
                  switchCfg.checked = false
                  item.update({ '@switch': switchCfg })
                } else {
                  item.removeClass(opts.checkedClass)
                }
              }
            })
            this.value = tmp
            this.valids = tmpValids
            storeValue[this.checklistUniqId] = this.value
            storeValids[this.checklistUniqId] = this.valids
            this.hooks.emit('set-valid-stat', this)
          }
        }

        let $value = storeValue[opts.checklistUniqId] || this.value
        let renderContentStat = false
        let timmer = null
        this.hooks.once('set-value-valid', function(param) {
          this.forEach((it, ii) => {
            it.removeClass(checkedClass)
            let item = it.data
            if (item.value && $value.indexOf(item.value) > -1) {
              this.setValueValid((item.value||item.title), ii, item)
              
              if (item.content && this.footerInst) {
                renderContentStat = true
                clearTimeout(timmer)
                timmer = setTimeout(() => {
                  it.addClass(checkedClass)
                  it.exec()
                  this.footerInst.fillContent(item.content)
                }, 17);
              } else {
                it.addClass(checkedClass)
              }
            } else {
              subValues = []
              initValidItem(item, item.value)
              if (subValues.length) {
                if (this.valids.indexOf(ii) === -1) {
                  this.valids.push(ii)
                }
              }
            }
          })
          storeValue[this.checklistUniqId] = this.value
          storeValids[this.checklistUniqId] = this.valids
          // storeValids[opts.checklistUniqId] = this.valids
        })
        this.hooks.emit('set-value-valid', {}, this)
        
        if (!renderContentStat) {
          setTimeout(() => {
            let rootInst = this.getRoot()
            rootInst.tapItem = {
              checked: true,
              checkedType: opts.checkedType,
              title: this.currentTitle,
              value: this.currentValue
            }
            // console.log('===== 4444', this.valids, this.value);
            this.hooks.emit('set-valid-stat', this)
          }, 34);
        }
      }
    }
  }
}

module.exports = function(params) {
  if (lib.isObject(params)) {
    return mkCheckList(params, true)
  }
}