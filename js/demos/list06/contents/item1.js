const novoList = [
  {title: 'HUAWEI nove 系列', idf: 'novo'},  // 父级
  {
    img: {mode: 'heightFix', src: '/images/huawei.jpg'},
    title: 'HUAWEI nova 7 pro',
    parent: 'novo'
  },
  {
    img: {mode: 'heightFix', src: '/images/huawei.jpg'},
    title: 'HUAWEI nova 7 pro',
    parent: 'novo'
  },
  {
    img: {mode: 'heightFix', src: '/images/huawei.jpg'},
    title: 'HUAWEI nova 7 pro',
    parent: 'novo'
  },
  {
    img: {mode: 'heightFix', src: '/images/huawei.jpg'},
    title: 'HUAWEI nova 7 pro',
    parent: 'novo'
  },
  {
    img: {mode: 'heightFix', src: '/images/huawei.jpg'},
    title: 'HUAWEI nova 7 pro',
    parent: 'novo'
  },
  {
    img: {mode: 'heightFix', src: '/images/huawei.jpg'},
    title: 'HUAWEI nova 7 pro',
    parent: 'novo'
  },
  {
    img: {mode: 'heightFix', src: '/images/huawei.jpg'},
    title: 'HUAWEI nova 7 pro',
    parent: 'novo'
  },
  {
    img: {mode: 'heightFix', src: '/images/huawei.jpg'},
    title: 'HUAWEI nova 7 pro',
    parent: 'novo'
  },
  {
    img: {mode: 'heightFix', src: '/images/huawei.jpg'},
    title: 'HUAWEI nova 7 pro',
    parent: 'novo'
  },
]

const mateList = [
  {
    title: 'HUAWEI mate 系列手机',
    idf: 'mate'
  }, // 父级
  {
    img: {mode: 'heightFix', src: 'https://res0.vmallres.com/pimages//product/6901443353125/428_428_843D9A399BDE267826C8BE3F0F68A903E015089FCD5087D9mp.png' },
    title: 'HUAWEI nova 7 pro',
    parent: 'mate'
  }, 
  {
    img: {mode: 'heightFix', src: 'https://res0.vmallres.com/pimages//product/6901443353125/428_428_843D9A399BDE267826C8BE3F0F68A903E015089FCD5087D9mp.png' },
    title: 'HUAWEI nova 7 pro',
    parent: 'mate'
  }, 
  {
    img: {mode: 'heightFix', src: 'https://res0.vmallres.com/pimages//product/6901443353125/428_428_843D9A399BDE267826C8BE3F0F68A903E015089FCD5087D9mp.png' },
    title: 'HUAWEI nova 7 pro',
    parent: 'mate'
  }
]

const mbookList = [
  {
    title: 'HUAWEI mate 系列笔记本',
    idf: 'matebook'
  }, // 父级
  {
    img: {mode: 'heightFix', src: 'https://res1.vmallres.com/pimages//product/6901443407170/428_428_94C37897A70207E984618A91DFB43F500D0A40471D69CF54mp.png' },
    title: 'HUAWEI nova 7 pro',
    parent: 'matebook'
  }, 
  {
    img: {mode: 'heightFix', src: 'https://res1.vmallres.com/pimages//product/6901443407170/428_428_94C37897A70207E984618A91DFB43F500D0A40471D69CF54mp.png' },
    title: 'HUAWEI nova 7 pro',
    parent: 'matebook'
  }, 
  {
    img: {mode: 'heightFix', src: 'https://res1.vmallres.com/pimages//product/6901443407170/428_428_94C37897A70207E984618A91DFB43F500D0A40471D69CF54mp.png' },
    title: 'HUAWEI nova 7 pro',
    parent: 'matebook'
  }
]

function productList() {
  return {
    "@tree": {
      containerClass: 'block-list',
      itemClass: 'block-item',
      data: [
        ...novoList,
        ...mateList,
        ...mbookList
      ]
    }
  }
}

export const item1 = {
  title: '要闻',
  id: 'board-1',
  dot: [
    {img: {src: '/images/banner.jpg', itemStyle:'width: 100%; margin-top: 10px;'}},
    productList()
  ]
}