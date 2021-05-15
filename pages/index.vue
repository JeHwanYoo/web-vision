<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-img class="my-5 mx-auto" src="/logo.png" width="324px" height="400px">
      </v-img>
    </v-col>
    <v-col cols="8">
      <drag-and-drop @upload="uploaded" @metadata="metadata" />
    </v-col>
    <v-col cols="8">
      <image-uploader @upload="uploaded" @metadata="metadata" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import DragAndDrop from '~/components/DragAndDrop.vue'
import ImageUploader from '~/components/ImageUploader.vue'
import ImageViewer from '~/components/ImageViewer.vue'
import { Vue, Component } from 'vue-property-decorator'
import { Image } from '~/store/images'
import { Getter } from 'vuex-class'

@Component({
  components: { DragAndDrop, ImageUploader, ImageViewer },
})
export default class IndexPage extends Vue {
  expected = 0

  @Getter('images/originImages') originImages!: Image[]

  uploaded(image: Image) {
    this.$store.commit('images/pushOriginImages', image)
    if (this.expected > 0 && this.expected === this.originImages.length) {
      this.$router.replace({ name: 'editor' })
    }
  }

  metadata(fileContext: File | File[]) {
    if (fileContext instanceof File) {
      this.expected = 1
    } else if (fileContext.length > 0) {
      this.expected = fileContext.length
    }
  }

  mounted() {
    console.log(this.$route)
  }
}
</script>
