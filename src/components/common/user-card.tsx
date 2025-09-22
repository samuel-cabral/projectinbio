import { Github, Instagram, Linkedin, Plus, Twitter } from 'lucide-react'
import Image from 'next/image'

import { Button } from '../ui/button'

export function UserCard() {
  const icons = [Github, Instagram, Linkedin, Twitter, Plus]

  return (
    <div className="border-opacity-10 flex w-[348px] flex-col items-center justify-center gap-5 rounded-3xl border bg-[#121212] p-5 text-white">
      <div className="size-48">
        <Image
          src="/me.png"
          alt="Samuel Cabral"
          className="h-full w-full rounded-full object-cover"
          width={192}
          height={192}
        />
      </div>

      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3 className="min-w-0 overflow-hidden text-3xl font-bold">
            Samuel Cabral
          </h3>
        </div>

        <p className="opacity-40">
          &quot;Eu faço produtos para a Internet&quot;
        </p>
      </div>

      <div className="flex w-full flex-col gap-2">
        <span className="text-xs font-medium uppercase">Links</span>
        <div className="flex gap-3">
          {icons.map((Icon, index) => (
            <button
              key={index}
              className="rounded-xl bg-[#1E1E1E] p-3 hover:bg-[#2E2E2E]"
            >
              <Icon />
            </button>
          ))}
        </div>
      </div>
      <div className="flex h-[172px] w-full flex-col gap-3">
        <div className="flex w-full flex-col items-center gap-3">
          <Button className="w-full">Template SaaS - Compre agora</Button>
          <button className="rounded-xl bg-[#1E1E1E] p-3 hover:bg-[#2E2E2E]">
            <Plus />
          </button>
        </div>
      </div>
    </div>
  )
}
