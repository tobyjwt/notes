Function.prototype.myCall = function (context, ...args) {
    const fn = Symbol('fn');
    context = context || window;
    context[fn] = this;
    const result = context[fn](...args);
    delete context[fn];
    return result;
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
    const self = this;
    const fn = function () {
        const params = args.concat(Array.prototype.slice.call(arguments));
        return self.apply(this instanceof self ? this : context, params);
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
