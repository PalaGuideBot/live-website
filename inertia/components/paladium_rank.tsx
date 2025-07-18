import { rankToIcon, translateRank } from '@/contents/ranks'
import type { Rank } from '@/types'

interface PaladiumRankProps {
  rank: string
}

export function PaladiumRank({ rank }: PaladiumRankProps) {
  const rankIcon = rankToIcon(rank as Rank)
  const translatedRank = translateRank(rank as Rank)

  return (
    <div className="flex items-center gap-2">
      <span>{translatedRank}</span>
      {rankIcon && <img src={rankIcon} alt={`${rank}'s icon`} className="size-6" />}
    </div>
  )
}
