//index.js
//获取应用实例
const app = getApp()
const Pager = require('../common/extpager')

Pager({
  data: {
    tag01: {title: 'tag01的标签演示', itemClass: 'tag tag01'},
    tag011: {title: ['tag01的标签演示', '测试'], itemClass: 'tag tag01'},
    tag012: {title: ['tag01的标签演示', '测试', '开心', '喜欢'], itemClass: 'tag tag01'},
    tag02: {title: 'tag02的标签演示', itemClass: 'tag tag02'},
    tag03: {title: ['tag03的标签演示', '好玩'], itemClass: 'tag tag03'},
    tag04: {title: ['tag04的标签演示', '好玩'], itemClass: 'tag tag04'},
    tag05: {title: 'tag05的标签演示', itemClass: 'tag tag05'},
    tag06: {title: 'tag06的标签演示', itemClass: 'tag tag06'},
    tag061: {title: ['tag06的标签演示', '分组'], itemClass: 'tag tag06'},
    tag062: {title: ['tag06的标签演示', '分组', '分组', '分组'], itemClass: 'tag tag06'},
    tag07: {title: 'tag07的标签演示', itemClass: 'tag tag07'},
    tag08: {title: 'tag08的标签演示', itemClass: 'tag tag08'},
  },
})
