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
          {faction.leaderboard.map((factionItem, index) => (
            <div
              key={factionItem.name}
              className="px-6 py-4 border-t flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'w-12 font-mc text-xl',
                    index + 1 === 1 && 'text-yellow-500',
                    index + 1 === 2 && 'text-gray-500',
                    index + 1 === 3 && 'text-amber-900'
                  )}
                >
                  #{index + 1}
                </div>
                <div className="flex items-center gap-2">
                  <img src={faction.factionsEmblems[index].url} className="size-16" />
                  <span className="font-mc text-lg">{factionItem.name}</span>
                </div>
              </div>
              <div className="col-span-2 text-right font-mc text-xl">
                {formatElo(factionItem.value)}
              </div>
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
          <h2 className="text-center text-2xl font-bold">Top Faction</h2>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <img src={faction.emblemUrl} className="size-50" />
          <span className="font-mc text-xl">{faction.name}</span>
          <Details className="flex items-center">
            <DetailsTitle className="text-lg">Description : </DetailsTitle>
            <DetailsContent className="text-lg">
              {faction.description ? faction.description : 'Aucune description disponible'}
            </DetailsContent>
          </Details>
          <Details className="flex items-center">
            <DetailsTitle className="text-lg">Alliance: </DetailsTitle>
            <DetailsContent className="text-lg">{faction.alliance}</DetailsContent>
          </Details>
        </CardContent>
      </Card>
      <Card>
        <Details>
          <DetailsTitle className="text-center text-lg">Membres</DetailsTitle>
          <DetailsContent className="grid grid-cols-[repeat(auto-fill,minmax(48px,1fr))] gap-2 p-4">
            {faction.members.map((member) => (
              <div key={member.uuid} className="group relative">
                <img
                  src={getHeadUrl(member.uuid)}
                  className="size-12 rounded"
                  title={member.username}
                />
              </div>
            ))}
          </DetailsContent>
        </Details>
      </Card>
    </div>
  )
}
