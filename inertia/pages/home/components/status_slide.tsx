import {
  CirclePlayIcon,
  CirclePowerIcon,
  ConstructionIcon,
  EarthIcon,
  GamepadIcon,
  ListXIcon,
  ShieldQuestionIcon,
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import { Spinner } from '@/components/ui/spinner'
import { getFactionBannerUrl, getFactionIconUrl } from '@/contents/faction'
import { translateStatus } from '@/contents/status'
import { cn } from '@/lib/utils'
import type { HomePageProps } from '@/pages/home/index'
import { PaladiumStatus } from '@/types'
import { useOnlinePlayers } from '../hooks/use_online_players'

interface StatusSlideProps {
  status: HomePageProps['status']
}

export function StatusSlide({ status }: StatusSlideProps) {
  return (
    <div className="flex-1 flex flex-col gap-8">
      <div className="grid grid-cols-5 gap-8">
        {Object.entries(status.java.factions).map(([faction, state]) => (
          <FactionCard key={faction} faction={faction} state={state as 'unknown'} />
        ))}
      </div>
      <div className="flex-1 grid grid-cols-5 gap-8">
        <PlayerOnlineChart className="col-span-4" />
        <div className="flex-1 col-span-1 grid grid-rows-2 gap-8">
          <Card
            className={cn(
              'pt-0 overflow-hidden',
              getBackgroundClass(status.java.global.status as 'unknown')
            )}
          >
            <CardHeader className="relative h-[90%]">
              <div
                className="absolute inset-x-0 top-0 h-full bg-size-[200%] bg-left-bottom"
                style={{
                  backgroundImage: `url(/map-background.png)`,
                }}
              />
              <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-transparent to-black" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <EarthIcon />
                <CardTitle className="text-2xl">Global</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1">
                <span>Etat :</span>
                <UptimeIndicatorStatus status={status.java.global.status as 'unknown'} />
              </div>
            </CardContent>
          </Card>
          <Card
            className={cn(
              'pt-0 overflow-hidden',
              getBackgroundClass(status.launcher.status as 'unknown')
            )}
          >
            <CardHeader className="relative h-[90%]">
              <div
                className="absolute inset-x-0 top-0 h-full bg-right bg-cover"
                style={{ backgroundImage: 'url(/launcher-background.png)' }}
              />
              <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-transparent to-black" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <GamepadIcon />
                <CardTitle className="text-2xl">Launcher</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1">
                <span>Etat :</span>
                <UptimeIndicatorStatus status={status.launcher.status as 'unknown'} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface FactionCardProps {
  faction: string
  state: PaladiumStatus
}

function FactionCard({ faction, state }: FactionCardProps) {
  return (
    <Card className={cn('pt-0 overflow-hidden', getBackgroundClass(state as 'unknown'))}>
      <CardHeader className="relative h-40">
        <div
          className="absolute inset-x-0 top-0 h-full bg-center bg-cover"
          style={{ backgroundImage: `url(${getFactionBannerUrl(faction.toLowerCase())})` }}
        />
        <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-transparent to-black" />
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <img src={getFactionIconUrl(faction.toLowerCase())} className="w-8 h-auto" />
          <CardTitle className="text-2xl">{faction}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1">
          <span>Etat :</span>
          <UptimeIndicatorStatus status={state as 'unknown'} />
        </div>
      </CardContent>
    </Card>
  )
}

function PlayerOnlineChart({ className, ...props }: React.ComponentProps<typeof Card>) {
  const onlinePlayers = useOnlinePlayers()
  const lastCount = onlinePlayers.at(-1)?.count || 0
  const chartConfig = {
    count: {
      label: 'Joueurs en ligne',
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig

  return (
    <Card className={cn('py-4 sm:py-0', className)} {...props}>
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Joueurs en ligne</CardTitle>
        </div>
        <div className="flex">
          <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
            <span className="text-muted-foreground text-xs">Dernier relevé</span>
            <span className="text-lg leading-none font-bold sm:text-3xl">{lastCount}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
          <AreaChart
            data={onlinePlayers}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid />
            <YAxis dataKey="count" tickLine={false} axisLine={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })
              }}
            />
            <Area
              dataKey="count"
              type="monotone"
              fill="url(#fillCount)"
              stroke="var(--color-count)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function UptimeIndicatorStatus({
  status,
  variant = 'outline',
  ...props
}: React.ComponentProps<typeof Badge> & { status: PaladiumStatus }) {
  const icon = {
    online: (
      <span className="flex h-4 w-4 items-center justify-center rounded-full before:flex before:aspect-square before:w-[6px] before:rounded-full before:bg-emerald-500 before:content-['']" />
    ),
    offline: (
      <span className="flex h-4 w-4 items-center justify-center rounded-full before:flex before:aspect-square before:w-[6px] before:rounded-full before:bg-destructive before:content-['']" />
    ),
    maintenance: <ConstructionIcon className="h-4 w-4" />,
    running: (
      <span className="flex h-4 w-4 items-center justify-center rounded-full before:flex before:aspect-square before:w-[6px] before:rounded-full before:bg-emerald-500 before:content-['']" />
    ),
    starting: <CirclePlayIcon className="h-4 w-4" />,
    restarting: <Spinner variant="ellipsis" className="text-primary" />,
    stopping: <CirclePowerIcon className="h-4 w-4 animate-blink" />,
    unknown: <ShieldQuestionIcon className="h-4 w-4" />,
    whitelist: <ListXIcon className="h-4 w-4" />,
  }[status]

  return (
    <Badge variant={variant} {...props}>
      {icon}
      {translateStatus(status)}
    </Badge>
  )
}

function getBackgroundClass(status: PaladiumStatus) {
  return cn(
    'bg-gradient-to-bl',
    status === 'online' && 'from-card from-60% to-emerald-700/20',
    status === 'offline' && 'from-card from-60% to-red-700/20',
    status === 'maintenance' && 'from-card from-60% to-yellow-700/20',
    status === 'whitelist' && 'from-card from-60% to-blue-700/20',
    status === 'running' && 'from-card from-60% to-emerald-700/20',
    status === 'starting' && 'from-card from-60% to-yellow-700/20',
    status === 'restarting' && 'from-card from-60% to-yellow-700/20',
    status === 'stopping' && 'from-card from-60% to-red-700/20',
    status === 'unknown' && 'from-card from-60% to-gray-700/20'
  )
}
