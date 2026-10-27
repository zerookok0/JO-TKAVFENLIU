import {
  AlertTriangle,
  Bell,
  Camera,
  Check,
  Clock,
  Download,
  EyeOff,
  Flame,
  Gift,
  Globe,
  Heart,
  Lock,
  MapPin,
  MessageCircleOff,
  Mic,
  Music2,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Upload,
  Users,
  Video,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { IconName } from '../config/types'

export const ICONS: Record<IconName, LucideIcon> = {
  sparkles: Sparkles,
  wifi: Wifi,
  mapPin: MapPin,
  flame: Flame,
  mic: Mic,
  eyeOff: EyeOff,
  upload: Upload,
  messageOff: MessageCircleOff,
  shieldCheck: ShieldCheck,
  lock: Lock,
  download: Download,
  smartphone: Smartphone,
  scan: ScanLine,
  alert: AlertTriangle,
  zap: Zap,
  heart: Heart,
  gift: Gift,
  star: Star,
  music: Music2,
  camera: Camera,
  clock: Clock,
  users: Users,
  bell: Bell,
  globe: Globe,
  video: Video,
  check: Check,
}

type Props = {
  name: IconName
  className?: string
}

/** 按名字渲染图标，控制台里选什么这里就出什么 */
export function Icon({ name, className = 'h-5 w-5' }: Props) {
  const Cmp = ICONS[name] ?? Sparkles
  return <Cmp className={className} aria-hidden="true" />
}
