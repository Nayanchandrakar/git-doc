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

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

export function CreateGitIndexForm() {
  const router = useRouter()
  const form = useForm<checkGithubRepoSchemaType>({
    resolver: zodResolver(checkGithubRepoSchema),
    defaultValues: { url: "" },
    shouldUseNativeValidation: true,
    shouldFocusError: true,
    mode: "onChange",
  })

  function onSubmit(values: checkGithubRepoSchemaType) {
    const { pathname } = new URL(values.url)
    router.push(pathname)
  }

  return (
    <Container>
      <Card className="relative w-full mt-12 overflow-hidden mx-auto max-w-4xl bg-rose-500/5">
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-end gap-3"
            >
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="w-full space-y-1">
                    <FormLabel>Github repository url</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={configuration.social.github}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="bg-rose-500 hover:bg-rose-500/80 text-white"
                type="submit"
              >
                Create Index
              </Button>
            </form>
          </Form>
        </CardContent>
        <BorderBeam duration={10} size={200} />
      </Card>
    </Container>
  )
}
