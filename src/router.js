import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      component: resolve => require(["./views/login.vue"], resolve),
      name: "login",
      meta: {
        displayName: "登陆",
        hidden: false
      }
    },
    {
      path: "*",
      component: resolve => require(['./views/notFound.vue'], resolve),
      name: 'notFound',
      meta: {
        displayName: '页面不存在',
        hidden: false
      }
    }
  ]
});
//打包时替换成H5路由；后台或代理工具需设置重定向为index.html
if (process.env.NODE_ENV === "production") router.mode = "history";
export default router;
