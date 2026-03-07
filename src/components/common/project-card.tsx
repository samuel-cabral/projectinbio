'use client'

import Image from 'next/image'
import Link from 'next/link'
import router from 'next/router'

import { ProjectData } from '@/app/server/get-profile-projects'

type ProjectCardProps = {
  project: ProjectData
  isOwner: boolean
  imgUrl: string | null
}

export function ProjectCard({ project, isOwner, imgUrl }: ProjectCardProps) {
  const projectUrl = `${project.projectUrl}`
  const formattedProjectUrl = projectUrl.startsWith('http') ? projectUrl : `https://${projectUrl}`

  function handleClick() {
    console.log('clicked') // TODO: implement analytics click
  }
  return (
    <Link
      href={formattedProjectUrl}
      target="_blank"
      className="bg-accent/30 hover:border-accent flex h-[132px] w-[340px] cursor-pointer gap-5 rounded-[20px] border-2 border-transparent p-3 no-underline"
      onClick={handleClick}
    >
      <div className="size-24 flex-shrink-0 overflow-hidden rounded-md">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt="Projeto"
            className="h-full w-full object-cover"
            width={100}
            height={100}
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
