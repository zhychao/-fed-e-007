setTimeout(function() {
    var a = 'hello'
    setTimeout(function() {
        var b = 'lagou'
        setTimeout(function() {
            var c = 'I ❤️ U'
            console.log(a + b + c)
        }, 10);
    }, 10);
}, 10)

const helloLagou=new Promise((reslove,reject)=>{
    reslove()
})