// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: null,
    auth: null
  },
  mutations: {
    setUser (state, payload) {
      state.userInfo = payload
    },

    setAuth (state, payload) {
      state.auth = payload
    }
  }
})

export default store
