// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
Vue.config.productionTip = false;

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'babel-polyfill';

import App from './App';
import store from './store';
import router from './router';
 //←注意这一句应该在router实例化(router = new VueRouter({})之后

import api from './api/index.js';   
Vue.prototype.$api = api;

import toolkit from './common/toolkit';
Vue.prototype.$toolkit = toolkit;

Vue.prototype.$getRouteParams = () => store.getters.getPageParams;

import 'font-awesome/css/font-awesome.min.css';
Vue.use(ElementUI);




import global from '../static/global.json'
//console.log(global)
Vue.prototype.$global = global;
console.log(global)
const getVuexKey = () => toolkit.md5(`${api.global.sessionStoragePrefix}${toolkit.format(new Date(), "yyyyMMdd")}Vuex`);

   


const readVuex = () => {
    store.commit("setLoadVuexDone");
    let vuex = sessionStorage.getItem(getVuexKey());
    if (!vuex) return;
    vuex = JSON.parse(toolkit.base24Decode(vuex));
    Object.keys(vuex).forEach(v => store.commit({ type: `set${v.substr(0, 1).toUpperCase() + v.substr(1)}`, value: vuex[v] }));
}



router.beforeEach((to, from, next) => {
    const isLoadVuexDone = store.getters.getLoadVuexDone;
    console.log(to)
    if (isLoadVuexDone) {
        store.commit({ type: "setPageParams", path: to.path, value: to.params });
    } else {
        //没有加载过Vuex的刷新逻辑
        readVuex();
    }
    //判断是否登录
    const loginId = store.getters.getLoginId;
    if (!loginId && to.path !== "/login") {
        next("/login");
        return;
    }

    if (to.path === "/login") {
        store.commit("setLoginId", "");
    }

    next();
});


/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App },
    methods: {
        saveVuex: function() {
            sessionStorage.setItem(getVuexKey(), this.$toolkit.base24Encode(JSON.stringify({
                pageParams: store.getters.getPageParams,
                loginId: store.getters.getLoginId || "",
            })));
        }
    },
    created() {
        window.onbeforeunload = this.saveVuex;
    }
})