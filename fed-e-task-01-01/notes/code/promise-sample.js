const promise=new Promise((resolve,reject)=>{
    resolve('hello')
})

// promise.then(function(value){
//     console.log(value)
// })
promise.then(value=>{
    return value+'lagou'
}).then(value=>{
    console.log(value+'I ❤️ U')
})