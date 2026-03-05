import { createStore } from 'vuex'

export default createStore({
  state: {
    token: localStorage.getItem('token'),
  },
  getters: {
  },
  mutations: {
    setToken(state, token){
      state.token = token;
    }
  },
  actions: {
    saveToken({commit},token){
      commit('setToken',token);
      localStorage.setItem('token',token)
    },
    logout({commit}){
          commit('setToken',null);
          localStorage.clear();
    }
  },
  modules: {
  }
})
