# 一、简答题
1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如何把新增成员设置成响应式数据，它的内部原理是什么。
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})
 
 答：不是响应式数据。响应式对象和响应式数组是指在vue初始化时期，利用Object.defineProperty()方法对其进行监听，这样在修改数据时会及时体现在页面上。

# 2、请简述 Diff 算法的执行过程
 答:
 diff 的过程就是调用名为 patch 的函数，比较新旧节点，一边比较一边给真实的 DOM 打补丁。
patch 函数接收两个参数 oldVnode 和 Vnode 分别代表新的节点和之前的旧节点,这个函数会比较 oldVnode 和 vnode 是否是相同的, 即函数 sameVnode(oldVnode, vnode), 根据这个函数的返回结果分如下两种情况：
true：则执行 patchVnode
false：则用 vnode 替换 oldVnode
patchVnode 这个函数做了以下事情：
找到对应的真实 dom，称为 el
判断 vnode 和 oldVnode 是否指向同一个对象，如果是，那么直接 return
如果他们都有文本节点并且不相等，那么将 el 的文本节点设置为 vnode 的文本节点。
如果 oldVnode 有子节点而 vnode 没有，则删除 el 的子节点
如果 oldVnode 没有子节点而 vnode 有，则将 vnode 的子节点真实化之后添加到 el
如果两者都有子节点，则执行 updateChildren 函数比较子节点

# 二、编程题
1、模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。
 答：
 let _Vue = null
export default class VueRouter {
    static install(Vue) {
        // 1、判断当前插件是否已经安装
        if (VueRouter.install.installed) {
            return
        }
        VueRouter.install.installed = true
            // 2、把 vue 构造函数记录到全局变量
        _Vue = Vue
            // 3、把创建 vue 实例时候传入的 router 对象注入到 vue 实例上
            // 混入
        _Vue.mixin({
            beforeCreate() {
                if (this.$options.router) {
                    _Vue.prototype.$router = this.$options.router
                    this.$options.router.init()
                }
            }
        })
    }
    constructor(options) {
        this.options = options
        this.routeMap = {}
        this.data = _Vue.observable({
            current: '/'
        })
    }
    init() {
        this.createRouteMap()
        this.initComponents(_Vue)
        this.initEvent()
    }
    createRouteMap() {
        // 遍历所有的路由规则，把路由规则解析成键值对的形式，存储到 routeMap 中
        this.options.routes.forEach(route => {
            this.routeMap[route.path] = route.component
        })
    }
    initComponents(Vue) {
        const self = this
        Vue.component(
            'router-link', {
                props: {
                    to: String
                },
                render(h) {
                    return h('a', {
                        attrs: {
                            href: '#' + this.to
                        },
                        on: {
                            click: this.clickHandler
                        }
                    }, [this.$slots.default])
                },
                methods: {
                    clickHandler(e) {
                        window.location.hash = '#' + this.to
                        this.$router.data.current = this.to
                        e.preventDefault()
                    }
                }
            }
        )

        Vue.component('router-view', {
            render(h) {
                const conmponent = self.routeMap[self.data.current]
                return h(conmponent)
            }
        })
    }

    initEvent() {
        window.addEventListener('load', this.hashChange.bind(this))
        window.addEventListener('hashchange', this.hashChange.bind(this))
    }
    hashChange() {
        if (!window.location.hash) {
            window.location.hash = '#/'
        }
        this.data.current = window.location.hash.substr(1)
    }
}

2、在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。
 class Vue {
    constructor(options) {
        // 1、通过属性保存选项的数据
        this.$options = options || {}
        this.$data = options.data || {}
        this.$methods = options.methods || {}
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
            // 2、把 data 中的成员转换成 getter 和 setter,并注入到 vue 实例中
        this._proxyData(this.$data)
            // 把 methods 中的成员注入到 vue 实例中 
        this._proxyMethods(this.$methods)
            // 3、调用 observer 对象，监听数据的变化
        new Observer(this.$data)
            // 4、调用 compiler 对象，解析指令和插值表达式
        new Compiler(this)
    }
    _proxyData(data) {
        // 遍历 data 中的所有属性
        Object.keys(data).forEach(key => {
            // 把 data 的属性注入到 vue 实例中
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[key]
                },
                set(newValue) {
                    if (newValue !== data[key]) {
                        data[key] = newValue
                    }
                }
            })
        })
    }
    _proxyMethods(methods) {
        Object.keys(methods).forEach(key => {
            // 把 methods 的成员注入到 vue 实例中
            this[key] = methods[key]
        })
    }
}
class Compiler {
    constructor(vm) {
            this.el = vm.$el
            this.vm = vm
            this.compile(this.el)
        }
        // 编译模板，处理文本节点和元素节点
    compile(el) {
            let childNodes = el.childNodes
            Array.from(childNodes).forEach(node => {
                if (this.isTextNode(node)) {
                    // 处理文本节点
                    this.compileText(node)
                } else if (this.isElementNode(node)) {
                    // 处理元素节点
                    this.compileElement(node)
                }
                // 判断 node 节点，是否有子节点，如果有子节点，要递归调用 compile
                if (node.childNodes && node.childNodes.length) {
                    this.compile(node)
                }
            })
        }
        // 编译元素节点，处理指令
    compileElement(node) {
            // 遍历所有的属性节点
            Array.from(node.attributes).forEach(attr => {
                // 判断是否是指令
                let attrName = attr.name
                if (this.isDirective(attrName)) {
                    // v-text --> text
                    attrName = attrName.substr(2)
                    let key = attr.value
                    if (attrName.startsWith('on')) {
                        const event = attrName.replace('on:', '') // 获取事件名
                            // 事件更新
                        return this.eventUpdate(node, key, event)
                    }
                    this.update(node, key, attrName)
                }
            })
        }
        // 编译文本节点，处理插值表达式
    compileText(node) {
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        if (reg.test(value)) {
            let key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key])
                // 创建 watcher 对象，当数据改变时更新视图
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = newValue
            })
        }

    }
    update(node, key, attrName) {
        let updateFn = this[attrName + 'Updater']
        updateFn && updateFn.call(this, node, this.vm[key], key)
    }
    eventUpdate(node, key, event) {
        this.onUpdater(node, key, event)
    }


    // 处理 v-text 指令
    textUpdater(node, value, key) {
            node.textContent = value
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = newValue
            })
        }
        // 处理 v-html 指令
    htmlUpdater(node, value, key) {
            node.innerHTML = value
            new Watcher(this.vm, key, (newValue) => {
                node.innerHTML = newValue
            })
        }
        // 处理 v-model 指令
    modelUpdater(node, value, key) {
            node.value = value
            new Watcher(this.vm, key, (newValue) => {
                    node.value = newValue
                })
                // 双向绑定
            node.addEventListener('input', () => {
                this.vm[key] = node.value
            })
        }
        // 处理 v-on 指令
    onUpdater(node, key, event) {
        node.addEventListener(event, (e) => this.vm[key](e))
    }



    // 判断元素属性是否是指令
    isDirective(attrName) {
            return attrName.startsWith('v-')
        }
        // 判断节点是否是文本节点
    isTextNode(node) {
            return node.nodeType === 3
        }
        // 判断节点是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1
    }
}
3、参考 Snabbdom 提供的电影列表的示例，利用Snabbdom 实现类似的效果，如图：
import { h, init } from 'snabbdom'
import style from 'snabbdom/modules/style'
import eventlisteners from 'snabbdom/modules/eventlisteners'
import { originalData } from './originData'

let patch = init([style,eventlisteners])

let data = [...originalData]
const container = document.querySelector('#container')

var sortBy = 'rank';
let vnode = view(data);

// 初次渲染
let oldVnode = patch(container, vnode)


// 渲染
function render() {
    oldVnode = patch(oldVnode, view(data));
}
// 生成新的VDOM
function view(data) {
    return h('div#container',
        [
            h('h1', 'Top 10 movies'),
            h('div',
                [
                    h('a.btn.add',
                        { on: { click: add } }, 'Add'),
                    'Sort by: ',
                    h('span.btn-group',
                        [
                            h('a.btn.rank',
                                {
                                    'class': { active: sortBy === 'rank' },
                                    on: { click: [changeSort, 'rank'] }
                                }, 'Rank'),
                            h('a.btn.title',
                                {
                                    'class': { active: sortBy === 'title' },
                                    on: { click: [changeSort, 'title'] }
                                }, 'Title'),
                            h('a.btn.desc',
                                {
                                    'class': { active: sortBy === 'desc' },
                                    on: { click: [changeSort, 'desc'] }
                                }, 'Description')
                        ])
                ]),
            h('div.list', data.map(movieView))
        ]);
}

// 添加一条数据 放在最上面
function add() {
    const n = originalData[Math.floor(Math.random() * 10)];
    data = [{ rank: data.length+1, title: n.title, desc: n.desc, elmHeight: 0 }].concat(data);
    render();
}
// 排序
function changeSort(prop) {
    sortBy = prop;
    data.sort(function (a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        }
        if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    });
    render();
}

// 单条数据
function movieView(movie) {
    return h('div.row', {
        key: movie.rank,
        style: {
            display: 'none', 
            delayed: { transform: 'translateY(' + movie.offset + 'px)', display: 'block' },
            remove: { display: 'none', transform: 'translateY(' + movie.offset + 'px) translateX(200px)' }
        },
        hook: {
            insert: function insert(vnode) {
                movie.elmHeight = vnode.elm.offsetHeight;
            }
        }
    }, [
        h('div', { style: { fontWeight: 'bold' } }, movie.rank),
        h('div', movie.title), h('div', movie.desc),
        h('div.btn.rm-btn', {on: { click: [remove, movie]}}, 'x')]);
}
// 删除数据
function remove(movie) {
    data = data.filter(function (m) {
        return m !== movie;
    });
    render()
}