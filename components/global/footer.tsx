import { configuration } from "@/lib/config"
import Link from "next/link"

export const Footer = () => {
  return (
    <footer className="border-t border-rose-500/30 h-14 flex items-center justify-center">
      <p className="text-center text-rose-100">
        Made with ❤️ by{" "}
        <Link
          target="_blank"
          href={configuration.social.x}
          className="text-rose-600 hover:underline"
        >
          @nayanexe
        </Link>
      </p>
    </footer>
  )
}
