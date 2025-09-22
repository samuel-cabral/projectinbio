import { TotalVisits } from '../common/total-visits'
import { UserCard } from '../common/user-card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export function Hero() {
  return (
    <div className="flex h-screen">
      <div className="mt-[35vh] flex w-full flex-col gap-2">
        <h1 className="text-5xl leading-[64px] font-bold text-white">
          Seus projetos e redes sociais em um único link
        </h1>
        <h2 className="text-xl leading-6">
          Crie sua própria página de projetos e compartilhe eles com o mundo.
          <br />
          Acompanhe o engajamento com Analytics de clicks.
        </h2>

        <div className="mt-[10vh] flex w-full items-center gap-2">
          <span className="text-xl text-white">projectinbio.com/</span>
          <Input type="text" placeholder="Seu link" />
          <Button>Criar agora</Button>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-[radial-gradient(circle_at_50%_50%,#4B2DBB,transparent_55%)]">
        <div className="relative">
          <UserCard />
          <div className="absolute -right-[45%] -bottom-[7%]">
            <TotalVisits />
          </div>
          <div className="absolute top-[20%] -left-[45%] -z-10">
            {/* <ProjectCard /> */}
          </div>
          <div className="absolute -top-[5%] -left-[55%] -z-10">
            {/* <ProjectCard /> */}
          </div>
        </div>
      </div>
    </div>
  )
}
