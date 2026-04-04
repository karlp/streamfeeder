<script setup lang="ts">
import { provide, ref } from 'vue';
import { RouterView } from 'vue-router';

const drawer = ref(true);
const enableDev = ref(0);
const developerMode = ref(false);
function clickTitle() {
  enableDev.value++;
  if (enableDev.value > 5) {
    developerMode.value = true;
  }
}

provide('developerMode', developerMode);

</script>

<template>
  <v-app>
    <v-layout class="rounded rounded-md border">
      <v-app-bar color="primary">
        <template #prepend>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        </template>
        <v-app-bar-title @click="clickTitle">StreamFeeder</v-app-bar-title>
      </v-app-bar>
      <v-navigation-drawer
        v-model="drawer"
        :location="$vuetify.display.mobile ? 'bottom' : undefined"
      >
        <v-list nav>
          <v-list-item link :to="{name: 'home'}">Home</v-list-item>
          <v-list-item link :to="{name: 'l1'}">Test1</v-list-item>
          <v-list-item v-if="developerMode" link :to="{name: 'dev'}">Developer</v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <RouterView />
      </v-main>
    </v-layout>
  </v-app>
</template>
