import { GetterTree } from 'vuex'

export const namespaced = true

export interface NavigationItem {}

export interface Navigation {
  items: NavigationItem[]
}

export const state: () => Navigation = function () {
  return {
    items: [],
  }
}

export const getters: GetterTree<Navigation, any> = {
  items(state) {
    return state.items
  },
}
