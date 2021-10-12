//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')
let source = require('../common/source')

Pager({
  data: {
    htmlConfig: {
      listClass: 'card-it',
      content: `
## 关于本项目    
本项目使用 queryui 开发，queryui 是我们基于小程序原生开发的核心库,UI库，可高效的开发各种组件，本项目作为示例使用，会不定期更新  

## 免费/有偿组件  
首页灰色按钮为开源示例项目，源码在\`github/gitee\`的\`aotoo-xquery\`项目中，蓝色按钮源码需要支持我们获得\`(以星巴克大杯卡布奇洛价格(￥30)为单位)\`。联系VX: kkndyyralf

## 详细文档  
访问 \`http://www.agzgz.com/minip\` 查看详细文档及使用说明

## 如何引入queryUI  
\`queryui\`基于微信小程序的原生库，不影响小程序原生开发使用，引入核心库文件后就能方便的引入queryUI的组件  

### 方式一
在 aotoo-hub 环境中使用远程方式安装、搭建 queryui 的使用环境(webpack环境)，查看 agzgz.com 了解详细

### 方式二
下载或者克隆github/gitee项目，使用小程序开发者工具打开  

### 方式三，引入核心目录/文件   
    components 
      ├─ aotoo 核心代码必须有 ✔︎
      ├─ markit  文档组件 ✔︎
      ├─ templates 模板 ✔︎  

#### 必须在app.json中定义全局组件  

    "usingComponents": {
      "ui-item": "/components/aotoo/item/index",
      "ui-list": "/components/aotoo/list/index",
      "ui-tree": "/components/aotoo/tree/index",
      "ui-markit": "/components/markit/index"
    }

`
    },
  }
})
