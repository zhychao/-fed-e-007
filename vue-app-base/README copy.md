# 一、简答题
1、Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。

项目中要有文件：webpack.config.js，它是运行在nodeJs中的一个文件，需要根据commonJs规范来编写代码，文件导出一个对象，我们根据导出的对象完成一系列配置。

构建流程

webpack启动的时候，会加载entry配置的入口文件，递归解析entry依赖的所有module，按照module.rules的规则进行匹配转化，对Module进行转换后，再解析出当前Module依赖的Module，这些Module会以Entry为单位进行分组，即为一个Chunk。因此一个Chunk，就是一个Entry及其所有依赖的Module合并的结果。最后Webpack会将所有的Chunk转换成文件输出Output。在整个构建流程中，Webpack会在恰当的时机执行Plugin里定义的逻辑，从而完成Plugin插件的优化任务。
2、Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。

loader

对模块进行加载、处理、编译转换，在module的rules中进行配置，如下：如果遇到后缀为css的文件，则会使用css-loader和style-loader进行编译转换。

plugin

相比于loader，Plugin拥有更宽的能力范围，loader只是在加载的环节工作，而插件触及到webpack工作的每一个环节。 Plugin用来扩展webpack功能，实现原理是在构建流程里注入钩子函数。在plugins数组中进行配置。例如：Webpack要求插件必须是一个函数或者是一个包含apply方法的对象。

loader更像是一个管道，将文件通过参数传递，然后经过一系列的处理，最终将文件输出。

# 二、编程题
1、使用 Webpack 实现 Vue 项目打包任务
具体任务及说明：

先下载任务的基础代码  百度网盘链接: https://pan.baidu.com/s/1pJl4k5KgyhD2xo8FZIms8Q 提取码: zrdd

这是一个使用 Vue CLI 创建出来的 Vue 项目基础结构

有所不同的是这里我移除掉了 vue-cli-service（包含 webpack 等工具的黑盒工具）

这里的要求就是直接使用 webpack 以及你所了解的周边工具、Loader、Plugin 还原这个项目的打包任务

尽可能的使用上所有你了解到的功能和特性