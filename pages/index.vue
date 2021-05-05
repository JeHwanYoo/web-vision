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
  @Getter('images/dataURLofOrigins') origins!: string[]
  @Getter('images/dataURLofConverted') converteds!: string[]
  @Getter('images/isLoading') isLoading!: boolean

  get origin() {
    return this.origins ? this.origins[0] : null
  }

  get converted() {
    return this.converteds ? this.converteds[0] : null
  }

  async uploaded(image: Image) {
    try {
      const newImage = await this.$store.dispatch('images/upload', {
        image,
        pythonFileName: 'to_gray.py',
      })
      if (newImage) {
        console.log(newImage)
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.error('base64 Image error')
        }
        alert('An error occurred while processing the image.')
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(error)
      }
      alert('An error occurred while processing the image.')
    }
  }

  metadata(fileContext: File | File[]) {
    console.log(fileContext)
    if (fileContext instanceof File) {
      this.$store.commit('images/startLoading', 1)
    } else if (fileContext.length > 0) {
      this.$store.commit('images/startLoading', fileContext.length)
    } else {
      this.$store.commit('images/clearImages')
    }
  }
}
</script>
