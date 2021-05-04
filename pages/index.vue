<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-img class="my-5 mx-auto" src="/logo.png" width="324px" height="400px">
      </v-img>
    </v-col>
    <v-col cols="8"> <drag-and-drop @upload="uploaded" /> </v-col>
    <v-col cols="8"> <image-uploader @upload="uploaded" /> </v-col>
    <v-col cols="12">
      <image-viewer :origin="origin" :converted="converted" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import DragAndDrop from '~/components/DragAndDrop.vue'
import ImageUploader from '~/components/ImageUploader.vue'
import ImageViewer from '~/components/ImageViewer.vue'
import { Vue, Component } from 'vue-property-decorator'
import randomstring from 'randomstring'
import { Image } from '~/store/images'
import { Getter } from 'vuex-class'

@Component({
  components: { DragAndDrop, ImageUploader, ImageViewer },
})
export default class IndexPage extends Vue {
  @Getter('images/dataURLofOrigins') origins!: string[]
  @Getter('images/dataURLofConverted') converteds!: string[]

  get origin() {
    return this.origins ? this.origins[0] : null
  }

  get converted() {
    return this.converteds ? this.converteds[0] : null
  }

  uploaded(image: Image) {
    const dataURL = image.dataURL
    if (dataURL) {
      this.$axios
        .post('/api/processing', {
          dataURL,
          pythonFileName: 'to_gray.py',
        })
        .then(result => {
          const convertedDataURL = result.data.join('')
          this.$store.commit('images/originImages', image)
          this.$store.commit('images/convertedImages', {
            id: 'C:' + image.id,
            file: image.file,
            dataURL: convertedDataURL,
          })
          console.log(this.$store)
        })
        .catch(error => {
          if (process.env.NODE_ENV === 'development') {
            console.log(error)
          }
          alert('An error occurred while processing the image.')
        })
    }
  }
}
</script>
