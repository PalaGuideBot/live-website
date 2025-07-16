import { Head as InertiaHead } from '@inertiajs/react'
import * as React from 'react'

export function Head({ title, children }: React.ComponentProps<typeof InertiaHead>) {
  return (
    <InertiaHead>
      <title>{title ? `${title} - PalaGuideBot Live` : 'PalaGuideBot Live'}</title>
      {children}
    </InertiaHead>
  )
}
