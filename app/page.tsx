"use client"

import { CreateGitIndexForm } from "@/components/forms/pages/home/create-index-form"
import { HeroSection } from "@/components/pages/home/hero-section"

export default function HomePage() {
  return (
    <section>
      <HeroSection />
      <CreateGitIndexForm />
    </section>
  )
}
