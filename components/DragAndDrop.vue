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
import { Getter } from 'vuex-class'
import { Image } from '~/store/images'
import randomstring from 'randomstring'

@Component
export default class DragAndDrop extends Vue {
  fileContext: FileList | null = null
  elevation = 0
  color = 'gray'

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
