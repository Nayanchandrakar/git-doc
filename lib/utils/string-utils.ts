import { LOCALHOST_IP } from "@/lib/constants/localhost"
import { createId } from "@paralleldrive/cuid2"
import type { Context } from "hono"
import { getConnInfo } from "hono/vercel"

export class StringUtils {
  static createRepoUrl(userName: string, repositoryName: string) {
    return `https://github.com/${userName}/${repositoryName}.git`
  }

  static createRepoPath(userName: string, repositoryName: string) {
    return `../repository/${userName.toLowerCase()}/${repositoryName}`
  }

  static getRepositoryStorageKey(
    userName: string,
    repositoryName: string,
    extension: string,
  ) {
    return `repositories/${userName.toLowerCase()}-${repositoryName}/${createId()}.${extension}`
  }

  static async getIdentityHash(c: Context) {
    const info = getConnInfo(c)
    const ip = info.remote?.address || LOCALHOST_IP
    const ua = c.req.header("User-Agent")

    const data = `${ua}-${ip}`
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer)

    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  }
}
