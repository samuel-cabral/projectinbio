import { Header } from '@/components/landing-page/header'
import { Button } from '@/components/ui/button'
import {
  ANNUAL_PRICE_WITH_DISCOUNT,
  formatPriceToBRL,
  MONTHLY_PRICE,
} from '@/lib/config'

export default function UpgradePage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Header />
      <h2 className="text-2xl font-bold">Escolha o plano</h2>
      <div className="flex gap-4">
        <Button>{`${formatPriceToBRL(MONTHLY_PRICE)} / mês`}</Button>
        <Button>{`${formatPriceToBRL(ANNUAL_PRICE_WITH_DISCOUNT)} Vitalício`}</Button>
      </div>
    </div>
  )
}
