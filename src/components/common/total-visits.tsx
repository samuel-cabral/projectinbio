import { TrendingUp } from 'lucide-react'

import { manageAuth } from '@/app/actions/manage-auth'

import { PortalButton } from './portal-button'

type TotalVisitsProps = {
  totalVisits?: number
  showBar?: boolean
  hasActiveSubscription?: boolean
}

export function TotalVisits({ totalVisits = 0, showBar, hasActiveSubscription }: TotalVisitsProps) {
  return (
    <div className="bg-background border-secondary flex w-min items-center gap-5 rounded-xl border px-8 py-3 whitespace-nowrap shadow-lg">
      <span className="font-bold text-white">Total de visitas</span>
      <div className="text-chart-2 flex items-center gap-2">
        <span className="text-3xl font-bold">{totalVisits}</span>
        <TrendingUp />
      </div>

      {showBar && (
        <div className="flex items-center gap-2">
          {hasActiveSubscription && <PortalButton />}
          <form action={manageAuth}>
            <button type="submit" className="cursor-pointer font-bold text-white hover:underline">
              Sair
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
