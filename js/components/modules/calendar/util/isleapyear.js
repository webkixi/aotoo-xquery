// 工具方法 - start
// 1.为了获得每个月的日期有多少，我们需要判断 平年闰年[四年一闰，百年不闰，四百年再闰]
export function isLeapYear(year) {
  return (year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0);
}