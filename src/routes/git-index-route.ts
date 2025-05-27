import { GitRepositoryAnalyzer } from "@/lib/helpers/git-analyzer.js"
import { gitCloneSchema } from "@/lib/schemas/git-clone-schema.js"
import { S3Service } from "@/lib/services/s3-service.js"
import { gitIndexRatelimit } from "@/middleware.js"
import { StringUtils } from "@/utils/string-utils.js"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

const app = new Hono()
  .get("/", (c) => {
    return c.json({ message: "Hello world!" })
  })
  .get(
    "/:userName/:repositoryName",
    gitIndexRatelimit,
    zValidator("param", gitCloneSchema),
    async (c) => {
      const { repositoryName, userName } = c.req.valid("param")
      const repositoryUrl = StringUtils.createRepoUrl(userName, repositoryName)

      try {
        const output = await GitRepositoryAnalyzer.analyzeGitRepository(
          userName,
          repositoryUrl,
          repositoryName,
        )

        const url = await S3Service.uploadIndexFile(
          userName,
          repositoryName,
          output,
        )
        return c.json({ data: url })
      } catch (error) {
        if (error instanceof Error) {
          return c.json(
            `Error cloning or analyzing repository: ${error.message}`,
            500,
          )
        }
      }
    },
  )

export default app
