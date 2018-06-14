
纯函数是函数式编程的基础，需要重点理解。

纯函数的概念：

> 纯函数是这样一种函数，即相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用。

他的**重点在于“相同的输入，永远会得到相同的输出”**，后面所说的副作用也是为了满足这一点。

在详细说明纯函数之前，先讲两个其他的概念：**可变数据类型和不可变数据类型。**

我们知道，在JavaScript中，基本数据类型都是不可变的，**他们只能被替换，不能被修改。**例如当我们在对字符串进行操作的时候，我们并不能改变这个字符串本身。

var str = 'I am hero';
console.log(str.toUpperCase());	// "I AM HERO"
console.log(str);	//"I am hero"

我们能做的只有把返回的新字符串重新赋值给变量。

var str = 'I am hero';
str = str.toUpperCase();	// "I AM HERO"

而引用数据类型都是可变的，存在变量中的仅仅就是一个地址。对于可变特性，facebook的immutable.js做了针对性的强化处理，此外还有clojurescript这样更加彻底的方式。

为什么我要说这两个概念呢？

先不说在JS运行的系统环境中可能会产生副作用，单单看这些可变的数据类型，就会增加我们写纯函数的难度，要十分注意，个别情况我们只能选择接受。

这样的话想，在JS中，我们不妨把纯函数换一种方式理解，不要把它当做一个只有“完全满足要求”和“不满足要求”的标准，而要把它想象成一个范围，在这里有高低不同程度的纯函数。

### 如何理解“相同的输入，永远会得到相同的输出”

文章开头的纯函数的概念中的“永远”可能会让你疑惑，要把它放在词法作用域中考虑，也就是说不考虑再下次执行之前修改常量这一类的情况。

**例一**

var a = 5;
function A(b) {
  return a + b;
}
A(5);

A函数是一个纯函数吗？显然非常不纯，在程序执行的过程中，变量a很容易被修改，这就会导致每次调用`A(5)`的返回值改变。

**例二**

对例一稍作修改

const a = 5;
function A(b) {
  return a + b;
}
A(5);

这是纯函数，确定的输入，确定的输出。

**例三**

把例二数字常量换成对象

const obj = {id: 5};
function A(_obj) {
  return _obj.id;
}
A(obj);

函数A基本上是纯函数，为什么说是“基本上”？因为有极端情况如下

var obj = {
  get id() {
    return Math.random();
  }
}

注意，obj在传进函数A之前是确定的，`getter`是在取值的时候才会执行，但是返回的结果是不确定的，所以这个时候函数A就不是纯函数了。**随机数和`Date`都会造成函数不纯，使用的时候要注意。**

除此之外，由于对象是可变数据类型，我们在每次输入变量`obj`到函数A中时，并不具有绝对的自信会返回确定的值。可对于函数A来说，它只关心传进来的数据是什么，而对于那个数据来说，只要不是上面的极端情况，返回的是确定的值。  
**例四**

const obj = {a: 5};
function A(b) {
  return obj.a + b;
}
A(5);

这个很明显很不纯，同例一，注意与例三的区别。

**例五**

对例四稍作修改

const obj = Object.freeze({a: 5});
function A(b) {
  return obj.a + b;
}
A(5);

这样就纯多了，可是需要注意的是，`Object.freeze()`这个方法无法冻结嵌套的对象，例如

const obj = Object.freeze({a: {a: 5}});
obj.a.a = 10;
function A(b) {
  return obj.a.a + b;
}
console.log(A(5));	// 15，不纯

**例六**

function foo(x) {
  return bar(x);
}

function bar(y) {
  return y + 1;
}

foo(1);

都纯。

**例七**

function A(a) {
  return function(b) {
    return a + b;
  }
}
var B = A(5);

函数A和函数B是纯函数吗？首先来看函数A，每次输入一个参数，都会得到一个用这个参数组成的函数，得到的函数是固定的，所以函数A是纯函数；再来看函数B虽然看起来好像使用了一个自己外部的变量a，而且这个变量a可能会经常改变，可是，**函数B一定要在调用了函数A之后才能得到，并且得到了之后，变量a是无法改变的**，这就很纯了。

即便在返回函数B之前修改了a，例如

**例八**

function A(a) {
  a = 0;
  return function(b) {
    return a + b;
  }
}
var B = A(5);

结论也是一样的。

可如果这样写

**例九**

function A(a) {
  return function(b) {
    return a = a + b;
  }
}
var B = A(5);

关于副作用，见[《JavaScript函数式编程之副作用》](https://github.com/zhuanyongxigua/blog/issues/17)

参考资料：

*   [JS函数式编程指南](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/)
*   [Functional-Light JavaScript](https://github.com/getify/Functional-Light-JS)
原文链接 [https://github.com/zhuanyongxigua/blog/issues/16](https://github.com/zhuanyongxigua/blog/issues/16)  