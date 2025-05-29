"use client"

import { ListComponent } from "@/components/shared/list-component"
import { REPOSITORIES } from "@/lib/constants/repositories"
import { useFormContext } from "react-hook-form"

interface ExampleRepositoriesProps {
  isPending: boolean
}

export const ExampleRepositories = ({
  isPending,
}: ExampleRepositoriesProps) => {
  const form = useFormContext()

  return (
    <div className="space-y-2 mt-4">
      <p className="text-sm font-semibold text-zinc-200">
        Try these example repositories
      </p>
      <ListComponent
        data={REPOSITORIES}
        className="flex gap-3 flex-wrap"
        renderItem={({ href, label }) => (
          <button
            key={label}
            disabled={isPending}
            className="border border-rose-500/60 h-8 rounded-md px-3 text-sm flex items-center justify-center hover:text-rose-500 transition duration-300 cursor-pointer hover:border-rose-500 disabled:pointer-events-none disabled:opacity-50"
            onClick={() => form.setValue("url", href)}
          >
            {label}
          </button>
        )}
      />
    </div>
  )
}
