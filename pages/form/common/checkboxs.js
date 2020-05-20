module.exports = function(params) {
  return {
    config: [
      {
        title: '复选框',
        input: [
          {
            name: 'test_checkbox1',
            type: 'checkbox',
            title: '默认选项',
            value: ['1', '3'],
            values: ['1', '2', '3'],
            titles: ['篮球', '足球', '羽毛球'],
          },
          {
            name: 'test_checkbox2',
            type: 'checkbox',
            title: '提示信息',
            values: ['1', '2', '3'],
            titles: ['篮球', '足球', '羽毛球'],
            error: '出错信息',
            desc: '红字是出错提示，这里是提示信息'
          }
        ]
      },
    ],


    methods: {

    },
  }
}