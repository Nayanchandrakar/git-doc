import { githubRegex } from "@/lib/regex"
import { z } from "zod"

export const gitCloneSchema = z.object({
  userName: z.string().max(40),
  repositoryName: z.string().min(1).max(40),
})

export const checkGithubRepoSchema = z.object({
  url: z
    .string()
    .url()
    .regex(
      githubRegex,
      "Invalid GitHub repository URL. use https://github.com/username/repository",
    ),
})

export type checkGithubRepoSchemaType = z.infer<typeof checkGithubRepoSchema>
