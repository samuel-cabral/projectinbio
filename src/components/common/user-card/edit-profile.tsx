'use client'

import { Loader, UploadIcon, UserPen } from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { startTransition, useRef, useState } from 'react'

import { updateProfile } from '@/app/actions/update-profile'
import type { ProfileData } from '@/app/server/get-profile-data'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { compressImage } from '@/lib/utils'

type EditProfileProps = {
  profileData: ProfileData
  avatarUrl: string | null
  isOwner: boolean
}

export function EditProfile({ profileData, avatarUrl, isOwner }: EditProfileProps) {
  const router = useRouter()
  const { profileId } = useParams()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [displayName, setDisplayName] = useState(profileData.displayName ?? '')
  const [description, setDescription] = useState(profileData.description ?? '')
  const [previewImage, setPreviewImage] = useState<string | null>(avatarUrl)
  const [isSaving, setIsSaving] = useState(false)

  function handleOpenModal() {
    setDisplayName(profileData.displayName ?? '')
    setDescription(profileData.description ?? '')
    setPreviewImage(avatarUrl)
    setIsDialogOpen(true)
  }

  function resetForm() {
    if (previewImage && previewImage.startsWith('blob:')) URL.revokeObjectURL(previewImage)
    setDisplayName(profileData.displayName ?? '')
    setDescription(profileData.description ?? '')
    setPreviewImage(avatarUrl)
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (previewImage && previewImage.startsWith('blob:')) URL.revokeObjectURL(previewImage)
    setPreviewImage(URL.createObjectURL(file))
  }

  async function handleSubmit() {
    if (!profileId || typeof profileId !== 'string') return
    setIsSaving(true)

    const formData = new FormData()
    formData.append('profileId', profileId)
    formData.append('displayName', displayName)
    formData.append('description', description)

    const file = fileInputRef.current?.files?.[0]
    if (file) {
      const compressed = await compressImage(file)
      if (compressed) formData.append('profileImage', compressed)
    }

    const ok = await updateProfile(formData)
    setIsSaving(false)

    if (ok) {
      startTransition(() => {
        resetForm()
        setIsDialogOpen(false)
        router.refresh()
      })
    }
  }

  if (!isOwner) return null

  const previewSrc = previewImage ?? avatarUrl

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Button variant="ghost" size="icon" className="" onClick={handleOpenModal}>
        <UserPen className="text-muted-foreground size-6" />
      </Button>
      <DialogContent className="bg-background rounded-[20px] p-8 shadow-xl">
        <DialogHeader>
          <DialogTitle className="mb-6 text-2xl font-bold">Editar perfil</DialogTitle>
        </DialogHeader>
        <form className="flex w-full flex-col gap-6" onSubmit={e => e.preventDefault()}>
          <input
            ref={fileInputRef}
            id="profile-image-input"
            type="file"
            accept="image/*"
            className="hidden"
            aria-label="Foto do perfil"
            onChange={handleImageChange}
          />
          <div className="flex gap-6">
            <div className="flex flex-col items-center gap-3 text-xs">
              <div className="bg-primary-foreground h-[100px] w-[100px] overflow-hidden rounded-full">
                {previewSrc ? (
                  <Image
                    src={previewSrc}
                    alt="Preview do perfil"
                    width={100}
                    height={100}
                    unoptimized={previewSrc.startsWith('blob:')}
                    onClick={() => fileInputRef.current?.click()}
                    className="h-full w-full cursor-pointer object-cover object-center hover:opacity-80"
                  />
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-full w-full rounded-full"
                  >
                    100x100
                  </Button>
                )}
              </div>
              <label
                htmlFor="profile-image-input"
                className="text-muted-foreground flex cursor-pointer items-center gap-1 text-xs hover:underline"
              >
                <UploadIcon className="size-4" />
                <span className="text-sm">Alterar foto</span>
              </label>
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="profile-display-name" className="text-sm font-medium">
                  Nome
                </label>
                <Input
                  id="profile-display-name"
                  type="text"
                  placeholder="Seu nome"
                  className="border-none"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="profile-description" className="text-sm font-medium">
                  Descrição
                </label>
                <Textarea
                  id="profile-description"
                  rows={4}
                  placeholder="Uma breve descrição sobre você"
                  className="min-h-[80px] border-none"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="mt-2 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => (resetForm(), setIsDialogOpen(false))}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={isSaving} className="min-w-24">
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <Loader className="size-4 animate-spin" />
                  Salvar
                </span>
              ) : (
                'Salvar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
