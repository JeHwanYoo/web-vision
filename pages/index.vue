<template>
  <v-row justify="center" align="center">
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
import { Vue, Component } from 'vue-property-decorator'
import { Image } from '~/store/images'
import { Getter } from 'vuex-class'

@Component({
  components: { DragAndDrop, ImageUploader },
})
export default class IndexPage extends Vue {
  expected = 0
  snackbar = false

  @Getter('images/images') images!: Image[]
  @Getter('images/supportedExtensions') supportedExtensions!: string[]

  upload(image: Image) {
    this.$store.commit('images/pushImage', image)
    if (this.expected > 0 && this.expected === this.images.length) {
      this.$store.commit('images/setCursor', this.images[0])
      this.$router.replace({ name: 'editor' })
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
