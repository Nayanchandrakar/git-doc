import { upstashRateLimit } from "@/lib/services/ratelimit-service"
import { StringUtils } from "@/lib/utils/string-utils"
import type { Context } from "hono"
import { createMiddleware } from "hono/factory"
import { HTTPException } from "hono/http-exception"
import type { HTTPResponseError } from "hono/types"

export const gitIndexRatelimit = createMiddleware(async (c, next) => {
  const identifier = `git-index-${StringUtils.getIdentityHash(c)}`
  const ratelimit = upstashRateLimit.globalRateLimit()
  const { success } = await ratelimit.limit(identifier)

  if (!success) {
    return c.json(
      { message: "Too Many Requests. Please try again later." },
      429,
    )
  }

  await next()
})

export const globalErrorHandler = (
  err: Error | HTTPResponseError,
  c: Context,
) => {
  if (err instanceof HTTPException) {
    return c.json({ message: err.message }, err.status)
  }
  console.error(err)
  return c.json({ message: "Internal Server Error" }, 500)
}
