import { Container } from "@/components/global/container"
import { Footer } from "@/components/global/footer"
import { Navbar } from "@/components/navbar"
import { DocumentationInfo } from "@/components/pages/repo/documentation-info"
import { client } from "@/lib/hono-rpc"

type PageProps = {
  params: Promise<{
    userName: string
    repoName: string
  }>
}

export default async function RepositoryPage({ params }: PageProps) {
  const { userName, repoName } = await params
  const response = await client.api.git.create.$post({
    form: {
      repositoryName: repoName,
      userName,
    },
  })

  const res = await response.json()

  console.log(res)

  return (
    <section className="w-full min-h-screen flex flex-col bg-rose-700/5">
      <Navbar />
      <Container className="flex flex-col items-center justify-center flex-1">
        <DocumentationInfo />
      </Container>
      <Footer />
    </section>
  )
}
