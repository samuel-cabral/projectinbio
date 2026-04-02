import { CheckoutButtons } from './checkout-buttons'

export default function UpgradePage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Escolha o plano</h2>
      <CheckoutButtons />
    </div>
  )
}
