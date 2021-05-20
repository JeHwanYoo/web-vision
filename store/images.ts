import { GetterTree, MutationTree, ActionTree } from 'vuex'
import md5 from 'crypto-js/md5'

export interface Image {
  id: string
  file: File
  dataURL: string
  parent?: Image
}

export interface State {
  originImages: Image[]
  convertedImages: Image[]
  expected: number
  loaded: number
  currentCursor: string
}

export const namespaced = true

export const state: () => State = () => ({
  originImages: [],
  convertedImages: [],
  expected: 0,
  loaded: 0,
  currentCursor: '',
})

export const getters: GetterTree<State, any> = {
  originImages(state) {
    return state.originImages
  },
  convertedImages(state) {
    return state.convertedImages
  },
  expected(state) {
    return state.expected
  },
  loaded(state) {
    return state.loaded
  },
  dataURLofOrigins(state) {
    return state.originImages.map(v => v.dataURL)
  },
  dataURLofConverted(state) {
    return state.convertedImages.map(v => v.dataURL)
  },
  isLoading(state) {
    return state.expected > 0 ? state.expected !== state.loaded : false
  },
  currentConvertedImage(state) {
    const current = state.convertedImages.find(
      v => v.id === state.currentCursor,
    )
    return current
  },
}

export const mutations: MutationTree<State> = {
  startLoading(state, payload: number) {
    state.expected = payload
  },
  pushOriginImages(state, payload: Image) {
    state.originImages.push(payload)
  },
  pushConvertedImages(state, payload: Image) {
    state.convertedImages.push(payload)
    state.loaded++
  },
  clearImages(state) {
    state.originImages = []
    state.convertedImages = []
  },
  initLoading(state) {
    state.loaded = 0
    state.expected = 0
  },
  changeCursor(state, payload: string) {
    state.currentCursor = payload
  },
}

export const actions: ActionTree<State, any> = {
  async upload(
    { state, getters, commit },
    payload: { image: Image; pythonFileName: string },
  ) {
    const { image, pythonFileName } = payload
    const dataURL = image.dataURL

    if (dataURL) {
      const result = await this.$axios.post('/api/processing', {
        dataURL,
        pythonFileName,
      })
      const convertedDataURL = result.data.join('')
      const newImage = {
        id: md5(convertedDataURL),
        file: image.file,
        dataURL: convertedDataURL,
        parent: image,
      }

      commit('pushConvertedImages', newImage)
      commit('changeCursor', newImage.id)

      if (!getters.isLoading) {
        commit('initLoading')
      }

      return newImage
    } else {
      state.loaded++
      return null
    }
  },
}
