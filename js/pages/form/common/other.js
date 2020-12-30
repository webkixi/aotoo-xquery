module.exports = function(params) {
  return {
    config: [
      {
        title: 'SWITCH',
        input: [
          { id: 'test_switch1', type: 'switch', title: '切换按钮', bindchange: 'switchAction' },
          { id: 'test_switch2', type: 'switch', title: '切换按钮', value: true, color: '#4b9afc', bindchange: 'switchAction' },
          { id: 'test_switch3', type: 'switch', title: '切换按钮', bindchange: 'switchAction' },
          { id: 'test_switch4', type: 'switch', title: '设置内容', bindchange: 'switchAction', itemClass: 'switch-sm' },
        ]
      },
      {
        title: 'SLIDER',
        input: [
          { 
            id: 'test_slider',
            type: 'slider',
            value: 50,
          },
        ]
      }
    ],

    methods: {
      switchAction(e, param, inst) {
        console.log(e);
        // let currentTarget = e.currentTarget
        // let detail = e.detail
        // let id = currentTarget.id
        // if (detail.value) {
        //   if (id === 'test_switch1') {
        //     inst.value('test_text', 'test_switch1 value')
        //   }
        //   if (id === 'test_switch2') {
        //     inst.value('test_text', 'test_switch2 value')
        //   }
        //   if (id === 'test_switch3') {
        //     inst.value('test_text', 'test_switch3 value')
        //   }
        //   if (id === 'test_switch4') {
        //     inst.value('test_text', 'test_switch4 value')
        //   }
        // } else {
        //   inst.empty('test_text')
        // }
      }
    }
  }
}