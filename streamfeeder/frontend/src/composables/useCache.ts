import { inject } from 'vue'
import * as idbkv from 'idb-keyval';
import type { FileStat, WebDAVClient } from 'webdav';
import type {streamitem } from '../model';


export function useCache() {

    const client = inject('davClient') as WebDAVClient;

    async function getFully(item: FileStat, abortSignal: AbortSignal) {
        if (item.type != "file") {
            console.warn("Attempted to load a directory into cache?!", item.filename);
            return;
        }
        const startTime = performance.now();
        const dbi = await idbkv.get<streamitem>(item.filename);
        if (dbi) {
            if (dbi.dataOriginal) {
                // myImageUrl.value = URL.createObjectURL(new Blob([new Uint8Array(dbi.dataOriginal)], { type: props.item.mime }));
                const loadTime = performance.now() - startTime;
                console.log("Loaded %s from IDB in %d", item.filename, loadTime);
                return dbi;
            }
        }
        // this needs to accept an abort!
        const buff = await client.getFileContents(item.filename, { signal: abortSignal }) as Buffer;
        // myImageUrl.value = URL.createObjectURL(new Blob([new Uint8Array(buff)], { type: props.item.mime }));
        const tocache: streamitem = {
            key: item.filename,
            mime: item.mime!,
            basename: item.basename,
            //etag: item.etag, ? do I need this? should I try and respect it for my own cache?
            dataOriginal: buff,
        }
        idbkv.set(tocache.key, tocache);
        const loadTime = performance.now() - startTime;
        console.log("Loaded %s from DAV in %d", item.filename, loadTime);
        return tocache;
    }

    return {getFully}
}