export default()=>{
    const element =document.createElement('h2')
    element.textContent='hello word'
    element.addEventListener('click',()=>{
        alert('hello webpack')
    })
    return element
}