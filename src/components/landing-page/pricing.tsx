import {
  ANNUAL_PRICE_WITH_DISCOUNT,
  ANNUAL_PRICE_WITHOUT_DISCOUNT,
  calculateDiscountPercentage,
  formatPriceToBRL,
  MONTHLY_PRICE,
  TRIAL_DAYS,
} from '../../lib/config'
import { Button } from '../ui/button'

export function Pricing() {
  return (
    <div className="my-[150px] flex flex-col items-center gap-14">
      <div className="flex flex-col items-center gap-6">
        <h3 className="text-4xl font-bold text-white">
          Um valor acessível para todos
        </h3>

        <p className="text-muted-foreground text-center text-xl leading-6">
          Junte-se à comunidade de criadores e profissionais que estão já estão
          elevando sua <br />
          presença online. Teste gratuitamente por{' '}
          <strong className="text-pink-700">{TRIAL_DAYS} dias</strong>, sem
          compromisso!
        </p>

        <div className="flex items-end gap-9">
          <div className="border-accent flex w-[304px] flex-col gap-9 rounded-2xl border p-8">
            <div className="flex flex-col gap-1">
              <h4 className="text-xl font-bold text-white">Mensal</h4>
              <span>Apenas</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-foreground text-5xl font-bold">
                {formatPriceToBRL(MONTHLY_PRICE)}
              </span>
              <span className="text-muted-foreground text-xl">/mês</span>
            </div>
            <Button variant="secondary" className="max-w-20">
              Assinar
            </Button>
          </div>

          <div className="border-accent flex w-[304px] flex-col justify-center rounded-2xl border bg-[linear-gradient(90deg,#4B2DBB_0%,#B5446B_100%)] p-[1.6px]">
            <div className="flex h-8 items-center justify-center text-sm">
              <span className="font-bold text-white uppercase">
                Recomendado
              </span>
            </div>
            <div className="border-accent bg-background flex w-full flex-col gap-9 rounded-b-2xl border p-8">
              <div className="flex flex-col gap-1">
                <h4 className="text-xl font-bold text-white">Vitalício</h4>
                <span>Economize com</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-foreground text-5xl font-bold">
                  {formatPriceToBRL(ANNUAL_PRICE_WITH_DISCOUNT)}
                </span>
              </div>
              <Button className="max-w-min">Assinar</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
