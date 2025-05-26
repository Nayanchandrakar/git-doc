import { z } from "zod"

export const gitCloneSchema = z.object({
  userName: z.string().max(40),
  repositoryName: z.string().min(1).max(40),
})
