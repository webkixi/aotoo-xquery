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
    img: {mode: 'heightFix', src: 'http://www.agzgz.com/imgs/matemob.jpg' },
    title: 'HUAWEI nova 7 pro',
    parent: 'mate'
  }, 
  {
    img: {mode: 'heightFix', src: 'http://www.agzgz.com/imgs/matemob.jpg' },
    title: 'HUAWEI nova 7 pro',
    parent: 'mate'
  }, 
  {
    img: {mode: 'heightFix', src: 'http://www.agzgz.com/imgs/matemob.jpg' },
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
    img: {mode: 'heightFix', src: 'http://www.agzgz.com/imgs/matebook.jpg' },
    title: 'HUAWEI nova 7 pro',
    parent: 'matebook'
  }, 
  {
    img: {mode: 'heightFix', src: 'http://www.agzgz.com/imgs/matebook.jpg' },
    title: 'HUAWEI nova 7 pro',
    parent: 'matebook'
  }, 
  {
    img: {mode: 'heightFix', src: 'http://www.agzgz.com/imgs/matebook.jpg' },
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

export const item2 = {
  title: '视频',
  id: 'board-2',
  dot: [
    {img: {src: 'https://res.vmallres.com/pimages/pages/mobile/frontCategory/80987430849513478908.jpg', mode: 'heightFix', itemStyle:'width: 100%; height: 73px; margin-top: 10px;'}},
    productList()
  ]
}