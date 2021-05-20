<template>
  <div>
    <v-btn
      class="mr-2 mb-2"
      v-for="(command, index) in commandList"
      :key="index"
      @click="click(command.pythonFileName)"
      >{{ command.label }}
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Command from '~/opencv/api/command'

@Component
export default class ImageViewer extends Vue {
  @Prop() commandList!: Command[]

  click(pythonFileName: string) {
    this.$emit('execute', pythonFileName)
  }
}
</script>
