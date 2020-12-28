# 模块一：函数式编程与 JS 异步编程、手写 Promise参考答案

#### 简答题

### 一、谈谈你是如何理解 JS 异步编程的，EventLoop、消息队列都是做什么的，什么是宏任务，什么是微任务？

EventLoop:事件循环，是我们使用异步的原理，是指浏览器一种解决JS单线程运行时的一种机制,负责监听调用栈和消息队列
消息队列:栈、堆、消息队列是一种数据结构，队列，特点为先进先出，存放执行的任,负责取出第一个回调函数，压入到调用栈中！
宏任务:消息队列中的每个任务都是宏任务,在回调队列的末尾执行.
微任务:每个宏任务对应都有一个微任务队列,执行栈在完成同步任务之后，会去执行任务队列中的宏任务，每次宏任务执行完毕之后，查看相应的微任务队列是否为空，如果不为空，则会按照先进先出的规则全部执行完对应的微任务，如此循环，直至任务结束。直接在当前任务结束后立即执行的任务.

  

------

#### 代码题

### 一、将下面异步代码使用 Promise 的方式改进

```
setTimeout(function() {
    var a = 'hello'
    setTimeout(function() {
        var b = 'lagou'
        setTimeout(function() {
            var c = 'I ❤️ U'
            console.log(a + b + c)
        }, 10);
    }, 10);
}, 10);
```

> 参考代码：

```
const promise=new Promise((resolve,reject)=>{
    resolve('hello')
})
promise.then(value=>{
    return value+'lagou'
}).then(value=>{
    console.log(value+'I ❤️ U')
})
```

------

### 二、基于以下代码完成下面的四个练习

```
const fp = require('lodash/fp')
// 数据：horsepower 马力，dollar_value 价格，in_stock 库存
const cars = [
    { name: 'Ferrari FF', horsepower: 660, dollar_value: 700000, in_stock: true },
    { name: 'Spyker C12 Zagato', horsepower: 650, dollar_value: 648000, in_stock: false },
    { name: 'Jaguar XKR-S', horsepower: 550, dollar_value: 132000, in_stock: false },
    { name: 'Audi R8', horsepower: 525, dollar_value: 114200, in_stock: false },
    { name: 'Aston Martin One-77', horsepower: 750, dollar_value: 185000, in_stock: true },
    { name: 'Pagani Huayra', horsepower: 700, dollar_value: 130000, in_stock: false }
]
```

#### 练习1：使用组合函数 fp.flowRight() 重新实现下面这个函数

```
let isLastInStock = function(cars){
    // 获取最后一条数据
    let last_car = fp.last(cars)
    // 获取最后一条数据的 in_stock 属性值
    return fp.prop('in_stock', last_car)
}
```

> 先定义获取最后一条数据的函数，再定义获取某个对象中的 in_stock 属性的函数，再用 fp.flowRight 组合函数

```
let fr = fp.flowRight(fp.prop('in_stock'),fp.last)
console.log(fr(cars))
```

#### 练习2：使用 fp.flowRight()、fp.prop() 和 fp.first() 获取第一个 car 的 name

> 先定义获取第一条数据的函数，再定义获取某个对象中的 name 属性的函数，再用 fp.flowRight 组合函数

```
let fr = fp.flowRight(fp.prop('name'),fp.first)
console.log(fr(cars)) 
```

#### 练习3：使用帮助函数 _average 重构 averageDollarValue，使用函数组合的方式实现

```
let _average = function(xs){
    return fp.reduce(fp.add, 0, xs) / xs.length
}
```

> 先定义获取某个对象中的 dollar_value 属性的函数，将该函数作为 fp.map 的数组元素处理函数，再用 fp.flowRight 组合函数

```
let  _average = function (xs){
    return fp.reduce(fp.add,0,xs)
}

let averageDollarValue = function(cars){
   let arr = fp.flowRight(_average,fp.map(car=>car.dollar_value))
   return arr(cars)
}
```

#### 练习4：使用 flowRight 写一个 sanitizeNames() 函数，返回一个下划线连续的小写字符串，把数组中的 name 转换为这种形式，例如：sanitizeNames(["Hello World"]) => ["hello_world"]

```
let _underscore = fp.replace(/\W+/g, '_') // 无须改动，并在 sanitizeNames 中使用它
```

> 先定义获取某个对象中的 name 属性的函数，再定义转化为小写的函数，再将空格和下划线替换，,再用 fp.flowRight 组合函数

```
function sanitizeNames(){
   return fp.flowRight(fp.map(name=>_underscore(name)))
}
```

------

### 三、基于下面提供的代码，完成后续的四个练习

```
// support.js
class Container {
    static of(value){
        return new Container(value)
    }
    constructor(value){
        this._value = value
    }
    map(fn){
        return Container.of(fn(this._value))
    }
}

class Maybe {
    static of(x){
        return new Maybe(x)
    }
    isNothing(){
        return this._value === null || this._value === undefined
    }
    constructor(x){
        this._value = x
    }
    map(fn){
        return this.isNothing() ? this : Maybe.of(fn(this._value))
    }
}
module.exports = { Maybe, Container }
```

#### 练习1：使用 fp.add(x, y) 和 fp.map(f,x) 创建一个能让 functor 里的值增加的函数 ex1

```
const fp = require('lodash/fp')
const {Maybe, Container} = require('./support')
let maybe = Maybe.of([5,6,1])
let ex1 = () => {
    // 你需要实现的函数。。。
}
```

> 函子对象的 map 方法可以运行一个函数对值进行处理，函数的参数为传入 of 方法的参数；接着对传入的整个数组进行遍历，并对每一项执行 fp.add 方法

```
let ex1 = (num) =>{
    let fn = fp.flowRight(fp.map(fp.add(num)))
    return maybe.map(fn)  
}
console.log(ex1(3)) // [8,9,4]
```

#### 练习2：实现一个函数 ex2，能够使用 fp.first 获取列表的第一个元素

```
const fp = require('lodash/fp')
const {Maybe, Container} = require('./support')
let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
let ex2 = () => {
    // 你需要实现的函数。。。
}
```

> 解答如下：

```
let ex2 = () => {
    return xs.map(fp.first)._value
}
console.log(ex2()) 
```

#### 练习3：实现一个函数 ex3，使用 safeProp 和 fp.first 找到 user 的名字的首字母

```
const fp = require('lodash/fp')
const {Maybe, Container} = require('./support')
let safeProp = fp.curry(function(x, o){
    return Maybe.of(o[x])
})
let user = { id: 2, name: 'Albert' }
let ex3 = () => {
    // 你需要实现的函数。。。
}
```

> 调用 ex3 函数传入 user 对象，safeProp 是经过柯里化处理的，可以先传“属性”参数，后传“对象”参数。safeProp 函数处理后返回 user 的值，再调用fp.first 获取首字母

```
let ex3 = () => {
    return safeProp('name',user).map(fp.first)._value
}
console.log(ex3())
```

#### 练习4：使用 Maybe 重写 ex4，不要有 if 语句

```
const fp = require('lodash/fp')
const {Maybe, Container} = require('./support')
let ex4 = function(n){
    if(n){
        return parseInt(n)
    }
}
```

> MayBe 函子用来处理外部的空值情况，防止空值的异常，拿到函子的值之后进行 parseInt 转化

```
let  ex4 = function(n){
    let m1 = new MayBe(n)
    let m2 = m1.map(parseInt)
    return m2._value
}
ex4()  //undefined
ex4(1) // 1
```

------

### 四、手写实现 MyPromise 源码

要求：尽可能还原 Promise 中的每一个 API，并通过注释的方式描述思路和原理。【参考代码】

```javascript

/**
 * 1、promise是一个类，在执行这个类的时候，需要传递一个执行器进去，执行器会立即执行
 * 2、Promise中有三个状态，分别为 成功 resolve、失败 reject、等待 pedding
 *    状态一旦确定就不能被改变
 *    pedding-resolve
 *    pedding-reject
 * 3、resolve和reject函数是用来更改状态的
 *    resolve:fufilled
 *    reject:rejected
 * 4、then方法做的事情就是判断状态，如果状态是成功，调用成功回调函数，如果是失败，调用失败函数，then方法是被定义在原型对象中
 * 5、then成功回调有一个参数，表示成功之后的值，失败回调有一个参数，表示失败的原因
 */
const PEDDING = 'pedding' //等待
const FUFILLED = 'fufilled' //成功
const REJECT = 'reject' //失败

class MyPromise {
    constructor(exeuctor) {
        try {
            exeuctor(this.resolve, this.reject)
        } catch (error) {
            this.reject(error)
        }
    }

    status = PEDDING
    //成功之后的值
    value = undefined
    //失败之后的原因
    reason = undefined
    //成功回调
    // successCallback = undefined  只能处理一个回调函数
    successCallback = []
    //失败回调
    // failCallback = undefined
    failCallback = []


    //使用箭头函数定义是为了执行方法的时候让this指向MyPromise的实例对象
    resolve = value => {
        //如果状态不是等待，向下执行
        if (this.status !== PEDDING) return
        this.status = FUFILLED
        //保存成功之后的值
        this.value = value
        //判断成功回调是否存在，如果存在则调用
        // this.successCallback && this.successCallback(this.value)
        while (this.successCallback.length) {
            // this.successCallback.shift()(this.value)
            this.successCallback.shift()()
        }
    }

    reject = reason => {
        if (this.status !== PEDDING) return
        this.status = REJECT
        //保存失败后的原因
        this.reason = reason
        // this.failCallback && this.failCallback(this.reason)
        while (this.failCallback.length) {
            // this.failCallback.shift()(this.reason)
            this.failCallback.shift()()
        }
    }

    then(successCallback, failCallback) {
        successCallback = successCallback ? successCallback : value => value
        failCallback = failCallback ? failCallback : reason => { throw reason }
        let promise2 = new MyPromise((resolve, reject) => {
            if (this.status === FUFILLED) {
                // let x = successCallback(this.value)
                /**
                 * 需要判断x的值是普通值还是promise对象,如果是普通值，直接调用resolve，
                 * 如果是promise对象，查看promise的结果，根据promise对象返回的结果决定调用resolve，reject
                 */
                // resolvePromise(x,resolve,reject)
                //防止循环调用,但是此时promise2并不能获取到，所以现在需要使其变成异步执行代码
                // resolvePromise(promise2,x,resolve,reject)
                //使用try-catch捕获异常
                try {
                    setTimeout(() => {
                        let x = successCallback(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    }, 0)
                } catch (error) {
                    reject(error)
                }
            } else if (this.status === REJECT) {
                setTimeout(() => {
                    let x = failCallback(this.reason)
                    resolvePromise(promise2, x, resolve, reject)
                }, 0)
            } else {
                //状态为pedding，等待
                // 将成功回调和失败回调存储起来
                // this.successCallback.push(successCallback)
                this.successCallback.push(() => {
                    setTimeout(() => {
                        let x = successCallback(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    }, 0)
                })
                // this.failCallback.push(failCallback)
                this.failCallback.push(() => {
                    setTimeout(() => {
                        let x = failCallback(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    }, 0)
                })
            }
        })
        return promise2
    }

    finally(callback){
        return this.then(value=>{
            return MyPromise.resolve(callback()).then(()=>value)
        },reason=>{
            return MyPromise.resolve(callback()).then(()=>{throw reason})
        })
    }

    catch(failCallback){
        return this.then(undefined,failCallback)
    }


    static all(array) {
        let result = []
        
        return new MyPromise((resolve, reject) => {
            let count = 0
            function addData(index,value){
                result[index] = value
                count++
                console.log(count,array.length)
                if(count === array.length){
                    resolve(result) 
                }   
            }
            for(let i= 0;i<array.length;i++){
                let current = array[i]
                if(current instanceof MyPromise){
                    //Promise对象
                    current.then((value)=>{
                        addData(i,value)
                    },(reason)=>{
                        reject(reason)
                    })
                }else{//普通值
                    addData(i,current)
                }
            }
        })
    }


    static resolve(value){
        if(value instanceof MyPromise){
            return value
        }
        return new MyPromise(resolve=>resolve(value))
    }

}

function resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
        return reject(new TypeError("Chaining cycle detected for promise #<Promise>    "))
    }
    if (x instanceof MyPromise) {
        x.then(resolve, reject)
    } else {
        resolve(x)
    }
}

module.exports = MyPromise

```

