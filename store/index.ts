import Vuex from 'vuex'
import * as navigations from './navigations'

export const store = new Vuex.Store({
  modules: {
    navigations,
  },
})
