;(function (root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define('Typing', [], function ($) {
      return (root.Typing = factory($));
    });
  } else {
    root.Typing = factory();
  }
}(this, function() {
  function Typing (opts) {
    this.opts = opts || {};
    this.source = opts.source;
    this.output = opts.output;
    this.delay = opts.delay || 30;
    this.chain = {
      parent: null,
      dom: this.output,
      val: []
    };
    this._stop = true;

    if (!(typeof this.opts.done == 'function')) this.opts.done = function() {};
  }

  Typing.fn = Typing.prototype = {
    toArray: function (eles) {
      var result = [];
      for (var i = 0; i < eles.length; i++) {
        result.push(eles[i]);
      }
      return result;
    },

    init: function () {
      this.chain.val = this.convert(this.source, this.chain.val);
    },

    convert: function (dom, arr) {
      var that = this,
          children = this.toArray(dom.childNodes);

      for (var i = 0; i < children.length; i++) {
        var node = children[i];
        if (node.nodeType === 3) {
          arr = arr.concat(node.nodeValue.split(''));
        } else if (node.nodeType === 1) {
          var val = [];
          val = that.convert(node, val);
          arr.push({
            'dom': node,
            'val': val
          });
        }
      }

      return arr;
    },

    print: function (dom, val, callback) {
      setTimeout(function(){
        dom.appendChild(document.createTextNode(val));
        callback();
      }, this.delay);
    },

    play: function (ele) {
      if (this._stop) return;
      if (!ele) return;
      if (!ele.val.length) {
        if (ele.parent) this.play(ele.parent);
        else this.opts.done();
        return;
      }

      var curr = ele.val.shift();
      var that = this;

      if (typeof curr === 'string') {
        this.print(ele.dom, curr, function() {
          that.play(ele);
        });
      } else {
        var dom = document.createElement(curr.dom.nodeName);
        var attrs = that.toArray(curr.dom.attributes);
        for (var i = 0; i < attrs.length; i++) {
          var attr = attrs[i];
          dom.setAttribute(attr.name, attr.value);
        }
        ele.dom.appendChild(dom);
        curr.parent = ele;
        curr.dom = dom;

        // 检查是否为换行标签 <br>
        if (curr.dom.nodeName.toLowerCase() === 'br') {
          setTimeout(function() {
            that.play(curr.val.length ? curr : curr.parent);
          }, 100); // 换行时停顿 500 毫秒
        } else {
          that.play(curr.val.length ? curr : curr.parent);
        }
      }
    },

    start: function () {
      this._stop = false;
      this.init();
      this.play(this.chain);
    },

    pause: function() {
      this._stop = true;
    },

    resume: function(){
      this._stop = false;
      this.play(this.chain);
    }
  };

  Typing.version = '2.1';

  return Typing;
}));