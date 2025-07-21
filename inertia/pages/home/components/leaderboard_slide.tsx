import { PaladiumJob } from '@/components/paladium_job'
import { PaladiumRank } from '@/components/paladium_rank'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Details, DetailsContent, DetailsTitle } from '@/components/ui/details'
import { getHeadUrl } from '@/lib/minecraft'
import { cn, formatPrice } from '@/lib/utils'
import type { HomePageProps } from '@/pages/home/index'

interface LeaderboardSlideProps {
  money: HomePageProps['moneyLeaderboard']
}

export function LeaderboardSlide({ money }: LeaderboardSlideProps) {
  return (
    <div className="flex-1 grid grid-cols-4 gap-8 [&_[data-slot=card-title]]:text-xl">
      <Card className="col-span-3 pb-0">
        <CardHeader>
          <CardTitle>Classement Money</CardTitle>
        </CardHeader>
        <CardContent className="px-0 flex-1 grid grid-rows-10">
          {money.leaderboard.map((player) => (
            <div
              key={player.uuid}
              className="px-6 py-4 border-t flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'w-12 font-mc text-xl',
                    player.position === 1 && 'text-yellow-500',
                    player.position === 2 && 'text-gray-500',
                    player.position === 3 && 'text-amber-900'
                  )}
                >
                  #{player.position}
                </div>
                <div className="flex items-center gap-2">
                  <img src={getHeadUrl(player.uuid)} className="size-16" />
                  <span className="font-mc text-lg">{player.username}</span>
                </div>
              </div>
              <div className="col-span-2 text-right font-mc text-xl">
                {formatPrice(player.value)}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      {money.topPlayer && <TopPlayerCard player={money.topPlayer} />}
    </div>
  )
}

interface TopPlayerCardProps extends React.ComponentProps<'div'> {
  player: NonNullable<HomePageProps['moneyLeaderboard']['topPlayer']>
}

function TopPlayerCard({ player, className, ...props }: TopPlayerCardProps) {
  return (
    <div className={cn('grid grid-rows-3 gap-8', className)} {...props}>
      <Card className="row-span-2">
        <CardHeader className="border-b justify-center">
          <div className="inline-flex items-center gap-2">
            <CardTitle className="block">{player.profile.username}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-1 relative">
          <div className="absolute inset-0 flex justify-center items-center">
            <img
              src={`https://starlightskins.lunareclipse.studio/render/isometric/${player.profile.username}/full`}
              className="h-full w-auto"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="row-span-1">
        <CardContent className="flex-1 flex flex-col justify-evenly">
          <Details className="flex items-center">
            <DetailsTitle className="text-lg">Pseudo :</DetailsTitle>
            <DetailsContent className="text-lg">{player.profile.username}</DetailsContent>
          </Details>
          <Details className="flex items-center">
            <DetailsTitle className="text-lg">Faction :</DetailsTitle>
            <DetailsContent className="text-lg">
              {player.profile.faction || 'Wilderness'}
            </DetailsContent>
          </Details>
          <Details className="flex items-center">
            <DetailsTitle className="text-lg">Rank :</DetailsTitle>
            <DetailsContent className="text-lg">
              <PaladiumRank rank={player.profile.rank || 'default'} />
            </DetailsContent>
          </Details>
          <Details className="flex items-center">
            <DetailsTitle className="text-lg">Temps de jeu :</DetailsTitle>
            <DetailsContent className="text-lg">
              {player.profile.timePlayed === -1 ? 'Masqué' : player.profile.timePlayed}
            </DetailsContent>
          </Details>
          <div className="grid grid-cols-4 gap-4 items-center">
            {Object.entries(player.jobs).map(([job, info]) => (
              <PaladiumJob key={job} job={job} info={info} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
