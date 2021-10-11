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
