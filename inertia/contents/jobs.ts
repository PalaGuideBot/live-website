import alchemistIcon from '@/assets/job-icons/alchemist.png'
import farmerIcon from '@/assets/job-icons/farmer.png'
import hunterIcon from '@/assets/job-icons/hunter.png'
import minerIcon from '@/assets/job-icons/miner.png'

import type { Job } from '@/types'

export const icons: Record<Job, string> = {
  alchemist: alchemistIcon,
  farmer: farmerIcon,
  hunter: hunterIcon,
  miner: minerIcon,
}
