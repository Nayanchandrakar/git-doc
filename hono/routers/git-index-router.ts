import { gitIndexRatelimit } from "@/hono/middlewares"
import { GitAnalyzerService } from "@/hono/services/git-analyzer-service"
import { gitCloneSchema } from "@/lib/schemas/git-clone-schema"
import { s3Service } from "@/lib/services/s3-service"
import { StringUtils } from "@/lib/utils/string-utils"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

const gitIndexRouter = new Hono()
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
        const output = await GitAnalyzerService.analyzeGitRepository(
          userName,
          repositoryUrl,
          repositoryName,
        )

        // const fileName = StringUtils.getRepositoryStorageKey(
        //   userName,
        //   repositoryName,
        //   "txt",
        // );

        // await s3Service.uploadObjects({
        //   Key: fileName,
        //   Body: output,
        //   ContentType: "text/plain",
        // })

        // return c.json({ data: `https://d33aluc0l6cahu.cloudfront.net/${fileName}` })
        return c.text(output)
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

export { gitIndexRouter }
