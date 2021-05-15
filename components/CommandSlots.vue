<template>
  <v-flex>
    <v-btn @click="click('to_gray.py')">to gray</v-btn>
    <v-btn @click="click('threshold_127.py')">threshold binary(127)</v-btn>
    <v-btn @click="click('canny.py')">canny edge(50, 70)</v-btn>
  </v-flex>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class ImageViewer extends Vue {
  click(command: string) {
    this.$emit('command', command)
  }
}
</script>
