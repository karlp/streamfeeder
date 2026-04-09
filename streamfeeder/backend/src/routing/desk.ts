/* Approvals desk routes and stuff */

import { Elysia } from "elysia";

import { db } from "../db";
import { streamfiles } from "../db/schema";

import { eq } from "drizzle-orm";

const artificialDelay = 7;

// THis is the _web_ type not the "db" type.
interface FileMetadata {
    /* Clients might not provide it or know it */
    id?: BigInteger;
    filename: string;
    approved?: boolean;
    caption?: string;
    // published to a stream?
}


// all of these need to be upserts.
async function handleCaption(context) {
    const blob = context.body as FileMetadata;  // TODO - how do we assert that? json schema shits?
    console.log("Resetting caption: %s with caption: %s", blob.filename, blob.caption)
    // wtf is best to return these days?!
    await Bun.sleep(artificialDelay);
    // upsert always plz...
    // upsert works if we have target=fn, with unique on fn...
    // this needs more db work, what a surprise
    const updated = await db.insert(streamfiles)
    .values({fn: blob.filename, caption: blob.caption})
    .onConflictDoUpdate({target: streamfiles.fn, set: {caption: blob.caption}})
    .returning();
    return updated;
}

async function handleApprove(context) {
    const blob = context.body;
    console.log("Approving", blob.filename)
    await Bun.sleep(artificialDelay);
    const updated = await db.insert(streamfiles)
    .values({fn: blob.filename, approval: true})
    .onConflictDoUpdate({target: streamfiles.fn, set: {approval: true}})
    .returning();
    return updated;
}

async function handleUnapprove(context) {
    const blob = context.body;
    console.log("Unapproving", blob.filename)
    await Bun.sleep(artificialDelay);
    const updated = await db.insert(streamfiles)
    .values({fn: blob.filename, approval: false})
    .onConflictDoUpdate({target: streamfiles.fn, set: {approval: false}})
    .returning();
    return updated;
}

async function lookupMetadataDB(ufn) {
    //const ufn = context.params["*"]
    console.log("karl, attempting a lookup of", ufn)
    await Bun.sleep(artificialDelay);

    const blob1 = await db.select().from(streamfiles).where(eq(streamfiles.fn, ufn));

    // this one doesn't work.  apparently, this where is a "relation" not a ... field?
    // const blob2 = await db.query.streamfiles.findFirst({
    //     where: {
    //         fn: ufn
    //     }
    // })
    return blob1
}

async function lookupMetadataRandom(context) : Promise<FileMetadata> {
    const fn = context.params["*"]
    await Bun.sleep(artificialDelay);

    let data: FileMetadata = {
        filename: fn,
    }
    const dice = Math.random();
    if (dice > 0.5) {
        data.approved = true;
    }
    if (dice < 0.1) {
        data.approved = false;
    }
    if (dice > 0.4) {
        data.caption = "made up " + Bun.randomUUIDv7()
    }
    return data
}

export const DeskController = new Elysia({
  name: "desk-controller",
  prefix: "/api/desk",
})
    .get('/finfo/:filename?', ({ params: { filename } }) => lookupMetadataDB(filename), {
       detail: {
            description: 'Handles wildcard file paths'
        }
    })
    .post('/caption/', (context) => handleCaption(context))
    .post('/approve/', (context) => handleApprove(context))
    .post('/unapprove/', (context) => handleUnapprove(context))
