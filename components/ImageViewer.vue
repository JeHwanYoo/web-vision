<template>
  <v-img
    class="d-block"
    :src="dataURL"
    :key="dataURL"
    width="100%"
    contain
  ></v-img>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component
export default class ImageViewer extends Vue {
  @Prop() dataURL!: string
}
</script>
