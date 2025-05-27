
import { upstashRateLimit } from '@/lib/services/ratelimit-service.js';
import { StringUtils } from '@/utils/string-utils.js';
import { createMiddleware } from 'hono/factory';

export const gitIndexRatelimit = createMiddleware(async (c, next) => {
    const identifier = `git-index-${StringUtils.getIdentityHash(c)}`

    const ratelimit = upstashRateLimit.globalRateLimit()
    const { success } = await ratelimit.limit(identifier)

    if (!success) {
        return c.json({ message: 'Too Many Requests. Please try again later.' }, 429);
    }

    await next()
})