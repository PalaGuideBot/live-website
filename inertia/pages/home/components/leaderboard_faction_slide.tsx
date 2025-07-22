import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Details, DetailsContent, DetailsTitle } from '@/components/ui/details'
import { cn, formatElo } from '@/lib/utils'
import { getHeadUrl } from '@/lib/minecraft'
import type { HomePageProps } from '@/pages/home/index'

interface LeaderboardSlideProps {
  faction: HomePageProps['factionLeaderboard']
}

export function LeaderboardFactionSlide({ faction }: LeaderboardSlideProps) {
  return (
    <div className="flex-1 grid grid-cols-4 gap-8 [&_[data-slot=card-title]]:text-xl">
      <Card className="col-span-3 pb-0">
        <CardHeader>
          <CardTitle>Classement Faction</CardTitle>
        </CardHeader>
        <CardContent className="px-0 flex-1 grid grid-rows-10">
          {faction.leaderboard.map((item) => (
            <div
              key={item.name}
              className="px-6 py-4 border-t flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'w-12 font-mc text-xl',
                    item.position === 1 && 'text-yellow-500',
                    item.position === 2 && 'text-gray-500',
                    item.position === 3 && 'text-amber-900'
                  )}
                >
                  #{item.position}
                </div>
                <div className="flex items-center gap-2">
                  <img src={item.emblemUrl} className="size-16" />
                  <span className="font-mc text-lg">{item.name}</span>
                </div>
              </div>
              <div className="col-span-2 text-right font-mc text-xl">{formatElo(item.value)}</div>
            </div>
          ))}
        </CardContent>
      </Card>
      {faction.topFaction && <TopFactionCard faction={faction.topFaction} />}
    </div>
  )
}

interface TopFactionCardProps extends React.ComponentProps<'div'> {
  faction: NonNullable<HomePageProps['factionLeaderboard']['topFaction']>
}

function TopFactionCard({ faction, className, ...props }: TopFactionCardProps) {
  return (
    <div className={cn('grid auto-rows-min gap-8', className)} {...props}>
      <Card>
        <CardHeader className="border-b justify-center">
          <CardTitle className="text-center">Top Faction</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <img src={faction.emblemUrl} className="size-50" />
          <span className="font-mc text-xl">{faction.name}</span>
          <Details className="flex items-center">
            <DetailsTitle className="text-lg">Description : </DetailsTitle>
            <DetailsContent className="text-lg">
              {faction.description ? faction.description : 'Aucune'}
            </DetailsContent>
          </Details>
          <Details className="flex items-center">
            <DetailsTitle className="text-lg">Alliance: </DetailsTitle>
            <DetailsContent className="text-lg">{faction.alliance}</DetailsContent>
          </Details>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Membres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(48px,1fr))] gap-2">
            {faction.players.map((member) => (
              <div key={member.uuid} className="group relative">
                <img
                  src={getHeadUrl(member.uuid)}
                  className="size-12 rounded"
                  title={member.username}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
