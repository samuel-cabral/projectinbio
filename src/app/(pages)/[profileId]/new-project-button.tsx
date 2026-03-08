'use client'

import { Loader, Plus, UploadIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { startTransition, useRef, useState } from 'react'

import { createProject } from '@/app/actions/create-project'
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
import { compressImage } from '@/lib/utils'

type NewProjectButtonProps = {
  profileId: string
}

export function NewProjectButton({ profileId }: NewProjectButtonProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [projectImage, setProjectImage] = useState<string | null>(null)
  const [projectTitle, setProjectTitle] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectUrl, setProjectUrl] = useState('')
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  function resetForm() {
    if (projectImage) URL.revokeObjectURL(projectImage)
    setProjectImage(null)
    setProjectTitle('')
    setProjectDescription('')
    setProjectUrl('')
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (projectImage) URL.revokeObjectURL(projectImage)
    setProjectImage(URL.createObjectURL(file))
  }

  async function handleSubmit() {
    setIsCreatingProject(true)
    const formData = new FormData()

    const title =
      projectTitle ||
      (document.getElementById('project-title') as HTMLInputElement | null)?.value ||
      ''
    const description =
      projectDescription ||
      (document.getElementById('project-description') as HTMLTextAreaElement | null)?.value ||
      ''
    const url =
      projectUrl || (document.getElementById('project-url') as HTMLInputElement | null)?.value || ''

    formData.append('profileId', profileId)
    formData.append('projectTitle', title)
    formData.append('projectDescription', description)
    formData.append('projectUrl', url)

    const file = fileInputRef.current?.files?.[0]
    if (file) {
      const compressed = await compressImage(file)
      if (compressed) formData.append('projectImage', compressed)
    }

    const ok = await createProject(formData)

    setIsCreatingProject(false)

    if (ok) {
      startTransition(() => {
        resetForm()
        router.refresh()
        setIsDialogOpen(false)
      })
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger
        data-profile-id={profileId}
        className="bg-accent/30 hover:border-accent flex h-[132px] w-[340px] cursor-pointer items-center justify-center gap-2 rounded-[20px] border-2 border-transparent p-3 hover:border-dashed"
      >
        <Plus className="text-chart-2 size-10" />
        <span className="text-foreground text-xl">Novo projeto</span>
      </DialogTrigger>

      <DialogContent className="bg-background rounded-[20px] p-8 shadow-xl">
        <DialogHeader>
          <DialogTitle className="mb-6 text-2xl font-bold">Novo projeto</DialogTitle>
        </DialogHeader>
        <form className="flex w-full flex-col gap-6" onSubmit={e => e.preventDefault()}>
          <input
            ref={fileInputRef}
            id="project-image-input"
            type="file"
            accept="image/*"
            className="hidden"
            aria-label="Imagem do projeto"
            onChange={handleImageChange}
          />
          <div className="flex gap-6">
            <div className="flex flex-col items-center gap-3 text-xs">
              <div className="bg-primary-foreground h-[100px] w-[100px] overflow-hidden rounded-xl">
                {projectImage ? (
                  <Image
                    src={projectImage}
                    alt="Preview do projeto"
                    width={100}
                    height={100}
                    onClick={() => fileInputRef.current?.click()}
                    className="object-cover object-center hover:cursor-pointer hover:opacity-80"
                  />
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-full w-full"
                  >
                    100x100
                  </Button>
                )}
              </div>

              <label
                htmlFor="project-image-input"
                className="text-muted-foreground flex cursor-pointer items-center gap-1 text-xs hover:underline"
              >
                <UploadIcon className="size-4" />
                <span className="text-sm">Adicionar imagem</span>
              </label>
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-col gap-3">
                <label htmlFor="project-title" className="text-sm font-medium">
                  Título do projeto
                </label>
                <Input
                  id="project-title"
                  name="projectTitle"
                  type="text"
                  placeholder="Digite o nome do projeto"
                  className="border-none"
                  value={projectTitle}
                  onChange={e => setProjectTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="project-description" className="text-sm font-medium">
                  Descrição
                </label>
                <Textarea
                  id="project-description"
                  name="projectDescription"
                  rows={5}
                  placeholder="Dê uma breve descrição do seu projeto"
                  className="min-h-[100px] border-none"
                  value={projectDescription}
                  onChange={e => setProjectDescription(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="project-url" className="text-sm font-medium">
                  URL do projeto
                </label>
                <Input
                  id="project-url"
                  name="projectUrl"
                  type="url"
                  placeholder="Digite a URL do projeto"
                  className="border-none"
                  value={projectUrl}
                  onChange={e => setProjectUrl(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="mt-2 flex justify-end gap-4">
            <DialogClose
              render={
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              }
            />
            <Button type="button" onClick={handleSubmit} disabled={isCreatingProject}>
              {isCreatingProject ? (
                <span className="flex items-center gap-2">
                  <Loader className="size-4 animate-spin" />
                  <span className="text-sm">Salvando projeto...</span>
                </span>
              ) : (
                'Salvar projeto'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
