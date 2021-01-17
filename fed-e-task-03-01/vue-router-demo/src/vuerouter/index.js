let _Vue = null;
export default class VueRouter {
  static install(Vue) {
    // 判断当前插件是否被安装
    if (VueRouter.install.installed) {
      return;
    }
    VueRouter.install.installed = true;
    // 把vue构造函数记录到全局变量
    _Vue = Vue;
    // 把创建vue实例时候传入到router对象注入到vue实例中
    // _Vue.prototype.$router=this.$options.router
    // 混入
    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router;
          this.$options.router.init();
        }
      }
    });
  }
  constructor(options) {
    this.options = options;
    this.routeMap = {};
    this.data = _Vue.observable({
      current: "/"
    });
  }
  init() {
    this.createRouteMap();
    this.initComponents(_Vue);
    this.initEvent();
  }
  createRouteMap() {
    // 遍历所有路由规则，解析成键值对形式
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component;
    });
  }
  initComponents(Vue) {
    Vue.component("router-link", {
      props: {
        to: String
      },
      render(h){
          return h('a',{
              attrs:{
                  href:this.to
              },
              on:{
                click:this.clickHandler
              }
          },[this.$slots.default])
      },
      methods:{
        clickHandler(e){
          history.pushState({},'',this.to)
          this.$router.data.current=this.to
          e.preventDefault()
        }
      }
    //   template: '<a :href="to"><slot></slot></a>'
    });
    const self=this
    Vue.component("router-view", {
      render(h){
        const component=self.routeMap[self.data.current]
        return h(component)
      }
    })
  }
  initEvent(){
    window.addEventListener('popstate',()=>{
      this.data.current=window.location.pathname
    })
  }
}
