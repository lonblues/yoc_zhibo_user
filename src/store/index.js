import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    awardInfo: {},
    teamList: [],
    title: ''
  },
  mutations: {
    setAward (state, value) {
      state.awardInfo = value
    },
    getTeamList (state, value) {
      state.teamList = value
    },
    getTitle (state, value) {
      state.title = value
    }
  },
  // 这是把所有数据缓存到本地 也可以进行配置
  plugins: [createPersistedState()]
})

export default store
