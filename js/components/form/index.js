/**
 * 作者： 天天修改
 * github: webkixi
 * 小程序的模板真是又长又臭
 */
const app = null //getApp()
const Core = require('../aotoo/core/index')
const lib = Core.lib

/**
 * data: [
 *  {
 *    title, 
 *    input[
 *      placeholder,
 *      id,
 *      name,
 *      value,
 *      disabled,
 *      type,
 *      attr: {}
 *    ], 
 *    desc, 
 *    itemClass, 
 *    required, 
 *    show, 
 *    union
 *   },
 *   ...
 *   ...
 * ],
 * $$id: 'some id',
 * show: true
 */

const CLASS_NAMES = ['itemClass', 'class']
    , TYPE_TEXT = ['text', 'password', 'select', 'tel', 'date', 'span', 'textarea']
    , TYPE_PLHOLDER = ['text', 'password']
    , TYPE_RADIO = ['radio', 'checkbox']
    , TYPE_BUTTON = ['button', 'submit']

const containerAttributs = { // attrs
  uid: undefined,  // 索引
  title: undefined,
  desc: undefined,
  itemClass: 'input-item',
  listClass: '',
  formClass: '',
  formStyle: '',
  itemStyle: undefined,
  listStyle: '',
  required: undefined,
  show: true,
  union: undefined
}

const inputAttributs = {
  uid: undefined,  // input的唯一id
  uAddress: undefined, // input在$validInputs中的寻址地址
  title: undefined,
  desc: undefined,
  error: undefined,
  eye: undefined,   // 密码键盘的显示密码的眼睛
  readonly: false,
  test: undefined, // 校验
  show: true,
  attr: undefined,

  maxlength: undefined,
  placeholder: undefined,
  id: undefined,
  name: undefined,
  value: undefined,
  type: 'text',
  disabled: false,
  union: undefined,
  attr: undefined,
  itemClass: 'input-item-input',
  inputClass: '',
  class: undefined,
  itemStyle: undefined,
  style: undefined,

  // 用于checkbox与radio
  titles: undefined,
  descs: undefined,
  values: undefined,
  checked: undefined,

  // button
  plain: undefined,
  size: undefined,
  loading: undefined,
  'form-type': undefined,
  'open-type': undefined,
  'hover-class': undefined,
  'hover-stop-propagation': undefined,
  'hover-start-time': undefined,
  'hover-stay-time': undefined,
  'lang': 'en',
  'session-from': undefined,
  'send-message-title': undefined,
  'send-message-path': undefined,
  'send-message-img': undefined,
  'app-parameter': undefined,
  'show-message-card': undefined,
  'bindgetuserinfo': undefined,
  'bindcontact': undefined,
  'bindgetphonenumber': undefined,
  'binderror': undefined,
  'bindopensetting': undefined,
  'bindlaunchapp': undefined,
  'tap': undefined,

  // slider
  min: undefined,
  max: undefined,   // 在rating中作为最大分数
  step: undefined,
  color: undefined,
  'selected-color': undefined,
  activeColor: undefined,
  backgroundColor: undefined,
  'block-size': undefined,
  'block-color': undefined,
  'show-value': undefined,


  // picker
  'mode': undefined,    // 在dropdown中 mode='view'时，表示用view作为输出结构
  'bindcancel': undefined,
  'bindinput': undefined,
  'bindfocus': undefined,
  'bindblur': undefined,
  'bindconfirm': undefined,
  'bindchange': undefined,
  'bindchanging': undefined,
  'bindcolumnchange': undefined,
  'start': undefined,
  'end': undefined,
  'range': undefined,  // 在rating中作为范围
  'customItem': undefined,
  'value-separator': undefined,  // 显示picker.value值时，每个值之间的间隔符

  // picker-view
  'indicator-style': undefined,
  'indicator-class': undefined,
  'mask-style': undefined,
  'mask-class': undefined,
  'bindpickstart': undefined,
  'bindpickend': undefined,
  'header': undefined,
  'footer': undefined,
  
  'cursor-spacing': undefined,   
  'confirm-type': undefined,
  'confirm-hold': undefined,
  'confirm-hold': undefined,
  'adjust-position': undefined,

  // textarea
  'strCount': undefined,
  'maxcount': undefined,  // 是否显示统计以及统计字数上限
}

const inputAttributsAccessKeys = Object.keys(inputAttributs)
const containerAttributsAccessKeys = Object.keys(containerAttributs)

function resetUIitem(params, cls='input-item-title') {
  if (params) {
    if (lib.isString(params)) {
      params = {title: params}
    }
    if (lib.isObject(params)) {
      params.itemClass = cls + ' ' + (params.itemClass || '')
    }
    if (lib.isArray(params)) {
      params = {
        title: params,
        itemClass: cls
      }
    }
    return params
  }
}

// 依照依赖规范输出配置
function normAsset(params, normAst=[]) {
  return params
  // let nInput = {}
  // if (params.type === 'span') {
  //   return params
  // }
  // Object.keys(params).forEach(key => normAst.includes(key) ? nInput[key] = params[key] : '')
  // return nInput
}

function resetPickersValues(params, e) {
  if (lib.isArray(params.values)) {
    let titles = params.titles ? params.titles : []
    let value = params.value ? params.value : []
    let values = params.values
    let len = values.length
    let column = e && e.detail.column

    if (lib.isArray(values[0])) {
      //二维数组，多重picker
      for (let ii = 0; ii < len; ii++) {
        let columnVals = values[ii]
        if (!lib.isArray(columnVals)) {
          // console.log('picker类型的组件要求input.values为二维数组! 类似[[], []]')
          break;
        }
        let _titles = []
        let _select = -1
        columnVals.forEach((item, jj) => {
          if (item.select) _select = jj
          if (typeof item == 'string' || typeof item == 'number') {
            item = {title: item.toString()}
          }
          if (item.title) {
            _titles.push(item.title)
          }
        })
        if (value[ii] || value[ii]===0) {
          if (e) {
            if ((column || column === 0) && ii <= column) {
              _select = value[ii]
            }
          } else {
            _select = value[ii]
          }
        }
        if (_select > -1) {
          value[ii] = _select;
        }
        titles[ii] = _titles;
      }
      params.value = value
      params.titles = titles
    } else {
      // 单列picker
      const _titles = []
      let   _select = (params.value||params.value===0) ? params.value : ''
      values.forEach((item, ii)=>{
        let valueStr = ''
        if (lib.isObject(item)) {
          valueStr = item.title || ''
        }
        if (lib.isString(item)) {
          valueStr = item
        }
        if (params.value === valueStr) {
          _select = ii
        }
        if (lib.isString(_select) && valueStr === _select) {
          _select = ii
        }
        _titles.push(valueStr)
      })
      params.value = _select
      params.titles = _titles
    }
  }
  return params
}

function buildDropdownOptions(params, address) {
  return params.map((item, ii) => {
    if (typeof item == 'string') item = {title: item}
    if (!item.disabled) {
      item.aim = `inputItemDropdownOptions?address=${address}&index=${ii}&value=${item.value}&text=${item.title||item.text||''}`
    } else {
      item.itemClass = (item.itemClass||'') + ' disabled'
    }
    return item
  })
}

// let _watcher = {}

// 规范input的属性
function normInput(params, profile) {
  const that = this
  if (lib.isObject(params)) {
    params.disabled = params.hasOwnProperty('disabled') ? params.disabled : false
    params.uid = params.hasOwnProperty('uid') ? params.uid : lib.suid('input_input_')
    params.uAddress = [profile.uid, params.uid].join('.') // 0 => item的uid, 1=>input的uid

    if (params.union) {
      const union = params.union
      if (union.target || union.id) {
        const selfId = params.id || params.name
        const target = union.target || union.id
        const event = union.event
        const cb = union.callback
        if (typeof cb == 'function') {
          let tmp = {
            id: selfId,
            address: '',
            assets: {},
            inputData: {},
            // setData: function() {
            //   that.setData.apply(that, arguments)
            // },
            save: function(param) {
              if (param && lib.isObject(param)) {
                that.setData({ [tmp.address]: Object.assign(tmp.inputData, param)})
              }
            }
          }
          this.hooks.on('change', function(param) {
            const {id, point} = param   // point为观察的点的inputData
            if (id == target) {
              const res = that.getAddressInfo(params.uAddress)
              tmp.assets = that.getAddressInfo(params.uAddress).inputData
              tmp.inputData = tmp.assets
              tmp.address = res.address
              cb.call(tmp, {...point})
            }
          })
          // _watcher = Object.assign(_watcher, tmp)
        }
      }
    }

    if (params.type !== 'span') {
      if (params.title) {
        params.title = resetUIitem(params.title)
      }
  
      if (params.desc) {
        params.desc = resetUIitem(params.desc, 'input-item-desc')
      }
  
      if (params.error) {
        params.error = resetUIitem(params.error, 'input-item-error')
      }

      if (params.type === 'rating') {
        let max = params.max = parseInt(params.max) || 5
        if (params.value || params.value === 0) {
          params.value = parseInt(params.value)
        } else {
          params.value = 0
        }
        params.range = Array.from(new Array(max), (item, index) => {
          return {title: index+1}
        })
      }
  
      if (params.type == 'password') {
        params.eye = params.hasOwnProperty('eye') ? params.eye : true
      }
  
      if (params.type == 'picker') {
        params = resetPickersValues(params)
      }

      if (params.type == 'textarea') {
        params.maxcount = params.maxcount || 0
        if (params.value && params.value.length && params.maxcount > 0) {
          let counter = lib.strlen(params.value, true)
          if (counter > params.maxcount) {
            counter = params.maxcount
            params.value = lib.subcontent(params.value, params.maxcount)
          }
          params.strCount = counter
        }
      }
  
      if (params.type == 'dropdown') {
        let listid = (params.id||params.name)+'_dd'
        if (lib.isArray(params.titles)){
          params.titles = { data: params.titles }
        }
        if (lib.isObject(params.titles)){
          params.titles.$$id = listid
          params.eye = 'form-arrows'
          if (lib.isArray(params.titles.data)){
            // params.titles.type = {
            //   is: 'scroll',
            //   'scroll-y': true,
            //   isItem: true,
            //   bindscroll: 'inputItemDropdownScroll'
            // }
            params.titles.show = false
            params.titles.listClass = params.titles.listClass ? `input-item-dropdown-options ${params.titles.listClass}` : 'input-item-dropdown-options'
            params.titles.itemClass = params.titles.itemClass ? `input-item-dropdown-options-item ${params.titles.itemClass}` : 'input-item-dropdown-options-item'
            params.titles.data = buildDropdownOptions(params.titles.data, params.uAddress)
          }
        }
      }
    } else {
      let thisProps = that.props
      params.value = Object.assign({}, params.value, {
        fromComponent: thisProps.fromComponent,
        __fromParent: that.uniqId
      })
    }
    return normAsset(params, inputAttributsAccessKeys)
  }
}

// 规范input容器的属性
function normInputProfile(params) {
  if (params) {
    if (params.title) {
      params.title = resetUIitem(params.title, 'profile-item-title')
    }

    if (params.desc) {
      params.desc = resetUIitem(params.desc, 'profile-item-desc')
    }

    return normAsset(params, containerAttributsAccessKeys)
  }
}

// 规范input容器的属性
function normContainer(params) {
  return normAsset(params, containerAttributsAccessKeys)
}

function getTypeName(item){
  if (TYPE_RADIO.indexOf(item.type) > -1) {
    return lib.isString(item.name) ? (item.name || item.id) : lib.isArray(item.name) ? item.name[0] : ''
  } else {
    if (item.type) {
      return item.id||item.name
    }
  }
}

/**
 * 
 * @param {*} data 
 * @param {*} index 
 * 数据模型
 * {title: '', input: []/{}, desc: ''}
 */
function getItemAllocation(data, index) {
  let itemProfile = {}
  if (lib.isObject(data)) {

    // 容器属性
    Object.keys(data).forEach(key => {
      if (key != 'input') {
        // 设置样式
        if (CLASS_NAMES.indexOf(key) > -1) {
          itemProfile['itemClass'] = data[key] ? 'inputItem ' + data[key] : 'inputItem'
        } else {
          itemProfile[key] = data[key]
        }
      }
    }) 
    itemProfile.uid = itemProfile.hasOwnProperty('uid') ? itemProfile.uid : lib.suid('input_profile_')
    itemProfile = Object.assign({}, containerAttributs, normInputProfile(itemProfile))

    let assets = []
    let inputs = [].concat((data.input || []))
    inputs.forEach(item => {
      if (lib.isObject(item)) {
        let target = Object.assign({}, inputAttributs, normInput.call(this, item, itemProfile))
        if (target === 'dropdown' && lib.isObject(target.value)) {
          let tmpV = target.value
          target.text = tmpV.title||tmpV.text
          target.value = tmpV.value
        }
        assets.push(target)
      }
    })

    // map id to state.allocation
    let itemAllocation = {}
    assets.forEach(item => {
      const _name = getTypeName(item)
      if (_name) itemAllocation[_name] = item
    })

    return {
      itemAllocation,
      assets,
      itemProfile
    }
  }
}

// 表单资源集合，所有的表单元素的浅层资源类
function createAllocation(data) {
  let allocation = {}
  let nData = []
  data.forEach((item, ii) => {
    if (typeof item == 'object') {
      const {itemAllocation, assets, itemProfile} = getItemAllocation.call(this, item, ii)
      allocation = Object.assign(allocation, itemAllocation)
      let nItem = { profile: itemProfile, input: assets }
      nItem.uid = itemProfile.uid || lib.suid('input_item_')
      if (nItem) nData.push(nItem)
    }
  })
  return {allocation, data: nData}
}

function createProps(params) {
  let props = {}
  if (params) {
    Object.keys(params).forEach(key=>{
      if (key!='data') {
        props[key] = params[key]
      }
    })
  }
  props = normContainer(props)
  props.show = props.hasOwnProperty('show') ? props.show : true
  return props
}

function initForm(params) {
  let that = this
  let dataSource = params
  const props = this.props = createProps((dataSource || {}))
  const {allocation, data} = createAllocation.call(this, (dataSource.data||[]))
  this.allocation = allocation
  dataSource.data = this.validInputs = data
  if (lib.isObject(dataSource.methods)) {
    let mths = dataSource.methods
    Object.keys(mths).forEach(key=> {
      let fun = mths[key]
      if (lib.isFunction(fun)) {
        this[key] = fun.bind(that)
      }
    })
  }
  delete dataSource.methods

  this.setData({
    $dataSource: dataSource,
    $validInputs: this.validInputs,
    $props: props
  })
}

// 基于item的组件
Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
    addGlobalClass: true
  },
  properties: {
    dataSource: {
      type: Object,
      observer: function (params) { 
        if (this.mounted && !this.init) {
          if (params) {
            initForm.call(this, params)
          }
        }
      }
    }
  },
  data: {
    $dataSource: {},
  },
  behaviors: [Core.baseBehavior(app, 'form')],
  lifetimes: {
    created: function () {
      // this.generateUpdate('$dataSource')
      this.$$is = 'form'
      this.query = wx.createSelectorQuery().in(this)
    },
    attached: function() { //节点树完成，可以用setData渲染节点，但无法操作节点
      let properties = this.properties
      let dataSource = properties.dataSource
      initForm.call(this, dataSource)
    },
    ready: function() {
      const ds = this.data.$dataSource
      // if (ds.$$id) this.mount((ds.$$id))
      this.mount(ds.$$id)
      this.parentInstance = this._getAppVars(ds.fromComponent)
      this.componentInst = this.parentInstance
      if (lib.isEmpty(this.parentInstance)) {
        this.parentInstance = undefined
      } else {
        this.parentInstance.form = this
      }
    }
  },
  methods: {
    update(id, param) {
      if (lib.isObject(id) && id.data) {
        this.reset(id)
      } else {
        if (lib.isArray(id)) {
          let tmp = lib.clone(this.originalDataSource)
          tmp.data = id
          this.reset(tmp)
        } else {
          this.value(id, param)
        }
      }
    },
    reset(params) {
      let that = this
      if (params && params.data) {
        this.setData({
          $dataSource: {},
          $validInputs: {},
          $props: {}
        }, function() {
          initForm.call(that, params)
        })
      } else {
        let orid = this.originalDataSource
        initForm.call(this, orid)
      }
    },
    find(param){
      return wx.$$find(param, this)
    },
    findBYuid: function (uid) {
      let rightIt
      let rightIndex
      const $validInputs = this.data.$validInputs
      if (uid) {
        if (uid.indexOf('.') == -1) {
          $validInputs.forEach( (item, ii) => {
            if (item.uid == uid) {
              rightIndex = ii
              rightIt = item
            }
          })
          if (rightIt) {
            return {index: rightIndex, info: rightIt}
          }
        }

        if (uid.indexOf('.')>-1) {
          this.getAddressInfo(uid)
        }
      }
    },
    // address 取值来自input的data-address
    // address 为uid字符串，包含item.uid和input.uid，以 . 为分隔符
    getAddressInfo: function (address) {
      let findAddress
      let findIt
      let itemIndex
      let inputIndex
      let itemData
      let inputData
      let itemProfile
      const $validInputs = this.data.$validInputs
      if (address && $validInputs.length) {
        const [profile_uid, input_uid] = address.split('.')
        const res = this.findBYuid(profile_uid)
        if (res) {
          itemData = [res.info]
          itemIndex = res.index
          itemProfile = res.info.profile
        }
        if (input_uid && itemData.length) {
          inputData = itemData[0].input.filter((ipt, jj) => {
            if (ipt.uid == input_uid) {
              inputIndex = jj
              return true
            }
          })
        }

        if (inputData) {
          findAddress = `$validInputs[${itemIndex}].input[${inputIndex}]`
          findIt = inputData
        } else {
          if (itemData) {
            findAddress = `$validInputs[${itemIndex}]`
            findIt = itemData
          }
        }
        if (findAddress) {
          return {address: findAddress, inputData: findIt[0], profile: itemProfile}
        }
      }
    },
    
    addWarn: function (id, message) {
      this.value(id, { error: message })
    },
    
    addDesc: function (id, message) {
      this.value(id, { desc: message })
    },
    
    removeWarn: function(id) {
      const inputConfig = this.value(id)
      if (inputConfig.error) {
        this.value(id, {error: null})
      }
    },
    
    removeDesc: function(id) {
      const inputConfig = this.value(id)
      if (inputConfig.desc) {
        this.value(id, {desc: null})
      }
    },

    disabled: function(id, val) {
      if (typeof val === 'boolean') {
        this.value(id, {disabled: val})
      } else {
        this.value(id, {disabled: true})
      }
    },

    // 清空某个表单的值
    empty: function(keyid) {
      const allocation = this.allocation
      let willEmpty = {}

      Object.keys(allocation).forEach(id=>{
        let profile = allocation[id]
        let val = profile.value
        let emptyValue = null
        if (lib.isArray(val)) emptyValue = []
        if (lib.isString(val) || lib.isNumber(val)) emptyValue = ''
        if (keyid) {
          if (id === keyid) {
            willEmpty[id] = {value: emptyValue}
          }
        } else {
          willEmpty[id] = {value: emptyValue}
        }
      })
      this.value(willEmpty)

      // if (keyid) {
      //   Object.keys(allocation).forEach(id=>{
      //     if (id === keyid) {
      //       let profile = allocation[id]
      //       let val = profile.value
      //       let emptyValue = null
      //       if (lib.isArray(val)) emptyValue = []
      //       if (lib.isString(val) || lib.isNumber(val)) emptyValue = ''
      //       willEmpty[id] = {value: emptyValue}
      //     }
      //   })
      // } else {
      //   Object.keys(allocation).forEach(id=>{
      //     let profile = allocation[id]
      //     let val = profile.value
      //     let emptyValue = null
      //     if (lib.isArray(val)) emptyValue = []
      //     if (lib.isString(val) || lib.isNumber(val)) emptyValue = ''
      //     willEmpty[id] = {value: emptyValue}
      //   })
      // }
      // this.value(willEmpty)
    },
    
    /**
     * 
     * @param {String} id 表单id
     * @param {Object} val 表单配置
     */
    profile(id, val) {
      const allocation = this.allocation
      const ipData = allocation[id]  // id必须为string类型
      const address = ipData['uAddress']
      const profileId = address.split('.')[0]
      let res = this.findBYuid(profileId)
      if (res && val) {
        if (val) {
          if (lib.isObject(val)) {
            res.info.profile = Object.assign(res.info.profile, val)
            this.setData({
              [`$validInputs[${res.index}]`]: res.info
            })
          }
        } else {
          return res
        }
      }
    },

    /**
     * 为某个表单添加类名
     * @param {String|Object} id 表单id，表单配置
     * @param {String} clsName 添加的类名，允许添加多个类名，如：'clsA clsB'
     */
    addClass(id, clsName){
      let addInputClass = (inputId, clsnm) => {
        clsnm = clsnm.replace(/\./g, '')
        let ipData = this.getInputData(inputId)
        let inputType = ipData.type
        // if (inputType === 'span') {
        //   // ipData = ipData.value
        //   let value = ipData.value
        //   let itCls = value.itemClass && value.itemClass.split(' ') || ''
        //   let itemClass = itCls[(itCls.length-1)]
        //   let feature = value.$$id || value.id || itemClass
        //   if(feature) {
        //     let target = this.find(feature)
        //     target&&target.addClass(clsnm)
        //   }
        //   return
        // }
        let inputCls = ipData.inputClass || ipData.itemClass || ''
        let ary = clsnm.split(' ')
        let clsAry = ary.filter(cls => inputCls.indexOf(cls) === -1)
        inputCls = inputCls + ' ' + clsAry.join(' ')
        return {inputClass: inputCls}
        // return inputType === 'span' ? {itemClass: inputCls} : {inputClass: inputCls}
      }

      if (lib.isObject(id)) {
        let ary = Object.entries(id)
        let upData = {}
        ary.forEach(group=>{
          let [$id, val] = group
          let inputCls = addInputClass($id, val)
          if (inputCls) {
            upData[$id] = inputCls
          }
        })
        this.value(upData)
      } else {
        let inputCls = addInputClass(id, clsName)
        if (inputCls) {
          this.value({
            [id]: { ...inputCls }
          })
        }
      }
    },

    /**
     * 为某个表单移除类名
     * @param {String} id 表单id
     * @param {String} clsName 移除的类名，允许移除多个类名，如：'clsA clsB'
     */
    removeClass(id, clsName){
      let rmvInputClass = (id, clsnm) => {
        clsnm = clsnm.replace(/\./g, '')
        let ipData = this.getInputData(id)
        let inputType = ipData.type
        // if (inputType === 'span') {
        //   let value = ipData.value
        //   let itCls = value.itemClass && value.itemClass.split(' ') || ''
        //   let itemClass = itCls[(itCls.length - 1)]
        //   let feature = value.$$id || value.id || itemClass
        //   if (feature) {
        //     let target = this.find(feature)
        //     target&&target.removeClass(clsnm)
        //   }
        //   return
        // }
        let inputCls = ipData.inputClass || ''
        let ary = inputCls.split(' ')
        let clsAry = ary.filter(cls => clsnm.indexOf(cls) === -1)
        inputCls = clsAry.join(' ')
        return {inputClass: inputCls}
        // return inputType === 'span' ? {itemClass: inputCls} : {inputClass: inputCls}
      }

      if (lib.isObject(id)) {
        let ary = Object.entries(id)
        let upData = {}
        ary.forEach(group => {
          let [$id, val] = group
          let inputCls = rmvInputClass($id, val)
          if (inputCls) {
            upData[$id] = inputCls
          }
        })
        this.value(upData)
      } else {
        let inputCls = rmvInputClass(id, clsName)
        if (inputCls) {
          this.value({
            [id]: { ...inputCls }
          })
        }
      }
    },

    /**
     * 获取某个表单的value值
     * @param {String|null} id 
     * @param {Boolean} forData true获得完整数据，false只获取表单的value值
     */
    getValue(id, forData){
      let val = this.value(id) || {}
      let tmpValue = {}
      if (id) {
        Object.keys(val).forEach(ky=>{
          if (val[ky] !== undefined) {
            tmpValue[ky] = val[ky]
          }
        })
      } else {
        Object.keys(val).forEach(inputId=>{
          tmpValue[inputId] = this.getValue(inputId, true)
        })

        // Object.keys(val).forEach(ky=>{
        //   if (val[ky]) {
        //     let element = val[ky]
        //     let tmp = {}
        //     Object.keys(element).forEach(key=>{
        //       if (element[key]!==undefined) {
        //         tmp[key] = element[key]
        //       }
        //     })
        //     tmpValue[ky] = tmp
        //   }
        // })
      }

      if (id) {
        if (val.type === 'dropdown') {
          // return forData ? {type: val.type, id: (val.id||val.name), text: val.text, value: val.value} : val.value
          return {type: tmpValue.type, id: (tmpValue.id||tmpValue.name), text: tmpValue.text, value: tmpValue.value}
        }

        if (val.type === 'picker') {
          if (val.values && val.values.length) {
            let _values = val.values
            let _value = [].concat(val.value)
            let _val = []
            // if (_value[0] === undefined) _value[0] = 0

            for (let ii=0; ii<_value.length; ii++) {
              const sub = _value[ii]||0
              if (lib.isArray(_values[ii])) {  // 二维数组
                let tmp = _values[ii][sub]
                if (!lib.isObject(tmp)) {
                  tmp = {title: tmp}
                }
                if (lib.isObject(tmp)) {
                  tmp.sub = sub  // value中的值，指向 values 的下标
                  if (!tmp.title && tmp.title !== 0 ) {
                    tmp.sub = -1
                  }
                }
                _val.push(tmp)
              }
            }
            if (!_val.length) {
              _val = _value
            }
            tmpValue.value = _val
          }
        }

        if (val.type === 'picker') {
          if (val.values && val.values.length) {
            let _values = val.values
            let _value = [].concat(val.value)
            let _val = []

            for (let ii=0; ii<_value.length; ii++) {
              const sub = _value[ii]||0
              // 多维picker
              if (lib.isArray(_values[ii])) {  // 二维数组
                let tmp = _values[ii][sub]
                if (!lib.isObject(tmp)) {
                  tmp = {title: tmp}
                }
                if (lib.isObject(tmp)) {
                  tmp.sub = sub  // value中的值，指向 values 的下标
                  if (!tmp.title && tmp.title !== 0) {
                    tmp.sub = -1
                  }
                }
                _val.push(tmp)
              } else {
                // 一维picker   @1 
                let tmp = _values[ii]
                if (!lib.isObject(tmp)) {
                  tmp = {title: tmp}
                }
                if (lib.isObject(tmp)) {
                  tmp.sub = sub  // value中的值，指向 values 的下标
                }
                _val.push(tmp)
              }
            }

            if (!_val.length) {
              // _val = _value
              _val = val.value   // 这个才是正确的 @2    @1与@2要同时放开才正确
            }
            tmpValue.value = _val
          }
        }
        return forData ? tmpValue : tmpValue.value
      } else {
        return tmpValue
      }
    },

    /**
     * 
     * @param {String|Object} id 表单id，或者完整配置
     * @param {String|Object} val 
     */
    setValue(id, val){
      if (val) {
        if (!lib.isObject(val)) {
          val = {value: val}
        }
        this.value(id, val)
      }
    },

    updateDropdownOptions(id, options){
      if (lib.isArray(options)) {
        this.value(id, options)
      }
    },

    setInputProfile(param={}){
      if (lib.isObject(param)) {
        this.value(param)
      }
    },

    setInputData(param) {
      this.setInputProfile(param)
    },

    getInputData(id) {
      const allocation = this.allocation
      if (id) {
        if (lib.isString(id)) {
          return allocation[id]
        }
      }
    },
    
    value(id, val){
      const allocation = this.allocation
      if (id) {
        if (val) {
          if (lib.isString(id)) {
            if (allocation[id] && val) {
              const ipData = allocation[id] 
              const address = ipData['uAddress']
              let willUpdate = {}
              let res = this.getAddressInfo(address)
              if (res) {
                let inputType = res.inputData.type
                if (lib.isString(val) || lib.isNumber(val)) {
                  res.inputData.value = val
                  let resault = res.inputData
                  res.inputData = resault = normInput.call(this, resault, res.profile)
                  willUpdate = {[res.address]: resault}
                } else {
                  // 下拉菜单允许数组
                  if (inputType === 'dropdown') {
                    if (lib.isObject(val)) {
                      if (val.titles && lib.isArray(val.titles)) {
                        val = Object.assign({}, val, {titles: {data: buildDropdownOptions(val.titles, address)}})
                      }
                    }
                    if (lib.isArray(val)) {
                      val = {titles: {data: buildDropdownOptions(val, address)}}
                    }
                  }

                  // 更新picker的values
                  if (inputType === 'picker') {
                    if (lib.isObject(val)) {
                      if (val.values && lib.isArray(val.values)) {
                        val = Object.assign({}, val, resetPickersValues(val))
                      }
                    }
                    if (lib.isArray(val)) {
                      val = resetPickersValues({values: val})
                    }
                  }

                  // if (lib.isArray(val) && inputType === 'dropdown') {
                  //   val = {titles: {data: buildDropdownOptions(val, address)}}
                  // }
                  // if (lib.isArray(val) && inputType === 'picker') {
                  //   val = resetPickersValues({values: val})
                  // }

                  if (lib.isObject(val)) {
                    let resault = Object.assign({}, res.inputData, val)
                    res.inputData = resault = normInput.call(this, resault, res.profile)

                    const keys = Object.keys(val) 
                    const updateBody = {}
                    keys.forEach(ky=>{
                      const updateKey = `${res.address}.${ky}`
                      updateBody[updateKey] = resault[ky]
                    })

                    willUpdate = updateBody
                    // willUpdate = { [res.address]: resault }
                  }
                }
                allocation[id] = res.inputData
                this.setData(willUpdate)
              }
            }
          }
        } else {

          // 取单个表单的配置
          if (lib.isString(id)) {
            return allocation[id]
          }

          // 批量赋值
          if (lib.isObject(id)) {
            const _param = id
            Object.keys(_param).forEach(inputId=>{
              const _val = _param[inputId]
              if (_val || _val === 0) {
                this.value(inputId, _val)
              }
            })
          }

          // if (lib.isObject(id)) {
          //   let willUpdate = {}
          //   Object.keys(id).forEach($id=>{
          //     const myval = id[$id]
          //     const ipData = allocation[$id]
          //     if (ipData) {
          //       const inputType = ipData.type
          //       const address = ipData['uAddress']
          //       let res = this.getAddressInfo(address)
          //       if (res) {
          //         if (lib.isString(myval)) {
          //           res.inputData.value = myval
          //           willUpdate[res.address] = res.inputData
          //         } else {
          //           if (lib.isObject(myval)) {
          //             let resault = Object.assign({}, res.inputData, myval)
          //             res.inputData = resault
          //             willUpdate[res.address] = resault
          //           }
          //         }
          //         allocation[$id] = res.inputData
          //       }
          //     }
          //   })
          //   this.setData(willUpdate)
          // } else {
          //   return allocation[id]
          // }
        }
      } else {
        return allocation
      }
    },

    // // 下拉菜单的列表项为scroll-view
    // // 滚动式触发以下方法
    // inputItemDropdownScroll: function (e, param) {
    //   // console.log(e);
    //   // console.log(param);
    // },

    inputItemRating(e, param){
      const that = this
      const mytype = e.type
      const dataset = e.currentTarget.dataset
      const address = dataset.address
      const changedTouches = e.changedTouches[0]
      const detail = e.detail
      let value = e.detail.value = parseInt((dataset.value))
      
      if (mytype === 'tap') {
        let res = this.getAddressInfo(address)
        ratingTint.call(this, e, res, value)
      } else {
        if (mytype === 'touchstart') {
          // e.dataset
          // address: "input_profile_29.input_input_30"
          // evt: "tap=ratingChecked"
          // max: 7
          // type: "rating"
          // value: 3

          // rating item
          // bottom: 110.71875
          // dataset:
          //   address: "input_profile_29.input_input_30"
          //   evt: "tap=ratingChecked"
          //   max: 7
          //   type: "rating"
          //   value: 1
          // height: 40
          // id: ""
          // left: 89.28125
          // right: 117.28125
          // top: 70.71875
          // width: 28


          // changedTouches
          // pageX: 179
          // pageY: 93
          let rightRatings = this.ratingItems.filter(item => item.dataset.address === address)
          if (!rightRatings.length) {
            rightRatings = null
          } else {
            let res = this.getAddressInfo(address)
            let leftPoints = rightRatings.map(item=>item.left)
            this.__currentRating = {
              res,
              rightRatings,
              leftPoints,
              value,
              x: changedTouches.pageX,
              y: changedTouches.pageY
            }
            ratingTint.call(this, e, res, value)
          }
        }
        
        if (mytype === 'touchmove' && this.__currentRating) {
          let __currentRating = this.__currentRating
          let val = __currentRating.value
          let res = __currentRating.res
          let currentX = changedTouches.pageX
          let currentY = changedTouches.pageY
          let points = __currentRating.leftPoints
          let rightPoints = points.filter(point=>point<currentX)
          if (rightPoints.length && rightPoints.length !== val)  {
            __currentRating.value = rightPoints.length
            ratingTint.call(this, e, res, rightPoints.length)
          }
        }
      }
    },

    inputItemDropdownOff(e){
      const dataset = e.currentTarget.dataset
      this.hooks.emit('dropdown-off')
    },

    inputItemDropdownOptions(e, param, inst){
      if (param && param.address) {
        // 下拉菜单选项点击
        let ddV = this.dropdownValue || {}
        this.dropdownValue = ddV
        let add = param.address
        let oldValue = ddV[add] || {}
        if (oldValue.value !== param.value) {
          this.dropdownValue[add] = param
          this.inputItemDropdown(e, param, inst)
        } else {
          this.hooks.emit('dropdown-off', e.currentTarget.dataset)
        }
      } else {
        // 下拉菜单栏点击
        this.inputItemDropdown(e, {fromMenu: true}, inst)
      }
    },
    // dropdown
    // e evtent
    // param 经过 core itemMethod解析过后的数据，包含?abc=xxx等query信息
    inputItemDropdown: function (e, param={}) {
      const that = this
      const $ = this.activePage.getElementsById.bind(this.activePage)
      const mytype = e.type
      const dataset = e.currentTarget.dataset
      const detail = e.detail
      let {address, index, value, text, fromMenu} = param
      let res = this.getAddressInfo(address||dataset.address)
      this.hooks.emit('dropdown-off', dataset)
      if (res) {
        let id = res.inputData.id || res.inputData.name
        let listid = id+'_dd'
        if (dataset.eye) {
          // console.log(dataset);
          // console.log(res.inputData);
          let itemInput = this.allocation[id]
          let hasSelected = itemInput.__param
          let defValue = itemInput.value
          const state = !res.inputData.titles.show
          res.inputData.titles.show = state
          res.inputData.eye = state ? 'form-arrows-x' : 'form-arrows'

          let style = res.inputData.itemStyle
          let ddlistStyle = res.inputData.titles.listStyle
          if (state) {
            style = (style||'') + ';z-index: 698'
            ddlistStyle = (ddlistStyle||'') + ';z-index: 699'
            res.inputData.itemStyle = style
            res.inputData.titles.listStyle = ddlistStyle

            this.hooks.off('dropdown-off')
            this.hooks.on('dropdown-off', function (param) {
            // this.hooks.once('dropdown-off', function (param) {
              let beable = false
              if (param) {
                if (param.address !== res.inputData.uAddress) {
                  beable = true
                }
              } else {
                beable = true
              }

              if (beable) {
                res.inputData.titles.show = false
                res.inputData.eye = 'form-arrows'
                style = (style || '').replace(';z-index: 698', '')
                ddlistStyle = (ddlistStyle || '').replace(';z-index: 699', '')
                res.inputData.itemStyle = style
                res.inputData.titles.listStyle = ddlistStyle
                runFormBindFun.call(that, null, res, e)
              }
            })
          } else {
            style = (style || '').replace(';z-index: 698', '')
            ddlistStyle = (ddlistStyle || '').replace(';z-index: 699', '')
            res.inputData.itemStyle = style
            res.inputData.titles.listStyle = ddlistStyle
          }

          let hs = hasSelected
          let tDatas = res.inputData.titles.data
          if (hasSelected) {
            tDatas = tDatas.map((item, ii)=>{
              item.itemClass = (item.itemClass||'').replace(/ *active/g, '')
              if (ii === parseInt(hs.index)) {
                item.itemClass = (item.itemClass||'') + ' active'
              }
              return item
            })
            // res.inputData.titles.data = tDatas
          } else {
            if (defValue) {
              if (lib.isObject(defValue)) {
                defValue = defValue.value
              }
              tDatas = tDatas.map((item, ii) => {
                item.itemClass = (item.itemClass||'').replace(/ *active/g, '')
                if (item.value === defValue || item.title === defValue) {
                  item.itemClass = (item.itemClass||'') + ' active'
                } 
                return item
              })
              // res.inputData.titles.data = tDatas
            }
          }

          // setAllocation.call(this, res, {value: detail.value})
          // runFormBindFun.call(this, 'tap', res, e)
          
          // const state = !res.inputData.titles.show
          // res.inputData.titles.show = state
          // res.inputData.eye = state ? 'icon-arrows-t' :'icon-arrows-b'
        } else {
          if (text) {
            res.inputData.titles.show = false
            res.inputData.eye = 'form-arrows'
          }
          setAllocation.call(this, res, {value: (value||''), text, __param: param })
          // res.inputData.value = text||''
          // res.inputData.value = {title: text, value}
          res.param = param
        }
        if (!fromMenu) {
          runFormBindFun.call(this, 'bindchange', res, e)
        }
        runFormBindFun.call(this, 'bindinput', res, e)
        runFormBindFun.call(this, 'bindblur', res, e)
      }
    },

    inputBtnMethod(e){
      e.__type = 'bind'+e.type
      const mytype = e.type
      const dataset = e.currentTarget.dataset
      const detail = e.detail

      const address = dataset.address
      const res = this.getAddressInfo(address)
      const activePage = this.activePage
      // const {fun, param, allParam} = this._rightEvent(e)

      switch (mytype) {
        case 'getuserinfo':
          runFormBindFun.call(this, 'bindgetuserinfo', res, e)
          break;

        case 'contact':
          runFormBindFun.call(this, 'bindcontact', res, e)
          break;

        case 'getphonenumber':
          runFormBindFun.call(this, 'bindgetphonenumber', res, e)
          break;

          
          case 'opensetting':
            runFormBindFun.call(this, 'bindopensetting', res, e)
            break;
            
        case 'error':
          runFormBindFun.call(this, 'binderror', res, e)
          break;

        case 'launchapp':  // e.type == 'error'，这个应该是小程序的bug
          runFormBindFun.call(this, 'bindlaunchapp', res, e)
          break;
      }
    },

    inputItemMethod: function(e) {
      let that = this
      const mytype = e.type
      const dataset = e.currentTarget.dataset
      const detail = e.detail

      const address = dataset.address
      const res = this.getAddressInfo(address)
      const activePage = this.activePage
      // const {fun, param, allParam} = this._rightEvent(e)
      
      if (res) {
        var id = res.inputData.id || res.inputData.name
      }

      if (dataset.type === 'rating') {
        if (!this.ratingItems) {
          this.query.selectAll('.input-type-rating .input-item-rating').boundingClientRect(ret => {
            if (ret.length) {
              that.ratingItems = ret
              this.inputItemRating(e)
            }
          }).exec()
        } else {
          this.inputItemRating(e)
        }
      }
      switch (mytype) {
        case 'confirm':
          runFormBindFun.call(this, 'bindconfirm', res, e)
          break;
          
        case 'focus':
          if (res.inputData.type == 'dropdown') {
            e.currentTarget.dataset.eye = true
            this.inputItemDropdown(e, {fromMenu: true})
          } else {
            runFormBindFun.call(this, 'bindfocus', res, e)
          }
          break;

        case 'blur':
          if (res.inputData.type == 'dropdown') {
            res.inputData.titles.show = false
            res.inputData.eye = 'form-arrows'
            runFormBindFun.call(this, 'bindblur', res, e)
          } else {
            setAllocation.call(this, res, {value: detail.value})
            runFormBindFun.call(this, 'bindblur', res, e)
          }
          break;

        case 'input':
          if ((!res.inputData.readonly&&!res.inputData.disabled) && (detail.value || detail.value === '')) {
            if (res.inputData.type === 'textarea') {
              if (res.inputData.maxcount >0) {
                let counter = lib.strlen(detail.value, true)
                if (counter > res.inputData.maxcount) {
                  counter = res.inputData.maxcount
                  detail.value = lib.subcontent(detail.value, res.inputData.maxcount)
                }
                res.inputData.strCount = counter
              }
            }
            setAllocation.call(this, res, {value: detail.value})
            res.inputData.value = detail.value
            runFormBindFun.call(this, 'bindinput', res, e)
          }
          break;

        case 'tap':
          if (res.inputData.type === 'rating') {
            this.inputItemRating(e)
          } 
          else
          if (res.inputData.type == 'dropdown') {
            // this.hooks.emit('dropdown-off')
            this.inputItemDropdown(e)
            // res.inputData.titles.show = !res.inputData.titles.show
            // res.inputData.eye = 'icon-arrows-t'
            // setAllocation.call(this, res, {value: detail.value})
            // runFormBindFun.call(this, 'tap', res, e)
          } else {
            // const targetFun = this.parentInstance&&this.parentInstance[fun] || activePage[fun]
            // if (lib.isFunction(targetFun)) {
            //   const tapctx = this.parentInstance || activePage
            //   targetFun.call(tapctx, e, param, this)
            // }
            runFormBindFun.call(this, 'tap', res, e)
          }
          break;
      
        default:
          break;
      }
    },

    openCloseEey: function(e) {
      const dataset = e.currentTarget.dataset
      const address = dataset.address
      const res = this.getAddressInfo(address)
      // console.log(res.address, res.inputData);
      if (res) {
        let id = res.inputData.id||res.inputData.name
        res.inputData.type = res.inputData.type == 'password' ? 'text' : 'password'
        res.inputData.eye && (res.inputData.eye = typeof res.inputData.eye == 'boolean' ? 'form-eye' : true)
        this.setData({ [res.address]: res.inputData })
        setTimeout(() => {
          this.setValue(id, res.inputData.value)
        }, 50);
      }
    },

    onClearValue(e){
      const dataset = e.currentTarget.dataset
      const address = dataset.address
      const res = this.getAddressInfo(address)
      if (res) {
        let id = res.inputData.id||res.inputData.name
        this.empty(id)
      }
    },

    rcChange: function (e) {
      const dataset = e.currentTarget.dataset
      const detail = e.detail
      const res = this.getAddressInfo(dataset.address)
      if (res) {
        const type = res.inputData.type
        // res.inputData.value = detail.value
        setAllocation.call(this, res, {value: detail.value, checked: detail.value})

        runFormBindFun.call(this, 'bindchange', res, e)
        if (type !== 'switch') {
          runFormBindFun.call(this, 'bindchanging', res, e)
        }
        // res.inputData.bindchange && runFormBindFun.call(this, 'bindchange', res, e)
        // if (type !== 'switch') {
        //   res.inputData.bindchanging && runFormBindFun.call(this, 'bindchanging', res, e)
        // }
      }
    },

    pickerViewEvent(e){
      const dataset = e.currentTarget.dataset
      const detail = e.detail
      const res = this.getAddressInfo(dataset.address)
      if (res) {
        const type = e.type
        if (type === 'change') {
          let oldValue = res.inputData.value
          let newValue = detail.value
          let valueIndex = undefined
          let column = (()=>{
            let changeColumn = undefined
            for (let ii=0; ii<oldValue.length; ii++) {
              if (oldValue[ii] !== newValue[ii]) {
                changeColumn = ii
                valueIndex = newValue[ii]
                break;
              }
            }
            return changeColumn
          })()
          detail.columnValue = {
            column,
            value: valueIndex
          }
          e.detail = detail
          setAllocation.call(this, res, {value: detail.value})
        }
        runFormBindFun.call(this, 'bindchange', res, e, 'picker-view')
        runFormBindFun.call(this, 'bindpickstart', res, e)
        runFormBindFun.call(this, 'bindpickend', res, e)
      }
    },

    pickersChange: function(e) {
      const dataset = e.currentTarget.dataset
      const detail = e.detail
      const res = this.getAddressInfo(dataset.address)
      if (res && e.type != 'cancel') {
        const type = res.inputData.type
        const column = detail.column
        const value = detail.value
        // setAllocation.call(this, res, {value: res.inputData.value})
        setAllocation.call(this, res, {value: detail.value, column})
        if (column || column === 0) {
          runFormBindFun.call(this, 'bindcolumnchange', res, e, 'pickers')
        } else {
          runFormBindFun.call(this, 'bindchange', res, e, 'pickers')
        }
      } else {
        runFormBindFun.call(this, 'bindcancel', res, e, 'cancel')
      }
    },

    _union(param){
      const that = this
      if (lib.isObject(param)) {
        const {id, event, callback} = param
        const target = id
        if (id && lib.isFunction(callback)) {
          this.hooks.on('change', function(param) {
            const {id, point} = param   // point为观察的点的inputData
            if (id == target) {
              callback.call(that, {...point})
            }
          })
        }
      }
    },

    union(param){
      if (lib.isObject(param)) {
        this._union(param)
      }

      if (lis.isArray(param)) {
        param.forEach(item=>{
          if (lib.isObject(item)) {
            this._union(item)
          }
        })
      }
    }
  }
})

function setAllocation(res, val) {
  var id = res.inputData.id || res.inputData.name
  let itemInput = this.allocation[id]
  const itemInputValue = itemInput.value
  const column = val.column
  let hasChanged = false

  if (itemInput) {
    if (lib.isArray(itemInputValue)) {
      if (column || column === 0) {
        hasChanged = (JSON.stringify(itemInputValue[column]) !== JSON.stringify((val.value)))  
      } else {
        hasChanged = (JSON.stringify(itemInputValue) !== JSON.stringify((val.value)))
      }
    } else {
      hasChanged = itemInputValue !== (val.value)
    }

    if (hasChanged) {
      if (itemInput.type === 'dropdown') {
        this.allocation[id].value = {title: val.text, value: val.value}
      } 
      else if (['picker', 'pickers', 'picker-view'].includes(itemInput.type)){
        if (column || column === 0) {
          this.allocation[id].value[column] = val.value
        } else {
          this.allocation[id].value = val.value
        }
      }
      else {
        this.allocation[id] = Object.assign({}, itemInput, val)
      }

      itemInput = this.allocation[id]
      this.hooks.emit('change', {id, point: itemInput})
    }

    // if (itemInputValue !== val.value) {
    //   if (itemInput.type === 'dropdown') {
    //     this.allocation[id].value = {title: val.text, value: val.value}
    //   }
    //   itemInput = this.allocation[id]
    //   this.hooks.emit('change', {id, point: itemInput})
    // }
  }
}

function runFormBindFun(fn, res, e, from) {
  let that = this
  let activePage = this.activePage
  let inputType = res.inputData.type
  let fun, param, allParam

  if (fn === 'bindcolumnchange' && res && res.inputData[fn] === true) {
    fn = undefined
  } else {
    let tmp = this._rightEvent(e)
    fun = tmp.fun; param = tmp.param; allParam = tmp.allParam
  }

  // if (fn !== 'bindcolumnchange') {
  //   let tmp = this._rightEvent(e)
  //   fun = tmp.fun; param = tmp.param; allParam = tmp.allParam
  // } else {
  //   fn = undefined
  // }

  // let tmp = this._rightEvent(e)
  // fun = tmp.fun; param = tmp.param; allParam = tmp.allParam
  let funNm = fun

  var id = res.inputData.id || res.inputData.name
  if (!id) throw new Error('表单元素必须指定id')
  res.inputData = this.allocation[id]
  res.param ? e.param = res.param : ''
  res.param = res.param || param || {}
  e.param = Object.assign(res.param, e.detail)
  res.value = res.inputData.value
  res.values = res.inputData.values
  res.id = id
  res.type = res.inputData.type

  if (from === 'cancel') {
    if (lib.isFunction((res && res.inputData && res.inputData['cancel']))) {
      res.inputData['cancel'].call()
    }
    return 
  }


  // 设置picker的值
  // 多重picker如果绑定了 bindchange事件，则bindcolumnchange不会即时更新
  function updatePickers(data){
    // if (fn === 'bindcolumnchange') {
    //   if (res.inputData['bindchange']) {
    //     return
    //   }
    // }
    that.setData({[res.address]: data})
  }

  // 定义picker(多重)的bindcolumnchange的更新方法
  function reDefinePickerColumnCallback(e, res, context) {
    let column = e.detail.column
    let value = e.detail.value
    if (from === 'picker-view') {
      e.param.columnValue = e.detail.columnValue
      column = e.detail.columnValue.column
      value = e.detail.columnValue.value
    }
    context.updateNextColumn = function(col, param) {
      if (lib.isArray(col)) {
        param = col
        col = undefined
      }
      let $column = column + 1
      if (lib.isNumber(col)) {
        $column = col
      }
      if (column > -1 && lib.isArray(param)) {
        if (res.inputData.values[$column]) {
          res.inputData.values[$column] = param
          res.inputData._titles = [...(res.inputData.titles)||[]]
          const resData = resetPickersValues(res.inputData, e)
          // that.setData({[res.address]: res.inputData})
          updatePickers(resData)
        }
      }
    }
  }

  if (lib.isString(res.inputData[fn])) {
    let funName = res.inputData[fn]
    // let targetObj = (!lib.isEmpty(this.componentInst) && this.componentInst) || activePage
    // let fun = (funNm&&targetObj[funNm]) || targetObj[funName]
    let targetObj = this.componentInst
    // let fun = (funNm&&targetObj[funNm]) || targetObj[funName] || activePage[funName]
    let fun = this[(funNm || funName)] || targetObj[(funNm || funName)] || activePage[(funNm || funName)]
    let context = this[(funNm || funName)] ? this : targetObj[(funNm || funName)] ? targetObj : activePage

    if (from === 'pickers' || from === 'picker-view') {
      let value = res.inputData.value
      let _values = res.inputData.values
      if (fn !== 'bindcolumnchange' && res.inputData.mode !== 'region') {
        if (lib.isArray(value)) {
          const values = []
          value.forEach((idx, ii) => {
            values.push({
              title: (_values[ii] && _values[ii][idx] && _values[ii][idx].title)||'',
              id: (_values[ii] && _values[ii][idx] && _values[ii][idx].id) || ''
            })
          })
          e.detail = e.detail || {}
          e.detail.pickerValue = values
          e.param.pickerValue = values
          res.pickerValue = values
        }
        if (from === 'picker-view') {
          reDefinePickerColumnCallback(e, res, context)
        }
      } else {
        reDefinePickerColumnCallback(e, res, context)
      }
    }
    

    if (lib.isFunction(fun)) {
      let resData = null
      let result = fun.call(context, e, res, this)
      res.inputData = this.allocation[id]
      if (from === 'pickers') {
        if (result) {
          resData = result.inputData ? result.inputData : result
          resData = resetPickersValues(resData, e)
          updatePickers(resData)
          // this.setData({[res.address]: resData})
        } else {
          updatePickers(res.inputData)
          // this.setData({[res.address]: res.inputData})
        }
      } else {
        if (result) {
          resData = result.inputData ? result.inputData : result
          this.setData({[res.address]: resData})
        } else {
          if (inputType === 'rating') {
            this.setData({[res.address]: res.inputData})
          }
          if (inputType === 'textarea' && fn === 'bindinput') {
            this.setData({[res.address]: res.inputData})
          }
        }

        // if (result) {
        //   resData = result.inputData ? result.inputData : result
        //   if (from == 'pickers') {
        //     resData = resetPickersValues(resData, e)
        //   }
        //   from == 'cancel' ? '' : this.setData({[res.address]: resData})
        // } else {
        //   res.inputData = this.allocation[id]
        //   /** 什么都不做 ? */
        //   if (inputType === 'rating') {
        //     from == 'cancel' ? '' : this.setData({[res.address]: res.inputData})
        //   }
        //   if (from == 'pickers') {
        //     this.setData({[res.address]: res.inputData})
        //   }
        // }
      }
    } else {
      if (from === 'pickers') {
        updatePickers(res.inputData)
      } else {
        this.setData({[res.address]: res.inputData})
      }
    }
  } else {
    let selfUpdate = ['picker-view', 'picker', 'pickers', 'dropdown', 'checkbox', 'radio', 'textarea']
    if (from === 'pickers') {
      updatePickers(res.inputData)
    } else {
      if (selfUpdate.indexOf(res.inputData['type'])>-1) {
        this.setData({[res.address]: res.inputData})
      }
    }
  }
}

function ratingTint(e, res, value) {
  if (res) {
    let range = res.inputData.range
    range = range.map((item, index) => {
      if (index <= (value-1)) {
        item.itemClass = (item.itemClass||'') + ' active'
      } else {
        item.itemClass = (item.itemClass || '').replace(/ *active/g, '')
      }
      return item
    })
    res.inputData.range = range
    setAllocation.call(this, res, {value})
    if (e.detail) {
      e.detail.value = value
    } else {
      e.detail = {value: value}
    }
    runFormBindFun.call(this, 'tap', res, e)
    lib.vibrateShort()
  }
}