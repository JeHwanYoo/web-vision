<template>
  <v-row>
    <v-col class="left-bar" ref="leftBar" cols="3">
      <v-btn class="d-block mb-2" color="gray" @click="back">RE-UPLOAD</v-btn>
      <image-list
        :images="images"
        :currentCursor="currentCursor"
        :setCursor="setCursor"
        :disabled="!loaded"
      ></image-list>
    </v-col>
    <v-col cols="9">
      <v-container class="py-0">
        <v-row>
          <v-col class="text-center" v-if="loaded">
            <image-viewer :dataURL="currentCursorURL" />
          </v-col>
          <v-col class="text-center" v-else>
            <v-progress-circular
              :size="300"
              :width="10"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <command-slots
              :commandList="commandList"
              @execute="execute"
              :disabled="!loaded"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Image } from '~/store/images'
import { Getter, Mutation } from 'vuex-class'
import ImageViewer from '~/components/ImageViewer.vue'
import CommandSlots from '~/components/CommandSlots.vue'
import ImageList from '~/components/ImageList.vue'
import { commandList } from '~/opencv/api/client'

@Component({
  components: { ImageViewer, CommandSlots, ImageList },
})
export default class EditorPage extends Vue {
  commandList = commandList
  @Getter('images/images') images!: Image[]
  @Getter('images/currentCursorURL') currentCursorURL!: string
  @Getter('images/loaded') loaded!: boolean
  @Getter('images/currentCursor') currentCursor!: Image
  @Mutation('images/clearImages') clearImages!: () => void
  @Mutation('images/setCursor') setCursor!: (image: Image) => void

  @Watch('images')
  scrollChange() {
    const container = this.$refs.leftBar as Element

    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }

  get currentDataURL() {
    return this.currentCursor ? this.currentCursor.dataURL : null
  }

  async execute(pythonFileName: string) {
    try {
      const newImage = await this.$store.dispatch('images/process', {
        image: this.currentCursor,
        pythonFileName,
      })

      if (!newImage) {
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

  back() {
    this.clearImages()
    this.$router.replace({ name: 'index' })
  }

  mounted() {
    if (this.images.length === 0) this.back()
  }
}
</script>

<style lang="scss" scoped>
.left-bar {
  max-height: 600px;
  overflow-y: auto;
}
</style>
