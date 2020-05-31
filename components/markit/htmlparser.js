const htmlparser2 = require("./hp2");
const marked = require('./marked')
const hl = require('./hl')
const langJs = require('./hl/js')
const langBash = require('./hl/bash')
const langJson = require('./hl/json')
const langHtml = require('./hl/html')
const langCss = require('./hl/css')
hl.registerLanguage('bash', langBash)
hl.registerLanguage('json', langJson)
hl.registerLanguage('html', langHtml)
hl.registerLanguage('css', langCss)
hl.registerLanguage('javascript', langJs)
// hl.registerLanguage('js', langJs)

function htmlEncodeByRegExp(str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/ /g, "&nbsp;");
    s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    return s;
}

function htmlDecodeByRegExp(str) {
  var s = "";
  if (str.length == 0) return "";
  s = str.replace(/&amp;/g, "&");
  s = s.replace(/&lt;/g, "<");
  s = s.replace(/&gt;/g, ">");
  s = s.replace(/&nbsp;/g, " ");
  s = s.replace(/&#39;/g, "\'");
  s = s.replace(/&quot;/g, "\"");
  return s;
}

class htmlparser {
  constructor(){
    const that =this
    this.stack = []
    this.tags = []
    this._html = []

    this._span = false
    this._code = false
    this._codes = []
    this._tmptext = ''
    this._isbr = false
    this._open = false

    this.parser = new htmlparser2.Parser({
      onopentag: that.onopentag.bind(that),
      ontext: that.ontext.bind(that),
      onclosetag: that.onclosetag.bind(that)
    }, {
      decodeEntities: false,
      recognizeSelfClosing: true
    })
  }

  onopentag(name, attribs) {
    let attr = {};
    let hasAttr = false;
    let stack = this.stack
    let tags = this.tags
    let _html = this._html
    let options = this.options

    this._open = true

    if (name === 'code') {
      this._code = true
    }

    if (name === "span" || name === 'a') {
      this._span = true
    }

    const events = ['mode', 'tap', 'aim', 'catchtap', 'longpress', 'longtap', 'catchlongtap', 'catchlongpress']
    if (attribs) {
      Object.keys(attribs).forEach(ky => {
        if (ky.indexOf("data-") === 0) {
          hasAttr = true;
          let _key = ky.replace("data-", "");
          attr[_key] = attribs[ky];
          // delete attribs[ky];
        }
        else 
        if (events.indexOf(ky)>-1) {
          // attribs[ky] = attribs[ky]
        }
        else
        if (ky === "class") {
          attribs["itemClass"] = attribs[ky];
          // delete attribs[ky];
        }
        else
        if (ky === "style") {
          attribs["itemStyle"] = attribs[ky];
          // delete attribs[ky];
        }
        else
        if (ky === 'href') {
          attribs["url"] = attribs[ky];
        }
        else
        if (ky === 'src') {
          // attribs["src"] = attribs[ky];
        }
        else {
          if (ky === 'align' && ['td', 'th'].indexOf(name)>-1) {
            let alignStr = attribs[ky]
            let itStyle = ''
            switch (alignStr) {
              case 'center':
                itStyle = ';justify-content: center;'
                break;
              case 'left':
                itStyle = ';justify-content: flex-start;'
                break;
              case 'right':
                itStyle = ';justify-content: flex-end;'
                break;
            }
            if (attribs["itemStyle"]) {
              attribs["itemStyle"] = attribs["itemStyle"] + itStyle;
            } else {
              attribs["itemStyle"] = itStyle
            }
          }
          delete attribs[ky];
        }
      });
    }

    let tag = attribs || {};
    if (hasAttr) tag.attr = attr;
    tag.itemClass = tag.itemClass ? name + " " + tag.itemClass : name;

    if (name === "img") {
      let $imgOption = options.img
      attribs = Object.assign({}, $imgOption, attribs)
      tag = {img: attribs}

      // tag.img = attribs.src || "";
      // delete tag.src;
    }
    
    if (!this._code || name === 'code') {
      stack.push(name);
      tags.push(tag);
    } else {
      if (this._code) {
        tag.decode = true
        tag.space = true
        tag.text = ' '
        this._codes.push(tag)
      }
    }
  }

  ontext(text){
    let stack = this.stack
    let tags = this.tags
    let _html = this._html
    let _codes = this._codes
    
    if (this._code) {
      text = text.replace(/ /g, '&nbsp;')
      if (this._open && _codes.length) {
        let curTag = _codes[_codes.length - 1]
        curTag.text = text || ''
      } else {
        _codes.push({text, decode: true, space: true, itemClass: 'code-zoom'})
      }
    }
    else {
      text = text.trim()
      if (tags.length && /[\w\u4e00-\u9fa5]/g.test(text)) {
        let curTag = tags[tags.length - 1];
        if (curTag.title) {
          curTag.dot = (curTag.dot||[]).concat({text})
        } else {
          curTag.title = text;
        }
      } else {
        if (text) {
          _html.push({ title: text });
        }
      }
    }
  }

  onclosetag(tagname) {
    let stack = this.stack
    let tags = this.tags
    let _html = this._html

    if (!this._code || tagname === 'code') {
      stack.pop();
      let curTag = tags.pop();
      if (tagname === 'code' && this._codes.length) {
        curTag.dot = (curTag.dot||[]).concat(this._codes)
      }

      if (tagname === 'br') {
        curTag.text = ' '
        curTag.itemStyle = 'display: block;'
      }

      if (tagname === 'span') {
        curTag.text = curTag.title
        delete curTag.title
      }
      
      if (stack.length) {
        let last = tags[tags.length - 1];
        let dot = last.dot || [];
        dot.push(curTag);
        last.dot = dot;
      } else {
        _html.push(curTag);
      }
    }

    this._open = false
    if (tagname === 'span') this._span = false
    if (tagname === 'code') {
      this._code = false
      this._codes = []
    }
  }

  html(content, param={}, fromMd){
    let dft = {
      img: {mode: 'scaleToFill'},
      url: {}
    }
    let opts = {}
    let options = param.options||{}
    opts.img = Object.assign({}, dft.img, options.img)
    opts.url = Object.assign({}, dft.url, options.url)
    this.options = Object.assign({}, dft, opts)
    this._codes = []
    this._html = []
    let stack = this.stack
    let tags = this.tags
    let _html = this._html
    let parser = this.parser
    let that = this
    content = htmlDecodeByRegExp(content)
    return new Promise((resolve, reject)=>{
      parser.onend = function() {
        // console.log(that._html);
        resolve({...param, data: that._html})
      }
      parser.write(content)
      parser.end()
    })
  }

  md(content, param={}){
    param.listClass = 'markdown-body ' + (param.listClass||param.class||'')
    marked.setOptions({
      sanitize: true,
      highlight: function (code) {
        let val = hl.highlightAuto(code).value
        return val
      }
    })
    content = marked(content)
    return this.html(content, param, true)
  }
}

let tmpInst
export function html(content, param) {
  if (!tmpInst)  tmpInst = new htmlparser()
  return tmpInst.html(content, param)
}

export function markdown(content, param) {
  if (!tmpInst) tmpInst = new htmlparser()
  return tmpInst.md(content, param)
}