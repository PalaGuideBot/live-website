/// <reference path="../../adonisrc.ts" />

import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'

import { Providers } from '@/components/providers'
import '../css/app.css'

createInertiaApp({
  progress: { color: '#ffb702' },

  resolve: (name) => {
    return resolvePageComponent(`../pages/${name}.tsx`, import.meta.glob('../pages/**/*.tsx'))
  },

  setup({ el, App, props }) {
    createRoot(el).render(
      <Providers>
        <App {...props} />
      </Providers>
    )
  },
})
