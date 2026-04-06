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
                        <v-btn color="orange" text="delete cache"></v-btn>
                    </v-card-actions>

                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

import { computed } from "vue";
import { useIDB } from "../composables/useIDB";

import { mdiDatabaseSettings } from "@mdi/js";

const idbCount = computed(() => {
    // fucking I don't have this, should switch to idb-keyval, as that's all I'm using it for?
    return 1;
})


</script>