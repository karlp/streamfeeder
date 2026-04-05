 <template>

    <v-list>
        <v-list-item v-for="fent in items">
            <router-link v-if="fent.type == 'directory'" :to="{ name: 'browse', params: { path: fent.filename } }">
                {{ fent.filename }}
            </router-link>
            <div v-else>
                <router-link :to="{name: 'detail', params: {path: fent.filename}}">
                    <FileListItem :item="fent"/>
                </router-link>
            </div>
        </v-list-item>
    </v-list>

</template>

<script setup lang="ts">

const props = defineProps(["items"]);

import FileListItem from './FileListItem.vue';

</script>