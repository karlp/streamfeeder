<template>
    <h3>This is my dav list page</h3>

    <li>
        
    </li>
</template>

<script lang="ts">

import { createClient } from 'webdav';

const davEndpoint = import.meta.env.VITE_SF_DAV_ENDPOINT;
const davUsername = import.meta.env.VITE_SF_DAV_USERNAME;
const davPassword = import.meta.env.VITE_SF_DAV_PASSWORD;

const client = createClient(
    davEndpoint,
    {
        username: davUsername,
        password: davPassword
    }
);

const directoryItems = await client.getDirectoryContents("/");
console.log(directoryItems);

</script>