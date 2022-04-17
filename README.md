<!--
 * @Author: 天天修改
 * @Date: 2019-12-18 10:17:43
 * @LastEditTime : 2019-12-19 12:01:15
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /xquery/README.md
 -->

# AOTOO-XQUERY

该项目是一个精简小程序项目，包含小程序一些好用的UI组件及其演示demo，不定期更新，欢迎关注并在github上点赞我们  

* 基于原生微信小程序  
* 动态模板构建
* 内置支持html、markdown

## [更多文档](http://www.agzgz.com)

## 小程序示例

### miaoui
![miaoui](js/images/miaoui.png)  

### 魔芋日历
![魔芋日历](js/images/miaoui.png)  

## 完整DEMO列表

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

1. 使用 [aotoo-hub](https://gitee.com/webkixi/aotoo-hub) 脚手架远程安装`queryui`(基于webpack编译)
2. clone本项目，使用微信小程序开发工具打开
3. 引入核心源码在其他项目中使用，查看下例说明

### 源码目录

```bash
css         日历、文档、表单等样式
pages       基础示例
app.json    注册全局组件
components 
    ├─ aotoo 核心代码必须有 ✔︎
    ├─ actionSide  弹窗组件
    ├─ form  表单组件
    ├─ calendar  日历组件
    ├─ markit  文档组件
    ├─ modules ✔︎  # 该目录下的文件为组件合集
    ├─ templates 模板 ✔︎
```

### 核心目录/文件

融合项目中必须引入以下核心目录、文件  

```bash
components 
    ├─ aotoo 核心代码必须有 ✔︎
    ├─ markit  文档组件 ✔︎
    ├─ templates 模板 ✔︎
```

必须在app.json中定义核心全局组件  

```json
"usingComponents": {
  "ui-item": "/components/aotoo/item/index",
  "ui-list": "/components/aotoo/list/index",
  "ui-tree": "/components/aotoo/tree/index",
  "ui-markit": "/components/markit/index"
}
```

### 内置组件

1. markdown
2. html
3. item
4. list
5. tree
6. img

### 内嵌组件  

内嵌组件可以在配置中方便插入其他组件，方便构建复杂的结构，所有内置组件均可作为内嵌组件。也可以自定义内嵌组件

1. @item
2. @list
3. @tree
4. @url
5. @md
6. @html

**item组件中嵌入列表组件**  

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

/*
wxml模板
<ui-item item="{{itemConfig}}" />
*/
```

**item组件中嵌入markdown组件**  

```js
Pager({
  data: {
    itemConfig: {
      title: '列表标题',
      "@md": {
        content: `...`
      }
    }
  }
})

/*
wxml模板
<ui-item item="{{itemConfig}}" />
*/
```

#### 随意支持，谢谢

![DEMO小程序](http://www.agzgz.com/imgs/wxzan.jpg)
