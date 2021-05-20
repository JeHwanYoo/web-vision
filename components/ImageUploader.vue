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
import { Getter } from 'vuex-class'
import { Image } from '~/store/images'
import randomstring from 'randomstring'

@Component
export default class ImageUploader extends Vue {
  fileContext: FileList | null = null

  @Getter('images/supportedExtensions') supportedExtensions!: string[]

  @Watch('fileContext')
  onFileContextChanged(fileContext: FileList) {
    this.$emit('metadata', fileContext)

    if (
      Object.values(fileContext).every(file =>
        this.supportedExtensions.includes(file.type),
      )
    ) {
      fileContext.forEach(file => {
        const fileReader = new FileReader()
        fileReader.addEventListener('load', e => {
          this.$emit('upload', {
            id: randomstring.generate() + Date.now().toString(),
            file,
            dataURL: e.target?.result,
          } as Image)
        })
        fileReader.readAsDataURL(file)
      })
    } else {
      this.$emit('error', {
        code: 'file not supported',
      })
    }
  }
}
</script>
