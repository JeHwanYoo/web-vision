<template>
  <v-file-input
    v-model="file"
    accept="image/png, image/jpeg"
    prepend-icon="mdi-camera"
    placeholder="Select an Image (png, jpeg)"
    @change="changed"
  >
  </v-file-input>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class ImageUploader extends Vue {
  file = null

  changed(file: File) {
    const fileReader = new FileReader()
    fileReader.addEventListener('load', e => {
      this.$emit('upload', e.target?.result)
    })
    fileReader.readAsDataURL(file)
  }
}
</script>
