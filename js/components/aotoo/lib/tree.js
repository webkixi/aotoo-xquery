import {
  isString,
  isObject,
  isArray,
  isNumber,
  isFunction,
  formatQuery,
  suid,
  resetSuidCount,
  clone
} from './util'

import {
  resetItem
} from "./foritem";

let self = null

const filter = function(data, callback) { 
  if (isArray(data)) {
    return data.filter(callback)
  }
} 
let idrecode = []
let treeProps = {}
function valideClassName(clsname, level) {
	const reCls = / *level([\d]* *)?/ig
	const myLevelCls = `level${level}`
	if (clsname) {
		if (reCls.test(clsname)) {
			clsname = clsname.replace(reCls, '')
		}
    clsname += ` ${myLevelCls}`
		return clsname
	}
}

let treeDeep = 1
function subTree(item, dataAry, deep, index){
  deep = treeDeep = deep || 1
  let fromTree
  if (this && this.fromTree) {
    fromTree = this.fromTree
  }
	let nsons = []
	let sons = filter(dataAry, o => o.$parent == item.idf)
	sons.forEach( (son, ii) => {
		let _clsName = son.itemClass || son.class
    son.itemClass = _clsName
		if (son.idf && idrecode.indexOf(son.idf) == -1) {
      son.itemClass = valideClassName(_clsName, deep)
			idrecode.push(son.idf)
			nsons = nsons.concat([subTree.call({fromTree}, son, dataAry, ++deep, ii)])
			--deep
		} else {
			nsons = nsons.concat(son)
		}
	})
	if (nsons.length) {
    // item.li = nsons
    // item['__sort'] = (item['__sort']||[]).concat('li')
    const treeid = (item.attr && item.attr['data-treeid']) || index
    // const $id = item.$$id || item.id || `level${deep}-${treeid}`
    const $id = item.$$id || item.id || `${treeid}`
    item.id = item.id || 'sort-' + treeid
		item['@list'] = {
      // $$id: $id,
      data: nsons,
      type: item.type||{is: 'exposed'},
      listClass: item.liClass || 'ul',
      itemClass: treeProps.itemClass||'',
      itemStyle: treeProps.itemStyle||'',
      show: item.hasOwnProperty('show') ? item.show : true,
      fromTree: self.__fromTree || self.uniqId,
      fromComponent: self.componentInst ? self.componentInst.uniqId :  self && self.uniqId,
      __fromParent: self && self.uniqId,
      methods:{
        __ready(){
          if (self) {
            self.childs[treeid] = this
            self.childs[item.idf] = this
          }
        }
      }
      // fromTree : fromTree
    }
    item['__sort'] = (item['__sort'] || []).concat('@list')
  }
  // item = resetItem(item)  //在list初始化中已经做过了
	return item
}

function owerTree(item) {
	const ary = []
	item.forEach( o => {
		if (Array.isArray(o)) return owerTree(item)
		ary.push(o)
	})
	if (ary.length) {
		return {li: ary}
	}
}

// TreeStructor
// 此处tree的算法与aotoo的tree算法有差异
export function tree(dataAry, props, fromTree){
	let menus = []
  idrecode = []
  treeProps = {
    itemClass: props.itemClass || props.class,
    itemStyle: props.itemStyle || props.style,
  }
  dataAry = dataAry.map(item=>{
    if (item && isObject(item)) {
      if (item.parent) {
        item.$parent = item.$parent || item.parent
        delete item.parent
      }
    }
    return item
  })
  dataAry.forEach( (item, ii) => {
    treeDeep = 1
    if (typeof item === 'number' || typeof item === 'string') {
      menus.push(item.toString())
    }
    if (item && typeof item == 'object' && !Array.isArray(item)) {
      if (item.idf && !item.$parent && idrecode.indexOf(item.idf) == -1) {
        var clsName = item.itemClass || item.class
        clsName = clsName ? clsName.indexOf('level0') == -1 ? clsName + ' level0' : clsName : 'level0'
        item.itemClass = clsName
        let nItem = subTree.call({fromTree}, item, dataAry, ii) 
        nItem.__deep = treeDeep
        menus.push(nItem)
      }
      if (!item.idf && !item.$parent) {
        menus.push(item)
      }
    }
    // if (Array.isArray(item)) {
    //   var _tmp = owerTree(item)
		// 	if (_tmp) {
    //     menus.push(_tmp)
		// 	}
		// }
  })
  return menus
}

export function listToTree(_list, fromTree) {
  let list = clone(_list)
  this.$flat = _list
  self = this
  if (isObject(list) && list.data) {
    list.data = tree.call(this, list.data, list, fromTree)
  }
  return list
}