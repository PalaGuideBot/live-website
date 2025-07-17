import BannerFactionAeloria from '@/assets/faction-banners/aeloria.png'
import BannerFactionEgopolis from '@/assets/faction-banners/egopolis.png'
import BannerFactionKilmodra from '@/assets/faction-banners/kilmordra.png'
import BannerFactionRunegard from '@/assets/faction-banners/runegard.png'
import BannerFactionXanoth from '@/assets/faction-banners/xanoth.png'

import IconFactionAeloria from '@/assets/faction-icons/aeloria.png'
import IconFactionEgopolis from '@/assets/faction-icons/egopolis.png'
import IconFactionKilmodra from '@/assets/faction-icons/kilmordra.png'
import IconFactionRunegard from '@/assets/faction-icons/runegard.png'
import IconFactionXanoth from '@/assets/faction-icons/xanoth.png'

export const factions = ['aeloria', 'egopolis', 'kilmordra', 'runegard', 'xanoth'] as const

export function getFactionBannerUrl(faction: string) {
  const banners: Record<(typeof factions)[number], string> = {
    aeloria: BannerFactionAeloria,
    egopolis: BannerFactionEgopolis,
    kilmordra: BannerFactionKilmodra,
    runegard: BannerFactionRunegard,
    xanoth: BannerFactionXanoth,
  }

  return banners[faction as (typeof factions)[number]] || BannerFactionAeloria
}

export function getFactionIconUrl(faction: string) {
  const icons: Record<(typeof factions)[number], string> = {
    aeloria: IconFactionAeloria,
    egopolis: IconFactionEgopolis,
    kilmordra: IconFactionKilmodra,
    runegard: IconFactionRunegard,
    xanoth: IconFactionXanoth,
  }

  return icons[faction as (typeof factions)[number]] || IconFactionAeloria
}
