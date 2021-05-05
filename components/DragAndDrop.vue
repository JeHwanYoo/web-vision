<template>
  <v-sheet
    class="drag text-center"
    height="200px"
    color="gray"
    rounded
    @drop.prevent="onDrop"
    @dragover.prevent
    @dragenter="onDragenter"
    @dragleave="onDragleave"
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
    target.classList.add('dragenter')
  }

  onDragleave(evt: DragEvent) {
    const target = evt.target as HTMLDivElement
    target.classList.remove('dragenter')
  }

  onDrop(evt: DragEvent) {
    const target = evt.target as HTMLDivElement
    const droppedFiles = evt.dataTransfer?.files
    target.classList.remove('dragenter')
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
  border-style: dashed;
  border-color: gray;
}
.dragenter {
  border-color: wheat;
}
</style>
