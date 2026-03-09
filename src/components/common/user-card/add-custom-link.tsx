'use client'

import { Loader, Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

import { createCustomLink, type CreateCustomLinkItem } from '@/app/actions/create-custom-link'
import type { ProfileData } from '@/app/server/get-profile-data'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

const MAX_SLOTS = 3

function buildLinksFromCustomLinks(customLinks?: ProfileData['customLinks']) {
  const existing = (customLinks ?? []).map(({ title, url }) => ({ title, url }))
  const slots = Array.from({ length: Math.max(0, MAX_SLOTS - existing.length) }, () => ({
    title: '',
    url: '',
  }))
  return [...existing, ...slots]
}

type AddCustomLinkProps = {
  customLinks?: ProfileData['customLinks']
  isOwner: boolean
}

export function AddCustomLink({ customLinks, isOwner }: AddCustomLinkProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [links, setLinks] = useState<CreateCustomLinkItem[]>(() =>
    buildLinksFromCustomLinks(customLinks)
  )
  const { profileId } = useParams()
  const router = useRouter()

  function handleOpenModal() {
    setLinks(buildLinksFromCustomLinks(customLinks))
    setIsModalOpen(true)
  }

  function updateLink(index: number, field: 'title' | 'url', value: string) {
    setLinks(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  async function handleAddCustomLink() {
    setIsSaving(true)
    const validLinks = links
      .map(({ title, url }) => ({ title: title.trim(), url: url.trim() }))
      .filter(({ title, url }) => title !== '' && url !== '')

    const ok = await createCustomLink({ profileId: String(profileId), links: validLinks })

    if (ok) {
      startTransition(() => {
        setIsSaving(false)
        setLinks(buildLinksFromCustomLinks(customLinks))
        setIsModalOpen(false)
        router.refresh()
      })
    } else {
      setIsSaving(false)
    }
  }

  if (!isOwner) return null

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Button
        variant="secondary"
        size="icon-xl"
        className="border-secondary rounded-xl"
        onClick={handleOpenModal}
      >
        <Plus />
      </Button>
      <DialogContent className="bg-background rounded-[20px] p-8 shadow-xl">
        <DialogHeader>
          <DialogTitle className="mb-6 text-2xl font-bold">
            Adicionar links personalizados
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {links.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Título do Link"
                className="h-10 flex-1 border-none"
                value={item.title}
                onChange={e => updateLink(index, 'title', e.target.value)}
              />
              <Input
                placeholder="URL do Link"
                className="h-10 flex-1 border-none"
                value={item.url}
                onChange={e => updateLink(index, 'url', e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleAddCustomLink}
            disabled={isSaving}
            className="min-w-24"
          >
            {isSaving ? <Loader className="size-4 animate-spin" /> : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
