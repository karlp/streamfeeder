<template>
  <div v-if="isLoading">
    <h3><PathLinks :path="path" :isFile="false"/> Loading....<v-icon :icon="mdiLoading"></v-icon></h3><!-- timerSand as well?-->
  </div>
  <div v-else>
    <h3><PathLinks :path="path" :isFile="false"/></h3>
    <v-list>
        <v-list-item v-for="fent in dirItems">
            <router-link v-if="fent.type == 'directory'" :to="{ name: 'browse', params: { path: fent.filename } }">
                {{ fent.filename }}
            </router-link>
            <div v-else>
                <!-- <router-link :to="{name: 'detail', params: {path: fent.filename}}"> -->
                    <FileListItem :item="fent" />
                <!-- </router-link> -->
            </div>
        </v-list-item>
    </v-list>
  </div>
</template>

<script setup lang="ts">

import { inject, onMounted, ref } from 'vue';
import FileListItem from '../components/FileListItem.vue';

import PathLinks from '../components/PathLinks.vue';
import type { FileStat, WebDAVClient } from 'webdav';
import { mdiLoading } from '@mdi/js';

interface Props {
  path: string;
}

const props = defineProps<Props>()
const client = inject('davClient') as WebDAVClient;
const isLoading = ref(true)
const dirItems = ref()

onMounted(async () => {
  const directoryItems = await client.getDirectoryContents(props.path);
  console.log("Opened up path: ", props.path, "and got: ", directoryItems);
  isLoading.value = false
  // OK, problem, if we get 2600 files here... it kills firefox...
  // pagination is teh suck, but we need _somethign here?
  // ... I mean,.... do I? it's a huge problem, and not really somethign I need for my realllll installation
  dirItems.value = directoryItems;
})

// async function handleUnapprove(item: FileStat) {
//   console.log("unapprove", item.basename);
// }

// async function handleApprove(item: FileStat) {
//   console.log("Approve", item.basename);
// }

// async function handleCaption(item: FileStat, caption: string) {
//   console.log("caption", item.basename, caption);
// }

</script>