<template>
  <div v-if="isLoading">
    <h3>Loading contents of {{ path }}</h3>
  </div>
  <div v-else>
    <h3>Contents of 
      <span v-for="(p, idx) in pathSegs">
        <router-link v-if="idx > 0 && p.length > 0" :to="{ name: 'browse', params: { path: '/' + pathSegs.slice(1, idx+1).join('/') } }">
          / {{p}}
        </router-link>
        <router-link v-if="idx == 0" :to="{name: 'browse', params: {path: '/'}}">
          (root) 
        </router-link>
      </span>
      </h3>
    <FolderComponent :items="dirItems"/>
  </div>
</template>

<script setup lang="ts">

import { computed, inject, onMounted, ref } from 'vue';
import FolderComponent from '../components/FolderComponent.vue';

const props = defineProps(["path"]);
const client = inject('davClient');
const isLoading = ref(true)
const dirItems =ref(null)

onMounted(async () => {
  const directoryItems = await client.getDirectoryContents(props.path);
  console.log("Opened up path: ", props.path, "and got: ", directoryItems);
  isLoading.value = false
  dirItems.value = directoryItems;
})

const pathSegs = computed(() => {
  const segs = props.path.split("/")
  console.log("Attempting to navigate with path segs", segs);
  return segs
})


</script>