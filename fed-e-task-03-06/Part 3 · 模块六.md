## 解答题：

# 说说 application/json 和 application/x-www-form-urlencoded 二者之间的区别。
```
content-type:application/json的数据格式：json字符串
application/x-www-form-urlencoded的数据格式：键值对：key-value

```

# 说一说在前端这块，角色管理你是如何设计的。
```
  用户关联角色，通过角色分配不同的菜单权限；新增角色给不同的角色分配不同的菜单，及操作权限，通过权限来根据用户是否是普通用户或者是管理员，是否有增删改查的一些操作

```

# @vue/cli 跟 vue-cli 相比，@vue/cli 的优势在哪？
```
1、Vue-cli： （1）开箱即用，但强制性强，需要按照它的规则进行
            （2）单个模版之间相互依赖，耦合性太高，无法实现共享功能和互相迁移，使得模版本身变得及其复杂和难以维护
            （3）ebpack 配置和构建包含在仓库内，如 webpack 被改动，则会影响其他关联的插件

2、Vue CLI：（1）开箱即用，简单易用
           （2）CLI3 将Webpack的配置和逻辑全部封装在依赖中，同时允许用户通过 Vue.config.js 配置进行修改 Webpack，好处是：CLI 3 更新后，并不会影响到其他插件，此时我们只需要专注与功能，底层的配置只需要交给 Vue 团队去进行维护即可。
           （3）CLI3 通过插件的形式去支持多个不同的功能，一个插件对应一个功能，比如（router, TS, Test）, 这样避免了多个模版，使得 CLi 自身的可维护性得到提升，同时支持第三方插件。
```

# 详细讲一讲生产环境下前端项目的自动化部署的流程。

```
1、需要提前安装 JDK，JDK 
2、下载jenkins 并且安装，完成后自动打开http://localhost:8000，这时需要等待一会，进行初始化
3、按照提示找到对应的文件（直接复制路径在我的电脑中打开），其中有管理员密码。
4、安装社区推荐的插件并创建管理员用户，点击完成并保存，然后一路下一步。
5、配置完成后自动进入首页，这时点击 Manage Jenkins -> Manage plugins 安装插件。点击 可选插件，输入 nodejs，搜索插件，然后安装
安装完成后回到首页，点击 Manage Jenkins -> Global Tool Configuration 配置 nodejs。如果你的电脑是 win7 的话，nodejs 版本最好不要太高，选择 v12 左右的就行。
6、下载 Jenkins 提供的 demo 项目 building-a-multibranch-pipeline-project，然后在你的 Gitea 新建一个仓库,把内容克隆进去，并提交到 Git服务器。
7、打开 Jenkins 首页，点击 新建 Item 创建项目
8、选择源码管理，输入你的 Git 上的仓库地址。
9、选择你的构建环境，这里选择刚才配置的 nodejs
10、点击增加构建步骤，windows 要选 execute windows batch command，linux 要选 execute shell。
11、构建命令输入 npm i && npm run build && xcopy .\build* G:\node-server\dist\ /s/e/y，这行命令的作用是安装依赖，构建项目，并将构建后的静态资源复制到指定目录 G:\node-server\dist\。这个目录是静态服务器资源目录(自行修改为你的服务器资源目录)
12、保存后，返回首页。点击项目旁边的小三角，选择 build now, 开始构建项目，我们可以点击项目查看构建过程, 最后输出finished success 就构建成功了

```

# 你在开发过程中，遇到过哪些问题，又是怎样解决的？请讲出两点。

```
 1. 浏览器请求总是附带options 这样一个请求，测试要求去掉这个请求，因为总是看错，本着好奇心我也看着不爽的原因，就去研究了一下这个options 是怎么回事, 然后各种资料查找，代码分析，最后得出结果，浏览器会分为简单请求和复杂请求， 常用的有GET，POST，HEAD;

 HTTP的头信息不超出以下几种字段：

    Accept
    Accept-Language
    Content-Language
    Last-Event-ID
    Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain
    剩下的就是复杂请求了，浏览器出现options 的原因就是因为复杂请求，所谓的复杂请求大概解释如下： XMLHttpRequest会遵守同源策略(same-origin policy). 也即脚本只能访问相同协议/相同主机名/相同端口的资源, 如果要突破这个限制, 那就是所谓的跨域, 此时需要遵守CORS(Cross-Origin Resource Sharing)机制。

    那么, 允许跨域, 不就是服务端设置 *Access-Control-Allow-Origin: * * 就可以了吗? 普通的请求才是这样子的, 除此之外, 还一种叫请求叫preflighted request。

    preflighted request在发送真正的请求前, 会先发送一个方法为OPTIONS的预请求(preflight request), 用于试探服务端是否能接受真正的请求，如果options获得的回应是拒绝性质的，比如404\403\500等http状态，就会停止post、put等请求的发出。

    第一个OPTIONS的请求是由Web服务器处理跨域访问引发的。OPTIONS是一种“预检请求”，浏览器在处理跨域访问的请求时如果判断请求为复杂请求，则会先向服务器发送一条预检请求，根据服务器返回的内容浏览器判断服务器是否允许该请求访问。如果web服务器采用cors的方式支持跨域访问，在处理复杂请求时这个预检请求是不可避免的。 到这里，就明白了了什么是复杂请求，知道问题，那就对症下药，既然跨域，那我们就从服务端出发，解决跨域问题，需要在服务端处理一下，不然无法跨域访问post,服务端拦截器设置：

    HttpServletResponse response = (HttpServletResponse) res;
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    response.setHeader("Access-Control-Max-Age", "3600");
    response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
    chain.doFilter(req, res);
    重启服务器，然后再次请求，发现没了options 预检请求了, 至此问题解决了，也了解了什么是复杂请求，什么是简单请求了

```

# 针对新技术，你是如何过渡到项目中？

```
1.针对老项目，时间充裕，采用重构整个项目，时间不足，可以通过官方提供方法逐步过渡。 2.新项目可以直接从零开始，逐步完善整个项目。在开发过程中同样也是对新技术的熟练和巩固过程

```