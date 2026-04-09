/* Approvals desk routes and stuff */

import { Elysia } from "elysia";

async function handleCaption(context) {
    const blob = context.body;
    console.log("Resetting caption: %s with caption: %s", blob.filename, blob.caption)
    // wtf is best to return these days?!
    await Bun.sleep(700);
    return {
        err: 0,
    }
}

async function handleApprove(context) {
    const blob = context.body;
    console.log("Approving", blob.filename)
    await Bun.sleep(700);
    return {
        err: 0,
    }
}

async function handleUnapprove(context) {
    const blob = context.body;
    console.log("Unapproving", blob.filename)
    await Bun.sleep(700);
    return {
        err: 0,
    }
}

interface FileMetadata {
    filename: string;
    approved?: boolean;
    caption?: string;
    // published to a stream?

}

async function lookupMetadata(context) {
    const fn = context.params["*"]
    await Bun.sleep(700);
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

async function lookupCaption(context) {
    console.log("what can I work with?", context)
    const fn = context.params.fn
    await Bun.sleep(700);
    return {
        filename: fn,
    }
}

export const DeskController = new Elysia({
  name: "desk-controller",
  prefix: "/api/desk",
})
    .get('/finfo/*', (context) => lookupMetadata(context))
    .post('/caption/', (context) => handleCaption(context))
    .post('/approve/', (context) => handleApprove(context))
    .post('/unapprove/', (context) => handleUnapprove(context))
