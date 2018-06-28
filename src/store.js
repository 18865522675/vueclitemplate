    import Vue from 'vue';
    import Vuex from 'vuex';
    Vue.use(Vuex);

const mutations = {
  setLoadVuexDone: (state, param) => state.loadVuexDone = true,
  setPageParams: (state, param) => {
    if (param.path === state.pageView.path && (param.value === null || param.value === undefined)) return;

        if (state.pageView.path !== param.path) {
            state.pageView.path = param.path;
        }

        state.pageView.params = param.value;
    },
    setLoginId: (state, param) => state.loginId = param.value,
    setRootData: (state, params) => state.rootData = params.value,

};

const getters = {
  getPageParams: state => {
    return state.pageView.params
  },
};

const state = {
    loadVuexDone: false,
    pageView: {
        path: "",
        params: {}
    },
    loginId: "",
    rootData: "",
    loginbg: '',
    publicbatch: '',
    restaurants: [],
    totalPag: "",
    loadVuexDone: false,
    pageView: {
        path: "",
        params: {}
    },
    
};



Object.keys(state).forEach(key => {
  if (["pageView"].includes(key)) return;
  getters[`get${key.substr(0, 1).toUpperCase()}${key.substring(1)}`] = state => state[key];
});

export default new Vuex.Store({
  state, getters, mutations,// actions
});