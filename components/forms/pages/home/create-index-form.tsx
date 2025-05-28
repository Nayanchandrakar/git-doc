"use client"

import { Container } from "@/components/global/container"
import { BorderBeam } from "@/components/magicui/border-beam"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
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
    <Container className="mt-12">
      <Card className="relative w-full overflow-hidden mx-auto max-w-3xl bg-rose-500/5">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="w-full">
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
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            className="bg-rose-500 hover:bg-rose-500/80 text-white"
            type="submit"
          >
            Create Index
          </Button>
        </CardFooter>
        <BorderBeam duration={10} size={150} />
      </Card>
    </Container>
  )
}
