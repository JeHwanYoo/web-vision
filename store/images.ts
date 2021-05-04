import { GetterTree, MutationTree, ActionTree, ActionContext } from 'vuex'

export interface Image {
  id: string
  file: File
  dataURL: string
}

export interface State {
  originImages: Image[]
  convertedImages: Image[]
}

export const namespaced = true

export const state: () => State = () => ({
  originImages: [],
  convertedImages: [],
})

export const getters: GetterTree<State, any> = {
  originImages(state) {
    return state.originImages
  },
  convertedImages(state) {
    return state.convertedImages
  },
  dataURLofOrigins(state) {
    return state.originImages.map(v => v.dataURL)
  },
  dataURLofConverted(state) {
    return state.convertedImages.map(v => v.dataURL)
  },
}

export const mutations: MutationTree<State> = {
  originImages(state, payload: Image) {
    state.originImages.push(payload)
  },
  convertedImages(state, payload: Image) {
    state.convertedImages.push(payload)
  },
  clearOriginImages(state) {
    state.originImages = []
  },
  clearConvertedImages(state) {
    state.convertedImages = []
  },
  clearImages(state) {
    state.originImages = []
    state.convertedImages = []
  },
}

export const actions: ActionTree<State, any> = {}
