//index.js
//获取应用实例
const app = getApp()
const Pager = require('../common/extpager')
const lib = Pager.lib

Pager({
  data: {
    targetConfig0: {
      listClass: 'demo-list',
      itemClass: 'demo-list-item noevent',
      header: {title: '简单的list列表', itemClass: 'cat'},
      data: [
        {title: ['接收关闭', '接收']},
        {title: '仅限联系人'},
        {title: ['所有人', '✓']},
      ],
    },

    // 通过methods属性定义list组件内响应方法
    targetConfig: {
      listClass: 'demo-list',
      itemClass: 'demo-list-item',
      header: {title: 'list组件监听子项事件', itemClass: 'cat'},
      data: [
        {title: '关于本机', tap: 'onTap?id=1'},
        {title: '软件更新', tap: 'onTap?id=2'},
      ],
      methods: {
        /**
         * 
         * @param {*} e 原生event对象
         * @param {*} param 事件的query参数
         * @param {*} inst 操作对象的实例
         */
        onTap(e, param, inst){
          let id = param.id
          Pager.alert('bind:tap选中的id:'+id)
        }
      }
    },


    // 直接定义子项响应方法
    targetConfig1: {
      listClass: 'demo-list',
      itemClass: 'demo-list-item',
      header: {title: '直接定义子项事件', itemClass: 'cat'},
      data: [
        {title: '隔空投送', tap(e, param, inst){
          Pager.alert('选中了隔空投送')
        }},
        {title: '隔空播放与接力', tap(e, param, inst){
          Pager.alert('选中了隔空播放与接力')
        }},
        {title: 'CarPlay车载', tap(e, param, inst){
          Pager.alert('选中了CarPlay车载')
        }},
      ]
    },

    // page环境中的响应方法
    targetConfig2: {
      listClass: 'demo-list',
      itemClass: 'demo-list-item',
      header: {title: 'Page中监听子项事件', itemClass: 'cat'},
      data: [
        {title: '日期与时间', aim: 'onAim?id=1'}, // aim为catch:tap的别名
        {title: '键盘', aim: 'onAim?id=2'},
        {title: '字体', aim: 'onAim?id=3'},
        {title: '语言与地区', aim: 'onAim?id=4'},
        {title: '词典', aim: 'onAim?id=5'},
      ]
    },

    // 使用itemMethod为所有子项定义响应方法
    targetConfig3: {
      listClass: 'demo-list',
      itemClass: 'demo-list-item',
      header: {title: '批量定义子项事件方法', itemClass: 'cat'},
      data: [
        {title: '歌曲', id: '1'},
        {title: '视频', id: '2'},
        {title: '照片', id: '3'},
      ],
      itemMethod: {
        aim(e, param, inst){
          let data = inst.getData()
          let id = data.id
          let title = data.title
          if (!lib.isArray(title)) {
            let newTitle = [].concat(title)
            switch (id) {
              case '1':
                newTitle.push('33')
                break;
              case '2':
                newTitle.push('27')
                break;
              case '3':
                newTitle.push('100')
                break;
            }
            inst.update({title: newTitle})
          }
        }
      }
    },
  },
  
  onLoad(param) {
    let pageTitle = param.pageTitle
    if (pageTitle) {
      wx.setNavigationBarTitle({
        title: pageTitle
      })
    }
  },
  
  // 更新监听对象并修改title
  onAim(e, param, inst){
    let id = param.id
    let data = inst.getData()
    let title = data.title
    let newTitle = title.replace('✓', '') + '✓'
    inst.update({title: newTitle})
  }
})
