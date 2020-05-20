module.exports = function (params) {
  return {
    config: [
      {
        title: 'TEXT下拉菜单',
        input: [
          {
            id: 'ddmenu',
            type: 'dropdown',
            placeholder: '请选择省份',
            title: '省份',
            titles: {
              data: [
                {title: '广东', value: '1001'},
                {title: '湖南', value: '1002', disabled: true},
                {title: '山东', value: '1003'},
                {title: '广西', value: '1004'},
                {title: '山西', value: '1005'},
              ]
            },
            bindchange: 'ddAction'
          }
        ]
      },

      {
        title: 'VIEW下拉菜单',
        input: [
          {
            id: 'ddmenuview',
            type: 'dropdown',
            placeholder: '请选择省份',
            mode: 'view',
            value: {title: '广东', value: '1001'},
            title: '省份',
            desc: '下拉菜单由view构成，支持更多样式',
            titles: {
              data: [
                {title: '广东', value: '1001'},
                {title: '湖南', value: '1002', disabled: true},
                {title: '山东', value: '1003'},
                {title: '广西', value: '1004'},
                {title: '山西', value: '1005'},
              ]
            },
            bindchange: 'ddAction'
          }
        ]
      },
    ],

    methods: {
      ddAction(e, param){
        console.log(e.param);
        console.log(param.value)
      }
    }
  }
}