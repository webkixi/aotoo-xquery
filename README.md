<!--
 * @Author: 天天修改
 * @Date: 2019-12-18 10:17:43
 * @LastEditTime : 2019-12-19 12:01:15
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /xquery/README.md
 -->
# XQUERY
xquery是一个开发库(小程序原生)，剥离自原项目aotoo-hub，xquery基于小程序类似于jquery基于web，可以方便的融入到现有的小程序项目中  

小程序社区： https://developers.weixin.qq.com/community/personal/oCJUsw9JDs23M0Y9XuAMiTuUX214  
更多说明及demo代码片段  

xquery包含以下这些特性  

* 组件选取
* 嵌套结构
* 事件函数封装
* 钩子方法
* 支持数据过期机制    
* lru缓存机制  
* markdown支持
* html支持
* 方便扩展内置/外部插件 

> xquery源码中有`.styl`类型的样式文件，使用stylus命令行编译  

## DEMO列表  
demo图片均有效，github图片需要翻墙才能查看  
![demo](http://www.agzgz.com/myimgs/demo.jpg)  

本项目小程序包含以下DEMO

* markdown
* html
* 地址定位  
* 水果老虎机
* 折叠面板
* 双栏分类导航(左右)
* 双栏分类导航(上下)
* 刮刮卡  
* 弹窗
* 导航球
。。。


## 如何使用  
clone或下载本项目  
* 本项目本身是一个完整的小程序示例demo，引入小程序开发工具中即可直接打开  
* 或者导入下例核心文件及配置，可以融入到已有项目中  

### 源码目录
    components 
        ├─ aotoo 核心代码必须有 ✔︎
        ├─ actionSide  弹窗组件
        ├─ form  表单组件
        ├─ calendar  日历组件
        ├─ markit  文档组件
        ├─ templates 模板 ✔︎
        │
       css  日历、文档、表单等样式
        │
       pages  基础示例
        │
      app.json  注册全局组件
 

app.json中定义全局组件
 ```js
  "usingComponents": {
    "ui-item": "/components/aotoo/item/index",   // 基础item组件 ✔︎
    "ui-list": "/components/aotoo/list/index",   // 基础list组件 ✔︎
    "ui-tree": "/components/aotoo/tree/index",   // 基础tree组件 ✔︎
    "ui-pop": "/components/actionSide/index",    // 弹窗组件
    "ui-form": "/components/form/index",         // 表单组件
    "ui-markit": "/components/markit/index",     // 文档组件，支持html/markdown
    "ui-calendar": "/components/calendar/index"  // 日历组件
  }
 ```

> 勾选文件必须有，属于核心文件，组件可以按照需求增减    

#### 小程序放置目录
![](./css/structor.jpeg)


## 文件及目录说明  

#### components
基础目录  

#### components/aotoo
核心代码目录  

#### components/actionSide
弹窗组件  

#### components/calendar
日历组件  

#### components/form
表单组件  

#### components/markit
markdown/html组件  

#### css
一些组件的样式库，需要在小程序项目中引入  

#### pages
基础示例代码  

#### app.json
文件中`usingComponents`字段必须设置，否则无法使用(可以根据需求删减)  

## DEMO小程序 

![DEMO小程序](http://www.agzgz.com/myimgs/xquery.png)