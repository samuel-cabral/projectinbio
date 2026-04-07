import { MOCK_PROFILE, MOCK_PROJECTS } from '@/lib/mocks/profile'

import { ProjectCard } from '../common/project-card'
import { TotalVisits } from '../common/total-visits'
import { UserCard } from '../common/user-card/user-card'
import { HeroLinkInput } from './hero-link-input'

export function Hero() {
  return (
    <div className="flex h-screen">
      <div className="mt-[35vh] flex w-full flex-col gap-2">
        <h1 className="max-w-[600px] text-5xl leading-[64px] font-bold text-white">
          Seus projetos e redes sociais em um único link
        </h1>
        <h2 className="text-muted-foreground text-xl leading-6">
          Crie sua própria página de projetos e compartilhe eles com o mundo.
          <br />
          Acompanhe o engajamento com Analytics de clicks.
        </h2>

        <HeroLinkInput />
      </div>

      <div className="flex w-full items-center justify-center bg-[radial-gradient(circle_at_50%_50%,#4B2DBB,transparent_55%)]">
        <div className="relative">
          <UserCard preview />
          <div className="absolute -right-[45%] -bottom-[7%]">
            <TotalVisits totalVisits={MOCK_PROFILE.totalVisits} />
          </div>
          <div className="absolute top-[20%] -left-[45%] -z-10">
            <ProjectCard project={MOCK_PROJECTS[0]} isOwner={false} imgUrl="project1.png" />
          </div>
          <div className="absolute -top-[5%] -left-[55%] -z-10">
            <ProjectCard project={MOCK_PROJECTS[1]} isOwner={false} imgUrl="project2.png" />
          </div>
        </div>
      </div>
    </div>
  )
}
