import gitIndexRoute from "@/routes/git-index-route.js"
import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { csrf } from "hono/csrf"
import { logger } from "hono/logger"
import { secureHeaders } from "hono/secure-headers"

const app = new Hono()

app.use(
  "*",
  secureHeaders(),
  cors({
    origin: process.env.CLIENT_URL!,
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  }),
  csrf({ origin: process.env.CLIENT_URL! }),
  logger(),
)

// API Routes 
app.route("/", gitIndexRoute)

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT) || 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)
