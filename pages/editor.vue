<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <image-viewer :origin="dataURLofOrigins[0]" :converted="currentDataURL" />
    </v-col>

    <v-col cols="12">
      <command-slots @command="executeCommand" />
    </v-col>
    <v-col>{{ currentDataURL }}</v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Image } from '~/store/images'
import { Getter, Mutation } from 'vuex-class'
import ImageViewer from '~/components/ImageViewer.vue'
import CommandSlots from '~/components/CommandSlots.vue'

@Component({
  components: { ImageViewer, CommandSlots },
})
export default class EditorPage extends Vue {
  @Getter('images/originImages') originImages!: Image[]
  @Getter('images/convertedImages') convertedImages!: Image[]
  @Getter('images/dataURLofOrigins') dataURLofOrigins!: string[]
  @Getter('images/dataURLofConverted') dataURLofConverted!: string[]
  @Getter('images/isLoading') isLoading!: boolean
  @Getter('images/currentConvertedImage') currentConvertedImage!: Image
  @Mutation('images/startLoading') startLoading!: (payload: number) => void

  get currentDataURL() {
    return this.currentConvertedImage
      ? this.currentConvertedImage.dataURL
      : null
  }

  async executeCommand(command: string) {
    try {
      this.startLoading(1)
      const newImage = await this.$store.dispatch('images/upload', {
        image: this.originImages[0],
        pythonFileName: command,
      })
      if (newImage) {
        console.log(newImage)
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.error('base64 Image error')
        }
        alert('An error occurred while processing the image.')
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(error)
      }
      alert('An error occurred while processing the image.')
    }
  }

  mounted() {
    if (this.originImages.length === 0) this.$router.replace({ name: 'index' })
    console.log(this.dataURLofOrigins)
  }
}
</script>
