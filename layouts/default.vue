<template>
  <v-app dark>
    <v-app-bar fixed app>
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>{{ copyright }}</span>
      &nbsp; &nbsp;
      <span>{{ version }}</span>
      <v-spacer></v-spacer>
      <span>
        <v-btn
          link
          target="_blank"
          href="https://github.com/JeHwanYoo/web-vision.git"
        >
          <v-icon>mdi-github</v-icon>
          &nbsp; View open source on GitHub
        </v-btn>
      </span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import project from '~/package.json'

@Component
export default class DefaultLayout extends Vue {
  fixed = true
  app = true
  title = 'Web Vision'
  copyright = `© ${new Date().getFullYear()} JeHwan Yoo`

  get version() {
    return 'v ' + project.version
  }
}
</script>
