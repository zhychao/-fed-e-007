

### 一、Vue 3.0 性能提升主要是通过哪几方面体现的？


```
（1）响应式系统升级
    Vue.js 2.x 中响应式系统的核心是 Object.defineProperty
    Vue.js 3.0 中使用 Proxy 对象重写了响应式系统

    可以监听动态新增的属性
    可以监听删除的属性
    可以监听数组的索引和 length 属性
（2）编译优化

    Vue.js 2.x 中通过标记静态根节点，优化 diff 过程
    Vue.js 3.0 中标记和提升所有的静态节点，diff 的时候只需要对比动态节点内容

    Fragments 片段，模板中可以直接放文本内容或同级标签(升级 vetur 插件)
    静态节点提升到 render 函数外部，只在初始化时执行一次，再次render无需再次执行
    Patch flag，标记动态节点（记录节点内容、节点属性），diff时跳过静态根节点 只需关心动态节点内容
    缓存事件处理函数，减少了不必要的更新操作
（3）源码体积的优化

    Vue.js 3.0 中移除了一些不常用的 API

    例如：inline-template / filter 等
    Tree-shaking

  ```

------

### 二、 Vue 3.0 所采用的 Composition Api 与 Vue 2.x使用的Options Api 有什么区别？

```
Options Api

    （1）包含一个描述组件选项（props、data、methods 等）的对象
    （2）Options Api 开发复杂组件，同一个功能逻辑的代码被拆分到不同选项
Composition Api

    （1）提供了一种基于函数的API，让我们可以更灵活、更合理的组织组件的逻辑和代码结构
    （2）同一功能的代码不需要拆分，有利于对代码的提取和重用
```

### Proxy 相对于 Object.defineProperty 有哪些优点？

```
    Proxy 的优点：

    Proxy 除了有 set 和 get 监听之外，还有其他对于对象的监听回调，可以监听动态新增的属性、监听删除的属性。has deleteProperty ownKeys apply 等等
    Proxy 更好的支持数组对象的监视监听，可以监听数组的索引和 length 属性
    Proxy 是以非侵入的方式监管了对象的读写，不会修改原对象

```

#### Vue 3.0 在编译方面有哪些优化？
```
    Vue.js 3.0 中标记和提升所有的静态节点，diff 的时候只需要对比动态节点内容

    Fragments 片段，模板中可以直接放文本内容或同级标签(vscode中要升级 vetur 插件)
    静态节点提升到 render 函数外部，只在初始化时执行一次，再次render无需再次执行
    Patch flag，标记动态节点（记录节点内容、节点属性），diff时跳过静态根节点 只需关心动态节点内容
    缓存事件处理函数，减少了不必要的更新操作

```

### Vue.js 3.0 响应式系统的实现原理？

```
    使用 Proxy 对象实现属性监听，初始化时不需要遍历所有属性对其 defineProperty
    多属性嵌套，在访问属性的过程中处理下一级属性（递归处理）
    默认监听动态添加的属性
    默认监听属性的删除操作
    默认监听数组索引和 length 属性的修改操作
    可以作为单独的模块使用
核心方法:

    reactive/ref/toRefs/computed
    effect (watch函数内部使用的底层函数)
    track 收集依赖的函数
    trigger 触发更新的函数

```


