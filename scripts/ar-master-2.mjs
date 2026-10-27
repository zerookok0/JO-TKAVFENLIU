#!/usr/bin/env node
/**
 * 主库阿语化（第 2 部分）：亮点、附近、流程、私聊。
 *
 * 全部按「整块对象」替换 —— 比逐行替换更稳：
 * 字段顺序变了、中间插了新键，都不会导致匹配失败。
 */
import { readFileSync, writeFileSync } from 'node:fs'

const FILE = 'src/config/defaults.ts'
let src = readFileSync(FILE, 'utf8')
let failed = 0

/**
 * 用「起始标记」定位到某个 const 的字面量，整块换掉。
 * @param marker 例如 "export const DEFAULT_HIGHLIGHTS_COPY"
 * @param opts   closesWith：块结尾那行的样子（"}" 或 "]"）
 */
function replaceBlock(marker, block, label, closesWith = '}') {
  const startAt = src.indexOf(marker)
  if (startAt === -1) {
    console.error(`✗ ${label}：找不到 ${marker}`)
    failed += 1
    return
  }

  const lines = src.slice(startAt).split('\n')
  let endLine = -1
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === closesWith) {
      // 数组（\`]\`）需要确认后面是空行，避免命中数组内部的 \`]\`
      if (closesWith === ']' && lines[i + 1]?.trim() !== '') continue
      endLine = i
      break
    }
  }
  if (endLine === -1) {
    console.error(`✗ ${label}：找不到结尾`)
    failed += 1
    return
  }

  const after = lines.slice(endLine + 1).join('\n')
  src = src.slice(0, startAt) + block + (after ? `\n${after}` : '\n')
  console.log(`✓ ${label}`)
}

/* ─────────────── 亮点：区块标题 ─────────────── */

replaceBlock(
  'export const DEFAULT_HIGHLIGHTS_COPY',
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
}`,
  '亮点·区块标题',
)

/* ─────────────── 亮点：五张卡 ─────────────── */

replaceBlock(
  'export const DEFAULT_HIGHLIGHTS',
  `export const DEFAULT_HIGHLIGHTS: HighlightItem[] = [
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
]`,
  '亮点·五张卡',
  ']',
)

/* ─────────────── 附近：区块文案 ─────────────── */

replaceBlock(
  'export const DEFAULT_NEARBY_COPY',
  `export const DEFAULT_NEARBY_COPY = {
  eyebrow: 'حسب المسافة، لا حسب الشهرة',
  title: 'الآن، داخل ثلاثة كيلومترات.',
  sub: 'ليس ما اختاره لك الخوارزم. بل حسب المسافة، من الأقرب إلى الأبعد، واحدًا تلو الآخر.',
  liveNote: '٤ أشخاص متصلون · يتحدّث',
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
}`,
  '附近·区块文案',
)

/* ─────────────── 流程 ─────────────── */

replaceBlock(
  'export const DEFAULT_HOW_COPY',
  `export const DEFAULT_HOW_COPY = {
  eyebrow: 'ثلاث دقائق للبدء',
  title: 'افتح، مرّر مرة، قل كلمة.',
  sub: 'بلا تسجيل معقّد. تحقّق من رقمك وتبدأ المشاهدة.',
  uploadTitle: 'يمكنك النشر أيضًا',
  uploadBody:
    'صوّر وانشر مباشرة، واختر «قريبون فقط» إن أردت. ثلاثون ثانية وتنتهي — بلا مونتاج.',
  uploadLink: 'كيف تنشر',
}`,
  '流程·区块文案',
)

replaceBlock(
  'export const DEFAULT_STEPS',
  `export const DEFAULT_STEPS: StepItem[] = [
  {
    id: 's1',
    icon: 'mapPin',
    title: 'شاهد ما حولك',
    body: 'بمجرد الفتح ترى فيديو حيًا داخل ٣ كم، الأقرب أولًا. بلا متابعة أو صداقة.',
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
]`,
  '流程·三步',
  ']',
)

/* ─────────────── 私聊 ─────────────── */

replaceBlock(
  'export const DEFAULT_CHAT_COPY',
  `export const DEFAULT_CHAT_COPY = {
  eyebrow: 'دردشة الساعة ٠١:٢٤',
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
}`,
  '私聊·区块文案',
)

writeFileSync(FILE, src, 'utf8')

if (failed) {
  console.error(`\n❌ ${failed} 处未匹配`)
  process.exit(1)
}
console.log('\n✅ 第 2 部分完成')
