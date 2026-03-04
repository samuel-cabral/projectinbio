'use client'

import { Plus } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type NewProjectButtonProps = {
  profileId: string
}

export function NewProjectButton({ profileId }: NewProjectButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="bg-accent/30 hover:border-accent flex h-[132px] w-[340px] cursor-pointer items-center justify-center gap-2 rounded-[20px] border-2 border-transparent p-3 hover:border-dashed"
        >
          <Plus className="text-chart-2 size-10" />
          <span className="text-foreground text-xl">Novo projeto</span>
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo projeto</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
