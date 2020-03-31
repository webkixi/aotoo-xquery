/**
 * 源码: https://github.com/webkixi/aotoo-xquery
 */
const Pager = require('../../components/aotoo/core/index')

const vtcfg = {
  methods: {
    ratingChecked(e, param, inst) {
      console.log(e);
    }
  },
  data: [{
      itemClass: 'input-rating-list',
      title: '评分表单',
      input: {
        id: 'ratingit',
        title: '服务态度',
        type: 'rating',
        max: 5,
        tap: 'ratingChecked',
      }
    },
    {
      itemClass: 'input-rating-list',
      title: '评分表单',
      input: {
        title: '服务态度',
        id: 'ratingitaaa',
        type: 'rating',
        max: 7,
        tap: 'ratingChecked'
      }
    }
  ]
}

Pager({
  data: {
    voteConfig: vtcfg,
  }
})
