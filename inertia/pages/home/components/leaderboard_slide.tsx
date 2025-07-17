import { IdleAnimation } from 'skinview3d'

import { SkinViewer3d } from '@/components/skin_viewer_3d'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getHeadUrl, getSkinUrl } from '@/lib/minecraft'
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
          {money.map((player) => (
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
      <TopPlayerCard username={money.at(0)!.username} />
    </div>
  )
}

interface TopPlayerCardProps extends React.ComponentProps<typeof Card> {
  username: string
}

function TopPlayerCard({ username, ...props }: TopPlayerCardProps) {
  return (
    <Card {...props}>
      <CardHeader className="border-b justify-center">
        <div className="inline-flex items-center gap-2">
          <CardTitle className="block">{username}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex justify-center items-center">
        <SkinViewer3d
          className="h-auto! w-full! pointer-events-none!"
          skinUrl={getSkinUrl(username)}
          options={{ enableControls: false }}
          width="330"
          height="600"
          onReady={({ viewer }) => {
            viewer.animation = new IdleAnimation()
            viewer.animation.speed = 3
            viewer.autoRotate = true
            viewer.autoRotateSpeed = 0.5
          }}
        />
      </CardContent>
    </Card>
  )
}
