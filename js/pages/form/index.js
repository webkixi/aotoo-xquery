//index.js
//获取应用实例
const app = getApp()
const Pager = require('../../components/aotoo/core/index')

const formAsset = {
  text: require('./common/text')(),
  dropdown: require('./common/dropdown')(),
  other: require('./common/other')(),
  checkboxs: require('./common/checkboxs')(),
  radiobox: require('./common/radiobox')(),
  slider: require('./common/slider')(),
  pickers: require('./common/pickers')(),
}

Pager({
  data: {
    formConfig: null,
  },

  onLoad(){
    const whichForm = 'text'
    let dataSet = null
    let mthSet = null
    switch (whichForm) {
      case 'text':
        dataSet = formAsset.text.config
        mthSet = formAsset.text.methods
        break;

      case 'dropdown':
        dataSet = formAsset.dropdown.config
        mthSet = formAsset.dropdown.methods
        break;
        
      case 'other':
        dataSet = formAsset.other.config
        mthSet = formAsset.other.methods
        break;

      case 'checkboxs':
        dataSet = formAsset.checkboxs.config
        mthSet = formAsset.checkboxs.methods
        break;

      case 'radiobox':
        dataSet = formAsset.radiobox.config
        mthSet = formAsset.radiobox.methods
        break;

      case 'slider':
        dataSet = formAsset.slider.config
        mthSet = formAsset.slider.methods
        break;

      case 'pickers':
        dataSet = formAsset.pickers.config
        mthSet = formAsset.pickers.methods
        break;
    
      default:
        dataSet = formAsset.text.config
        mthSet = formAsset.text.methods
        break;
    }

    this.setData({
      formConfig: {
        $$id: 'myForm',
        formStyle: 'width: 90vw;',
        data: dataSet,
        methods: mthSet
      }
    })
  },

  onReady(){
    const form = this.getElementsById('myForm')
    console.log(form);
  }
})
