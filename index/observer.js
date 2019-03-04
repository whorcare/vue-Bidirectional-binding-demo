
/**
 * 从代码上看，我们将订阅器Dep添加一个订阅者设计在getter里面，
 * 这是为了让Watcher初始化进行触发，因此需要判断是否要添加订阅者，
 * 至于具体设计方案，下文会详细说明的。
 * 在setter函数里面，如果数据变化，就会去通知所有订阅者，订阅者们就会去执行对应的更新的函数。
 * 到此为止，一个比较完整Observer已经实现了，接下来我们开始设计Watcher。
 **/
//function Dep () {
//    this.subs = [];
//}
//Dep.prototype = {
//    addSub: function(sub) {
//        this.subs.push(sub);
//    },
//    notify: function() {
//        this.subs.forEach(function(sub) {
//            sub.update();
//        });
//    }
//};

/**
 * Observer是一个数据监听器，其实现核心方法就是前文所说的Object.defineProperty( )。
 * 如果要对所有属性都进行监听的话，那么可以通过递归方法遍历所有属性值，
 * 并对其进行Object.defineProperty( )处理。如下代码，实现了一个Observer。
 */
function Observer(data) {
    this.data = data;
    this.walk(data);
}

Observer.prototype = {
    walk: function(data) {
        var self = this;
        Object.keys(data).forEach(function(key) {
            self.defineReactive(data, key, data[key]);
        });
    },
    defineReactive: function(data, key, val) {
        var dep = new Dep();
        var childObj = observe(val);
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: function getter () {
                if (Dep.target) {
                    dep.addSub(Dep.target);
                }
                return val;
            },
            set: function setter (newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                dep.notify();
            }
        });
    }
};

function observe(value, vm) {
    if (!value || typeof value !== 'object') {
        return;
    }
    return new Observer(value);
};

function Dep () {
    this.subs = [];
}
Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub);
    },
    notify: function() {
        this.subs.forEach(function(sub) {
            sub.update();
        });
    }
};
Dep.target = null;