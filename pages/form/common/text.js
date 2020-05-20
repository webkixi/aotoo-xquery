// 文本框类表单

module.exports = function(params) {
  return {
    config: [
      {
        title: '文本框表单区域',
        input: [
          {id: 'aaa', type: 'text', title: '文本', placeholder: '数字输入键盘', bindblur: 'onBlur'},
        ]
      },

      {
        title: '数字表单区域',
        input: [
          {id: 'ccc', type: 'number', title: '整数型', placeholder: '数字输入键盘', bindblur: 'onBlur'},
          {id: 'ddd', type: 'idcard', title: '身份证', placeholder: '身份证输入键盘', bindblur: 'onBlur'},
          {id: 'eee', type: 'password', title: '密码串', maxlength: 30, placeholder: '隐藏的密码串', bindblur: 'onBlur'}
        ]
      },

      {
        title: 'TEXTAREA',
        input: [
          {id: 'aaa', type: 'textarea', title: '文本域', placeholder: '输入文字', bindblur: 'onBlur'},
        ]
      },
    ],

    methods: {
      onBlur(e) {
        console.log('=====3333', e);
      },
    }
  }
}