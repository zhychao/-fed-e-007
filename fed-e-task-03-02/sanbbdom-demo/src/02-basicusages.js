import {init} from 'snabbdom/build/package/init'
import {h} from 'snabbdom/build/package/h'
const patch =init([])
let vnode=h('div#container',[
    h('h1','Heeeeeeee'),
    h('p','PPPPPPPPPPPPPPPPPPPPP')
])
let app=document.querySelector('#app')
let oldVnode=patch(app,vnode)
setTimeout(()=>{
    vnode=h('div#container',[
        h('h1','this is H1'),
        h('h2','this is H2')
    ])
    patch(oldVnode,vnode)
    // 清空
    patch(oldVnode,h('!'))

},2000)