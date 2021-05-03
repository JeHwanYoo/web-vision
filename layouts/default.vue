<template>
  <v-app dark>
    <v-navigation-drawer v-if="isNavigationEnabled" v-model="drawer" fixed app>
      <v-list>
        <!-- <v-list-item v-for="(item, i) in items" :key="i">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item> -->
      </v-list>
    </v-navigation-drawer>
    <v-app-bar fixed app>
      <v-btn v-if="isNavigationEnabled" icon @click.stop="drawer = !drawer">
        <v-icon>mdi-chevron-{{ drawer ? 'left' : 'right' }}</v-icon>
      </v-btn>
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
  drawer = true
  title = 'Web Vision'
  copyright = `© ${new Date().getFullYear()} JeHwan Yoo`
  naviEnabledPaths = ['editor']

  get isNavigationEnabled(): boolean {
    return (
      !!this.$route.name && this.naviEnabledPaths.includes(this.$route.name)
    )
  }

  get version() {
    return 'v ' + project.version
  }
}
</script>
