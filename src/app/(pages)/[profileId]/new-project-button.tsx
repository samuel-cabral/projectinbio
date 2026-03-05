'use client'

import { Plus, UploadIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type NewProjectButtonProps = {
  profileId: string
}

export function NewProjectButton({ profileId }: NewProjectButtonProps) {
  return (
    <Dialog>
      <DialogTrigger
        data-profile-id={profileId}
        className="bg-accent/30 hover:border-accent flex h-[132px] w-[340px] cursor-pointer items-center justify-center gap-2 rounded-[20px] border-2 border-transparent p-3 hover:border-dashed"
      >
        <Plus className="text-chart-2 size-10" />
        <span className="text-foreground text-xl">Novo projeto</span>
      </DialogTrigger>

      <DialogContent className="bg-background rounded-[20px] p-8 shadow-xl">
        <DialogHeader>
          <DialogTitle className="mb-6 text-2xl font-bold">
            Novo projeto
          </DialogTitle>
        </DialogHeader>
        <form className="flex w-full flex-col gap-6">
          <div className="flex gap-6">
            {/* Imagem do projeto */}
            <div className="flex flex-col items-center">
              <div className="text-muted-foreground bg-primary-foreground mb-2 flex h-[100px] w-[100px] items-center justify-center rounded-lg text-sm font-medium">
                100x100
              </div>
              <label className="text-muted-foreground flex cursor-pointer items-center gap-1 text-xs hover:underline">
                <Input type="file" className="hidden" />
                <UploadIcon className="size-4" />
                Adicionar imagem
              </label>
            </div>
            {/* Inputs do formulário */}
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-col gap-3">
                <label htmlFor="project-title" className="text-sm font-medium">
                  Título do projeto
                </label>
                <Input
                  id="project-title"
                  name="title"
                  type="text"
                  placeholder="Digite o nome do projeto"
                  className="border-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="project-description"
                  className="text-sm font-medium"
                >
                  Descrição
                </label>
                <Textarea
                  id="project-description"
                  name="description"
                  rows={3}
                  placeholder="Dê uma breve descrição do seu projeto"
                  className="border-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="project-url" className="text-sm font-medium">
                  URL do projeto
                </label>
                <Input
                  id="project-url"
                  name="url"
                  type="url"
                  placeholder="Digite a URL do projeto"
                  className="border-none"
                />
              </div>
            </div>
          </div>
          {/* Botões */}
          <div className="mt-2 flex justify-end gap-4">
            <DialogClose>Voltar</DialogClose>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
