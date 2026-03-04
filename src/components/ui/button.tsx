import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-bold transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        default: 'bg-violet-700 text-white hover:bg-violet-700/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-xl gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-xl px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function mergeRefs<T>(
  ref: React.Ref<T> | undefined,
  childRef: React.Ref<T> | undefined
) {
  return (instance: T | null) => {
    if (typeof ref === 'function') ref(instance)
    else if (ref) (ref as React.MutableRefObject<T | null>).current = instance
    if (typeof childRef === 'function') childRef(instance)
    else if (childRef)
      (childRef as React.MutableRefObject<T | null>).current = instance
  }
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const resolvedClassName = cn(buttonVariants({ variant, size, className }))

  if (asChild && React.Children.count(props.children) === 1) {
    const child = React.Children.only(props.children) as React.ReactElement<
      Record<string, unknown> & { className?: string; ref?: React.Ref<unknown> }
    >
    const { ref: refFromProps, ...rest } = props
    const { children: childContent, ...restWithoutChildren } = rest
    void childContent
    return React.cloneElement(child, {
      ...restWithoutChildren,
      ...(child.props as Record<string, unknown>),
      className: cn(resolvedClassName, child.props?.className),
      ref: mergeRefs(refFromProps, (child as { ref?: React.Ref<unknown> }).ref),
    })
  }

  return <button data-slot="button" className={resolvedClassName} {...props} />
}

export { Button, buttonVariants }
