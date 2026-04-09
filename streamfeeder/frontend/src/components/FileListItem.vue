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
                            <v-btn label="Approve" color="success" @click="handleApprove" :disabled="disableApprove">Approve</v-btn>
                            <v-btn label="Unapprove" color="warning" @click="handleUnapprove" :disabled="disableUnapprove">Private</v-btn>
                        </v-col>
                    </v-row>
                    <v-row density="compact">
                        <v-col cols="8">
                            <v-text-field v-model="caption" label="Caption" clearable hint="Enter a caption for this file" @keyup.enter="handleCaption"></v-text-field>
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
import type { FileStat } from 'webdav';
const sfc = useCache();


interface Props {
  item: FileStat
}

const props = defineProps<Props>()

// const emit = defineEmits<{
//   approve: [item: FileStat]  // TODO - should be a streamitem?
//   unapprove: [item: FileStat]
//   caption: [item: FileStat, caption: string]
// }>()

const caption = ref();
const pendingLoad = ref(true);
const pendingApprove = ref(true);  // TODO use this to animate progress and shit...
const pendingUnapprove = ref(true);  // TODO use this to animate progress and shit...
const pendingCaption = ref(true);  // TODO use this to animate progress and shit...

const disableApprove = ref(false);
const disableUnapprove = ref(false);


// Man, doing this one by one is _great_ for the design, but it would make a shit heap of db requests to the backedn to look up the perms of each file...?
// ok, who the fuck is firing to the backend, in what fucking order? 
// But at the same time, how else would we do it?  We can't / don't want to do some sort of folder grouping, and things might move...
// (We don't care about moving things, we're expecting immutable sources.... so... yeah. Look it up per file, .... who caches all taht shit?! Pinia?)
// Pinia sounds like the right place to store things like our webdav directory listings and shit?


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
    // umm, what if we didn't have an si?!

    try {
        const response = await fetch("/api/desk/finfo/" + props.item.filename);
        if (!response.ok) {
            // I think we need a prop or emit or something that says "we've failed" and the top level view can have a "retry" button/timer that retries all children that failed?
            console.log("Not... sure what we do here?  ");
        }
        const data = await response.json();
        if (data.filename != props.item.filename) {
            console.error("shits' sbusted yo...");
        }
        // if (data.caption) {

        // }
        // undefined stays undef?
        caption.value = data.caption;
        if (data.approval !== undefined) {
            if (data.approval) {
                disableApprove.value = true;
            } else {
                disableUnapprove.value = true;
            }
        }
    } catch (err) {
        console.log("same as above failure....?!");
    }




    isLoading.value = false;
});

onUnmounted(() => {
    if (myImageUrl.value) {
        URL.revokeObjectURL(myImageUrl.value)
    };
    controller.abort();
});


async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST", // Specify the method
    headers: {
      "Content-Type": "application/json", // Tell the server you're sending JSON
    },
    body: JSON.stringify(data), // The data must be a string
  });

  return response.json(); // Parses the JSON response from the server
}

async function handleApprove(ev)
{
    pendingApprove.value = true;
    console.log("Approving", props.item.basename);
    const data = {
        filename: props.item.filename
    }
    try {
        await postData("/api/desk/approve", data)
    } catch (err) {
        // reset states and shit?
        console.log("best effort, we failed: ", err)
    }
    pendingApprove.value = false;

}

async function handleUnapprove(ev)
{
    console.log("UNapproving", props.item.basename);
    pendingApprove.value = true;
    console.log("Approving", props.item.basename);
    const data = {
        filename: props.item.filename
    }
    try {
        await postData("/api/desk/unapprove", data)
    } catch (err) {
        // reset states and shit?
        console.log("best effort, we failed: ", err)
    }
    pendingApprove.value = false;
}

async function handleCaption(ev)
{
    console.log("Capitioning", props.item.basename, "with: ", caption.value);
    pendingCaption.value = true;
    const data = {
        filename: props.item.filename,
        caption: caption.value,
    }
    try {
        await postData("/api/desk/caption", data)
    } catch (err) {
        // reset states and shit?
        console.log("best effort, we failed: ", err)
    }
    pendingCaption.value = false;
}

</script>