// for(var i =0;i<3;i++){
//     for(var i=0;i<3;i++){
//         console.log(i)
//     }
// }
var element=[{},{},{}]
for(var i=0;i<element.length;i++){
 element[i].onclick=(function(i){
    //  console.log(i)
     return function(){
         console.log(i)
     }
 })(i)   
}
element[1].onclick()
console.log('sfsf')
class Person{
    constructor(name){
        this.name=name
    }
    say(){
        console.log(this.name)
    }
    static create(name){
        return new Person(name)
    }
}
const p=new Person('you')
console.log(p.name)
const tom=Person.create('ltomove')
console.log(tom.say())