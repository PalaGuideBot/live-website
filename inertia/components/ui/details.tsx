import { cn } from '@/lib/utils'

export function Details({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<'div'> & { orientation?: 'horizontal' | 'vertical' }) {
  return (
    <div
      data-orientation={orientation}
      className={cn(
        'grid gap-1.5 data-[orientation=horizontal]:grid-cols-2 data-[orientation=vertical]:grid-cols-1',
        className
      )}
      {...props}
    />
  )
}

export function DetailsTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('text-sm font-semibold leading-none text-foreground', className)}
      {...props}
    />
  )
}

export function DetailsContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('text-sm text-muted-foreground', className)} {...props} />
}
