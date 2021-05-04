<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-img class="my-5 mx-auto" src="/logo.png" width="324px" height="400px">
      </v-img>
    </v-col>
    <v-col class="text-center" cols="12" v-show="isLoading">
      <v-progress-circular
        :size="100"
        :width="20"
        indeterminate
        color="primary"
      ></v-progress-circular>
    </v-col>
    <v-col cols="8" v-show="!isLoading">
      <drag-and-drop @upload="uploaded" @metadata="metadata" />
    </v-col>
    <v-col cols="8" v-show="!isLoading">
      <image-uploader @upload="uploaded" @metadata="metadata" />
    </v-col>
    <v-col cols="12" v-show="!isLoading">
      <image-viewer :origin="origin" :converted="converted" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import DragAndDrop from '~/components/DragAndDrop.vue'
import ImageUploader from '~/components/ImageUploader.vue'
import ImageViewer from '~/components/ImageViewer.vue'
import { Vue, Component } from 'vue-property-decorator'
import { Image } from '~/store/images'
import { Getter } from 'vuex-class'

@Component({
  components: { DragAndDrop, ImageUploader, ImageViewer },
})
export default class IndexPage extends Vue {
  expected = 0
  loaded = 0

  @Getter('images/dataURLofOrigins') origins!: string[]
  @Getter('images/dataURLofConverted') converteds!: string[]

  get origin() {
    return this.origins ? this.origins[0] : null
  }

  get converted() {
    return this.converteds ? this.converteds[0] : null
  }

  get isLoading() {
    return this.expected > 0 ? this.expected !== this.loaded : false
  }

  async uploaded(image: Image) {
    try {
      const dataURL = image.dataURL

      this.$store.commit('images/clearImages')

      if (dataURL) {
        const result = await this.$axios.post('/api/processing', {
          dataURL,
          pythonFileName: 'to_gray.py',
        })
        const convertedDataURL = result.data.join('')
        this.$store.commit('images/originImages', image)
        this.$store.commit('images/convertedImages', {
          id: 'C:' + image.id,
          file: image.file,
          dataURL: convertedDataURL,
        })
      }
      this.loaded++
      if (!this.isLoading) {
        this.loaded = 0
        this.expected = 0
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log(error)
      }
      alert('An error occurred while processing the image.')
      this.loaded++
    }
  }

  metadata(fileContext: File | File[]) {
    if (fileContext instanceof File) {
      this.expected = 1
    } else if (fileContext) {
      this.expected = fileContext.length
    } else {
      this.$store.commit('images/clearImages')
    }
  }
}
</script>
