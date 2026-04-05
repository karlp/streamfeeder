<script setup lang="ts">
import { provide, ref } from 'vue';
import { RouterView } from 'vue-router';
import { createClient } from 'webdav';

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

// So, can this get... provided by the user? can they select what dav server they want to work with?
// I'm not a fan of this, but I'm also not a fan of webdav giving full user rights, when I just want to read...
// I want/need to save it, because fuck entering every time you open the app.
// right now, one server spun up for the (lol) single user is... fine I guess, but the _server_ doesn't really need to be single user at all.
// (And I shouldn't design it like that...)
const davEndpoint = import.meta.env.VITE_SF_DAV_ENDPOINT;
const davUsername = import.meta.env.VITE_SF_DAV_USERNAME;
const davPassword = import.meta.env.VITE_SF_DAV_PASSWORD;

const client = createClient(
    davEndpoint,
    {
        username: davUsername,
        password: davPassword
    }
);
provide("davClient", client);


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
          <v-list-item link :to="{name: 'browse', params: { path: '/' }}">Browse DAV</v-list-item>
          <v-list-item v-if="developerMode" link :to="{name: 'dev'}">Developer</v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <RouterView :key="$route.fullPath"/>
      </v-main>
    </v-layout>
  </v-app>
</template>
