<template>
<span v-for="(p, idx) in pathSegs">
    <router-link v-if="idx > 0 && p.length > 0" :to="{ name: props.isFile ? 'detail' : 'browse', params: { path: '/' + pathSegs.slice(1, idx+1).join('/') } }">
        / {{p}}
    </router-link>
    <router-link v-if="idx == 0" :to="{name: 'browse', params: {path: '/'}}">
        (root) 
    </router-link>
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  path: string;
  isFile: boolean;
}

const props = defineProps<Props>()

const pathSegs = computed<string[]>(()  => {
  const segs = props.path.split("/");
  console.log("Attempting to navigate with path segs", segs);
  return segs
})


</script>


