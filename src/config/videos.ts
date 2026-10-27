import type { WithId } from './types'

export type VideoItem = WithId & {
  /** 视频直链（.mp4） */
  src: string
  /** 封面图，留空则自动取视频中段某一帧 */
  poster: string
  /**
   * 抓帧得到的候选封面（dataURL）。
   *
   * 有了它，「封面图 URL」就不再需要你手工去找图 ——
   * 在控制台点「抓 5 帧」，挑一张，写回 poster 即可。
   *
   * 存这里而不是 localStorage 单独一份，是为了跟着视频走：
   * 换顺序、删视频，候选图不会错位。
   */
  frameOptions?: string[]
  name: string
  avatar: string
  caption: string
  tags: string[]
  music: string
  /** 距离（km） */
  distanceKm: number
  postedAt: string
  likes: number
  comments: number
  saves: number
  shares: number
  /** 角标，留空不显示 */
  badge: string
}

const avatar = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop`

/**
 * ────────────────────────────────────────────────────────────────
 *  手机里的短视频
 * ────────────────────────────────────────────────────────────────
 *
 *  这里是「唯一」的视频来源，写进代码、跟着 git 走。
 *  控制台里改动只落在你自己浏览器的 localStorage，
 *  不会影响线上 —— 要正式生效，只能改这个文件再部署。
 *
 *  两条硬性要求：
 *    · src 必须是能直接播的 .mp4 直链（不能是播放页、不能要登录）
 *    · poster 必须是能直接打开的图片直链
 *
 *  四条视频的封面都是手工给的，所以不需要在控制台里抓帧。
 *  poster 留空才会退回「取视频中段某一帧」那套逻辑。
 *
 *  文案已统一为阿拉伯语，与整站 RTL 版面一致。
 *  原文案为西语 / 日语 / 中文，按原意逐条译成阿语。
 * ────────────────────────────────────────────────────────────────
 */
export const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: 'v1',
    src: 'https://smsupermarket.shop/Recog%C3%AD%20a%20Mi%20Cliente%20Favorito%20De%20DIDI%20Sin%20Sost%C3%A9n%20y%20Toco%20Mis%20Grand.mp4',
    poster: 'https://smsupermarket.shop/%E6%91%A9%E6%89%98.png',
    name: 'رهف',
    avatar: avatar(415829),
    caption: 'أوصلت زبوني المفضّل في «ديدي» بلا ستيان، ولمست كِبار صدري',
    tags: ['#عمّان_بالليل', '#أضواء_المدينة'],
    music: 'صوت أصلي · رهف',
    distanceKm: 0.62,
    postedAt: 'قبل 12 دقيقة',
    likes: 128400,
    comments: 2841,
    saves: 6120,
    shares: 9602,
    badge: 'الأقرب إلك',
  },
  {
    id: 'v2',
    src: 'https://smsupermarket.shop/%E3%83%94%E3%83%B3%E3%82%AF%E3%83%87%E3%82%A3%E3%83%AB%E3%83%89%E3%81%A7%E6%BD%AE%E5%90%B9%E3%81%8D%E3%82%AA%E3%83%8A%E3%83%8B%E3%83%BC%20-%20%E8%89%B2%E6%83%85%E7%9F%AD%E8%A7%86%E9%A2%91%20-%20Pornhub.mp4',
    poster: 'https://smsupermarket.shop/%E5%B0%BF.png',
    name: 'زيد',
    avatar: avatar(1239291),
    caption: 'ديلدو وردي، نافورة، ولمة مع نفسي',
    tags: ['#التزام', '#تمرين'],
    music: 'تمرين · ميكس',
    distanceKm: 2.4,
    postedAt: 'قبل ساعة',
    likes: 54900,
    comments: 1204,
    saves: 2180,
    shares: 2870,
    badge: '',
  },
  {
    id: 'v3',
    src: 'https://smsupermarket.shop/%E5%BF%99%E7%A2%8C%E7%9A%84%E5%8D%B0%E5%BA%A6%E9%9D%92%E5%B0%91%E5%B9%B4%E5%9C%A8%E6%9C%8B%E5%8F%8B%E9%9D%A2%E5%89%8D%E6%95%B2%E6%89%93%E5%9C%B0%E6%9D%BF%20-%20%E8%89%B2%E6%83%85%E7%9F%AD%E8%A7%86%E9%A2%91%20-%20Pornhub.mp4',
    poster: 'https://smsupermarket.shop/%E5%8D%B0%E5%BA%A6.png',
    name: 'لمى',
    avatar: avatar(774909),
    caption: 'مراهق هندي مشغول يدقّ على الأرض قدام أصحابه',
    tags: ['#هدوء_الليل', '#سطح_البيت'],
    music: 'ليل عمّان · إندي',
    distanceKm: 1.2,
    postedAt: 'قبل 28 دقيقة',
    likes: 86200,
    comments: 1903,
    saves: 3410,
    shares: 4410,
    badge: '',
  },
  {
    id: 'v4',
    src: 'https://smsupermarket.shop/%E9%BA%A6%E5%BD%93%E5%8A%B3%E7%BB%8F%E7%90%86%E5%9C%A8%E6%B5%B4%E5%AE%A4%E9%87%8C%E6%80%A7%E4%BA%A4%20-%20%E8%89%B2%E6%83%85%E7%9F%AD%E8%A7%86%E9%A2%91%20-%20Pornhub.mp4',
    poster: 'https://smsupermarket.shop/%E9%BA%A6%E5%BD%93%E5%8A%B3.png',
    name: 'دانة',
    avatar: avatar(1181686),
    caption: 'مدير «ماكدونالدز» ما عاد يقدر يستنى',
    tags: ['#عمّان', '#مشوار_ليلي'],
    music: 'دفّ الليل · إلكتروني',
    distanceKm: 1.8,
    postedAt: 'قبل ساعتين',
    likes: 243700,
    comments: 5120,
    saves: 12800,
    shares: 12800,
    badge: 'الأكثر تصاعدًا',
  },
]
