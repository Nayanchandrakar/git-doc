import { gitIndexRatelimit } from "@/hono/middlewares"
import { GitAnalyzerService } from "@/hono/services/git-analyzer-service"
import { gitCloneSchema } from "@/lib/schemas/git-clone-schema"
import { s3Service } from "@/lib/services/s3-service"
import { StringUtils } from "@/lib/utils/string-utils"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"

const gitIndexRouter = new Hono().post(
  "/create",
  gitIndexRatelimit,
  zValidator("form", gitCloneSchema),
  async (c) => {
    const { repositoryName, userName } = c.req.valid("form")
    const repositoryUrl = StringUtils.createRepoUrl(userName, repositoryName)

    try {
      const output = await GitAnalyzerService.analyzeGitRepository(
        userName,
        repositoryUrl,
        repositoryName,
      )

      const fileName = StringUtils.getRepositoryStorageKey(
        userName,
        repositoryName,
        "txt",
      )

      await s3Service.uploadObjects({
        Key: fileName,
        Body: output,
        ContentType: "text/plain; charset=utf-8",
      })

      return c.json(
        { data: `${process.env.CLOUDFRONT_URL}/${fileName}` },
        200,
      )
    } catch (error) {
      if (error instanceof Error) {
        throw new HTTPException(500, { message: error.message })
      }

      throw error
    }
  },
)

export { gitIndexRouter }
