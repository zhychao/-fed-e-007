import {init} from 'snabbdom/build/package/init'
import {h} from 'snabbdom/build/package/h'
const patch =init([])

//h函数 第一个参数：标签+选择器
// 第二个参数：如果是字符串就是标签中的文本内容
let vnode=h('div#container.cls','Hello Word')
let app=document.querySelector('#app')
// patch :第一个参数 ：旧的vnode ,可以是Dom元素
// 第二个参数  ： 新的vNode
// 返回新的VNode
let oldVnode=patch(app,vnode)
vnode=h('div#container.xxx','hello test')
patch(oldVnode,vnode)