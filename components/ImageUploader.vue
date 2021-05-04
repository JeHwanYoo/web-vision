<template>
  <v-file-input
    v-model="fileContext"
    accept="image/png, image/jpeg"
    prepend-icon="mdi-camera"
    placeholder="Select an Image (png, jpeg)"
    multiple
  >
  </v-file-input>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Image } from '~/store/images'
import randomstring from 'randomstring'

@Component
export default class ImageUploader extends Vue {
  fileContext: File | File[] | null = null

  @Watch('fileContext')
  onFileContextChanged(fileContext: File | File[] | null) {
    this.$emit('metadata', fileContext)
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
      fileContext?.forEach(file => {
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
