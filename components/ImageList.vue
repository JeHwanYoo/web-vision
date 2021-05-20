<template>
  <v-flex class="justify-center image-list">
    <v-btn
      class="d-block mb-2"
      width="100%"
      v-for="(image, index) in images"
      :key="index"
      :color="currentCursor === image ? 'primary' : 'gray'"
      @click="changeColor(image)"
      :disabled="disabled"
    >
      <div class="image-text">
        {{ image.id }}
      </div>
    </v-btn>
  </v-flex>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Image } from '~/store/images'

@Component
export default class ImageList extends Vue {
  @Prop() images!: Image[]
  @Prop({ default: false }) disabled!: boolean
  @Prop() currentCursor!: Image
  @Prop() setCursor!: (image: Image) => void

  changeColor(image: Image) {
    this.setCursor(image)
  }
}
</script>

<style lang="scss" scoped>
.image-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
}
</style>
