import { Container } from "@/components/global/container"
import { ActionMenu } from "@/components/navbar/action-menu"
import { Logo } from "@/components/navbar/logo"

export const Navbar = () => {
  return (
    <header className="bg-background border-b border-rose-500/20 w-full h-14">
      <Container asChild className="flex items-center justify-between gap-5">
        <nav>
          <Logo />
          <ActionMenu />
        </nav>
      </Container>
    </header>
  )
}
