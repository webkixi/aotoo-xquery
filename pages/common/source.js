let stickyBar = require('../../components/modules/stickybar')
module.exports = {
  readme: {
    $$id: 'pop-readme',
    itemClass: 'pop-readme'
  },

  codeButton: stickyBar({
    title: '更多demo及说明文档',
    type: 'bottom',
    itemClass: 'code-button',
    tap: 'onTap',
    methods: {
      onTap(e, param, inst) {
        let $pop = this.find('pop-readme')
        $pop.pop({
          title: '查看说明请关注小程序',
          img: [
            {
              src: '/images/wxzan.jpg',
              itemStyle: 'margin-top: 20px',
              mode: 'scaleToFill'
            },
            {
              src: '/images/xquery.png',
              itemStyle: 'margin-top: 20px',
              mode: 'scaleToFill'
            },
            
          ],
          enableMask: true,
          closeBtn: true,
          itemStyle: 'width: 90vw; height: 70vh; top: -100px; overflow: auto'
        })
      }
    }
  })
}

