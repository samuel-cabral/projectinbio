export const TRIAL_DAYS = 7

export const MONTHLY_PRICE = 9.9
export const ANNUAL_PRICE_WITHOUT_DISCOUNT = 12 * MONTHLY_PRICE
export const ANNUAL_PRICE_WITH_DISCOUNT = 99.9

export function calculateDiscountPercentage(
  annualPriceWithoutDiscount: number,
  annualPriceWithDiscount: number
) {
  const discount = annualPriceWithoutDiscount - annualPriceWithDiscount
  const discountPercentage = (discount / annualPriceWithoutDiscount) * 100
  return Math.round(discountPercentage)
}

export function formatPriceToBRL(price: number) {
  const integerPart = Math.floor(price)
  const decimalPart = price - integerPart

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: decimalPart ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(price)
}
