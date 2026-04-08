import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { NewProjectButton } from '@/app/(pages)/[profileId]/new-project-button'
import { increaseProfileVisits } from '@/app/actions/increase-profile-visits'
import { ProjectCard } from '@/components/common/project-card'
import { TotalVisits } from '@/components/common/total-visits'
import { UserCard } from '@/components/common/user-card/user-card'
import { auth } from '@/lib/auth'

import { getDownloadUrlFromPath } from '../../../lib/firebase'
import { getProfileData } from '../../server/get-profile-data'
import { getProfileProjects } from '../../server/get-profile-projects'

export default async function ProfilePage({ params }: { params: Promise<{ profileId: string }> }) {
  const { profileId } = await params

  const profileData = await getProfileData(profileId)

  if (!profileData) {
    return notFound()
  }

  const projects = await getProfileProjects(profileId)

  const session = await auth()

  const isOwner = session?.user?.id === profileData.userId

  const avatarUrl = profileData.avatarImagePath
    ? await getDownloadUrlFromPath(profileData.avatarImagePath)
    : null

  if (!isOwner) {
    await increaseProfileVisits(profileId)
  }

  const hasActiveSubscription =
    profileData.subscriptionStatus === 'active' || profileData.subscriptionStatus === 'trialing'

  if (isOwner && !session?.user?.isTrial && !hasActiveSubscription) {
    redirect(`/${profileId}/upgrade`)
  }

  return (
    <div className="relative flex h-screen overflow-hidden p-20">
      {isOwner && session?.user?.isTrial && !hasActiveSubscription && (
        <div className="bg-card text-foreground fixed top-0 left-0 flex w-full justify-center gap-1 py-2">
          <span>Você está usando a versão trial.</span>
          <Link href={`/${profileId}/upgrade`}>
            <button className="flex items-center gap-1">
              <span className="text-chart-2 cursor-pointer font-bold hover:underline">
                Faça o upgrade agora!
              </span>
            </button>
          </Link>
        </div>
      )}

      <div className="flex h-min w-1/2 justify-center">
        <UserCard profileData={profileData} avatarUrl={avatarUrl} isOwner={isOwner} />
      </div>

      <div className="flex w-full flex-wrap content-start justify-center gap-4 overflow-y-auto">
        {projects.map(async project => (
          <ProjectCard
            key={project.id}
            project={project}
            isOwner={isOwner}
            imgUrl={(await getDownloadUrlFromPath(project.imagePath)) || ''}
          />
        ))}
        {isOwner && <NewProjectButton profileId={profileId} />}
      </div>

      {isOwner && (
        <div className="absolute right-0 bottom-4 left-0 mx-auto w-min">
          <TotalVisits
            totalVisits={profileData.totalVisits}
            showBar
            hasActiveSubscription={hasActiveSubscription}
          />
        </div>
      )}
    </div>
  )
}
