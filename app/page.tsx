import { Container } from "@/components/global/container"
import { Footer } from "@/components/global/footer"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/pages/home/hero-section"

export default function HomePage() {
  return (
    <section className="w-full min-h-screen flex flex-col bg-rose-700/5">
      <Navbar />
      <Container className="flex flex-col items-center justify-center flex-1">
        <HeroSection />
      </Container>
      <Footer />
    </section>
  )
}
