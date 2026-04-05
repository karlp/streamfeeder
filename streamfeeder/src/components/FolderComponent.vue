 <template>

    <!-- <h3>Contents of {{ path }}</h3> -->
    <v-list>
        <v-list-item v-for="fent in items" :key="fent.etag">
            <router-link v-if="fent.type == 'directory'" :to="{ name: 'browse', params: { path: fent.filename } }">
                {{ fent.filename }}
            </router-link>
            <div v-else>
                lol, files go here: {{ fent.basename }} has size: {{ fent.size }} and type: {{ fent.mime }}
            </div>
        </v-list-item>
    </v-list>

</template>

<script setup lang="ts">

const props = defineProps(["items"]);


/*
{ "filename": "/InstantUpload", 
"basename": "InstantUpload", 
"lastmod": "Sat, 04 Apr 2026 19:31:16 GMT", 
"size": 0, "type": "directory", "etag": "69d16704d3960" }

{ "filename": "/Nextcloud Manual.pdf", 
"basename": "Nextcloud Manual.pdf", 
"lastmod": "Wed, 26 Feb 2025 22:13:41 GMT", 
"size": 12861670, "type": "file", 
"etag": "6d1a7e6154f87c84af0898dc2bf888d9", 
"mime": "application/pdf" }    
    */

</script>