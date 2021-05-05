import { GetterTree, MutationTree, ActionTree, Store } from 'vuex'

export interface Image {
  id: string
  file: File
  dataURL: string
}

export interface State {
  originImages: Image[]
  convertedImages: Image[]
  expected: number
  loaded: number
}

export const namespaced = true

export const state: () => State = () => ({
  originImages: [],
  convertedImages: [],
  expected: 0,
  loaded: 0,
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
}

export const actions: ActionTree<State, any> = {
  async upload(
    { state, getters, commit },
    payload: { image: Image; pythonFileName: string },
  ) {
    const { image, pythonFileName } = payload
    const dataURL = image.dataURL

    commit('clearImages')

    if (dataURL) {
      const result = await this.$axios.post('/api/processing', {
        dataURL,
        pythonFileName,
      })
      const convertedDataURL = result.data.join('')
      const newImage = {
        id: 'C:' + image.id,
        file: image.file,
        dataURL: convertedDataURL,
      }

      commit('pushOriginImages', image)
      commit('pushConvertedImages', newImage)

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
