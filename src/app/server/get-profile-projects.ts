import 'server-only'

import { db } from '@/lib/firebase'

export type ProjectData = {
  id: string
  userId: string
  totalVisits: number
  createdAt: number
  projectTitle: string
  projectDescription: string
  projectUrl: string
  imagePath: string
}

export async function getProfileProjects(profileId: string) {
  const querySnapshot = await db
    .collection('profiles')
    .doc(profileId)
    .collection('projects')
    .orderBy('createdAt', 'desc')
    .get()

  const projects: ProjectData[] = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<ProjectData, 'id'>),
  }))

  return projects
}
