import { Icons } from "@/components/shared/icons"
import { buttonVariants } from "@/components/ui/button"
import { configuration } from "@/lib/config"
import Link from "next/link"

export const ActionMenu = () => {
  return (
    <div className="flex items-center gap-3">
      {/* X.com profile  */}
      <Link
        href={configuration.social.x}
        target="_blank"
        className={buttonVariants({
          variant: "outline",
          size: "icon",
        })}
      >
        <Icons.X className="size-4 fill-current" aria-hidden="true" />
      </Link>

      {/* Github profile */}
      <Link
        target="_blank"
        className={buttonVariants({ variant: "outline", size: "icon" })}
        href={configuration.social.github}
      >
        <Icons.Github className="size-4" aria-hidden="true" />
      </Link>
    </div>
  )
}
