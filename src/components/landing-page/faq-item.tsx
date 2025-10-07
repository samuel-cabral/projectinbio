export function FAQItem({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="borber border-border bg-background flex h-min w-[351px] flex-col gap-3 rounded-2xl border p-5">
      <p className="text-foreground font-bold">{title}</p>
      <p className="text-content-body text-muted-foreground">{description}</p>
    </div>
  )
}
