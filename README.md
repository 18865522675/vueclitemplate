> 课房学生端测试

## Setup

``` bash
npm install yarn -g --registry=https://registry.npm.taobao.org
yarn
yarn run dev
```

``` bash
yarn run build
```

##### 创建Vue项目
``` bash
# 初始化一个Vue项目
vue init webpack {directoryName}
# 如果目录存在则出现以下命令， 回车即可
? Target directory exists. Continue? {Yes}
# 输入项目名称，这里项目名称要小写，回车结束
? Project name {vuetest}
# 输入项目描述，可以为空，回车结束
? Project description A Vue.js project {}
# 输入作者，默认取Git设置，回车结束
? Author IA <vm0100@163.com> {}
# 这里键盘上下选择 {Runtime + Compiler: recommended for most users} ，默认就是它，回车即可
? Vue build standalone
# 是否安装vue-router 回车安装
? Install vue-router? Yes
# 是否启用ESLint - 我选择N
? Use ESLint to lint your code? No
# 是否启用unit tests - 我选择N
? Set up unit tests No
# e2e tests - 我选择N
? Setup e2e tests with Nightwatch? No
# 选择包管理工具，我用的是yarn,同样键盘上下选择。回车后默认开始install
? Should we run `npm install` for you after the project has been created? (recommended) yarn

# install完成后进入创建的目录内
cd {directoryName}
# 运行项目
yarn run dev
```
##### yarn常用语句
``` bash
# install
yarn
# 运行
yarn run dev
# 打包
yarn run build
# 添加模块 默认安装当前项目
yarn add moduleName
# 全局安装
yarn add moduleName -g
# 删除模块
yarn remove moduleName
# 查看模块更新信息
yarn yarn outdated
# 更新所有模块版本
yarn upgrade
```

## 目录结构
<pre>
├─build
│     │	 build.js								# webpack 基础配置
│     │  check-versions.js						# webpack 基础配置
│     │  utils.js								# webpack 基础配置
│     │  vue-loader.conf.js					    # webpack 基础配置
│     │  webpack.base.conf.js					# webpack 基础配置
│     │  webpack.dev.conf.js					# webpack 基础配置
│     └─ webpack.prod.config.js 				# webpack 生产配置
├─config
│     │  dev.env.js							    # 开发时环境变量
│     │  index.js								# webpack 基础配置
│     └─ prod.env.js							# 打包时环境变量
├─node_modules									# 此文件务必不要上传和修改
└─src
│    │ App.vue									# 主Vue
│    │ main.js									# 启动配置
│    │ router.js								# 路由
│    │ store.js 								# Vuex
│    ├─api									    # 资源目录，会被打包编译
│    │    ├─ XXX							    # api内容
│    │    ├─ index.js							# api控制文件
│    ├─assets									# 资源目录，会被打包编译
│    │    ├─ font							    # 字体
│    │    └─ img							    # 图片资源
│    ├─common 									# js扩展
│    │    │  ajax.js							# Asiox，XMLHTTPRequest封装，
│    │    │  bytes.js							# Bytes支持
│    │    └─ toolkit.js						    # 公共方法
│    ├─components								# 公共组件目录
│    ├─style									# 样式文件目录，若使用less 请不要提交生成的.css,.min.css
│    ├─views									# 视图目录
│    │    │  login.vue
│    │    └─ notFound.vue 
├─static										# 静态资源目录 将不会被打包编译
│     │  .gitkeep
│     └─ global.json							# 动态配置
│  .babelrc
│  .editorconfig								# 忽略无需git控制的文件  比如 node_modules
│  .gitignore
│  .postcssrc.js
│  index.html									# 首页
│  package.json									# 项目配置
│  yarn.lock
│  readme.md									# 项目说明
</pre>
