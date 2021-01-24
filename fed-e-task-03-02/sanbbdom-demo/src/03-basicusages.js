import {init} from 'snabbdom/build/package/init'
import {h} from 'snabbdom/build/package/h'
// 1 导入模块
import { styleModule } from 'snabbdom/build/package/modules/style'
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners'
// 注册模块
const patch=init([
    styleModule,
    eventListenersModule
])
// 使用h()函数的第二个参数传入模块使用的数据对象
let vnode=h('div',[
    h('h',{style:{backgroundColor:'red'}},'hello Word'),
    h('p',{on:{click:eventHandler}},'hello p')
])
function eventHandler(){
    console.log('点击事件')
}
let app=document.querySelector('#app')
patch(app,vnode)