// 工具方法 - end
let weekStr = '日一二三四五六';
// let weekArr = weekStr.split('').map(item => '星期' + item);
let weekArr = weekStr.split('').map(item => '' + item);       //需要扩展

// 星期抬头
export function weeksTils(params) {
  let weeks = weekArr.map(item => ({title: item}) )
  return {
    data: weeks,
    listClass: 'calendar-tils',
    itemClass: 'calendar-tils-item'
  }
}