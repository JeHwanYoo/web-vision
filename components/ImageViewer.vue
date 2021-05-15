<template>
  <v-container class="text-center">
    <v-row>
      <v-col cols="6">
        <v-img :src="origin"></v-img>
      </v-col>
      <v-col cols="6">
        <v-img :src="converted"></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class ImageViewer extends Vue {
  @Prop() origin!: string
  @Prop() converted!: string
}
</script>
