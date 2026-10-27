#!/usr/bin/env node
/**
 * 约旦本地化收尾脚本（一次性执行）。
 *
 * 做三件事：
 *   1. 让 ar / en 两个覆盖层的视频列表与基础库（v1–v4）严格对齐，避免多出无源条目；
 *   2. 人名统一为约旦常用名字；
 *   3. 把手机框里「加载失败」这类硬编码中文，改成可翻译字段；并修正 <html> 语言。
 *
 * 每一步都带断言：任何一处没匹配上就报错退出，方便立刻发现漂移。
 */
import { readFileSync, writeFileSync } from 'node:fs'

const read = (p) => readFileSync(p, 'utf8')
const write = (p, s) => writeFileSync(p, s, 'utf8')

let failed = 0

function sub(file, pattern, replacement, label) {
  const before = read(file)
  const after = before.replace(pattern, replacement)
  if (after === before) {
    console.error(`✗ ${label}（未匹配：${file}）`)
    failed += 1
    return
  }
  write(file, after)
  console.log(`✓ ${label}`)
}

/* ───────────── 1. 阿语：视频列表对齐 v1–v4 ───────────── */

const VIDEOS_AR = `  videos: [
    {
      id: 'v1',
      name: 'رهف',
      caption: 'شارع عبدون الساعة وحدة بالليل. الهوا ألطف من النهار.',
      tags: ['#عمّان_بالليل', '#أضواء_المدينة'],
      music: 'صوت أصلي · رهف',
      postedAt: 'قبل ١٢ دقيقة',
      badge: 'الأقرب إلك',
    },
    {
      id: 'v2',
      name: 'زيد',
      caption: 'اليوم ٤١ بالجيم. جسمي أضبط من المنبّه.',
      tags: ['#التزام', '#تمرين'],
      music: 'Push It · Gym Mix',
      postedAt: 'قبل ساعة',
      badge: '',
    },
    {
      id: 'v3',
      name: 'لمى',
      caption: 'سطح البيت بالجبيهة، كاسة شاي وولا شي على بالي.',
      tags: ['#هدوء_الليل', '#سطح_البيت'],
      music: 'ليل عمّان · إندي',
      postedAt: 'قبل ٢٨ دقيقة',
      badge: '',
    },
    {
      id: 'v4',
      name: 'دانة',
      caption: 'الدوار السابع فاضي، والليل حسّه غير.',
      tags: ['#عمّان', '#مشوار_ليلي'],
      music: 'Neon Drive · Synthwave',
      postedAt: 'قبل ساعتين',
      badge: 'الأكثر تصاعدًا',
    },
  ],`

sub(
  'src/i18n/messages/ar.ts',
  /  videos: \[[\s\S]*?\n  \],\n\n  ui: \{/,
  `${VIDEOS_AR}\n\n  ui: {`,
  'ar.ts · 视频列表（约旦创作者，对齐 v1–v4）',
)

sub(
  'src/i18n/messages/ar.ts',
  /    commentSamples: \[\n[\s\S]*?\n    \],/,
  `    commentSamples: [
      { name: 'رهف', text: 'هاي الزاوية كثير حلوة' },
      { name: 'زيد', text: 'وين هالمكان؟ بدي أروح' },
    ],`,
  'ar.ts · 示例评论人名',
)

/* ───────────── 2. 英文：人名、聊天、视频对齐 ───────────── */

const PEOPLE_EN = `  people: [
    {
      id: 'p1',
      name: 'Rahaf',
      now: 'Just out of the shower, hair still wet',
      quote: 'No work tomorrow, so I am not sleepy yet.',
      tags: ['Same block', 'Online'],
    },
    {
      id: 'p2',
      name: 'Lama',
      now: 'On the balcony, smoking with the lights off',
      quote: 'The cat downstairs is meowing again. Coming down to see it?',
      tags: ['Second floor', 'Still up'],
    },
    {
      id: 'p3',
      name: 'Dana',
      now: 'Lying down, only the bedside lamp on',
      quote: 'My voice is low, you might think I am someone else.',
      tags: ['Voice altered', '3 min ago'],
    },
    {
      id: 'p4',
      name: 'Noor',
      now: 'Just back from work, makeup still on',
      quote: 'Long day, but I do not want to sleep. Sit with me a while.',
      tags: ['Same city', 'Online'],
    },
  ],`

sub(
  'src/i18n/messages/en.ts',
  /  people: \[[\s\S]*?\n  \],\n\n  howCopy: \{/,
  `${PEOPLE_EN}\n\n  howCopy: {`,
  'en.ts · 人名改为约旦名字',
)

const CHAT_EN = `  chat: [
    {
      id: 'c1',
      name: 'Rahaf',
      meta: '320 m · yesterday 01:24',
      lines: [
        { id: 'l1', text: 'You are up too?' },
        { id: 'l2', text: 'Saw you were still online' },
        { id: 'l3', text: 'Just showered, my hair is still wet' },
        { id: 'l4', text: 'Send you one?' },
        { id: 'l5', text: 'Go ahead' },
        { id: 'l6', text: 'Photo opened · gone in 5s' },
        { id: 'l7', text: 'Did you see it?' },
        { id: 'l8', text: '…say something' },
      ],
    },
  ],`

sub(
  'src/i18n/messages/en.ts',
  /  chat: \[\n    \{\n      id: 'c1',[\s\S]*?\n  \],\n\n  installCopy: \{/,
  `${CHAT_EN}\n\n  installCopy: {`,
  'en.ts · 聊天记录改为约旦语境',
)

const VIDEOS_EN = `  videos: [
    {
      id: 'v1',
      name: 'Rahaf',
      caption: '1am on Abdoun street. The breeze is softer than daytime.',
      tags: ['#AmmanAtNight', '#CityLights'],
      music: 'Original · Rahaf',
      postedAt: '12 min ago',
      badge: 'Closest to you',
    },
    {
      id: 'v2',
      name: 'Zaid',
      caption: 'Day 41 at the gym. My body beats the alarm.',
      tags: ['#Streak', '#Training'],
      music: 'Push It · Gym Mix',
      postedAt: '1 hour ago',
      badge: '',
    },
    {
      id: 'v3',
      name: 'Lama',
      caption: 'Rooftop in Jubeiha, a glass of tea and nothing on my mind.',
      tags: ['#QuietNight', '#Rooftop'],
      music: 'Amman Nights · Indie',
      postedAt: '28 min ago',
      badge: '',
    },
    {
      id: 'v4',
      name: 'Dana',
      caption: '7th Circle is empty, and the night hits different.',
      tags: ['#Amman', '#NightDrive'],
      music: 'Neon Drive · Synthwave',
      postedAt: '2 hours ago',
      badge: 'Trending',
    },
  ],`

sub(
  'src/i18n/messages/en.ts',
  /  videos: \[[\s\S]*?\n  \],\n\n  ui: \{/,
  `${VIDEOS_EN}\n\n  ui: {`,
  'en.ts · 视频列表对齐 v1–v4',
)

sub(
  'src/i18n/messages/en.ts',
  /    commentSamples: \[\n[\s\S]*?\n    \],/,
  `    commentSamples: [
      { name: 'Rahaf', text: 'This corner is unreal' },
      { name: 'Zaid', text: 'Where is this? I want to go' },
    ],`,
  'en.ts · 示例评论人名',
)

sub(
  'src/i18n/messages/en.ts',
  /    videoMissingSrc: 'No video link set',/,
  `    videoMissingSrc: 'No video link set',
    videoBrokenTitle: 'This clip failed to load',
    videoBrokenBody:
      'The link may be dead (404), or it is not a direct .mp4 file. Replace it in the Videos tab.',`,
  'en.ts · 失效提示字段',
)

sub(
  'src/i18n/messages/ar.ts',
  /    videoMissingSrc: 'لا يوجد رابط فيديو',/,
  `    videoMissingSrc: 'لا يوجد رابط فيديو',
    videoBrokenTitle: 'هالمقطع ما زبط يفتح',
    videoBrokenBody:
      'الرابط يمكن صار قديم (404)، أو إنه مش ملف .mp4 مباشر. بدّله من تبويب «فيديوهات الهاتف».',`,
  'ar.ts · 失效提示字段',
)

/* ───────────── 3. 基础库：新增两个可翻译字段 ───────────── */

sub(
  'src/config/defaults.ts',
  /  videoMissingSrc: string/,
  `  videoMissingSrc: string
  /** 视频源失效（404 / 打不开）时的标题 */
  videoBrokenTitle: string
  /** 失效说明与修复指引 */
  videoBrokenBody: string`,
  'defaults.ts · UiCopy 类型新增字段',
)

sub(
  'src/config/defaults.ts',
  /  videoMissingSrc: '未填写视频链接',/,
  `  videoMissingSrc: '未填写视频链接',
  videoBrokenTitle: 'هالمقطع ما زبط يفتح',
  videoBrokenBody:
    'الرابط يمكن صار قديم (404)، أو إنه مش ملف .mp4 مباشر. بدّله من تبويب «فيديوهات الهاتف».',`,
  'defaults.ts · 默认值（阿语）',
)

/* ───────────── 4. 手机框：去掉硬编码中文 ───────────── */

sub(
  'src/components/PhoneMockup.tsx',
  /这条视频加载失败/,
  '{ui.videoBrokenTitle}',
  'PhoneMockup · 失败标题改用 i18n',
)

sub(
  'src/components/PhoneMockup.tsx',
  /链接可能已失效（404），或地址不是可直接播放的 \.mp4。\s*\n\s*<br \/>\s*\n\s*去控制台「手机视频」里换一条链接。/,
  '{ui.videoBrokenBody}',
  'PhoneMockup · 失败说明改用 i18n',
)

/* ───────────── 5. index.html：阿拉伯语 + RTL ───────────── */

sub('index.html', /<html lang="zh-CN">/, '<html lang="ar" dir="rtl">', 'index.html · lang/dir')
sub(
  'index.html',
  /<title>夜里 · 三公里内，此刻还没睡的人<\/title>/,
  '<title>نايتايل · من حولك، على بعد ثلاثة كيلومترات</title>',
  'index.html · 标题',
)
sub(
  'index.html',
  /content="深夜才上线的同城私域。三公里内的真实画面，不用加好友，划到就看得到。支持匿名出镜、AI 变声、看完即焚。仅限 18 岁以上。"/,
  'content="مجتمع ليلي داخل مدينتك. لقطات حقيقية في نطاق ثلاثة كيلومترات، بلا إضافة أصدقاء، مرّر لتشاهد. وجوه مخفية، ومغيّر صوت بالذكاء الاصطناعي، ورسائل تختفي بعد القراءة. للبالغين +18 فقط."',
  'index.html · 描述',
)
sub(
  'index.html',
  /<meta property="og:title" content="离你 480 米的地方，她的灯还亮着。" \/>/,
  '<meta property="og:title" content="ضوءُها ما زال مضاءً، على بعد 480 مترًا." />',
  'index.html · 分享标题',
)
sub(
  'index.html',
  /content="三公里内的此刻，不用加好友，划到就看得到。安卓免费下载，仅限 18+。"/,
  'content="ثلاثة كيلومترات حولك، الآن. بلا إضافة أصدقاء. تحميل مجاني لأندرويد، +18 فقط."',
  'index.html · 分享描述',
)

if (failed) {
  console.error(`\n❌ 有 ${failed} 处未匹配，请检查后再运行。`)
  process.exit(1)
}
console.log('\n✅ 全部完成')
