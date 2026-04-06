<template>
    <v-container fluid>
        <v-row density="compact">
            <v-col cols="2">
                <!-- FIXME - loading also implies fetching data from the backend for captions/approval state! -->
                <router-link :to="{name: 'detail', params: {path: item.filename}}">
                <div v-if="isLoading">
                    <v-img  height="80" max-width="100"
                    lazy-src="https://picsum.photos/id/11/100/60"
                    src="https://bad.src/not/valid">
                        <template v-slot:placeholder>
                            <div class="d-flex align-center justify-center fill-height">
                                <v-progress-circular
                                color="grey-lighten-4"
                                indeterminate
                                ></v-progress-circular>
                            </div>
                        </template>
                    </v-img>
                </div>
                <div v-else>
                    <v-img v-if="myImageUrl"  height="80" max-width="100" :src="myImageUrl"></v-img>
                </div>
                </router-link>
            </v-col>
            <v-col>
                <v-container fluid>
                    <v-row density="compact">
                        <v-col>
                            <router-link :to="{name: 'detail', params: {path: item.filename}}">{{item.basename}}</router-link> (Size: ~{{ formatMB(item.size) }})  Type: {{ item.mime }}
                        </v-col>
                        <v-col>
                            <!-- GTODO this needs to load approval state ?-->
                            <v-btn label="Approve" color="success" @click="$emit('approve', props.item)">Approve</v-btn>
                            <v-btn label="Unapprove" color="warning" @click="$emit('unapprove', props.item)">Private</v-btn>
                        </v-col>
                    </v-row>
                    <v-row density="compact">
                        <v-col cols="8">
                            <v-text-field v-model="caption" label="Caption" clearable hint="Enter a caption for this file" @keyup.enter="$emit('caption', props.item, caption)"></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import {inject, onMounted, onUnmounted, ref} from 'vue';
import { useFormatting } from '../composables/useFormatting';
import { useIDB } from '../composables/useIDB';
import type { SFDB } from '../composables/useIDB';
import type { WebDAVClient } from 'webdav';

const { formatMB } = useFormatting();
const { setItem, getItem } = useIDB();

const props = defineProps(["item"]);
const client = inject('davClient') as WebDAVClient;

const caption = ref();

// Man, doing this one by one is _great_ for the design, but it would make a shit heap of db requests to the backedn to look up the perms of each file...?

/*
    So, we really want to look in our local cache for _thumnbnails_ for this,
    because, pulling a 3-10MB raw image in, even just for the full view is no good
    but, it gets us started.
*/
const isLoading = ref(true);
const loadTime = ref(0);
const loadSource = ref("");
const myImageUrl = ref();

const controller = new AbortController();

onMounted(async () => {
    // get a timestamp to check how much we saved!
    const startTime = performance.now();

    // we got the webdav stat info already,  but... now we need the file itself...
    // sooo, look in indexdb, for , well, the original now, but should be a thumb.
    const dbi = await getItem(props.item.filename);
    if (dbi) {
        loadSource.value = "idb";
        console.log("ok? got one?", dbi);
        if (props.item.mime == "image/jpeg") {
            if (dbi.dataOriginal) {
                console.log("and it had original data, using that for now");
                myImageUrl.value = URL.createObjectURL(new Blob([dbi.dataOriginal], { type: props.item.mime }));
            } else {
                console.warn("in cache, jpg, but no data? forgot to save?");
            }
        } else {
            console.log("was in our cache, but not an image... fix that later..");
        }
    } else {
        loadSource.value = "webdav";
        console.log("didn't find it in cache, better fetch the whole blob and save it...");
        if (props.item.mime == "image/jpeg") {
            // this needs to accept an abort!
            const buff: Buffer = await client.getFileContents(props.item.filename, { signal: controller.signal });
            myImageUrl.value = URL.createObjectURL(new Blob([buff], { type: props.item.mime }));
            const tocache: SFDB["streamitem"] = {
                key: props.item.filename,
                basename: props.item.basename,
                dataOriginal: buff,
            }
            setItem(tocache.key, tocache);
        } else {
            console.log("Need to handle this better....")
        }
    }
    loadTime.value = performance.now() - startTime;
    isLoading.value = false
    console.log("Loaded ", props.item.basename, "from: ", loadSource.value, "in time: ", loadTime.value);
});

onUnmounted(() => {
    if (myImageUrl.value) {
        URL.revokeObjectURL(myImageUrl.value)
    };
    controller.abort();
});

</script>