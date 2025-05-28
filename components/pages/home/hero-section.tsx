import { CreateGitIndexForm } from "@/components/forms/pages/home/create-index-form"

export function HeroSection() {
  return (
    <section>
      <div className="text-center sm:mx-auto lg:mr-auto space-y-1.5">
        <h1 className="text-6xl md:text-7xl xl:text-[5.25rem] font-bold">
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-br  from-white  to-rose-500">
            Index Git for Cursor
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-zinc-200">
          Transform your GitHub repositories into a single LLM index file.
          Empower Cursor and other LLMs with full context of your codebase for
          smarter development.
        </p>
      </div>
      <CreateGitIndexForm />
    </section>
  )
}
