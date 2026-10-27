/**
 * 站点内容模型 —— 控制台里能改的字段，全部在这里有定义。
 */

export const ICON_NAMES = [
  'sparkles',
  'wifi',
  'mapPin',
  'flame',
  'mic',
  'eyeOff',
  'upload',
  'messageOff',
  'shieldCheck',
  'lock',
  'download',
  'smartphone',
  'scan',
  'alert',
  'zap',
  'heart',
  'gift',
  'star',
  'music',
  'camera',
  'clock',
  'users',
  'bell',
  'globe',
  'video',
  'check',
] as const

export type IconName = (typeof ICON_NAMES)[number]

export const ICON_LABELS: Record<IconName, string> = {
  sparkles: '闪耀 / 免费',
  wifi: 'Wi-Fi / 流量',
  mapPin: '定位 / 距离',
  flame: '火苗 / 即焚',
  mic: '麦克风 / 变声',
  eyeOff: '隐藏 / 隐私',
  upload: '上传',
  messageOff: '私聊',
  shieldCheck: '安全盾',
  lock: '锁',
  download: '下载',
  smartphone: '手机',
  scan: '扫描',
  alert: '警告',
  zap: '闪电',
  heart: '爱心',
  gift: '礼物',
  star: '星星',
  music: '音乐',
  camera: '相机',
  clock: '时间',
  users: '人群',
  bell: '提醒',
  globe: '地球',
  video: '视频',
  check: '勾',
}

/** 统一带 id 的列表项，方便控制台增删与拖序 */
export type WithId = { id: string }

export type NavItem = WithId & { label: string; href: string }

export type HeroSlide = WithId & {
  kicker: string
  title: string
  sub: string
}

export type HighlightItem = WithId & {
  icon: IconName
  title: string
  body: string
  /** 占满整行的大卡 */
  featured?: boolean
}

export type FeaturedBlock = {
  badge: string
  points: string[]
  meterTitle: string
  meterStatus: string
  meterOptions: string[]
}

export type PersonCard = WithId & {
  name: string
  age: number
  /** 距离（米） */
  meters: number
  now: string
  quote: string
  avatar: string
  live: boolean
  tags: string[]
}

export type ChatLine = WithId & {
  from: 'her' | 'you'
  text: string
  /** 系统提示行 */
  system?: boolean
}

export type ChatStory = {
  id: string
  name: string
  meta: string
  avatar: string
  lines: ChatLine[]
}
