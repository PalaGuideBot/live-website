import { PaladiumStatus } from '@/types'

export function translateStatus(status: PaladiumStatus) {
  const translations: Record<PaladiumStatus, string> = {
    online: 'En ligne',
    offline: 'Hors ligne',
    maintenance: 'En maintenance',
    running: 'En ligne',
    starting: 'Démarrage',
    restarting: 'Redémarrage',
    stopping: 'Arrêt',
    unknown: 'Inconnu',
    whitelist: 'Whitelist',
  }

  return translations[status] ?? 'Inconnu'
}
