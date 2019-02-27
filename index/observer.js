/**
 * 从代码上看，我们将订阅器Dep添加一个订阅者设计在getter里面，
 * 这是为了让Watcher初始化进行触发，因此需要判断是否要添加订阅者，
 * 至于具体设计方案，下文会详细说明的。
 * 在setter函数里面，如果数据变化，就会去通知所有订阅者，订阅者们就会去执行对应的更新的函数。
 * 到此为止，一个比较完整Observer已经实现了，接下来我们开始设计Watcher。
 **/
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

/**
 * Observer是一个数据监听器，其实现核心方法就是前文所说的Object.defineProperty( )。
 * 如果要对所有属性都进行监听的话，那么可以通过递归方法遍历所有属性值，
 * 并对其进行Object.defineProperty( )处理。如下代码，实现了一个Observer。
 */
function defineReactive(data, key, val) {
    observe(val); // 递归遍历所有子属性
    var dep = new Dep()
    Object.defineProperty(data, key, { // 核心方法 为get set
        enumerable: true,
        configurable: true,
        get: function() { // get 拿出值
            if (Dep.target) { // 是否需要添加订阅者
                dep.addSub(Dep.target); // 在这里添加一个订阅者
            }
            return val;
        },
        set: function(newVal) { // set 存储值
            if (val === newVal) {
                return
            }
            val = newVal;
            console.log('属性' + key + '已经被监听了，现在值为：“' + newVal.toString() + '”');
            dep.notify()
        }
    });
}
Dep.target = null;

function observe(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    // Object.keys() 方法会返回一个由一个给定对象的自身可枚举属性组成的数组，数组中属性名的排列顺序和使用 for...in 循环遍历该对象时返回的顺序一致 。
    Object.keys(data).forEach(function(key) {
        defineReactive(data, key, data[key]);
    });
};