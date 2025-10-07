import { Plus, Sparkles } from 'lucide-react'

import { ProjectCard } from '@/components/common/project-card'
import { TotalVisits } from '@/components/common/total-visits'
import { UserCard } from '@/components/common/user-card'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ profileId: string }>
}) {
  const { profileId } = await params

  return (
    <div className="relative flex h-screen overflow-hidden p-20">
      <div className="bg-card text-foreground fixed top-0 left-0 flex w-full justify-center gap-1 py-2">
        <span>Você está usando a versão trial.</span>
        <button className="flex items-center gap-1">
          <span className="text-chart-2 cursor-pointer font-bold">
            Faça o upgrade agora!
          </span>
        </button>
      </div>

      <div className="flex h-min w-1/2 justify-center">
        <UserCard />
      </div>

      <div className="flex w-full flex-wrap content-start justify-center gap-4 overflow-y-auto">
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <button className="bg-accent/30 hover:border-accent flex h-[132px] w-[340px] cursor-pointer items-center justify-center gap-2 rounded-[20px] border-2 border-transparent p-3 hover:border-dashed">
          <Plus className="text-chart-2 size-10" />
          <span className="text-foreground text-xl">Novo projeto</span>
        </button>
      </div>

      <div className="absolute right-0 bottom-4 left-0 mx-auto w-min">
        <TotalVisits />
      </div>
    </div>
  )
}
