
class Observer{
    constructor(data){
        this.walk(data)
    }
    walk(data){
        if(!data||typeof data!=='object'){
            return
        }
        Object.keys(data).forEach(key=>{
            this.defineReactive(data,key,data[key])
        })
    }
    defineReactive(obj,key,val){
        let that=this
        that.walk(val)
        Object.defineProperty(obj,key,{
            enumerable:true,
            configurable:true,
            get(){
                return val
            },
            set(newValue){
                if(newValue===val){
                    return
                }
                val=newValue
                that.walk(newValue)
            }
        })
    }
}