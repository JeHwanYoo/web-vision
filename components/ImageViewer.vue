<template>
  <v-card class="d-flex justify-center">
    <v-img
      class="d-block"
      :src="dataURL"
      :key="dataURL"
      max-width="640px"
      contain
    ></v-img>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component
export default class ImageViewer extends Vue {
  @Prop() dataURL!: string
}
</script>
