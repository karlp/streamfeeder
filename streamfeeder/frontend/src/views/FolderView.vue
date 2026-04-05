<template>
  <div v-if="isLoading">
    <h3>Loading contents of {{ path }}</h3>
  </div>
  <div v-else>
    <h3>Contents of {{ path }}</h3>
    <FolderComponent :items="dirItems"/>
  </div>
</template>

<script setup lang="ts">

import { inject, onMounted, ref } from 'vue';
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


</script>