'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { sanitizeLink } from '@/lib/utils'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

export function HeroLinkInput() {
  const router = useRouter()
  const [link, setLink] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLink(sanitizeLink(e.target.value))
  }

  function handleCreate() {
    const target = link ? `/criar?link=${link}` : '/criar'
    router.push(target)
  }

  return (
    <div className="mt-[10vh] flex w-full items-center gap-2">
      <span className="text-xl text-white">projectinbio.com/</span>
      <Input
        type="text"
        placeholder="Seu link"
        className="border-background bg-background h-12"
        value={link}
        onChange={handleChange}
      />
      <Button className="h-12" onClick={handleCreate}>
        Criar agora
      </Button>
    </div>
  )
}
