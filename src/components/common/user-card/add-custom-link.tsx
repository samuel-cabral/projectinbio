'use client'

import { Loader, Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

import { createCustomLink } from '@/app/actions/create-custom-link'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

const INITIAL_LINKS: { title: string; url: string }[] = [
  { title: '', url: '' },
  { title: '', url: '' },
  { title: '', url: '' },
]

export function AddCustomLink() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [links, setLinks] = useState<{ title: string; url: string }[]>(() =>
    INITIAL_LINKS.map(() => ({ title: '', url: '' }))
  )
  const { profileId } = useParams()
  const router = useRouter()

  function handleOpenModal() {
    setLinks(INITIAL_LINKS.map(() => ({ title: '', url: '' })))
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
        setLinks(INITIAL_LINKS.map(() => ({ title: '', url: '' })))
        setIsModalOpen(false)
        router.refresh()
      })
    } else {
      setIsSaving(false)
    }
  }

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
