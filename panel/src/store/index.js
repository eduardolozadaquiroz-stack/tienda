import { createStore } from 'vuex'

export default createStore({
  state: {
    token: localStorage.getItem('token'),
    avatarUrl: null,
  },
  getters: {
  },
  mutations: {
    setToken(state, token){
      state.token = token;
    },
    setAvatarUrl(state, url){
      state.avatarUrl = url;
    }
  },
  actions: {
    saveToken({commit},token){
      commit('setToken',token);
      localStorage.setItem('token',token)
    },
    logout({commit}){
          commit('setToken',null);
          commit('setAvatarUrl',null);
          localStorage.clear();
    }
  },
  modules: {
  }
})
