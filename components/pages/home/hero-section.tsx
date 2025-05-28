import React from "react"

export function HeroSection() {
  return (
    <section className="relative mt-20 md:mt-28">
      <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
        <h1 className="mt-8 text-6xl md:text-7xl lg:mt-14 xl:text-[5.25rem] font-bold">
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-br  from-white  to-rose-500">
            Index Git for Cursor
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-200">
          Transform your GitHub repositories into a single LLM index file.
          Empower Cursor and other LLMs with full context of your codebase for
          smarter development.
        </p>
      </div>
    </section>
  )
}
