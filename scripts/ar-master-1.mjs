#!/usr/bin/env node
/**
 * 把「主库」从中文改成阿拉伯语（第 1 部分）。
 *
 * 为什么必须这么做：
 *   原来主库是中文，阿拉伯语只是覆盖层。覆盖层优先级更高，
 *   于是你在控制台改了文案，页面上看到的还是覆盖层里的旧句子 ——
 *   改了等于没改。主库改成阿语、覆盖层清空，编辑才立刻生效。
 *
 * 每处替换都带断言：没匹配上就报错，不会静默跳过。
 */
import { readFileSync, writeFileSync } from 'node:fs'

const FILE = 'src/config/defaults.ts'
let src = readFileSync(FILE, 'utf8')
let failed = 0

function sub(oldText, newText, label) {
  if (!src.includes(oldText)) {
    console.error(`✗ ${label}`)
    failed += 1
    return
  }
  src = src.replace(oldText, newText)
  console.log(`✓ ${label}`)
}

/* ── 按钮 ── */
sub(
  `export const DEFAULT_BUTTONS: ButtonCopy = {
  headerCta: '免费下载',
  heroCta: '进来看一眼',
  heroSecondary: '先看看有谁',
  phoneEndTitle: '预览到这里就结束啦',
  phoneEndBody: '下载 App 解锁完整推荐流，还有你附近 3km 的实时更新。',
  phoneEndCta: '免费下载',
  dockCta: '下载',
  installCta: '免费下载 App',
  modalCancel: '取消',
  modalConfirm: '我已了解，开始下载',
}`,
  `export const DEFAULT_BUTTONS: ButtonCopy = {
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
}`,
  '按钮文案',
)

/* ── 界面文字 ── */
sub(
  `export const DEFAULT_UI: UiCopy = {
  skipToContent: '跳到主要内容',
  close: '关闭',
  closeDialog: '关闭弹窗',

  appIconAlt: '{name} 图标',
  appIconPlaceholder: '应用图标占位',
  appNamePlaceholder: '应用名称',
  appNamePlaceholderHint: '在控制台的「品牌」里填入应用名称',
  localeSwitchAria: '语言：{label}',
  localeMenuAria: '选择语言',

  backToTop: '回到顶部',
  openMenu: '打开菜单',
  closeMenu: '关闭菜单',
  mainNav: '主导航',
  mobileNav: '移动端导航',

  slideDot: '切换到第 {n} 条文案',

  feedRegionAria: '短视频预览，可上下滑动切换',
  previewLabel: '真实界面预览',
  previewDistance: '距你 {distance}',
  previewQualityNote: '网页版为省流量做了压缩 · App 内是原画',
  videoLoading: '视频正在加载中',
  videoLoadingHint: '网页版加载稍慢，App 内是秒开的',
  videoLoadingSlow: '网络有点慢，还在加载…',
  emptyFeedTitle: '还没有视频',
  emptyFeedBody: '打开控制台的「视频」标签，添加第一条视频链接',
  videoMissingSrc: '未填写视频链接',
  unmute: '开启声音',
  mute: '静音',
  likeAria: '点赞，需下载 App',
  commentAria: '评论，需下载 App',
  saveAria: '收藏，需下载 App',
  shareAria: '分享，需下载 App',
  ageOnly: '{age} · 仅限成年用户',
  officialBadge: '官方版',
  appSummary: '附近视频 · 一键上传 · 实时互动',
  moreComments: '更多评论需下载 App',
  gateLegal: '继续即表示同意用户协议 · 本应用仅限 18 岁以上',
  commentSamples: [
    { name: '小满', text: '这个角度也太好看了吧' },
    { name: 'Nova', text: '求定位！想去同款地方' },
  ],

  cardAria: '和 {name} 打个招呼，需下载 App',
  avatarAlt: '{name}，{age} 岁',
  sayHi: '打个招呼',
  noAvatar: '未设置头像',
  bridgeTitle: '看中了哪一位？直接开口就行。',
  bridgeBody: '文字、语音、照片都能发。她看完即焚，聊不下去随时关掉。',
  bridgeCta: '进去聊两句',

  chatInputAria: '继续聊天需要下载 App',
  chatContinueCta: '继续聊下去 · 免费下载',

  metaVersion: '版本',
  metaSize: '大小',
  metaSystem: '系统',
}`,
  `export const DEFAULT_UI: UiCopy = {
  skipToContent: 'تخطَّ إلى المحتوى',
  close: 'إغلاق',
  closeDialog: 'إغلاق النافذة',

  appIconAlt: 'أيقونة {name}',
  appIconPlaceholder: 'موضع أيقونة التطبيق',
  appNamePlaceholder: 'اسم التطبيق',
  appNamePlaceholderHint: 'أدخل اسم التطبيق من «الهوية» في لوحة التحكم',
  localeSwitchAria: 'اللغة: {label}',
  localeMenuAria: 'اختر اللغة',

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
}`,
  '界面文字',
)

/* ── 首屏 ── */
sub(
  `export const DEFAULT_HERO: HeroConfig = {
  statusPre: '现在',
  statusMid: '你附近还有',
  statusCount: '1,284',
  statusPost: '个人没睡',
  trusted: ['三公里内 · 不跨城', '可匿名出镜 · 声音可变'],
  note: '上面是真的界面 —— 直接上下滑。看到第几条会忍不住，我们也不知道',
  tabs: ['附近', '关注', '推荐'],
  swipeHint: '上下滑动切换',
  badge18: '18+',
}`,
  `export const DEFAULT_HERO: HeroConfig = {
  statusPre: 'الآن',
  statusMid: 'لا يزال هناك',
  statusCount: '1,284',
  statusPost: 'شخصًا قريبًا منك لم يناموا',
  trusted: ['داخل ٣ كم · لا تجاوز للمدينة', 'بوجه مخفي أو صوت معدّل'],
  note: 'ما جرّبته بالأعلى هو الواجهة الحقيقية — مرّر فقط. لا نعرف عند أي مقطع ستتوقف.',
  tabs: ['قريب', 'متابَعون', 'مقترح'],
  swipeHint: 'مرّر للأعلى والأسفل',
  badge18: '+18',
}`,
  '首屏状态条',
)

sub(
  `  {
    id: 'h1',
    kicker: '18+ · 此刻 · 三公里内',
    title: '离你 480 米的地方，她的灯还亮着。',
    sub: '不用加好友，也不用打招呼。划过去，就看见她今晚穿的是什么。',
  },
  {
    id: 'h2',
    kicker: '18+ · 深夜才上线',
    title: '凌晨一点，有人比你更不想睡。',
    sub: '这些人不会出现在白天的推荐里。她们只在夜里出现，也只在夜里消失。',
  },`,
  `  {
    id: 'h1',
    kicker: '+18 · الآن · داخل ثلاثة كيلومترات',
    title: 'ضوءُها ما زال مضاءً، على بعد ٤٨٠ مترًا.',
    sub: 'بلا إضافة صديق وبلا سلام محرج. مرّر لترى ما ترتديه هذه الليلة.',
  },
  {
    id: 'h2',
    kicker: '+18 · يظهرون ليلًا فقط',
    title: 'في الواحدة صباحًا، أحدهم لا يريد النوم أكثر منك.',
    sub: 'هؤلاء لا يظهرون في اقتراحات النهار. يأتون مع الليل، ويرحلون معه.',
  },`,
  '首屏轮播',
)

writeFileSync(FILE, src, 'utf8')

if (failed) {
  console.error(`\n❌ ${failed} 处未匹配`)
  process.exit(1)
}
console.log('\n✅ 第 1 部分完成')
