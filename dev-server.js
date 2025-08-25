#!/usr/bin/env node

// Development server script for non-root users
import { serve } from '@hono/node-server'
import app from './dist/vercel.js'

const port = process.env.PORT || 3000
console.log(`🚀 Starting ExerciseDB API server on port ${port}`)
console.log(`📖 API docs available at: http://localhost:${port}/docs`)
console.log(`🔗 API base URL: http://localhost:${port}/api/v1`)

serve({
  fetch: app.fetch,
  port: parseInt(port)
})
