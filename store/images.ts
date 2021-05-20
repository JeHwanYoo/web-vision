import { GetterTree, MutationTree, ActionTree } from 'vuex'
import randomstring from 'randomstring'

export interface Image {
  id: string
  dataURL: string
  parent_id?: string
}

export interface State {
  caches: Record<string, Image>
  images: Image[]
  loaded: boolean
  currentCursor: Image | null
}

export const namespaced = true

export const state: () => State = () => ({
  caches: {},
  images: [],
  expected: 0,
  loaded: true,
  currentCursor: null,
})

export const getters: GetterTree<State, any> = {
  caches(state) {
    return state.caches
  },
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
    state.caches[image.id] = image
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
  async upload({ commit }, image: Image) {
    const dataURL = image.dataURL
    if (dataURL) {
      commit('startLoading')

      const result = await this.$axios.post('/api/image', {
        image,
      })

      const savedImage = result.data.image

      commit('pushImage', savedImage)
      commit('setCursor', savedImage)

      commit('finishLoading')

      return savedImage
    } else {
      return null
    }
  },

  async process(
    { getters, commit },
    payload: { image: Image; pythonFileName: string },
  ) {
    const { image, pythonFileName } = payload
    const dataURL = image.dataURL

    if (dataURL) {
      commit('startLoading')

      const result = await this.$axios.post('/api/processing', {
        image,
        pythonFileName,
      })

      const { data } = result
      const newImage = {
        id: data.id,
        dataURL: data.dataURL,
        parent_id: data.parent_id,
      }

      const cache = getters['caches'][newImage.id]

      if (cache) {
        commit('setCursor', cache)
      } else {
        commit('pushImage', newImage)
        commit('setCursor', newImage)
      }

      commit('finishLoading')

      return newImage
    } else {
      return null
    }
  },
}
