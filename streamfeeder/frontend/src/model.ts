export interface streamitem {
    /** Original path on source */
    key: string;
    /** FIXME wouldn't we need to know _which source_ that path is on? (for multi-dav?!) */
    basename: string;
    /** Original bytes from source */
    dataOriginal: Buffer;
    thumbnail1?: Buffer; // we probably want all sorts of thumbnails right? by size or something?
}