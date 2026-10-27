#!/usr/bin/env node
/**
 * 主库阿语化（第 3 部分）：修复 + 剩余区块。
 *
 * 修复内容：
 *   上一轮用 `export const DEFAULT_HIGHLIGHTS` 定位，结果它同时匹配到了
 *   `DEFAULT_HIGHLIGHTS_COPY`（前者是后者的前缀），把区块标题对象覆盖掉了。
 *   这里先把它补回来。
 *
 * 教训（也是本脚本的写法）：
 *   定位一律带上类型标注 `: HighlightsConfig = {`，
 *   只写名字会命中前缀相同的兄弟常量。
 */
import { readFileSync, writeFileSync } from 'node:fs'

const FILE = 'src/config/defaults.ts'
let src = readFileSync(FILE, 'utf8')
let failed = 0

/** 精确替换：oldText 必须唯一存在，否则报错 */
function sub(oldText, newText, label) {
  const first = src.indexOf(oldText)
  if (first === -1) {
    console.error(`✗ ${label}：未匹配`)
    failed += 1
    return
  }
  if (src.indexOf(oldText, first + 1) !== -1) {
    console.error(`✗ ${label}：匹配到多处，需要更长的锚点`)
    failed += 1
    return
  }
  src = src.slice(0, first) + newText + src.slice(first + oldText.length)
  console.log(`✓ ${label}`)
}

/* ───────── 修复：补回 DEFAULT_HIGHLIGHTS_COPY ───────── */

sub(
  `/** 标题被拆成三段：前缀 + 渐变高亮 + 后缀，方便单独改色块 */
export const DEFAULT_HIGHLIGHTS: HighlightItem[] = [`,
  `export const DEFAULT_HIGHLIGHTS_COPY: HighlightsConfig = {
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
export const DEFAULT_HIGHLIGHTS: HighlightItem[] = [`,
  '修复·热点区块标题',
)

/* ───────── 附近的人 ───────── */

sub(
  `export const DEFAULT_PEOPLE: PersonCard[] = [
  {
    id: 'p1',
    name: '小满',
    age: 24,
    meters: 320,
    now: '刚洗完澡，头发还没干',
    quote: '明天不用早起，所以现在还不困。',`,
  `export const DEFAULT_PEOPLE: PersonCard[] = [
  {
    id: 'p1',
    name: 'رهف',
    age: 24,
    meters: 320,
    now: 'لسّه مخلّصة شوّر، شعرها مبلول',
    quote: 'بكرة ما في دوام، فما فيني أنام هلّق.',`,
  '附近·卡片 1',
)

sub(
  `    live: true,
    tags: ['同小区', '在线'],
  },
  {
    id: 'p2',
    name: 'Nova',
    age: 27,
    meters: 680,
    now: '在阳台抽烟，没开灯',
    quote: '楼下的猫又在叫了，你要不要下来看看。',`,
  `    live: true,
    tags: ['نفس الحيّ', 'متصلّة'],
  },
  {
    id: 'p2',
    name: 'لمى',
    age: 27,
    meters: 680,
    now: 'بالشرفة، دخّان والضو مطفّي',
    quote: 'القطة تحت عم تصرخ كمان مرة. بتنزل تشوفها؟',`,
  '附近·卡片 2',
)

sub(
  `    live: true,
    tags: ['两站路', '刚上线'],
  },
  {
    id: 'p3',
    name: '阿棠',
    age: 22,
    meters: 1100,
    now: '躺着，只开了床头那盏',
    quote: '我声音比较低，你可能会认错人。',`,
  `    live: true,
    tags: ['عالدوار الثاني', 'لسّه فاتحة'],
  },
  {
    id: 'p3',
    name: 'دانة',
    age: 22,
    meters: 1100,
    now: 'متمدّدة، مولّعة لمبة السرير بس',
    quote: 'صوتي واطي كتير، ممكن تحسبني حد ثاني.',`,
  '附近·卡片 3',
)

sub(
  `    live: false,
    tags: ['变声', '3 分钟前'],
  },
  {
    id: 'p4',
    name: '苏眠',
    age: 29,
    meters: 2400,
    now: '刚下班，妆还没卸',
    quote: '今天有点累，但不想睡。陪我坐一会儿。',`,
  `    live: false,
    tags: ['صوت مغيّر', 'قبل ٣ دقايق'],
  },
  {
    id: 'p4',
    name: 'نور',
    age: 29,
    meters: 2400,
    now: 'رجعت من الشغل، المكياج لسّه',
    quote: 'تعبت اليوم، بس ما بدي أنام. اقعد معي شوي.',`,
  '附近·卡片 4',
)

sub(
  `    live: true,
    tags: ['同城', '在线'],
  },
]`,
  `    live: true,
    tags: ['نفس المدينة', 'متصلّة'],
  },
]`,
  '附近·卡片 4 标签',
)

/* ───────── 私聊记录 ───────── */

sub(
  `    id: 'c1',
    name: '小满',
    meta: '320m · 昨天 01:24',`,
  `    id: 'c1',
    name: 'رهف',
    meta: '320 م · مبارح 01:24',`,
  '私聊·姓名与距离',
)

sub(
  `      { id: 'l1', from: 'her', text: '你也没睡啊' },
      { id: 'l2', from: 'you', text: '看到你还在线' },
      { id: 'l3', from: 'her', text: '我刚洗完澡，头发还是湿的' },
      { id: 'l4', from: 'her', text: '发你一张？' },
      { id: 'l5', from: 'you', text: '发吧' },
      { id: 'l6', from: 'her', text: '图片已查看 · 5 秒后销毁', system: true },
      { id: 'l7', from: 'her', text: '看到了吗' },
      { id: 'l8', from: 'her', text: '……说话呀' },`,
  `      { id: 'l1', from: 'her', text: 'إنت كمان سهران؟' },
      { id: 'l2', from: 'you', text: 'شفتك لسّه متصلّة' },
      { id: 'l3', from: 'her', text: 'لسّه مخلّصة شوّر، شعري مبلول' },
      { id: 'l4', from: 'her', text: 'أبعثلك وحدة؟' },
      { id: 'l5', from: 'you', text: 'ابعثي' },
      { id: 'l6', from: 'her', text: 'الصورة انفتحت · بتختفي بعد ٥ ثواني', system: true },
      { id: 'l7', from: 'her', text: 'شفتها؟' },
      { id: 'l8', from: 'her', text: '…احكي شوي' },`,
  '私聊·对话内容',
)

writeFileSync(FILE, src, 'utf8')

if (failed) {
  console.error(`\n❌ ${failed} 处失败`)
  process.exit(1)
}
console.log('\n✅ 第 3 部分完成')
