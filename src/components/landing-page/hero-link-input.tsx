'use client'

import { useState } from 'react'

import { heroCreate } from '@/app/actions/hero-create'
import { sanitizeLink } from '@/lib/utils'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

export function HeroLinkInput() {
  const [link, setLink] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLink(sanitizeLink(e.target.value))
  }

  function handleSubmit() {
    if (link) localStorage.setItem('pendingLink', link)
  }

  return (
    <form
      action={heroCreate}
      onSubmit={handleSubmit}
      className="mt-[10vh] flex w-full items-center gap-2"
    >
      <span className="text-xl text-white">projectinbio.luzomind.com/</span>
      <input type="hidden" name="link" value={link} />
      <Input
        type="text"
        placeholder="Seu link"
        className="border-background bg-background h-12"
        value={link}
        onChange={handleChange}
      />
      <Button type="submit" className="h-12">
        Criar agora
      </Button>
    </form>
  )
}
