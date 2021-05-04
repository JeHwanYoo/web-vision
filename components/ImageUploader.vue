<template>
  <v-file-input
    v-model="model"
    accept="image/png, image/jpeg"
    prepend-icon="mdi-camera"
    placeholder="Select an Image (png, jpeg)"
    @change="changed"
  >
  </v-file-input>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Image } from '~/store/images'
import randomstring from 'randomstring'

@Component
export default class ImageUploader extends Vue {
  model = null

  changed(fileContext: File | File[]) {
    if (fileContext instanceof File) {
      const fileReader = new FileReader()
      fileReader.addEventListener('load', e => {
        this.$emit('upload', {
          id: randomstring.generate(),
          file: fileContext,
          dataURL: e.target?.result,
        } as Image)
      })
      fileReader.readAsDataURL(fileContext)
    } else {
      fileContext.forEach(file => {
        const fileReader = new FileReader()
        fileReader.addEventListener('load', e => {
          this.$emit('upload', {
            id: randomstring.generate(),
            file,
            dataURL: e.target?.result,
          } as Image)
        })
        fileReader.readAsDataURL(file)
      })
    }
  }
}
</script>
