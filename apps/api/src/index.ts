import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { db } from './db/client.js'
import { healthChecks } from './db/schema.js'

const app = new Hono()

app.get("/", (c) => {
  return c.json({
    name: 'skill-port-api',
    status: 'ok'
  })
})

app.get('/health', (c) => {
  return c.json({ status: "ok" })
})

app.get('/health/db', async (c) => {
  const id = globalThis.crypto.randomUUID()

  const [record] = await db.insert(healthChecks).values({ id, message: 'ok' }).returning()

  return c.json({
    status: 'ok',
    record
  })
})


serve({
  fetch: app.fetch,
  port: 8787,
  hostname: "0.0.0.0",
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
