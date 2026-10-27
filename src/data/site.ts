/**
 * ────────────────────────────────────────────────────────────────
 *  站点配置  ·  链接与开关都在这里
 * ────────────────────────────────────────────────────────────────
 */

/** 应用名称。留空会显示「应用名称」占位。 */
export const APP_NAME = ''

/** 应用图标 URL。留空显示占位方块。 */
export const APP_ICON_URL = ''

/** 直接下载 APK 的链接（安卓） */
export const APK_URL = 'https://example.com/app.apk'

/** 已上架时填商店链接；留空则按钮显示「即将上架」 */
export const APP_STORE_URL = ''
export const PLAY_STORE_URL = ''

/** APK 信息，显示在安装弹窗顶部 */
export const APK_META = {
  version: 'v2.4.1',
  size: '45 MB',
  minAndroid: 'Android 8.0+',
}

/** 联系方式 */
export const CONTACT_EMAIL = 'hello@example.com'

/**
 * ────────────────────────────────────────────────────────────────
 *  Facebook Pixel
 * ────────────────────────────────────────────────────────────────
 * 填上 Pixel ID 就会自动加载。留空 = 不加载、不发请求，
 * 本地调试不会被污染数据。
 */
export const FB_PIXEL_ID = ''

/** 埋点开关：Pixel ID 为空时即使这里为 true 也不会加载 */
export const FB_ENABLED = true

/* ── 文案 ───────────────────────────────────────────────────── */

/**
 * 首屏轮播文案。
 *
 * 写法原则（照着改就不会俗）：
 *   · 标题给「画面 + 距离」，不给形容词。让读者自己脑补。
 *   · 副标题只负责补一个细节：时间、楼层、她说了什么。
 *   · 不要出现「短视频」「社区」「功能」这类词 —— 一听就像工具。
 */
export type HeroSlide = {
  kicker: string
  title: string
  sub: string
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    kicker: '18+ · 此刻 · 三公里内',
    title: '离你 480 米的地方，她的灯还亮着。',
    sub: '不用加好友，也不用打招呼。划过去，就看见她今晚穿的是什么。',
  },
  {
    kicker: '18+ · 深夜才上线',
    title: '凌晨一点，有人比你更不想睡。',
    sub: '这些人不会出现在白天的推荐里。她们只在夜里出现，也只在夜里消失。',
  },
]

/** 手机内操作被点击时的拦截弹窗文案 */
export type GateAction = 'default' | 'like' | 'comment' | 'save' | 'share'

export const GATE_COPY: Record<GateAction, { title: string; sub: string; cta: string }> = {
  default: {
    title: '后面的，得进 App 才看得到',
    sub: '有些画面不适合放在网页上。装好之后，从这里接着往下划。',
    cta: '装好接着看',
  },
  like: {
    title: '想让她知道你点了',
    sub: '她会看到是谁。但只在她也装了 App 之后。',
    cta: '下载去点这个赞',
  },
  comment: {
    title: '评论区得进 App 才能进',
    sub: '这一条下面有 2,800 多句没说完的话。',
    cta: '下载去看评论',
  },
  save: {
    title: '先存起来，回头再看',
    sub: '她删掉之前，你还有时间。收藏只在 App 里生效。',
    cta: '下载去收藏',
  },
  share: {
    title: '转给那个也没睡的人',
    sub: '别一个人看。这类的链接，我们只让它活两小时。',
    cta: '下载去分享',
  },
}

/**
 * ── 此刻三公里内 · 真人卡片 ──
 *
 * 这一段是全站最"勾人"的地方：不讲功能，只讲「有个人，离你多近，现在在做什么」。
 * 每张卡必须有三个信息：距离、此刻在做什么、一句她说过的话。
 */
export type NearbyPerson = {
  name: string
  age: number
  /** 距离（米） */
  meters: number
  /** 此刻状态，一句话 */
  now: string
  /** 她说过的原话 —— 越具体越勾人 */
  quote: string
  /** 头像图 */
  avatar: string
  /** 在线状态 */
  live: boolean
  /** 标签 */
  tags: string[]
}

export const NEARBY_PEOPLE: NearbyPerson[] = [
  {
    name: '小满',
    age: 24,
    meters: 320,
    now: '刚洗完澡，头发还没干',
    quote: '明天不用早起，所以现在还不困。',
    avatar:
      'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=400&h=520&fit=crop',
    live: true,
    tags: ['同小区', '在线'],
  },
  {
    name: 'Nova',
    age: 27,
    meters: 680,
    now: '在阳台抽烟，没开灯',
    quote: '楼下的猫又在叫了，你要不要下来看看。',
    avatar:
      'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400&h=520&fit=crop',
    live: true,
    tags: ['两站路', '刚上线'],
  },
  {
    name: '阿棠',
    age: 22,
    meters: 1100,
    now: '躺着，只开了床头那盏',
    quote: '我声音比较低，你可能会认错人。',
    avatar:
      'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=400&h=520&fit=crop',
    live: false,
    tags: ['变声', '3 分钟前'],
  },
  {
    name: '苏眠',
    age: 29,
    meters: 2400,
    now: '刚下班，妆还没卸',
    quote: '今天有点累，但不想睡。陪我坐一会儿。',
    avatar:
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=520&fit=crop',
    live: true,
    tags: ['同城', '在线'],
  },
]

/**
 * ── 深夜对话 · 聊天实录 ──
 *
 * 用「真实发生过的对话」卖私聊，比任何功能列表都有效。
 * 关键是最后一条必须留白 —— 让读者想知道下一句是什么。
 */
export type ChatLine = {
  from: 'her' | 'you'
  text: string
  /** 系统提示（如「图片已销毁」），非对话内容 */
  system?: boolean
}

export type ChatStory = {
  /** 谁 */
  name: string
  /** 距离与时间 */
  meta: string
  avatar: string
  lines: ChatLine[]
}

export const CHAT_STORIES: ChatStory[] = [
  {
    name: '小满',
    meta: '320m · 昨天 01:24',
    avatar:
      'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
    lines: [
      { from: 'her', text: '你也没睡啊' },
      { from: 'you', text: '看到你还在线' },
      { from: 'her', text: '我刚洗完澡，头发还是湿的' },
      { from: 'her', text: '发你一张？' },
      { from: 'you', text: '发吧' },
      { from: 'her', text: '图片已查看 · 5 秒后销毁', system: true },
      { from: 'her', text: '看到了吗' },
      { from: 'her', text: '……说话呀' },
    ],
  },
]

/** 页面上的一些零散文案，集中在这里方便改 */
export const COPY = {
  heroAlert: '此刻你附近有 1,284 条新内容',
  heroNote: '上面是真实界面 —— 直接上下滑，先看几条再决定要不要装',
  nearbyTitle: '此刻，三公里内',
  nearbySub: '不是推荐算法给你的。是按距离，从近到远，一个接一个。',
  chatTitle: '深夜对话',
  chatSub: '真实的私聊长这样。看完即焚，截图要快。',
}
