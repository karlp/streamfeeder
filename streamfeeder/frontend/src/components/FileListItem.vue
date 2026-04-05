<template>
    <v-img class="mx-auto" height="50"
    lazy-src="https://picsum.photos/id/11/100/60"
    max-width="100"
    src="https://bad.src/not/valid"
  >
   <template v-slot:placeholder>
      <div class="d-flex align-center justify-center fill-height">
        <v-progress-circular
          color="grey-lighten-4"
          indeterminate
        ></v-progress-circular>
      </div>
    </template>
  </v-img>
  {{item.basename}} (Size: ~{{ formatMB(item.size) }})  Type: {{ item.mime }}
</template>

<script setup lang="ts">
import { useFormatting } from '../composables/useFormatting';
const { formatMB } = useFormatting();

const props = defineProps(["item"]);

</script>