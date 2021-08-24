//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
const lib = Pager.lib
import createCalendar from '../../components/modules/calendar/index'



Pager({
  // 左滑菜单列表
  // data: {
  //   demosConfig: {
  //     data: [],
  //     // data: [
  //     //   {
  //     //     title: '000',
  //     //     touchoption: {
  //     //       slip: {
  //     //         slipLeft: [
  //     //           {title: 'haha', aim: 'xxx'},
  //     //           {title: '你好'}
  //     //         ],
  //     //       }
  //     //     },
  //     //   },
  //     //   {title: '111'},
  //     //   {title: '222'},
  //     //   {title: '333'},
  //     //   {title: '444'},
  //     //   {title: '555'},
  //     //   {title: '666'},
  //     //   {title: '777'},
  //     //   {title: '888'},
  //     //   {title: '999'},
  //     //   {title: 'aaa'},
  //     //   {title: 'bbb'},
  //     //   {title: 'ccc'},
  //     //   {title: 'ddd'},
  //     //   {title: 'eee'},
  //     //   {title: 'fff'},
  //     //   {title: 'ggg'},
  //     //   {title: 'hhh'},
  //     //   {title: 'iii'},
  //     //   {title: 'jjj'},
  //     //   {title: 'kkk'},
  //     //   {title: 'lll'},
  //     //   {title: 'mmm'},
  //     //   {title: 'nnn'},
  //     //   {title: 'ooo'},
  //     //   {title: 'ppp'},
  //     //   {title: 'qqq'},
  //     //   {title: 'rrr'},
  //     //   {title: 'sss'},
  //     //   {title: 'ttt'},
  //     // ],
  //     // itemMethod: {
  //     //   touchoption: {
  //     //     slip: {
  //     //       autoDelete: false,
  //     //       slipLeft: [
  //     //         {title: 'haha', aim: 'xxx'},
  //     //         {title: '你好'}
  //     //       ],
  //     //     }
  //     //   },
  //     // },
  //     methods: {
  //       xxx(e, param, inst){
  //         console.log('===== ooo', param);
  //       }
  //     },
  //     ready(){
  //       this.update({
  //         data: [
  //           {
  //             title: '嘿嘿',
  //             touchoption: {
  //               slip: {
  //                 slipLeft: [
  //                   {title: '哈哈哈'}
  //                 ]
  //               }
  //             }
  //           }
  //         ]
  //       })
  //     },
  //     listClass: 'slip-list', 
  //     itemClass: 'slip-item'
  //   }
  // }

  // 无限swiper
  // data: {
  //   demosConfig: {
  //     data: [
  //       {title: '000'},
  //       {title: '111'},
  //       {title: '222'},
  //       {title: '333'},
  //       {title: '444'},
  //       {title: '555'},
  //       {title: '666'},
  //       {title: '777'},
  //       {title: '888'},
  //       // {title: '999'},
  //       // {title: 'aaa'},
  //       // {title: 'bbb'},
  //       // {title: 'ccc'},
  //       // {title: 'ddd'},
  //       // {title: 'eee'},
  //       // {title: 'fff'},
  //       // {title: 'ggg'},
  //       // {title: 'hhh'},
  //       // {title: 'iii'},
  //       // {title: 'jjj'},
  //       // {title: 'kkk'},
  //       // {title: 'lll'},
  //       // {title: 'mmm'},
  //       // {title: 'nnn'},
  //       // {title: 'ooo'},
  //       // {title: 'ppp'},
  //       // {title: 'qqq'},
  //       // {title: 'rrr'},
  //       // {title: 'sss'},
  //       // {title: 'ttt'},
  //     ],
  //     type: {
  //       current: 0,
  //       is: 'swiper-loop',
  //       appendItems(util){
  //         util.add([
  //           {title: 'xxx'},
  //           {title: 'yyy'},
  //           {title: 'zzz'},
  //         ])
  //       },
  //       prependItems(util){
  //         util.add([
  //           {title: 'ooo'},
  //           {title: 'ppp'},
  //           {title: 'qqq'},
  //         ])
  //       }
  //     },
  //     listClass: 'swiper-list', 
  //     itemClass: 'swiper-item'
  //   }
  // }


  // mode 1
  // data: {
  //   demosConfig: createCalendar({
  //     // date(param){
  //     //   if (param.solarDate.timestr === '2021-7-10') {
  //     //     param.body = [{title: '你好'}]
  //     //   }
  //     //   return param
  //     // },
  //     value: ['2021-11-5', '2021-11-8'],
  //     tap(e, param, inst){
  //       console.log(param);
  //     }, 
  //     type: 'range',
  //     rangeTip: [
  //       {footer: {title: '入住', ready(){
  //         const parent = this.parent()
  //         parent.update({body: ['哈哈哈']})
  //       }}}, 
  //       {footer: {title: '离店'}}
  //     ],
  //     mode: 1,
  //     total: 180,
  //     // data: [
  //     //   {date: '2021-7-3', content: {}},
  //     //   {date: '2021-8-3', content: {}},
  //     // ]
  //   })
  // }

  // 万年历
  data: {
    demosConfig: createCalendar({
      mode: 2,
      type: 'range',
      lunar: true,
      festival: true,
      tap(e, param, inst){
        // console.log(param);
      }
    })
  }
})