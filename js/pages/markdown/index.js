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
本项目是一个精简小程序项目，专为演示demo使用，我们会不定期更新，欢迎关注并在github上点赞我们  

> github中搜索 aotoo-xquery  

## 如何引入queryUI  
\`queryUI\`基于微信小程序的原生库，不影响小程序原生开发使用，引入核心库文件后就能方便的引入queryUI的组件  

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

### 内置组件  
核心文件包含的默认组件，内置组件具有很强的扩展性  

1. markdown
2. html
4. item
5. list
6. tree
7. img


### 内嵌组件  
有些结构非常复杂，需要多个组件组合完成。内嵌组件支持在组件中嵌入使用(通过配置)。默认的内置组件均可作为内嵌组件。我们也可以自定义内嵌组件

1. @item
2. @list
3. @tree
4. @url
5. @md
6. @html

看下面的例子

#### item中嵌入list组件

    Pager({
      data: {
        itemConfig: {
          title: '列表标题',
          "@list": {
            listClass: 'list-class-name'
            data: [...]
          }
        }
      }
    })


#### item中嵌入markdown文档

    Pager({
      data: {
        itemConfig: {
          title: '列表标题',
          "@md": {
            content: '...'
          }
        }
      }
    })


### 更多文档请参考  

## http://www.agzgz.com
`
    },
  }
})
