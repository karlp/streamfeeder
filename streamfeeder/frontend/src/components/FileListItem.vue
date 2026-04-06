<template>
    <v-container class="mx-auto">
        <v-row>
        <v-col cols="2">
            <div v-if="isLoading">
                <v-img class="mx-auto" height="80" max-width="100"
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
                <v-img v-if="myImageUrl" class="mx-auto" height="80" max-width="100"
                        :src="myImageUrl">
                </v-img>
            </div>
        </v-col>
        <v-col>
            {{item.basename}} (Size: ~{{ formatMB(item.size) }})  Type: {{ item.mime }}
        </v-col>
    </v-row>
    </v-container>
</template>

<script setup lang="ts">
import {inject, onMounted, onUnmounted, ref} from 'vue';
import { useFormatting } from '../composables/useFormatting';
import { useIDB } from '../composables/useIDB';
import type { SFDB } from '../composables/useIDB';

const { formatMB } = useFormatting();
const { setItem, getItem } = useIDB();

const props = defineProps(["item"]);
const client = inject('davClient') as WebDAVClient;


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
    const dbi: SFDB["streamitem"] = await getItem(props.item.filename);
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