import { gitIndexRouter } from "@/hono/routers/git-index-router"
import { Hono } from "hono"
import { handle } from "hono/vercel"

const app = new Hono().basePath("/api")

app.route("/", gitIndexRouter)

export const GET = handle(app)
export const POST = handle(app)
