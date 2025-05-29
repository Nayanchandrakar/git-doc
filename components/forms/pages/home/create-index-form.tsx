"use client"

import { Container } from "@/components/global/container"
import { BorderBeam } from "@/components/magicui/border-beam"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { configuration } from "@/lib/config"
import {
  checkGithubRepoSchema,
  checkGithubRepoSchemaType,
} from "@/lib/schemas/git-clone-schema"

import { ActionButtons } from "@/components/forms/pages/home/action-buttons"
import { ExampleRepositories } from "@/components/forms/pages/home/example-repos-form"
import { useCreateRepositoryIndex } from "@/hooks/hono/use-repository"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

export function CreateGitIndexForm() {
  const { mutateAsync, data, isPending } = useCreateRepositoryIndex()

  const form = useForm<checkGithubRepoSchemaType>({
    resolver: zodResolver(checkGithubRepoSchema),
    defaultValues: { url: "" },
    shouldUseNativeValidation: true,
    shouldFocusError: true,
    mode: "onChange",
  })

  function onSubmit(values: checkGithubRepoSchemaType) {
    const { pathname } = new URL(values.url)
    const paths = pathname.split("/")
    mutateAsync({ userName: paths[1], repositoryName: paths[2] })
  }

  const isResponseReady = !!(data && !isPending)

  return (
    <Container className="mt-12">
      <Card className="relative w-full overflow-hidden mx-auto max-w-3xl bg-rose-500/10 border-rose-500/30 rounded-xl border-2 shadow-rose-600/10 shadow-2xl">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-zinc-200">
                      Github repository url
                    </FormLabel>
                    <div className="flex sm:items-center gap-4 flex-col sm:flex-row">
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder={configuration.social.github}
                          {...field}
                        />
                      </FormControl>
                      <Button type="submit" loading={isPending}>
                        Create Index
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
            <ActionButtons data={data!} show={isResponseReady} />
            <ExampleRepositories isPending={isPending} />
          </Form>
        </CardContent>
        <BorderBeam duration={10} size={150} />
      </Card>
    </Container>
  )
}
