/**
 * 作者： 天天修改
 * github: webkixi
 * 小程序的模板真是又长又臭
 */
const app = null //getApp()
const Core = require('../aotoo/core/index')
const lib = Core.lib
import {html, markdown} from './htmlparser'

Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
    addGlobalClass: true
  },
  properties: {
    dataSource: {
      type: Object|String,
    },
    textType: {
      type: String,
    }
  },
  data: {},
  behaviors: [Core.baseBehavior(app, 'markit')],
  lifetimes: {
    created: function() {
      this.$$is = 'markitem'
    },
    attached: function() { //节点树完成，可以用setData渲染节点，但无法操作节点
      let that = this
      let dataSource = this.properties.dataSource
      let textType = this.properties.textType || 'html'

      if (lib.isString(dataSource)) {
        dataSource = {
          content: dataSource, 
          type: textType
        }
      }

      // <ui-markit dataSource="{{content: '', type: '', itemClass: '', itemStyle: ''  }}" textType="html"/>
      if (lib.isObject(dataSource)) {
        let cnt = dataSource.content
        let type = dataSource.type || textType
        delete dataSource.content
        delete dataSource.type
        // dataSource.type = dataSource.type || textType
        if (type === 'html') {
          let props = dataSource
          this.html(cnt, props)
        }

        if (type === 'md' || type === 'markdown') {
          let props = dataSource
          this.md(cnt, props)
        }
      }
    }
  },
  methods: {
    reset(){
      this.setData({
        "$list.data": []
      })
    },
    md(content, param){
      const that = this
      this.reset()
      markdown(content, param).then(cnt => doneHtml.call(this, cnt, that))
    },

    html(content, param) {
      const that = this
      this.reset()
      html(content, param).then(cnt => doneHtml.call(this, cnt, that))
    }
  }
})

function doneHtml(cnt, context) {
  let that = context
  cnt = lib.reSetList.call(this, cnt)
  that.setData({ $list: cnt })
}