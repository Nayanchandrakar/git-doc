"use client"

import { client } from "@/lib/hono-rpc"
import { useState, useTransition } from "react"
import { toast } from "sonner"

interface CreateRepositoryIndexProps {
  userName: string
  repositoryName: string
}

export const useCreateRepositoryIndex = () => {
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState<string | null>(null)

  const mutateAsync = async (
    form: CreateRepositoryIndexProps,
  ): Promise<void> => {
    startTransition(async () => {
      try {
        const response = await client.api.git.create.$post({ form })

        if (!response.ok) {
          throw new Error("Failed to create repository index")
        }

        const resData = await response.json()
        setData(resData.data)
        toast.success("Successfully created GitHub index file")
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        toast.error(errorMessage)
      }
    })
  }

  return { mutateAsync, data, setData, isPending }
}
