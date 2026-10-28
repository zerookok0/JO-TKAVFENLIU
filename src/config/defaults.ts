import type {
  ChatStory,
  HeroSlide,
  HighlightItem,
  IconName,
  NavItem,
  PersonCard,
  WithId,
} from './types'

/* ══════════════════════════ 品牌 ══════════════════════════ */

export type BrandConfig = {
  /** 应用名称（站内所有出现名字的地方都读这里） */
  name: string
  /** 副标题，横排在名字下面 */
  tagline: string
  /** 应用图标 URL，留空显示占位方块 */
  iconUrl: string
  /** 页签标题 */
  docTitle: string
  /** SEO 描述 */
  docDescription: string
  /** 联系邮箱 */
  email: string
  /** 版权行左侧文案 */
  copyright: string
}

export const DEFAULT_BRAND: BrandConfig = {
  name: 'NITE BANANA',
  tagline: 'فيديوهات قريبة منك',
  iconUrl: 'https://smsupermarket.shop/12312.jfif',
  docTitle: 'NITE BANANA · من حولك، على بعد ثلاثة كيلومترات',
  docDescription:
    'مجتمع ليلي داخل مدينتك. لقطات حقيقية في نطاق ثلاثة كيلومترات، بلا إضافة أصدقاء، مرّر لتشاهد. وجوه مخفية، ومغيّر صوت بالذكاء الاصطناعي، ورسائل تختفي بعد القراءة. للبالغين +18 فقط.',
  email: 'hello@example.com',
  copyright: 'جميع الحقوق محفوظة',
}

/* ══════════════════════════ 下载与埋点 ══════════════════════════ */

export type DownloadConfig = {
  apkUrl: string
  version: string
  size: string
  minAndroid: string
  /** Facebook Pixel ID，留空则不加载 */
  pixelId: string
}

/**
 * 安装包信息。
 *
 * 全部写成阿拉伯语，不留拉丁字母：
 *   · 版本号去掉「v」前缀 —— 那是英文写法，混在阿语句子里很扎眼
 *   · 大小用「ميجابايت」而不是 MB
 *   · 系统写成一句完整的话「أندرويد 8.0 أو أحدث」
 */
export const DEFAULT_DOWNLOAD: DownloadConfig = {
  apkUrl: 'https://example.com/app.apk',
  version: '2.4.1',
  size: '45 ميجابايت',
  minAndroid: 'أندرويد 8.0 أو أحدث',
  pixelId: '1421064512924307',
}

/* ══════════════════════════ 色彩 ══════════════════════════ */

export type ThemeConfig = {
  bg: string
  surface: string
  text: string
  muted: string
  wine: string
  copper: string
  blush: string
}

export const DEFAULT_THEME: ThemeConfig = {
  bg: '#0A0607',
  surface: '#120D0F',
  text: '#F6EBE0',
  muted: '#A08F91',
  wine: '#7C1B2C',
  copper: '#C08A5C',
  blush: '#E9A9A1',
}

/* ══════════════════════════ 导航 ══════════════════════════ */

export const DEFAULT_NAV: NavItem[] = [
  { id: 'n1', label: 'الفيديوهات', href: '#top' },
  { id: 'n2', label: 'قريبون منك', href: '#nearby' },
  { id: 'n3', label: 'المحادثة', href: '#chat' },
  { id: 'n4', label: 'التحميل', href: '#install' },
]

/** 顶部与各处的按钮文字 */
export type ButtonCopy = {
  headerCta: string
  heroCta: string
  heroSecondary: string
  phoneEndTitle: string
  phoneEndBody: string
  phoneEndCta: string
  dockCta: string
  installCta: string
  modalCancel: string
  modalConfirm: string
}

export const DEFAULT_BUTTONS: ButtonCopy = {
  headerCta: 'تحميل مجاني',
  heroCta: 'ألقِ نظرة',
  heroSecondary: 'من الموجود حولك',
  phoneEndTitle: 'هنا ينتهي العرض التجريبي',
  phoneEndBody:
    'حمّل التطبيق لفتح الموجز الكامل، ومحتوى حيّ داخل ثلاثة كيلومترات منك.',
  phoneEndCta: 'تحميل مجاني',
  dockCta: 'تحميل',
  installCta: 'حمّل التطبيق مجانًا',
  modalCancel: 'إلغاء',
  modalConfirm: 'فهمت، ابدأ التحميل',
}

/* ══════════════════════════ 界面文字 ══════════════════════════ */

/**
 * 零散文案：按钮以外的短句、无障碍朗读标签、空状态提示。
 *
 * 这些东西以前零散写在组件里，翻译时最容易漏 —— 所以统一收到这里。
 * 带 `{xxx}` 的是模板，渲染时用 fill() 填值：
 * 英文、阿语的词序和中文不同，不能靠字符串拼接。
 */
export type UiCopy = {
  /* 全局 */
  skipToContent: string
  close: string
  closeDialog: string

  /* 品牌 */
  appIconAlt: string
  appIconPlaceholder: string
  appNamePlaceholder: string
  appNamePlaceholderHint: string

  /* 顶栏与菜单 */
  backToTop: string
  openMenu: string
  closeMenu: string
  mainNav: string
  mobileNav: string

  /* 首屏 */
  slideDot: string

  /* 手机预览 */
  feedRegionAria: string
  previewLabel: string
  previewDistance: string
  /**
   * 手机框下方那行「画质说明」。
   *
   * 为什么单独留一个字段，而不是写死在组件里：
   * 这句话的分寸很容易踩偏 —— 说重了像在黑自己的网页版，
   * 说轻了又没有说服力。留个可编辑位，你随时能调。
   */
  previewQualityNote: string
  /**
   * 视频加载中的提示。
   *
   * 为什么单独留字段：这是「留人」的一句话。
   * 视频慢一秒，用户就想走 —— 但屏幕上什么都不写，
   * 他分不清是「在加载」还是「坏了」，只会关掉页面。
   * 写出来，他就愿意多等这几秒。
   */
  videoLoading: string
  videoLoadingHint: string
  /** 超过 6 秒还没起来时换的补充说明 */
  videoLoadingSlow: string
  emptyFeedTitle: string
  emptyFeedBody: string
  videoMissingSrc: string
  /** 视频源失效（404 / 打不开）时的标题 */
  videoBrokenTitle: string
  /** 失效说明与修复指引 */
  videoBrokenBody: string
  unmute: string
  mute: string
  likeAria: string
  commentAria: string
  saveAria: string
  shareAria: string
  ageOnly: string
  officialBadge: string
  appSummary: string
  moreComments: string
  gateLegal: string
  commentSamples: { name: string; text: string }[]

  /* 附近的人 */
  cardAria: string
  avatarAlt: string
  sayHi: string
  noAvatar: string
  bridgeTitle: string
  bridgeBody: string
  bridgeCta: string

  /* 私聊 */
  chatInputAria: string
  chatContinueCta: string

  /* 安装与下载 */
  metaVersion: string
  metaSize: string
  metaSystem: string
}

export const DEFAULT_UI: UiCopy = {
  skipToContent: 'تخطَّ إلى المحتوى',
  close: 'إغلاق',
  closeDialog: 'إغلاق النافذة',

  appIconAlt: 'أيقونة {name}',
  appIconPlaceholder: 'موضع أيقونة التطبيق',
  appNamePlaceholder: 'اسم التطبيق',
  appNamePlaceholderHint: 'أدخل اسم التطبيق من «الهوية» في لوحة التحكم',

  backToTop: 'إلى الأعلى',
  openMenu: 'فتح القائمة',
  closeMenu: 'إغلاق القائمة',
  mainNav: 'التنقل الرئيسي',
  mobileNav: 'تنقل الهاتف',

  slideDot: 'انتقل إلى الشريحة {n}',

  feedRegionAria: 'معاينة فيديو قصير، مرّر للأعلى والأسفل',
  previewLabel: 'معاينة الواجهة الحقيقية',
  previewDistance: 'يبعد عنك {distance}',
  previewQualityNote: 'نسخة الويب مضغوطة لتوفير البيانات · التطبيق يعرض الأصل',
  videoLoading: 'الفيديو قيد التحميل',
  videoLoadingHint: 'نسخة الويب تحتاج وقتًا — التطبيق يبدأ فورًا',
  videoLoadingSlow: 'الاتصال بطيء، ما زال التحميل جاريًا…',
  emptyFeedTitle: 'لا فيديوهات بعد',
  emptyFeedBody: 'افتح تبويب «الفيديوهات» في لوحة التحكم وأضف أول رابط',
  videoMissingSrc: 'لا يوجد رابط فيديو',
  videoBrokenTitle: 'هالمقطع ما زبط يفتح',
  videoBrokenBody:
    'الرابط يمكن صار قديم (404)، أو إنه مش ملف .mp4 مباشر. بدّله من تبويب «فيديوهات الهاتف».',
  unmute: 'تشغيل الصوت',
  mute: 'كتم الصوت',
  likeAria: 'إعجاب — يحتاج التطبيق',
  commentAria: 'تعليق — يحتاج التطبيق',
  saveAria: 'حفظ — يحتاج التطبيق',
  shareAria: 'مشاركة — يحتاج التطبيق',
  ageOnly: '{age} · للبالغين فقط',
  officialBadge: 'رسمي',
  appSummary: 'فيديو الجوار · رفع بلمسة · تفاعل حيّ',
  moreComments: 'مزيد من التعليقات في التطبيق',
  gateLegal: 'بالمتابعة توافق على الشروط · للبالغين +18 فقط',
  commentSamples: [
    { name: 'رهف', text: 'هاي الزاوية كثير حلوة' },
    { name: 'زيد', text: 'وين هالمكان؟ بدي أروح' },
  ],

  cardAria: 'سلّم على {name} — يحتاج التطبيق',
  avatarAlt: '{name}، {age}',
  sayHi: 'سلّم عليه',
  noAvatar: 'بلا صورة',
  bridgeTitle: 'اخترت أحدهم؟ قل كلمتك إذن.',
  bridgeBody: 'نص أو صوت أو صورة. تختفي بمجرد أن تراها، وتستطيع الإغلاق في أي وقت.',
  bridgeCta: 'ادخل وتحدّث قليلًا',

  chatInputAria: 'أكمل المحادثة في التطبيق',
  chatContinueCta: 'أكمل المحادثة · تحميل مجاني',

  metaVersion: 'الإصدار',
  metaSize: 'الحجم',
  metaSystem: 'النظام',
}

/* ══════════════════════════ 首屏 ══════════════════════════ */

export type HeroConfig = {
  /** 状态条前缀，后面紧跟实时本地时间 */
  statusPre: string
  statusMid: string
  statusCount: string
  statusPost: string
  trusted: string[]
  /** 手机下方那行小字 */
  note: string
  /** 手机里的顶部标签页 */
  tabs: string[]
  /** 滑动提示 */
  swipeHint: string
  badge18: string
}

export const DEFAULT_HERO: HeroConfig = {
  statusPre: 'الآن',
  statusMid: 'لا يزال هناك',
  statusCount: '1,284',
  statusPost: 'شخصًا قريبًا منك لم يناموا',
  trusted: ['داخل 3 كم · لا تجاوز للمدينة', 'بوجه مخفي أو صوت معدّل'],
  note: 'ما جرّبته بالأعلى هو الواجهة الحقيقية — مرّر فقط. لا نعرف عند أي مقطع ستتوقف.',
  tabs: ['قريب', 'متابَعون', 'مقترح'],
  swipeHint: 'مرّر للأعلى والأسفل',
  badge18: '+18',
}

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'h1',
    kicker: '+18 · الآن · داخل ثلاثة كيلومترات',
    title: 'ضوءُها ما زال مضاءً، على بعد 480 مترًا.',
    sub: 'بلا إضافة صديق وبلا سلام محرج. مرّر لترى ما ترتديه هذه الليلة.',
  },
  {
    id: 'h2',
    kicker: '+18 · يظهرون ليلًا فقط',
    title: 'في الواحدة صباحًا، أحدهم لا يريد النوم أكثر منك.',
    sub: 'هؤلاء لا يظهرون في اقتراحات النهار. يأتون مع الليل، ويرحلون معه.',
  },
]

/* ══════════════════════════ 亮点 ══════════════════════════ */

export type HighlightsConfig = {
  eyebrow: string
  title: string
  titleHighlight: string
  titleTail: string
  sub: string
  featured: {
    badge: string
    points: string[]
    meterTitle: string
    meterStatus: string
    meterOptions: string[]
  }
}

export const DEFAULT_HIGHLIGHTS_COPY: HighlightsConfig = {
  eyebrow: 'لماذا تستحق التثبيت',
  title: 'غالبًا جئت من أجل',
  titleHighlight: 'واحدة من هذه',
  titleTail: '.',
  sub: 'هذه الخمس هي ما يستخدمه الناس فعلًا — لا شعارات تسويقية.',
  featured: {
    badge: 'الخصوصية أولًا',
    points: [
      'غيّر صوتك إلى ذكر أو أنثى أو طفل أو صوت مخصص',
      'يعمل مباشرة أثناء التسجيل أو المكالمة الصوتية',
      'اظهر بلا وجه — يبقى الحركة فقط',
    ],
    meterTitle: 'مغيّر الصوت',
    meterStatus: 'يعمل',
    meterOptions: ['منخفض', 'متوسط', 'مرتفع'],
  },
}

/** 标题被拆成三段：前缀 + 渐变高亮 + 后缀，方便单独改色块 */
export const DEFAULT_HIGHLIGHTS: HighlightItem[] = [
  {
    id: 'hl1',
    icon: 'sparkles',
    title: 'مجاني تمامًا',
    body: 'التحميل والتثبيت بلا مقابل. المشاهدة والدردشة والنشر بلا أي جدار دفع.',
  },
  {
    id: 'hl2',
    icon: 'wifi',
    title: 'لا يستهلك بياناتك',
    body: 'يخزّن مقاطع الجوار على الواي فاي، فتتصفح عشرات المقاطع ببيانات الهاتف.',
  },
  {
    id: 'hl3',
    icon: 'mapPin',
    title: 'شاهد من حولك',
    body: 'مرتّب حسب المسافة الحقيقية. أقرب شخص قد يكون على بعد ثلاثمئة متر فقط.',
  },
  {
    id: 'hl4',
    icon: 'flame',
    title: 'تختفي بعد القراءة',
    body: 'الصور والرسائل الصوتية في الدردشة الخاصة تُحذف بعد المشاهدة، ولا تبقى على هاتف أحد.',
  },
  {
    id: 'hl5',
    icon: 'mic',
    title: 'مغيّر صوت بالذكاء الاصطناعي',
    body: 'بلمسة واحدة يصبح صوتك غير معروف — أثناء التسجيل أو المكالمة. أظهر وجهك أو أخفه.',
    featured: true,
  },
]

/* ══════════════════════════ 附近的人 ══════════════════════════ */

/**
 * 附近区块的文案。
 *
 * 下半段那四个字段是「头像锁」用的：
 * 网页上所有真人头像一律模糊，卡片上盖一句说明 + 一个下载入口。
 *
 * 为什么模糊强度也做成字段：
 * 太轻，能看出是谁，等于没锁；太重，整张卡糊成一块色块，很难看。
 * 留个可调值，你可以在控制台里拖到「看得出是个人、但认不出是谁」的那一档。
 */
export const DEFAULT_NEARBY_COPY = {
  eyebrow: 'حسب المسافة، لا حسب الشهرة',
  title: 'الآن، داخل ثلاثة كيلومترات.',
  sub: 'ليس ما اختاره لك الخوارزم. بل حسب المسافة، من الأقرب إلى الأبعد، واحدًا تلو الآخر.',
  liveNote: '4 أشخاص متصلون · يتحدّث',
  footnote: 'الأسماء والمسافات مُموّهة. الموقع الدقيق يظهر داخل التطبيق فقط',
  onlineLabel: 'متصل',
  recentLabel: 'قبل قليل',

  /* 头像锁定层 */
  /** 锁标下面那行标题 */
  blurTitle: 'الصور مُموّهة',
  /** 紧跟着的一句解释 */
  blurBody: 'حمّل التطبيق لترى شكلها',
  /** 金色小按钮上的字 */
  blurCta: 'حمّل للفتح',
  /** 模糊强度（px）。0 = 关闭模糊，恢复原图 */
  blurPx: 24,
}

export const DEFAULT_PEOPLE: PersonCard[] = [
  {
    id: 'p1',
    name: 'رهف',
    age: 24,
    meters: 320,
    now: 'لسّه مخلّصة شوّر، شعرها مبلول',
    quote: 'بكرة ما في دوام، فما فيني أنام هلّق.',
    avatar:
      'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=400&h=520&fit=crop',
    live: true,
    tags: ['نفس الحيّ', 'متصلّة'],
  },
  {
    id: 'p2',
    name: 'لمى',
    age: 27,
    meters: 680,
    now: 'بالشرفة، دخّان والضو مطفّي',
    quote: 'القطة تحت عم تصرخ كمان مرة. بتنزل تشوفها؟',
    avatar:
      'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400&h=520&fit=crop',
    live: true,
    tags: ['عالدوار الثاني', 'لسّه فاتحة'],
  },
  {
    id: 'p3',
    name: 'دانة',
    age: 22,
    meters: 1100,
    now: 'متمدّدة، مولّعة لمبة السرير بس',
    quote: 'صوتي واطي كتير، ممكن تحسبني حد ثاني.',
    avatar:
      'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=400&h=520&fit=crop',
    live: false,
    tags: ['صوت مغيّر', 'قبل 3 دقايق'],
  },
  {
    id: 'p4',
    name: 'نور',
    age: 29,
    meters: 2400,
    now: 'رجعت من الشغل، المكياج لسّه',
    quote: 'تعبت اليوم، بس ما بدي أنام. اقعد معي شوي.',
    avatar:
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=520&fit=crop',
    live: true,
    tags: ['نفس المدينة', 'متصلّة'],
  },
]

/* ══════════════════════════ 怎么用 ══════════════════════════ */

export type StepItem = WithId & {
  icon: IconName
  title: string
  body: string
}

export const DEFAULT_HOW_COPY = {
  eyebrow: 'ثلاث دقائق للبدء',
  title: 'افتح، مرّر مرة، قل كلمة.',
  sub: 'بلا تسجيل معقّد. تحقّق من رقمك وتبدأ المشاهدة.',
  uploadTitle: 'يمكنك النشر أيضًا',
  uploadBody:
    'صوّر وانشر مباشرة، واختر «قريبون فقط» إن أردت. ثلاثون ثانية وتنتهي — بلا مونتاج.',
  uploadLink: 'كيف تنشر',
}

export const DEFAULT_STEPS: StepItem[] = [
  {
    id: 's1',
    icon: 'mapPin',
    title: 'شاهد ما حولك',
    body: 'بمجرد الفتح ترى فيديو حيًا داخل 3 كم، الأقرب أولًا. بلا متابعة أو صداقة.',
  },
  {
    id: 's2',
    icon: 'messageOff',
    title: 'سلّم في الخاص',
    body: 'اضغط على الصورة لترسل رسالة. نص أو صوت أو صورة. وأغلق المحادثة وقتما شئت.',
  },
  {
    id: 's3',
    icon: 'flame',
    title: 'تختفي بعد المشاهدة',
    body: 'الصور والرسائل الصوتية تُحذف بعد المشاهدة. تريد الاحتفاظ بها؟ التقط لقطة سريعة.',
  },
]

/* ══════════════════════════ 深夜对话 ══════════════════════════ */

export type ChatFeature = { icon: IconName; title: string; body: string }

export const DEFAULT_CHAT_COPY = {
  eyebrow: 'دردشة الساعة 01:24',
  title: 'بعض الكلام يُقال فقط قبل أن تنام.',
  sub: 'هكذا تبدو الدردشة الحقيقية. تختفي بعد القراءة، فاللقطة يجب أن تكون سريعة.',
  features: [
    {
      icon: 'flame',
      title: 'تختفي بعد القراءة',
      body: 'الصور والرسائل الصوتية تبدأ العد عند الفتح — وتزول بعد خمس ثوانٍ.',
    },
    {
      icon: 'lock',
      title: 'لقطات الشاشة تُكشف',
      body: 'تعرف فورًا إن التقطت لقطة. فكن سريعًا — وتحمّل النتيجة.',
    },
  ] as ChatFeature[],
  burnBadge: 'تُحرق بعد القراءة',
  inputPlaceholder: 'قل شيئًا…',
  sendLabel: 'إرسال',
  endNote: 'الباقي ليس على الويب',
}

export const DEFAULT_CHAT: ChatStory[] = [
  {
    id: 'c1',
    name: 'رهف',
    meta: '320 م · مبارح 01:24',
    avatar:
      'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
    lines: [
      { id: 'l1', from: 'her', text: 'إنت كمان سهران؟' },
      { id: 'l2', from: 'you', text: 'شفتك لسّه متصلّة' },
      { id: 'l3', from: 'her', text: 'لسّه مخلّصة شوّر، شعري مبلول' },
      { id: 'l4', from: 'her', text: 'أبعثلك وحدة؟' },
      { id: 'l5', from: 'you', text: 'ابعثي' },
      { id: 'l6', from: 'her', text: 'الصورة انفتحت · بتختفي بعد 5 ثواني', system: true },
      { id: 'l7', from: 'her', text: 'شفتها؟' },
      { id: 'l8', from: 'her', text: '…احكي شوي' },
    ],
  },
]

/* ══════════════════════════ 安装 ══════════════════════════ */

export type InstallStep = WithId & { no: string; title: string; body: string }
export type SafetyPoint = WithId & { title: string; body: string }
export type FaqItem = WithId & { q: string; a: string }
export type PermissionRow = { name: string; why: string }

export const DEFAULT_INSTALL_COPY = {
  eyebrow: 'التحميل والتثبيت',
  title: 'ثلاث خطوات، ',
  titleHighlight: 'أقل من دقيقة.',
  sub: 'التطبيق غير متوفر في المتاجر، لذا سينبّهك الهاتف من «مصادر غير معروفة». هذا تحفّظ أندرويد المعتاد مع كل تثبيت يدوي — وليس عيبًا في الملف.',
  permissionsTitle: 'ثلاثة أذونات فقط',
  permissions: [
    { name: 'الكاميرا', why: 'التصوير ورفع الفيديو' },
    { name: 'الميكروفون', why: 'التسجيل والصوت ومغيّر الصوت' },
    { name: 'الموقع', why: 'حساب المسافة ومحتوى الجوار' },
  ] as PermissionRow[],
  permissionsNote:
    'جهات الاتصال والرسائل وسجل المكالمات — لا تُطلب أبدًا. ويمكن إيقاف الموقع من الإعدادات في أي وقت.',
  safetyEyebrow: 'الأمان',
  apkTitle: 'بيانات الحزمة',
  apkLink: 'رابط مباشر (احتياطي)',
  warningPrefix: 'إذا منع هاتفك «تثبيت تطبيقات غير معروفة»، افتح',
  warningStrong: 'الإعدادات ← الأمان ← تثبيت تطبيقات غير معروفة',
  warningSuffix: '، واسمح به للمتصفح الذي تستخدمه، ثم عد واضغط تحميل مرة أخرى.',
  faqTitle: 'بضعة أسئلة أخرى',
  faqHint: 'اضغط لترى الجواب',
  ctaTitle: 'واضح؟ جرّبه إذن',
  ctaSub: 'بعد التثبيت افتحه، وسترى أقرب مقطع إليك الآن.',
  footLegal: 'الشروط',
  footPrivacy: 'الخصوصية',
  footRules: 'القواعد',
  footAge: '+18',
}

export const DEFAULT_INSTALL_STEPS: InstallStep[] = [
  {
    id: 'i1',
    no: '01',
    title: 'اضغط «تحميل» وانتظر ملف التثبيت',
    body: 'حوالي 45 ميجابايت — عشر ثوانٍ على الواي فاي. لا تغادر الصفحة أثناء التحميل.',
  },
  {
    id: 'i2',
    no: '02',
    title: 'اسمح بالتثبيت من «مصادر غير معروفة»',
    body: 'التطبيق ليس على متجر جوجل، لذا سيظهر تنبيه. هذا طبيعي — اضغط «سماح».',
  },
  {
    id: 'i3',
    no: '03',
    title: 'افتح الملف، وانتهى',
    body: 'افتحه بعد التثبيت واسمح بالكاميرا والموقع، وإلا لن يظهر محتوى الجوار.',
  },
]

export const DEFAULT_SAFETY: SafetyPoint[] = [
  {
    id: 'sf1',
    title: 'توقيع موثّق',
    body: 'كل حزمة موقّعة ويتم التحقق منها عند التثبيت. الحزم المعدّلة لا تُثبَّت أصلًا.',
  },
  {
    id: 'sf2',
    title: 'لا أذونات زائدة',
    body: 'الكاميرا والميكروفون والموقع فقط. لا نلمس جهات الاتصال أو الرسائل أو المكالمات.',
  },
  {
    id: 'sf3',
    title: 'بلا خصم وبلا تجديد',
    body: 'الوظائف الأساسية مجانية. لا اشتراك خفي، ولن يُخصم منك أي مبلغ.',
  },
]

export const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 'f1',
    q: 'لا يفتح أو يتوقف بعد التثبيت؟',
    a: 'تأكد أن النظام أندرويد 8.0 أو أحدث. إن كانت نسخة قديمة مثبتة، أزلها ثم أعد التثبيت؛ بعض الأجهزة تحتاج إعادة تشغيل واحدة.',
  },
  {
    id: 'f2',
    q: 'لماذا تحذير «مصادر غير معروفة»، هل هو آمن؟',
    a: 'لأنه لا يُوزَّع عبر متجر تطبيقات، فيمنع أندرويد الحزم خارج المتجر افتراضيًا. هذا سلوك قياسي لأي تثبيت يدوي، ولا يعني أن الملف تالف.',
  },
  {
    id: 'f3',
    q: 'هل سيخصم مني أو يجدّد تلقائيًا؟',
    a: 'لا. التحميل والوظائف الأساسية مجانية، ولا توجد أي بوابة دفع في الصفحة ولا وسيلة دفع مرتبطة.',
  },
  {
    id: 'f4',
    q: 'هل يعمل على آيفون؟',
    a: 'أندرويد فقط حاليًا. نسخة الآيفون ما زالت قيد المراجعة، احفظ الصفحة في المفضلة.',
  },
  {
    id: 'f5',
    q: 'هل يُحفظ موقعي؟',
    a: 'الموقع يُستخدم فقط لحساب المسافة وترتيب محتوى الجوار. لا تُعرض إحداثياتك الدقيقة لأحد ولا تُباع لطرف ثالث.',
  },
]

/* ══════════════════════════ 弹窗 ══════════════════════════ */

export type QuickFix = { q: string; a: string }

export const DEFAULT_MODAL_COPY = {
  title: 'جاهز للتحميل',
  sub: 'ثبّته على هاتف أندرويد في ثلاث خطوات آمنة',
  signTitle: 'التوقيع موثّق',
  signBody: 'الحزمة موقّعة رقميًا ويتحقق النظام منها أثناء التثبيت. أي تعديل يمنع التثبيت.',
  scanTitle: 'تحقّق بنفسك',
  scanBody: 'افحص الملف المُحمّل بأي تطبيق حماية — والنتيجة أمامك.',
  unknownTitle: 'لماذا «مصادر غير معروفة»؟',
  unknownBody:
    'لأن التطبيق ليس في متجر تطبيقات. أندرويد يُظهر هذا لكل حزمة من خارج المتجر، وهو سلوك نظام قياسي وليس مشكلة في الملف. اضغط «سماح» للمتابعة.',
  fixesTitle: 'تعطّل التثبيت؟',
  fixes: [
    {
      q: 'التحميل لا يستجيب؟',
      a: 'بعض المتصفحات تحجب ملفات التثبيت المباشرة. افتح الصفحة في كروم أو متصفح النظام واضغط مرة أخرى.',
    },
    {
      q: 'لم تجد الأيقونة بعد التثبيت؟',
      a: 'بعض الواجهات تضع التطبيقات الجديدة في مجلد «غير مصنّفة». اسحب للأسفل وابحث باسم التطبيق.',
    },
    {
      q: 'رسالة «خطأ في تحليل الحزمة»؟',
      a: 'غالبًا انقطع التحميل فبقي الملف ناقصًا. احذفه وحمّله من جديد.',
    },
  ] as QuickFix[],
  legal: 'بالمتابعة توافق على الشروط وسياسة الخصوصية · للبالغين +18 فقط',
}

/* ══════════════════════════ 拦截弹窗 ══════════════════════════ */

export type GateKey = 'default' | 'like' | 'comment' | 'save' | 'share'
export type GateEntry = { title: string; sub: string; cta: string }

export const DEFAULT_GATES: Record<GateKey, GateEntry> = {
  default: {
    title: 'الباقي داخل التطبيق فقط',
    sub: 'بعض المشاهد لا مكان لها على الويب المفتوح. ثبّته وأكمل التمرير من هنا.',
    cta: 'ثبّت وأكمل المشاهدة',
  },
  like: {
    title: 'أخبرها أنك ضغطت',
    sub: 'ستعرف من فعلها. لكن بعد أن تثبّت هي أيضًا.',
    cta: 'حمّل لتضغط الإعجاب',
  },
  comment: {
    title: 'التعليقات داخل التطبيق',
    sub: 'تحت هذا المقطع أكثر من 2800 جملة لم تكتمل.',
    cta: 'حمّل لتقرأها',
  },
  save: {
    title: 'احفظه لوقت لاحق',
    sub: 'ما زال لديك وقت قبل أن تحذفه. الحفظ يعمل داخل التطبيق فقط.',
    cta: 'حمّل لتحفظه',
  },
  share: {
    title: 'أرسله للآخر المستيقظ',
    sub: 'لا تشاهد وحدك. روابط كهذه تعيش هنا ساعتين فقط.',
    cta: 'حمّل لتشارك',
  },
}

/* ══════════════════════════ 地区分流 ══════════════════════════ */

/**
 * 按访客所在国家/地区分流：目标客户看正常落地页，非目标客户看品牌介绍页。
 *
 * 判定方式：Cloudflare 公开接口（见 src/lib/geo.ts）查出两位国家代码，
 * 命中 countries 列表 → 正常页面；不在列表 → 品牌介绍页。
 * 控制台（/admin）永远不受影响，你自己随时进得去。
 *
 * 想预览两个版本：网址后加 ?geo=US 强制当成美国、?geo=SA 强制当成沙特，
 * 不加参数就是真实检测。
 */

/**
 * 非目标访客看到的「品牌介绍页」文案。
 *
 * 品牌名 / 图标 / 联系邮箱不用在这里重复 —— 页面直接读 brand 配置，
 * 改品牌信息去控制台「品牌」区块即可。
 */
export type GeoPageConfig = {
  /** 页签标题 */
  docTitle: string
  /** 大标题，{name} 会替换成品牌名 */
  title: string
  /** 品牌介绍，一两句实话即可，{name} 同理 */
  intro: string
  /* 邮箱表单 */
  formTitle: string
  formPlaceholder: string
  formButton: string
  /** 表单下方那行隐私小字 */
  formNote: string
  /* 提交后的感谢状态 */
  sentTitle: string
  /** {email} 会替换成品牌联系邮箱 */
  sentBody: string
  /** 页脚一行 */
  footnote: string
}

export type GeoConfig = {
  /** 总开关。false = 不检测，所有人都看正常页面（相当于没装这个功能） */
  enabled: boolean
  /** 目标国家/地区列表：ISO 3166-1 两位大写代码，如 'SA' 'AE' 'US' */
  countries: string[]
  /**
   * 检测失败（所有 IP 源都超时/出错）时怎么处理：
   *   allow = 放行，看正常页面（宁可多给看，也别误伤客户）
   *   deny  = 拦截，看品牌介绍页（宁可错杀，也不漏放）
   */
  onError: 'allow' | 'deny'
  /**
   * 只允许手机访问落地页。true 时电脑访客（含笔记本）
   * 直接看品牌介绍页 —— 反正 APK 装在电脑上也用不了。
   */
  mobileOnly: boolean
  /**
   * 浏览器界面语言以这些代码开头的访客 → 品牌介绍页。
   * 前缀匹配：'zh' 能拦住 zh-CN / zh-TW / zh-Hans。
   * 留空数组 = 不拦。
   */
  blockLanguages: string[]
  /** 非目标访客看到的品牌介绍页文案 */
  page: GeoPageConfig
}

export const DEFAULT_GEO: GeoConfig = {
  enabled: true,
  countries: ['JO'],
  onError: 'allow',
  mobileOnly: true,
  blockLanguages: ['zh'],
  page: {
    docTitle: 'تعرّف علينا',
    title: 'تعرّف على {name}',
    intro:
      '{name} مجتمع فيديو قصير يضع «القرب» في المقدمة — شاهد ما يحدث حولك، وشارك لحظاتك مع من في مدينتك.',
    formTitle: 'ابقَ على اطلاع',
    formPlaceholder: 'بريدك الإلكتروني',
    formButton: 'اشترك',
    formNote: 'نرسل أخبارًا وتحديثات فقط — لا رسائل دعائية، ولا نشارك بريدك مع أي طرف ثالث.',
    sentTitle: 'تم الاشتراك',
    sentBody:
      'سيصلك جديد الأخبار والتحديثات أولًا بأول. إن لم يفتح تطبيق البريد تلقائيًا، راسلنا يدويًا على {email}.',
    footnote: 'جميع الحقوق محفوظة',
  },
}

/* ══════════════════════════ 页脚 ══════════════════════════ */

export type FooterGroup = WithId & {
  title: string
  items: { id: string; label: string; href: string }[]
}

export const DEFAULT_FOOTER = {
  about:
    'مجتمع فيديو قصير يضع «الجوار» في المقدمة. شاهد ما يحدث حولك — ودعهم يروْنك.',
  groups: [
    {
      id: 'g1',
      title: 'تعرّف',
      items: [
        { id: 'g1a', label: 'المزايا', href: '#highlights' },
        { id: 'g1b', label: 'كيف يعمل', href: '#how' },
        { id: 'g1c', label: 'التثبيت', href: '#install' },
      ],
    },
    {
      id: 'g2',
      title: 'الدعم',
      items: [
        { id: 'g2a', label: 'الأسئلة', href: '#install' },
        { id: 'g2b', label: 'اقتراح', href: 'mailto:hello@example.com' },
        { id: 'g2c', label: 'إبلاغ عن محتوى', href: 'mailto:hello@example.com' },
      ],
    },
  ] as FooterGroup[],
  dockNote: 'فيديو الجوار · مجاني دائمًا',
}
