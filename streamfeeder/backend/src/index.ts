import { Hono } from 'hono'

const app = new Hono()

app.get('/api/data', (c) => {
  return c.text('Hello Hono!')
})

export default app
