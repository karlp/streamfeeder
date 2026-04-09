import { boolean, integer, pgSchema, pgTable, text, varchar } from "drizzle-orm/pg-core";

/*
 * Lollll, we're going to iterate the fuck out of this, I bet!
 * To start with, we're going with a "flat file" db to get the integrations up
 * future work, we want to link paths to what webdav server they come from?
 * and obviously, it needs to be per user...
 */

//// lollll db schema design up front always important isn't it!
// I don't _want_ a damn integer to pass around, I want to pass davkey and path... 
export const streamfiles = pgTable("streamfiles", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fn: varchar({ length: 255 }).unique().notNull(),   // FIXME ---annddd we're already in trouble!  I've assumed this path is unique on the client, but it only will be per webdav!
  approval: boolean(),
  caption: text(),
});