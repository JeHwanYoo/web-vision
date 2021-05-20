import { GetterTree, MutationTree, ActionTree } from 'vuex'
import randomstring from 'randomstring'

export interface Image {
  id: string
  file: File
  dataURL: string
  parent?: Image
}

export interface State {
  images: Image[]
  loaded: boolean
  currentCursor: Image | null
}

export const namespaced = true

export const state: () => State = () => ({
  images: [],
  expected: 0,
  loaded: true,
  currentCursor: null,
})

export const getters: GetterTree<State, any> = {
  images(state) {
    return state.images
  },
  loaded(state) {
    return state.loaded
  },
  dataURLofImages(state) {
    return state.images.map(v => v.dataURL)
  },
  currentCursor(state) {
    return state.currentCursor
  },
  currentCursorURL(state) {
    return state.currentCursor?.dataURL
  },
  supportedExtensions() {
    return ['image/jpeg', 'image/png']
  },
}

export const mutations: MutationTree<State> = {
  startLoading(state) {
    state.loaded = false
  },
  pushImage(state, image: Image) {
    state.images.push(image)
  },
  clearImages(state) {
    state.images = []
  },
  finishLoading(state) {
    state.loaded = true
  },
  setCursor(state, image: Image | null) {
    state.currentCursor = image
  },
}

export const actions: ActionTree<State, any> = {
  async upload({ commit }, payload: { image: Image; pythonFileName: string }) {
    const { image, pythonFileName } = payload
    const dataURL = image.dataURL

    if (dataURL) {
      commit('startLoading')

      const result = await this.$axios.post('/api/processing', {
        dataURL,
        pythonFileName,
      })

      const convertedDataURL = result.data.join('')
      const newImage = {
        id: randomstring.generate() + Date.now().toString(),
        file: image.file,
        dataURL: convertedDataURL,
        parent: image,
      }

      commit('pushImage', newImage)
      commit('setCursor', newImage)
      commit('finishLoading')

      return newImage
    } else {
      return null
    }
  },
}
