<template>
    <!-- TODO you need navigation left/right?! -->
  <div v-if="isLoading">
    <h3>Loading details of {{ path }}</h3>
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
    <h3>Details of 
      <span v-for="(p, idx) in pathSegs">
        <router-link v-if="idx > 0 && p.length > 0" :to="{ name: idx < pathSegs.length - 1 ? 'browse' : 'detail', params: { path: '/' + pathSegs.slice(1, idx+1).join('/') } }">
          / {{p}}
        </router-link>
        <router-link v-if="idx == 0" :to="{name: 'browse', params: {path: '/'}}">
          (root) 
        </router-link>
      </span>

    </h3>

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
            <v-row align-self="center">
                <v-col>Camera</v-col>
                <v-col>{{exifData.Make}} / {{exifData.Model}}</v-col>
            </v-row>
            <v-row align-self="center">
                <v-col>Time: {{ exifData.DateTimeOriginal }}</v-col>
                <v-col><a :href="`https://www.openstreetmap.org/?mlat=${exifData.latitude}&mlon=${exifData.longitude}#map=15/${exifData.latitude}/${exifData.longitude}`">Location</a></v-col>
            </v-row>
        </v-container>
    </div>
    <div v-else>
        this text is shown for unsupported images/movies/or other files...
    </div>
    
  </div>
</template>

<script setup lang="ts">

import { computed, inject, onMounted, onUnmounted, ref } from 'vue';
import { useFormatting } from '../composables/useFormatting';
import { useIDB } from '../composables/useIDB';
import { useRouter } from 'vue-router';
import type { WebDAVClient } from 'webdav';
// import type { IDBPDatabase } from 'idb';
const { formatMB } = useFormatting();
const { setItem, getItem } = useIDB();
import type { SFDB } from '../composables/useIDB';
import {parse} from 'exifr';

const props = defineProps(["path"]);

const client = inject('davClient') as WebDAVClient;

const isLoading = ref(true)
const item = ref()
const router = useRouter();
const loadTime = ref(0);
const loadSource = ref("");
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
    // get a timestamp to check how much we saved!
    const startTime = performance.now();

    // OK, that's the webdav metadata,  but... now we need the file itself...
    // sooo, look in indexdb, for the original....
    const dbi: SFDB["streamitem"] = await getItem(props.path);
    let buff;
    if (dbi) {
        loadSource.value = "idb";
        console.log("ok? got one?", dbi);
        if (item.value.mime == "image/jpeg") {
            if (dbi.dataOriginal) {
                console.log("and it had original data, using that for now");
                buff = dbi.dataOriginal;
                myImageUrl.value = URL.createObjectURL(new Blob([buff], { type: item.value.mime }));
            } else {
                console.warn("in cache, jpg, but no data? forgot to save?");
            }
        } else {
            console.log("was in our cache, but not an image... fix that later..");
        }
    } else {
        loadSource.value = "webdav";
        console.log("didn't find it in cache, better fetch the whole blob and save it...");
        if (item.value.mime == "image/jpeg") {
            buff = await client.getFileContents(item.value.filename, { signal: controller.signal });
            myImageUrl.value = URL.createObjectURL(new Blob([buff], { type: item.value.mime }));
            const tocache: SFDB["streamitem"] = {
                key: item.value.filename,
                basename: item.value.basename,
                dataOriginal: buff,
            }
            setItem(tocache.key, tocache);
        } else {
            console.log("Need to handle this better....")
        }
    }
    loadTime.value = performance.now() - startTime;
    // exif is separate from timing at least...
    exifData.value = await parse(buff);
    isLoading.value = false
});

onUnmounted(() => {
    if (myImageUrl.value) {
        URL.revokeObjectURL(myImageUrl.value)
    };
    controller.abort();
});

const pathSegs = computed(() => {
  const segs = props.path.split("/"); //.slice(0, -1)
  console.log("Attempting to navigate with path segs", segs);
  return segs
})




</script>