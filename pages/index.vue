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

@Component({
  components: { DragAndDrop, ImageUploader, ImageViewer },
})
export default class IndexPage extends Vue {
  origin: string | null = null
  converted: string | null = null

  uploaded(dataURL: string) {
    if (dataURL) {
      this.$axios
        .post('/api/conversion/gray', {
          dataURL,
        })
        .then(result => {
          const convertedDataURL = result.data.join('')
          this.origin = dataURL
          this.converted = convertedDataURL
        })
        .catch(error => {
          alert('An error occurred while processing the image.')
        })
    }
  }
}
</script>
