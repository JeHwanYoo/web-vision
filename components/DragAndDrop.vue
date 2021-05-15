<template>
  <v-sheet
    class="drag text-center"
    height="200px"
    rounded
    @drop.prevent="onDrop"
    @dragover.prevent
    @dragenter="onDragenter"
    @dragleave="onDragleave"
    :elevation="elevation"
    :color="color"
  >
    Drag Image Here
  </v-sheet>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Image } from '~/store/images'
import randomstring from 'randomstring'

@Component
export default class DragAndDrop extends Vue {
  fileContext: File | FileList | null = null
  elevation = 0
  color = 'gray'

  @Watch('fileContext')
  onFileContextChanged(fileContext: File | FileList | null) {
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

  onDragenter(evt: DragEvent) {
    const target = evt.target as HTMLDivElement
    this.elevation = 10
    this.color = 'success'
  }

  onDragleave(evt: DragEvent) {
    const target = evt.target as HTMLDivElement
    this.elevation = 0
    this.color = 'gray'
  }

  onDrop(evt: DragEvent) {
    const target = evt.target as HTMLDivElement
    const droppedFiles = evt.dataTransfer?.files
    this.elevation = 0
    this.color = 'gray'
    if (droppedFiles) {
      this.fileContext = droppedFiles
    }
  }
}
</script>

<style lang="scss" scoped>
.drag {
  font-size: 2rem;
  line-height: 200px;
}
</style>
