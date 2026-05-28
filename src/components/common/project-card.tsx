'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { increaseProjectVisits } from '@/app/actions/increase-project-visits'
import { ProjectData } from '@/app/server/get-profile-projects'

type ProjectCardProps = {
  project: ProjectData
  isOwner: boolean
  imgUrl: string | null
  viewerUserId?: string
}

export function ProjectCard({ project, isOwner, imgUrl, viewerUserId }: ProjectCardProps) {
  const projectUrl = `${project.projectUrl}`
  const formattedProjectUrl = projectUrl.startsWith('http') ? projectUrl : `https://${projectUrl}`

  const { profileId } = useParams<{ profileId: string }>()

  async function handleClick() {
    if (!isOwner && profileId && project.id) {
      await increaseProjectVisits(profileId, project.id, { viewerUserId })
    }
  }

  return (
    <Link
      href={formattedProjectUrl}
      target="_blank"
      className="bg-accent/30 hover:border-accent flex h-[132px] w-[340px] cursor-pointer gap-5 rounded-[20px] border-2 border-transparent p-3 no-underline"
      onClick={handleClick}
    >
      <div className="relative size-24 flex-shrink-0 overflow-hidden rounded-md">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt="Projeto"
            fill
            sizes="96px"
            unoptimized={imgUrl.startsWith('http')}
            className="object-cover"
          />
        ) : (
          <div className="bg-muted flex size-full items-center justify-center" aria-hidden />
        )}
      </div>
      <div className="flex flex-col gap-2">
        {isOwner && (
          <span className="text-chart-2 text-xs font-bold uppercase">
            {project.totalVisits || 0} cliques
          </span>
        )}
        <div className="flex flex-col">
          <span className="font-bold text-white">{project.projectTitle}</span>
          <span className="text-foreground text-sm">{project.projectDescription}</span>
        </div>
      </div>
    </Link>
  )
}
