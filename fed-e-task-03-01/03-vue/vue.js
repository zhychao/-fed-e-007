class Vue{
    constructor (options){
        // 通过属性保存选项的数据
        this.$options=options||{}
        this.$data=options.data||{}
        this.$el=typeof options.el==='string'?document.querySelector(options.el):options.el
        console.log(typeof options.el)
        console.log(document.querySelector(options.el))
        console.log('dadsad',options.el)
        // 把data中的成员转换成getter setter
        this._proxyData(this.$data)
        // 调用observer对象，监听数据变化
        new Observer(this.$data)
        // 4
        new Compiler(this)
    }
    _proxyData(data){
        Object.keys(data).forEach(key=>{
            Object.defineProperty(this,key,{
                enumerable:true,
                configurable:true,
                get(){
                    return data[key]
                },
                set(newValue){
                    if(newValue===data[key]){
                        return
                    }
                    data[key]=newValue
                }
        
            })
        })
    }
}