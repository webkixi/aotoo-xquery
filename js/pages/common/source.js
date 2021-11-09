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
          title: '更多说明请浏览官方网站',
          img: [
            {
              src: '/images/agzgzlogo.jpg',
              mode: 'aspectFit'
            },
          ],
          enableMask: true,
          closeBtn: true,
          itemStyle: 'width: 90vw; height: 50vh; top: -100px; overflow: auto'
        })
      }
    }
  })
}

