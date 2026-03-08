'use client'

import { Github, Instagram, Linkedin, Loader, Plus, Twitter } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

import { createSocialLinks } from '@/app/actions/create-social-links'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

export function EditSocialLinks() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddingSocialLinks, setIsAddingSocialLinks] = useState(false)

  const { profileId } = useParams()
  const router = useRouter()

  const [github, setGithub] = useState('')
  const [instagram, setInstagram] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [twitter, setTwitter] = useState('')

  async function handleAddSocialLinks() {
    setIsAddingSocialLinks(true)

    const ok = await createSocialLinks({
      profileId: String(profileId),
      github: github || undefined,
      instagram: instagram || undefined,
      linkedin: linkedin || undefined,
      twitter: twitter || undefined,
    })

    if (ok) {
      startTransition(() => {
        setIsAddingSocialLinks(false)
        setGithub('')
        setInstagram('')
        setLinkedin('')
        setTwitter('')
        setIsModalOpen(false)
        router.refresh()
      })
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="rounded-xl bg-[#1E1E1E] p-3 hover:bg-[#2E2E2E]"
      >
        <Plus />
      </button>
      <DialogContent className="bg-background rounded-[20px] p-8 shadow-xl">
        <DialogHeader>
          <DialogTitle className="mb-6 text-2xl font-bold">Adicionar redes sociais</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              <Github size={20} />
            </span>
            <Input
              id="github"
              type="text"
              placeholder="Github"
              className="h-10 flex-1 border-none"
              value={github}
              onChange={e => setGithub(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-600">
              <Linkedin size={20} />
            </span>
            <Input
              id="linkedin"
              type="text"
              placeholder="Linkedin"
              className="h-10 flex-1 border-none"
              value={linkedin}
              onChange={e => setLinkedin(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-pink-500">
              <Instagram size={20} />
            </span>
            <Input
              id="instagram"
              type="text"
              placeholder="Instagram"
              className="h-10 flex-1 border-none"
              value={instagram}
              onChange={e => setInstagram(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sky-400">
              <Twitter size={20} />
            </span>
            <Input
              id="twitter"
              type="text"
              placeholder="Twitter"
              className="h-10 flex-1 border-none"
              value={twitter}
              onChange={e => setTwitter(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleAddSocialLinks}
            disabled={isAddingSocialLinks}
            className="min-w-24"
          >
            {isAddingSocialLinks ? <Loader className="size-4 animate-spin" /> : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
