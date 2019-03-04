// 这时候我们需要将Observer和Watcher关联起来：

/**
 *  data -> name: 'hello world'
 *  el -> DOM
 *  exp -> name(key)
 **/
function SelfVue (data, el, exp) {
    var self = this;
    this.data = data;

    Object.keys(data).forEach(function(key) {
        self.proxyKeys(key);  // 绑定代理属性
    });

    observe(data);
    el.innerHTML = this.data[exp];  // 初始化模板数据的值
    new Watcher(this, exp, function (value) {
        el.innerHTML = value;
    });
    return this;
}

//我们给new SelfVue的时候做一个代理处理，让访问selfVue的属性代理为访问selfVue.data的属性，
// 实现原理还是使用Object.defineProperty( )对属性值再包一层
SelfVue.prototype = {
    proxyKeys: function (key) {
        var self = this;
        Object.defineProperty(this, key, {
            enumerable: false,
            configurable: true,
            get: function proxyGetter() {
                return self.data[key];
            },
            set: function proxySetter(newVal) {
                self.data[key] = newVal;
            }
        });
    }
}