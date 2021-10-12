Function.prototype.myCall = function (context, ...args) {
    const fn = Symbol('fn'); // 运用symbol的特性，防止覆盖context已有的属性
    context = context || window; // 在非严格模式下，this如果为null或者undefined会自动替换为全局对象，这个实现并不严谨，按浏览器环境下的非严格模式实现
    context[fn] = this; // this在这里就是函数实例本身，这里是利用函数内部的this指向函数调用者这一特性来改变函数内部this的指向
    const result = context[fn](...args); // 执行函数，缓存函数执行结果，因为在返回结果前要将context上的Symbol属性删除
    delete context[fn]; // 删除临时属性
    return result; // 返回结果
}

Function.prototype.myApply = function (context, args) {
    const fn = Symbol('fn');
    context = context || window;
    context[fn] = this;
    const result = context[fn](...args);
    delete context[fn];
    return result;
}

Function.prototype.myBind = function (context, ...args) {
    const self = this; // 先将this保存
    const fn = function () {
        const params = args.concat(Array.prototype.slice.call(arguments));
        if (this instanceof self) {
            context = this;
        }
        return self.apply(context, params);
    }
    fn.prototype = Object.create(self.prototype);
    return fn;
}

// test
const sum = function (b, c) {
    return this.a + b + c;
}

const sourceObj = {
    a: 233
}

console.log(sum.call(sourceObj, 111, 222));
console.log(sum.myCall(sourceObj, 111, 222));
console.log(sum.apply(sourceObj, [111, 222]));
console.log(sum.myApply(sourceObj, [111, 222]));
console.log(sum.bind(sourceObj, 111)(222));
console.log(sum.myBind(sourceObj, 111)(222));
