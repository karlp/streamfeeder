import { Elysia } from 'elysia'

import { DeskController } from './routing/desk'


const app = new Elysia()
  .use(DeskController)
  .get("/", () => "Hello Elysia")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
