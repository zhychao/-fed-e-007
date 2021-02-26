Vue.js 源码剖析-响应式原理、虚拟 DOM、模板编译和组件化

# 一、简答题

### 1、请简述 Vue 首次渲染的过程。

```
1、首先进行Vue的初始化，初始化Vue的实例成员以及静态成员。
2、当初始化结束之后，开始调用构造函数，在构造函数中调用this._init()，这个方法相当于我们整个Vue的入口。
3、在_init()中调用this.$mount()，共有两个this.$mount()。
     第一个this.$mount()是entry-runtime-with-compiler.js入口文件，这个$mount()的核心作用是帮我们把模板编译成render函数，但它首先会判断一下当前是否传入了render选项，如果没有传入的话，它会去获取我们的template选项，如果template选项也没有的话，他会把el中的内容作为我们的模板，然后把模板编译成render函数，它是通过compileToFunctions()函数，帮我们把模板编译成render函数的,当把render函数编译好之后，它会把render函数存在我们的options.render中。

3.1、src\platforms\web\entry-runtime-with-compiler.js

3.2、如果没有传递render，把模版编译成render函数

3.3、compileToFunction()生成render()渲染函数

3.4、options.render=render
4、第二个this.$mount()是runtime/index.js中的this.$mount()方法，这个方法首先会重新获取el，因为如果是运行时版本的话，是4.1、不会走entry-runtime-with-compiler.js这个入口中获取el，所以如果是运行时版本的话，我们会在runtime/index.js的$mount()中重新获取el。
4.2、src\platforms\web\runtime\index.js
4.3、mountComponent()
5、接下来调用mountComponent(),mountComponent()是在src/core/instance/lifecycle.js中定义的，在mountComponent()中，首先会判断render选项，如果没有render，但是传入了模板，并且当前是开发环境的话会发送警告，警告运行时版本不支持编译器。接下来会触发beforeMount这个生命周期中的钩子函数，也就是开始挂载之前。
6、然后定义了updateComponent()，在这个方法中，定义了_render和_update，_render的作用是生成虚拟DOM，_update的作用是将虚拟DOM转换成真实DOM，并且挂载到页面上来。
7、再接下来就是创建Watcher对象，在创建Watcher时，传递了updateComponent这个函数，这个函数最终是在Watcher内部调用的。在Watcher创建完之后还调用了get方法，在get方法中，会调用updateComponent()。
然后触发了生命周期的钩子函数mounted,挂载结束，最终返回Vue实例。

```

### 2、请简述 Vue 响应式原理。

在生成vue实例时，为对传入的data进行遍历，使用Object.defineProperty把这些属性转为getter/setter.

Object.defineProperty 是 ES5 中一个无法 shim 的特性，这也就是 Vue 不支持 IE8 以及更低版本浏览器的原因。

每个vue实例都有一个watcher实例，它会在实例渲染时记录这些属性，并在setter触发时重新渲染。

Vue 无法检测到对象属性的添加或删除

Vue 不允许动态添加根级别的响应式属性。但是，可以使用 Vue.set(object, propertyName, value)方法向嵌套对象添加响应式属性。

2.声明响应式属性
由于 Vue 不允许动态添加根级响应式属性，所以你必须在初始化实例前声明所有根级响应式属性，哪怕只是一个空值。

如果你未在 data 选项中声明 message，Vue 将警告你渲染函数正在试图访问不存在的属性。

3.异步更新队列
vue更新dom时是异步执行的

数据变化、更新是在主线程中同步执行的；在侦听到数据变化时，watcher将数据变更存储到异步队列中，当本次数据变化，即主线成任务执行完毕，异步队列中的任务才会被执行（已去重）。

如果你在js中更新数据后立即去操作DOM，这时候DOM还未更新；vue提供了nextTick接口来处理这样的情况，它的参数是一个回调函数，会在本次DOM更新完成后被调用。

### 3、请简述虚拟 DOM 中 Key 的作用和好处。

主要用在 Vue 的虚拟 DOM 算法，在新旧 nodes 对比时辨识 VNodes，相当于唯一标识ID。
Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染， 因此使用key值可以提高渲染效率，同理，改变某一元素的key值会使该元素重新被渲染。

### 4、请简述 Vue 中模板编译的过程

缓存公共的 mount 函数，并重写浏览器平台的 mount
判断是否传入了 render 函数，没有的话，是否传入了 template ，没有的话，则获取 el 节点的 outerHTML 作为 template
调用 baseCompile 函数
解析器(parse) 将模板字符串的模板编译转换成 AST 抽象语法树
优化器(optimize) - 对 AST 进行静态节点标记，主要用来做虚拟DOM的渲染优化
通过 generate 将 AST 抽象语法树转换为 render 函数的 js 字符串
将 render 函数 通过 createFunction 函数 转换为 一个可以执行的函数
将 最后的 render 函数 挂载到 option 中
执行 公共的 mount 函数