import type { CategoryItem } from '#leaderboard/types'

const categories = [
  'money',
  'job.alchemist',
  'job.hunter',
  'job.miner',
  'job.farmer',
  'boss',
  'egghunt',
  'end',
  'chorus',
  'koth',
  'clicker',
  'factions',
  'alliance',
] as const

const trixiumCategories = ['player', 'faction'] as const

const config = [
  {
    name: 'boss',
    cacheKey: 'leaderboard:boss',
  },
  {
    name: 'chorus',
    cacheKey: 'leaderboard:chorus',
  },
  {
    name: 'clicker',
    cacheKey: 'leaderboard:clicker',
  },
  {
    name: 'egghunt',
    cacheKey: 'leaderboard:egghunt',
  },
  {
    name: 'end',
    cacheKey: 'leaderboard:end',
  },
  {
    name: 'factions',
    cacheKey: 'leaderboard:factions',
  },
  {
    name: 'koth',
    cacheKey: 'leaderboard:koth',
  },
  {
    name: 'money',
    cacheKey: 'leaderboard:money',
  },
  {
    name: 'trixium.faction',
    cacheKey: 'leaderboard:trixium.faction',
  },
  {
    name: 'trixium.player',
    cacheKey: 'leaderboard:trixium.player',
  },
  {
    name: 'alliance',
    cacheKey: 'leaderboard:alliance',
  },
  {
    name: 'job.alchemist',
    cacheKey: 'leaderboard:job.alchemist',
  },
  {
    name: 'job.farmer',
    cacheKey: 'leaderboard:job.farmer',
  },
  {
    name: 'job.hunter',
    cacheKey: 'leaderboard:job.hunter',
  },
  {
    name: 'job.miner',
    cacheKey: 'leaderboard:job.miner',
  },
] satisfies CategoryItem[]

export { categories, config, trixiumCategories }
