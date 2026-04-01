import type { ProfileData } from '@/app/server/get-profile-data'
import type { ProjectData } from '@/app/server/get-profile-projects'

export const MOCK_PROFILE: ProfileData = {
  userId: 'demo',
  totalVisits: 1280,
  createdAt: Date.now(),
  displayName: 'Samuel',
  description: 'Criando coisas legais na internet',
  socialLinks: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    twitter: 'https://x.com',
  },
  customLinks: [
    { title: 'Meu portfólio', url: 'https://example.com' },
    { title: 'Newsletter', url: 'https://example.com' },
  ],
}

export const MOCK_PROJECTS: ProjectData[] = [
  {
    id: 'demo-1',
    userId: 'demo',
    totalVisits: 340,
    createdAt: Date.now(),
    projectTitle: 'Project in Bio',
    projectDescription: 'Seus projetos em um único link',
    projectUrl: 'https://example.com',
    imagePath: '',
  },
  {
    id: 'demo-2',
    userId: 'demo',
    totalVisits: 127,
    createdAt: Date.now(),
    projectTitle: 'Outro Projeto',
    projectDescription: 'Um projeto incrível',
    projectUrl: 'https://example.com',
    imagePath: '',
  },
]
