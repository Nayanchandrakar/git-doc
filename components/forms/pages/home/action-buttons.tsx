"use client"

import { Button } from "@/components/ui/button"
import { useCopyToClipboard } from "@/hooks/client/use-copy-to-clipboard"
import { Check, Copy } from "lucide-react"
import Link from "next/link"

interface ActionButtonProps {
  data: string
  show: boolean
}

export function ActionButtons({ data, show }: ActionButtonProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  return (
    <div className="my-4">
      {show && (
        <div className="flex items-center justify-between border rounded-lg gap-2 border-rose-500/60 p-1.5">
          <Link
            href={data}
            target="_blank"
            className="px-2 text-ellipsis whitespace-nowrap overflow-hidden text-sm text-rose-500 hover:text-rose-500/90 transition duration-200"
          >
            {data}
          </Link>

          <Button
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard(data)}
            className="dark:border-rose-500 text-rose-500 hover:text-rose-500/90"
          >
            {isCopied ? <Check /> : <Copy />}
          </Button>
        </div>
      )}
    </div>
  )
}
