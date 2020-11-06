<!--
 * @Author: 天天修改
 * @Date: 2019-12-18 10:17:43
 * @LastEditTime : 2019-12-19 12:01:15
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /xquery/README.md
 -->
微信号: aotoodemo

![demo](http://www.agzgz.com/myimgs/demo.jpg)  

# XQUERY

__[文档](http://www.agzgz.com)__  

小程序端更名为`queryUI`，在微信中搜索`queryUI`可以查看更多的DEMO  

本项目是一个精简小程序项目，包含丰富的小程序组件及其演示demo，不定期更新，欢迎关注并在github上点赞我们

`queryUI`是一套我们内部项目孵化而出的小程序核心库(基于原生小程序)，糅合了一些jQuery特性及一些方便好用的特性，用于简化小程序开发成本及帮助后期能更好的维护项目  

小程序社区： <https://developers.weixin.qq.com/community/personal/oCJUsw9JDs23M0Y9XuAMiTuUX214>  
gitee(码云): <https://gitee.com/webkixi/aotoo-xquery>

* 原生微信小程序  
* 动态模板构建
* 内置支持html、markdown

完整DEMO列表

* 多形态日历组件
* 通用型筛选列表
* form表单
* markdown/html组件
* 怎么弹都可以的弹窗组件
* 支持震动的评分组件
* 下拉菜单
* 双向slider
* 索引列表
* 腾讯地址定位  
* 水果老虎机
* 折叠面板
* 双栏分类导航(左右)
* 双栏分类导航(上下)
* 刮刮卡  
* 导航球
* 导航面板
* 俄罗斯大转盘
* 手势锁

## 如何使用  

clone或下载本项目，`queryUI`基于微信小程序的原生库，不影响小程序原生开发使用，引入核心库文件后就能方便的引入queryUI的组件  

> 本项目本身是一个完整的小程序示例demo，引入小程序开发工具中即可直接打开，或者导入下例核心文件及配置，即可以融入到已有项目中  

### 源码目录

    components 
        ├─ aotoo 核心代码必须有 ✔︎
        ├─ actionSide  弹窗组件
        ├─ form  表单组件
        ├─ calendar  日历组件
        ├─ markit  文档组件
        ├─ modules ✔︎  # 该目录下的文件为组件合集
        ├─ templates 模板 ✔︎
        │
       css  日历、文档、表单等样式
        │
       pages  基础示例
        │
      app.json  注册全局组件

### 核心目录/文件

融合项目中必须引入以下核心目录、文件  

    components 
      ├─ aotoo 核心代码必须有 ✔︎
      ├─ form  表单组件 ✔︎
      ├─ markit  文档组件 ✔︎
      ├─ modules ✔︎  # 该目录下的文件为组件合集，视需求选择
      ├─ templates 模板 ✔︎

在app.json中定义核心全局组件  

```json
"usingComponents": {
  "ui-item": "/components/aotoo/item/index",
  "ui-list": "/components/aotoo/list/index",
  "ui-tree": "/components/aotoo/tree/index",
  "ui-form": "/components/form/index",
  "ui-markit": "/components/markit/index"
}
```

核心文件内置支持  

1. markdown(全语法)
2. html
3. from表单
4. item
5. list
6. tree
7. img

且支持外挂组件， 方便扩展使用  
> 一套引入未压缩核心代码包大概为500k左右，后期考虑插件化可以大大降低小程序包容量

### Pager与Page的关系  

Demo代码中有大量Pager的相关使用，需要注意正确的使用方式  
Pager是queryUI对于Page的封装方法，该方法与Page一脉相承，使用逻辑，用法均保持一致，因此你可以使用Pager代替Page使用  
queryUI的组件需要在Pager的环境中才能生效

```js
const Pager = require('../../components/aotoo/core/index')
Pager({
  data: {},
  onLoad(){},
  onReady(){}
})
```

### 超级组件  

可以观察项目modules组件集合目录，该目录中存放各种组件库，可以看到组件的wxml结构非常简单，使用时模板方面的维护成本几乎为0，可以做到拿来即用
所有逻辑几乎都在JS部分完成，方便扩展、升级。  

#### 超级组件item

item是核心元组件，该组件支持输出非常丰富的结构, 组件结构支持递归item组件来生成复杂结构  

wxml

```html
<ui-item item="{{itemConfig}}" />
```

js  

```js
Pager({
  data: {  
    // item组件的基础配置
    itemConfig: {
      $$id: {String} // item组件实例化后查找id
      title: {String|Array|{Object}},  // 标题，标题组
      img: {String|Array|Object},  // 图片，图组
      itemClass: {String} // item样式  
      body: {Array}  // body子容器，item集合
      footer: {Array} // footer子容器，item集合
      dot: {Array} // dot子容器，item集合
      tap: {String|Function}  // bind:tap方法
      aim: {String|Function} // catch:tap方法
      longpress: {String|Function} // bind:longpress方法
      catchlongpress: {String|Function} // catch:longpress方法
    }
  }
})
```

#### 超级组件list

list是核心元组件，该组件基于item元组件构建而成，适用于列表类的场景使用，项目中的各种组件几乎都是基于list组件构建  

wxml  

```html
<ui-list list="{{listConfig}}" />
```

js

```js
Pager({
  data: {  
    // list组件的基础配置
    listConfig: {
      $$id: {String} // list组件实例化后查找id
      listClass: {String} // 列表样式  
      itemClass: {String} // 列表项样式  
      header: {Object} // item配置
      footer: {Object} // item配置
      data: {Array} // 列表项数据配置，item集合
      itemMethod: {Object} // 自动为列表项绑定方法，支持(tap, aim, longpress...)
      methods: {Object} // 设置list实例对象的内部方法
    }
  }
})
```

#### 超级组件tree

tree是核心元组件，该组件基于list组件构建而成，在扁平化的数据结构的基础上，能够输出层次化的结构
tree元组件配置如同list元组件  

wxml

```html
<ui-tree list="{{treeConfig}}" />
```

js

```js
Pager({
  data: {  
    // list组件的基础配置
    treeConfig: {
      $$id: {String} // list组件实例化后查找id
      listClass: {String} // 列表样式  
      itemClass: {String} // 列表项样式  
      header: {Object} // item配置
      footer: {Object} // item配置
      data: {Array} // 列表项数据配置，item集合
      itemMethod: {Object} // 自动为列表项绑定方法，支持(tap, aim, longpress...)
      methods: {Object} // 设置list实例对象的内部方法
    }
  }
})
```

### 内嵌组件  

内嵌组件不需要额外引入模板，直接嵌入在其他组件中使用的组件，内嵌组件基于寻址算法，会自动处理父子级的组件关系，比如子级使用父级定义的方法，或者\`Page\`中定义的方法
下列是常用的内嵌组件  

1. @item
2. @list
3. @tree
4. @url
5. @md
6. @html
7. @form

比如我们在`item组件`中需要引入一个`列表组件`  

wxml

```html
<ui-item item="{{itemConfig}}" />
```

```js
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
```

### 如何在Pager中查找组件实例并使用其API方法  

```js
Pager({
  data: {
    item: {/* item配置*/},  // $$id = 'abc'
    list: {/* list配置*/}  // $$id = 'xyz'
  }
  onReady(){
    let abc = this.getElementsById('#abc')
    abc.update({title: '新标题'})

    let xyz = this.getEelementsById('#xyz')
    xyz.forEach(item=>{
      // item.addclass/removeClass/hasClass/css/update... 等类jquery的API方法
    })

    this.find('.class-name').addClass('other-class-name') // 批量追加类名
  }
})
```

#### 随意支持，谢谢

![DEMO小程序](http://www.agzgz.com/imgs/wxzan.jpg)

#### 更多demo请关注小程序

![DEMO小程序](http://www.agzgz.com/imgs/xquery.png)
