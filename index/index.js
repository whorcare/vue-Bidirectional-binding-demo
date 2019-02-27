// 这时候我们需要将Observer和Watcher关联起来：

/**
 *  data -> name: 'hello world'
 *  el -> DOM
 *  exp -> name(key)
 **/
function SelfVue (data, el, exp) {
    this.data = data;
    observe(data);
    el.innerHTML = this.data[exp];  // 初始化模板数据的值
    new Watcher(this, exp, function (value) {
        el.innerHTML = value;
    });
    return this;
}