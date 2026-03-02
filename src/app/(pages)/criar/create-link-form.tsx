'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { sanitizeLink } from '@/lib/utils'

import { createLink } from '../../actions/create-link'
import { verifyLink } from '../../actions/verify-link'

export function CreateLinkForm() {
  const router = useRouter()
  const [link, setLink] = useState('')
  const [error, setError] = useState('')

  function handleLinkChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    const sanitizedValue = sanitizeLink(value)

    setLink(sanitizedValue)

    if (sanitizedValue.length > 30) {
      setError('O link deve ter no máximo 30 caracteres')
    } else {
      setError('')
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!link.trim()) {
      setError('Escolha um link primeiro. 🤓')
      return
    }

    const islinkAlreadyTaken = await verifyLink(link)

    if (islinkAlreadyTaken) {
      setError('Desculpe, esse link já está em uso. 😭')
      return
    }

    const isLinkCreated = await createLink(link)

    if (!isLinkCreated) {
      setError('Erro ao criar o perfil. Tente novamente.')
      return
    }

    router.push(`/${link}`)
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mt-5 flex w-full items-center gap-2"
      >
        <span>projectinbio.com/</span>
        <Input
          type="text"
          className="border-accent bg-accent h-12 w-full rounded-xl"
          onChange={handleLinkChange}
          value={link}
        />
        <Button className="h-12 w-[126px]">Criar</Button>
      </form>

      <div>
        <span className="text-destructive">{error}</span>
      </div>
    </>
  )
}
