module.exports = function(params) {
  return {
    methods: {
    },
    config: [
      {
        title: '滑动块',
        input: {
          title: '选择',
          id: 'test_slider',
          type: 'slider',
          value: 50,
          "show-value": true,
          "block-size": 28
        }
      },
    ]
  }
}