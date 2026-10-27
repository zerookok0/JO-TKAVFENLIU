/**
 * ────────────────────────────────────────────────────────────────
 *  视频配置  ·  唯一需要改的地方
 * ────────────────────────────────────────────────────────────────
 *
 * 【换视频】把 mp4 上传到任意「能直链访问」的地方，然后把链接
 * 粘到下面对应条目的 src 里即可。不需要改任何组件代码。
 *
 * 上传步骤（以 Cloudflare R2 为例，中文后台）：
 *   1. 打开 Cloudflare → R2 → Create bucket
 *   2. 把 mp4 拖进去 → 点开文件 → 打开 Public Access
 *   3. 复制 https://xxx.r2.dev/01.mp4 这样的直链
 *
 * 【规格建议】竖屏 720×1280 或 1080×1920，码率 1.5–2.5 Mbps，
 * 时长 8–15 秒，单条 2–4 MB。手机里只有 420px 宽，720p 足够清晰。
 *
 * 【封面 poster】留空时会自动取视频首帧（Pexels 源支持）。
 * 换成你自己的视频后，建议填一张封面图链接，首屏才不会有空白期。
 *
 * 【注意】Pexels 的视频仅作演示占位，请勿用于正式上线。
 * ────────────────────────────────────────────────────────────────
 */

export type VideoItem = {
  id: string
  /** 视频直链（.mp4） */
  src: string
  /** 封面图，留空则尝试用视频首帧 */
  poster?: string
  /** 昵称 */
  name: string
  /** 头像图链接 */
  avatar: string
  /** 视频下的文案 */
  caption: string
  /** 话题标签，最多 2 个 */
  tags: string[]
  /** 音乐名 */
  music: string
  /** 距离（km），用于「附近」叙事 */
  distanceKm: number
  /** 发布时间文案 */
  postedAt: string
  likes: number
  comments: number
  saves: number
  shares: number
  /** 角标文案，可留空 */
  badge?: string
}

const pexelsPoster = (id: number) =>
  `https://images.pexels.com/videos/${id}/pictures/preview-0.jpeg?auto=compress&cs=tinysrgb&w=720`

const pexelsVideo = (id: number) =>
  `https://videos.pexels.com/video-files/${id}/${id}-hd_1080_1920_30fps.mp4`

const avatar = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop`

export const VIDEOS: VideoItem[] = [
  {
    id: 'v1',
    src: pexelsVideo(7515915),
    poster: pexelsPoster(7515915),
    name: '夜色收集者',
    avatar: avatar(415829),
    caption: '凌晨一点的街，风比白天温柔一点。',
    tags: ['#深夜漫游', '#城市夜景'],
    music: '原声 · 夜色收集者',
    distanceKm: 0.62,
    postedAt: '12 分钟前',
    likes: 128400,
    comments: 2841,
    saves: 6120,
    shares: 9602,
    badge: '附近热门',
  },
  {
    id: 'v2',
    src: pexelsVideo(2795405),
    poster: pexelsPoster(2795405),
    name: 'Mia_',
    avatar: avatar(774909),
    caption: '今天的光刚刚好，随手一拍就是氛围感。',
    tags: ['#氛围感', '#日常碎片'],
    music: 'Slow Motion · Beat Lab',
    distanceKm: 1.2,
    postedAt: '28 分钟前',
    likes: 86200,
    comments: 1903,
    saves: 3410,
    shares: 4410,
  },
  {
    id: 'v3',
    src: pexelsVideo(4434242),
    poster: pexelsPoster(4434242),
    name: '阿岚',
    avatar: avatar(1181686),
    caption: '周末的露台，一杯冰的，什么都不想。',
    tags: ['#周末计划', '#松弛感'],
    music: 'Sunday Vibe · 独立音乐',
    distanceKm: 1.8,
    postedAt: '1 小时前',
    likes: 243700,
    comments: 5120,
    saves: 12800,
    shares: 12800,
    badge: '本周飙升',
  },
  {
    id: 'v4',
    src: pexelsVideo(8815559),
    poster: pexelsPoster(8815559),
    name: 'Kai',
    avatar: avatar(1239291),
    caption: '训练第 41 天，身体比闹钟更准时。',
    tags: ['#自律打卡', '#训练日常'],
    music: 'Push It · Gym Mix',
    distanceKm: 2.4,
    postedAt: '1 小时前',
    likes: 54900,
    comments: 1204,
    saves: 2180,
    shares: 2870,
  },
  {
    id: 'v5',
    src: pexelsVideo(5708830),
    poster: pexelsPoster(5708830),
    name: '软糖不加糖',
    avatar: avatar(1382731),
    caption: '第一次尝试这个转场，会不会有点上头。',
    tags: ['#转场挑战', '#剪辑练习'],
    music: 'Neon Drive · Synthwave',
    distanceKm: 3.1,
    postedAt: '2 小时前',
    likes: 392100,
    comments: 8420,
    saves: 20100,
    shares: 20100,
    badge: '挑战进行中',
  },
  {
    id: 'v6',
    src: pexelsVideo(5320011),
    poster: pexelsPoster(5320011),
    name: '南风',
    avatar: avatar(1130626),
    caption: '把今天的云存进相册，怕明天就忘了。',
    tags: ['#天空收藏', '#慢生活'],
    music: 'Cloud Nine · Ambient',
    distanceKm: 3.6,
    postedAt: '3 小时前',
    likes: 71200,
    comments: 1460,
    saves: 3020,
    shares: 3300,
  },
  {
    id: 'v7',
    src: pexelsVideo(2499611),
    poster: pexelsPoster(2499611),
    name: '北北',
    avatar: avatar(247322),
    caption: '这条街的灯，每次路过都像重新认识一遍。',
    tags: ['#街头摄影', '#夜景'],
    music: 'After Hours · Lo-Fi',
    distanceKm: 4.2,
    postedAt: '4 小时前',
    likes: 158600,
    comments: 3208,
    saves: 7760,
    shares: 7760,
  },
]

/** 数字格式化：128400 → 12.8w */
export const formatCount = (n: number): string => {
  if (n >= 10000) {
    const v = n / 10000
    return `${v >= 100 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, '')}w`
  }
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return String(n)
}

/** 距离格式化：0.62 → 620m；1.2 → 1.2km */
export const formatDistance = (km: number): string =>
  km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`
