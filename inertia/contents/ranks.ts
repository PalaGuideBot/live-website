import developpeurIcon from '@/assets/rank-icons/developpeur.png'
import discordIcon from '@/assets/rank-icons/discord.png'
import endiumIcon from '@/assets/rank-icons/endium.png'
import divinityIcon from '@/assets/rank-icons/divinity.png'
import legendIcon from '@/assets/rank-icons/legende.png'
import herosIcon from '@/assets/rank-icons/heros.png'
import gamedesignIcon from '@/assets/rank-icons/gamedesign.png'
import graphisteIcon from '@/assets/rank-icons/graphiste.png'
import ingameIcon from '@/assets/rank-icons/ingame.png'
import paladinIcon from '@/assets/rank-icons/paladin.png'
import palastaffIcon from '@/assets/rank-icons/palastaff.png'
import redacteurIcon from '@/assets/rank-icons/redaction.png'
import streamerIcon from '@/assets/rank-icons/streamer.png'
import titanIcon from '@/assets/rank-icons/titan.png'
import trixiumPlusIcon from '@/assets/rank-icons/trixium-plus.png'
import trixiumIcon from '@/assets/rank-icons/trixium.png'
import premiumIcon from '@/assets/rank-icons/premium.png'
import rusherIcon from '@/assets/rank-icons/rusher.png'
import youtuberIcon from '@/assets/rank-icons/youtuber.png'
import adminIcon from '@/assets/rank-icons/admin.png'
import type { Rank } from '@/types'

const icons: Record<Rank, string | null> = {
  'default': null,
  'titan': titanIcon,
  'paladin': paladinIcon,
  'endium': endiumIcon,
  'divinity': divinityIcon,
  'legend': endiumIcon,
  'heros': herosIcon,
  'legende': legendIcon,
  'trixium': trixiumIcon,
  'trixium+': trixiumPlusIcon,
  'premium': premiumIcon,
  'rusher': rusherIcon,
  'youtuber': youtuberIcon,
  'streamer': streamerIcon,
  'helper': ingameIcon,
  'supportconfirmé': ingameIcon,
  'moderateurchat': ingameIcon,
  'moderateur': ingameIcon,
  'moderateursenior': ingameIcon,
  'operateur': ingameIcon,
  'operateurcertif': ingameIcon,
  'operateursenior': ingameIcon,
  'paladium-staff': palastaffIcon,
  'discord': discordIcon,
  'discord+': discordIcon,
  'graphistejunior': graphisteIcon,
  'graphiste': graphisteIcon,
  'création': graphisteIcon,
  'redacteur': redacteurIcon,
  'gamedesigner': gamedesignIcon,
  'developpeurjunior': developpeurIcon,
  'developpeur': developpeurIcon,
  'developpeursenior': developpeurIcon,
  'graphistesenior': graphisteIcon,
  'responsable': adminIcon,
  'administrateur': adminIcon,
}

const translations: Record<Rank, string> = {
  'default': 'Joueur',
  'titan': 'Titan',
  'paladin': 'Paladin',
  'endium': 'Endium',
  'divinity': 'Divinité',
  'legend': 'Légende',
  'heros': 'Héros',
  'legende': 'Légende',
  'trixium': 'Trixium',
  'trixium+': 'Trixium+',
  'premium': 'Premium',
  'rusher': 'Rusher',
  'youtuber': 'Youtuber',
  'streamer': 'Streamer',
  'helper': 'Helper',
  'supportconfirmé': 'Support Confirmé',
  'moderateurchat': 'Modérateur Chat',
  'moderateur': 'Modérateur',
  'moderateursenior': 'Modérateur Senior',
  'operateur': 'Opérateur',
  'operateurcertif': 'Opérateur Certifié',
  'operateursenior': 'Opérateur Senior',
  'paladium-staff': 'Staff Paladium',
  'discord': 'Discord',
  'discord+': 'Discord+',
  'graphistejunior': 'Graphiste Junior',
  'graphiste': 'Graphiste',
  'création': 'Création',
  'redacteur': 'Rédacteur',
  'gamedesigner': 'Game Designer',
  'developpeurjunior': 'Développeur Junior',
  'developpeur': 'Développeur',
  'developpeursenior': 'Développeur Senior',
  'graphistesenior': 'Graphiste Senior',
  'responsable': 'Responsable',
  'administrateur': 'Administrateur',
}

export function rankToIcon(rank: Rank) {
  return icons[rank]
}

export function translateRank(rank: string) {
  return translations[rank as Rank] ?? 'Joueur'
}
