<template>
    <!-- TODO you need navigation left/right?! -->
  <div v-if="isLoading">
    <h3><PathLinks :path="path" :isFile="true"/> Loading....<v-icon :icon="mdiLoading"></v-icon></h3><!-- timerSand as well?-->
    <v-img class="mx-auto" height="800"
            lazy-src="https://picsum.photos/id/11/100/60"
            max-width="1800"
            src="https://bad.src/not/valid"
    >
        <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
            </div>
        </template>
    </v-img>
  </div>
  <div v-else>
    <!-- loading finished one way or the other, but might not have an image we support -->
    <h3><PathLinks :path="path" :isFile="true"/></h3>

    <div v-if="myImageUrl">
        <v-img v-if="myImageUrl" class="mx-auto" height="800" max-width="1800"
                :src="myImageUrl">
        </v-img>
        <v-container class="mx-auto">
            <v-row align-self="center">
                <v-col>Name</v-col>
                <v-col>{{ item.basename }}</v-col>
            </v-row>
            <v-row align-self="center">
                <v-col>Size</v-col>
                <v-col>{{ formatMB(item.size)}}</v-col>
            </v-row>
            <div v-if="exifData">
            <v-row align-self="center">
                <v-col>Camera</v-col>
                <v-col>{{exifData.Make}} / {{exifData.Model}}</v-col>
            </v-row>
            <v-row align-self="center">
                <v-col>Time: {{ exifData.DateTimeOriginal }}</v-col>
                <v-col v-if="exifData.latitude && exifData.longitude"><a :href="`https://www.openstreetmap.org/?mlat=${exifData.latitude}&mlon=${exifData.longitude}#map=15/${exifData.latitude}/${exifData.longitude}`">Location</a></v-col>
            </v-row>
            </div>
            <div v-else>
            <v-row align-self="center">
                <v-col>No camera metadata available</v-col>
            </v-row>
            </div>
        </v-container>
    </div>
    <div v-else>
        this text is shown for unsupported images/movies/or other files...
    </div>
    
  </div>
</template>

<script setup lang="ts">

import { inject, onMounted, onUnmounted, ref } from 'vue';
import { useFormatting } from '../composables/useFormatting';
const { formatMB } = useFormatting();
import { useRouter } from 'vue-router';
import { useCache } from '../composables/useCache';
const sfc = useCache();
import { mdiLoading } from '@mdi/js';
import PathLinks from '../components/PathLinks.vue';
import {parse} from 'exifr';
import type { WebDAVClient } from 'webdav';


interface Props {
  path: string;
}

const props = defineProps<Props>()
const client = inject('davClient') as WebDAVClient;

const isLoading = ref(true)
const item = ref()
const router = useRouter();
const myImageUrl = ref();
const exifData = ref();

const controller = new AbortController();

onMounted(async () => {
    const fItem = await client.getDirectoryContents(props.path);
    if (fItem.length != 1) {
        // Redirect to folder view
        router.push({name: "browse", params: {path: props.path}})
        return;
    }
    item.value = fItem[0];

    const si = await sfc.getFully(item.value, controller.signal);
    // TODO - only set the IMAGE URL if it's an image of some sort...
    if (si) {
        myImageUrl.value = URL.createObjectURL(new Blob([new Uint8Array(si.dataOriginal)], { type: si.mime }))
        try {
            exifData.value = await parse(si.dataOriginal);
        } catch (err) {
            // we'll just check for the prescence of exifData itself.
        }
    }
    isLoading.value = false
});

onUnmounted(() => {
    if (myImageUrl.value) {
        URL.revokeObjectURL(myImageUrl.value)
    };
    controller.abort();
});


</script>