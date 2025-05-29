import { globalErrorHandler } from "@/hono/middlewares"
import { gitIndexRouter } from "@/hono/routers/git-index-router"
import { Hono } from "hono"
import { handle } from "hono/vercel"

const app = new Hono()
  .basePath("/api")
  .route("/git", gitIndexRouter)
  .onError(globalErrorHandler)

export const GET = handle(app)
export const POST = handle(app)
export type AppType = typeof app
