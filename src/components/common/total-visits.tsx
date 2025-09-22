import { TrendingUp } from 'lucide-react'

export function TotalVisits() {
  return (
    <div className="bg-background border-secondary flex w-min items-center gap-5 rounded-xl border px-8 py-3 whitespace-nowrap shadow-lg">
      <span className="font-bold text-white">Total de visitas</span>
      <div className="text-chart-2 flex items-center gap-2">
        <span className="text-3xl font-bold">12342</span>
        <TrendingUp />
      </div>

      {/* <div className="flex items-center gap-2">
        <button>Portal</button>
        <button>Sair</button>
      </div> */}
    </div>
  )
}
