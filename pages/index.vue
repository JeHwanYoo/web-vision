<template>
  <v-row v-if="loading" justify="center" align="center">
    <v-col class="text-center">
      <v-progress-circular
        :size="300"
        :width="10"
        indeterminate
        color="primary"
      ></v-progress-circular>
    </v-col>
  </v-row>
  <v-row v-else justify="center" align="center">
    <v-col cols="12">
      <v-img class="my-5 mx-auto" src="/logo.png" width="324px" height="400px">
      </v-img>
    </v-col>
    <v-col cols="8">
      <drag-and-drop @upload="upload" @metadata="metadata" @error="error" />
    </v-col>
    <v-col cols="8">
      <image-uploader @upload="upload" @metadata="metadata" />
    </v-col>
    <v-snackbar v-model="snackbar" :timeout="2000">
      Supported extensions: {{ supportedExtensions }}
    </v-snackbar>
  </v-row>
</template>

<script lang="ts">
import DragAndDrop from '~/components/DragAndDrop.vue'
import ImageUploader from '~/components/ImageUploader.vue'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Image } from '~/store/images'
import { Getter, Action } from 'vuex-class'

@Component({
  components: { DragAndDrop, ImageUploader },
})
export default class IndexPage extends Vue {
  snackbar = false
  expected = 0
  loading = false

  @Getter('images/images') images!: Image[]
  @Getter('images/supportedExtensions') supportedExtensions!: string[]
  @Action('images/upload') uploadImage!: (image: Image) => Promise<Image | null>

  upload(image: Image) {
    this.uploadImage(image)
  }

  @Watch('images')
  onUploaded() {
    if (this.expected > 0 && this.expected === this.images.length) {
      this.$router.replace({ name: 'editor' })
    } else {
      this.loading = true
    }
  }

  metadata(fileContext: FileList) {
    this.expected = fileContext.length
  }

  error(error: any) {
    this.snackbar = error.code === 'file not supported'
  }
}
</script>
