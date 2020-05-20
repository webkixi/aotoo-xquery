module.exports = function(params) {
  return {
    config: [
      {
        title: 'RADIO',
        input: [
          {
            name: 'test_radio',
            type: 'radio',
            title: '请选择',
            value: '3',
            values: ['1','2','3','4'],
            titles: ['篮球', '足球', '羽毛球', '乒乓球'],
          },
          {
            name: 'test_radio1',
            type: 'radio',
            title: '请选择',
            value: '2',
            values: ['1', '2', '3', '4'],
            titles: ['篮球', '足球', '羽毛球', '乒乓球'],
            error: '出错信息',
            desc: '红字是出错提示，这里是提示信息'
          },
        ]
      },
    ],
    methods: {},
  }
}