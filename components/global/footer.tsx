import { configuration } from "@/lib/config"
import Link from "next/link"

export const Footer = () => {
  return (
    <footer className="mt-12">
      <p className="text-center text-rose-200">
        Made with ❤️ by{" "}
        <Link
          target="_blank"
          href={configuration.social.x}
          className="text-rose-500 hover:underline"
        >
          @nayanexe
        </Link>
      </p>
    </footer>
  )
}
