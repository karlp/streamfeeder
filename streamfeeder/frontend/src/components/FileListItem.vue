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
import { onMounted, onUnmounted, ref} from 'vue';
import { useFormatting } from '../composables/useFormatting';
const { formatMB } = useFormatting();
import { useCache } from '../composables/useCache';
const sfc = useCache();


const props = defineProps(["item"]);

const caption = ref();

// Man, doing this one by one is _great_ for the design, but it would make a shit heap of db requests to the backedn to look up the perms of each file...?

/*
    So, we really want to look in our local cache for _thumnbnails_ for this,
    because, pulling a 3-10MB raw image in, even just for the full view is no good
    but, it gets us started.
*/
const isLoading = ref(true);
const myImageUrl = ref();

const controller = new AbortController();

onMounted(async () => {

    const si = await sfc.getFully(props.item, controller.signal);
    // TODO - only set the IMAGE URL if it's an image of some sort...
    if (si) {
        // For other files, we need... somethign else?
        myImageUrl.value = URL.createObjectURL(new Blob([new Uint8Array(si.dataOriginal)], { type: si.mime }))
    }


    isLoading.value = false;
});

onUnmounted(() => {
    if (myImageUrl.value) {
        URL.revokeObjectURL(myImageUrl.value)
    };
    controller.abort();
});

</script>