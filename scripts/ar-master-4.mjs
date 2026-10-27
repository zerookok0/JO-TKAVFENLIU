#!/usr/bin/env node
/**
 * 主库阿语化（第 4 部分）：安装、弹窗、拦截、页脚。
 *
 * 这些区块都是「带类型的常量」或「对象字面量」，
 * 定位时一律使用完整签名（含类型标注），避免只写名字时命中前缀相同的兄弟常量。
 */
import { readFileSync, writeFileSync } from 'node:fs'

const FILE = 'src/config/defaults.ts'
let src = readFileSync(FILE, 'utf8')
let failed = 0

/** 从 marker 起，找到「与开头同缩进级别的收尾行」，整块替换 */
function replaceBlock(marker, block, label, closeToken) {
  const startAt = src.indexOf(marker)
  if (startAt === -1) {
    console.error(`✗ ${label}：未找到 ${marker}`)
    failed += 1
    return
  }
  const lines = src.slice(startAt).split('\n')
  let endLine = -1
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === closeToken) {
      endLine = i
      break
    }
  }
  if (endLine === -1) {
    console.error(`✗ ${label}：未找到结尾`)
    failed += 1
    return
  }
  const after = lines.slice(endLine + 1).join('\n')
  src = src.slice(0, startAt) + block + (after ? `\n${after}` : '\n')
  console.log(`✓ ${label}`)
}

/* ───────────── 安装区块文案 ───────────── */

replaceBlock(
  'export const DEFAULT_INSTALL_COPY = {',
  `export const DEFAULT_INSTALL_COPY = {
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
}`,
  '安装·区块文案',
  '}',
)

/* ───────────── 安装三步 ───────────── */

replaceBlock(
  'export const DEFAULT_INSTALL_STEPS: InstallStep[] = [',
  `export const DEFAULT_INSTALL_STEPS: InstallStep[] = [
  {
    id: 'i1',
    no: '01',
    title: 'اضغط «تحميل» وانتظر ملف APK',
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
]`,
  '安装·三步',
  ']',
)

/* ───────────── 安全说明 ───────────── */

replaceBlock(
  'export const DEFAULT_SAFETY: SafetyPoint[] = [',
  `export const DEFAULT_SAFETY: SafetyPoint[] = [
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
]`,
  '安装·安全说明',
  ']',
)

/* ───────────── 常见问题 ───────────── */

replaceBlock(
  'export const DEFAULT_FAQS: FaqItem[] = [',
  `export const DEFAULT_FAQS: FaqItem[] = [
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
    a: 'أندرويد فقط حاليًا. نسخة iOS ما زالت قيد المراجعة، احفظ الصفحة في المفضلة.',
  },
  {
    id: 'f5',
    q: 'هل يُحفظ موقعي؟',
    a: 'الموقع يُستخدم فقط لحساب المسافة وترتيب محتوى الجوار. لا تُعرض إحداثياتك الدقيقة لأحد ولا تُباع لطرف ثالث.',
  },
]`,
  '安装·常见问题',
  ']',
)

/* ───────────── 下载弹窗 ───────────── */

replaceBlock(
  'export const DEFAULT_MODAL_COPY = {',
  `export const DEFAULT_MODAL_COPY = {
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
      a: 'بعض المتصفحات تحجب ملفات APK. افتح الصفحة في كروم أو متصفح النظام واضغط مرة أخرى.',
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
}`,
  '安装·下载弹窗',
  '}',
)

/* ───────────── 拦截弹窗 ───────────── */

replaceBlock(
  'export const DEFAULT_GATES: Record<GateKey, GateEntry> = {',
  `export const DEFAULT_GATES: Record<GateKey, GateEntry> = {
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
    sub: 'تحت هذا المقطع أكثر من ٢٨٠٠ جملة لم تكتمل.',
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
}`,
  '安装·拦截弹窗',
  '}',
)

/* ───────────── 页脚 ───────────── */

replaceBlock(
  'export const DEFAULT_FOOTER = {',
  `export const DEFAULT_FOOTER = {
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
}`,
  '页脚',
  '}',
)

writeFileSync(FILE, src, 'utf8')

if (failed) {
  console.error(`\n❌ ${failed} 处失败`)
  process.exit(1)
}
console.log('\n✅ 第 4 部分完成')
