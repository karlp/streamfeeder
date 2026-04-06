<template>
    <h1>S3kr1t devel0per page</h1>
    <v-container class="mx-auto">
        <v-row align-self="center">
            <v-col>
                <v-card title="IndexedDB" class="mx-auto">
                    <template v-slot:prepend>
                    <v-icon color="success" :icon="mdiDatabaseSettings"></v-icon>
                    </template>
                    <p>How much are we using in the IndexedDB as local cache?</p>
                    <v-container class="mx-auto">
                        <v-row>
                            <v-col>
                                Entries
                            </v-col>
                            <v-col>
                                {{ idbCount }}
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-card-actions>
                        <v-btn color="orange" text="delete cache" @click="handleDeleteCache"></v-btn>
                    </v-card-actions>

                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

import { ref, watchEffect } from "vue";
import * as idbkv from 'idb-keyval';

const idbCount = ref();

import { mdiDatabaseSettings } from "@mdi/js";

watchEffect(async () => {
//  isLoading.value = true
  try {
    const kk = await idbkv.keys()
    idbCount.value = kk.length
  } finally {
    // isLoading.value = false
  }
})

async function handleDeleteCache() {
    console.log("Cleared out local cache!")
    idbkv.clear();
    idbCount.value = 0;
}

</script>