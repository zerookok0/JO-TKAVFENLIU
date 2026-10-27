#!/usr/bin/env node
/**
 * 把「主库」的界面文字段改成阿拉伯语。
 *
 * 为什么按「整块」替换而不是逐行替换：
 *   DEFAULT_UI 里有几十个键，逐行替换要写几十次断言，容易漏；
 *   整块替换一次就能保证这几十行全部到位，而且缺字段会立刻报错。
 *
 * 定位方式是「从 DEFAULT_UI 开头到它的收尾大括号」，
 * 不依赖字段顺序，也不怕中间被插入新键。
 */
import { readFileSync, writeFileSync } from 'node:fs'

const FILE = 'src/config/defaults.ts'
let src = readFileSync(FILE, 'utf8')

const START = 'export const DEFAULT_UI: UiCopy = {'

const startAt = src.indexOf(START)
if (startAt === -1) {
  console.error('✗ 找不到 DEFAULT_UI')
  process.exit(1)
}

/* 从起始位置往下找到第一个「只包含 } 的行」—— 那就是这个对象的结尾 */
const lines = src.slice(startAt).split('\n')
let endLine = -1
for (let i = 1; i < lines.length; i += 1) {
  if (lines[i].trim() === '}') {
    endLine = i
    break
  }
}
if (endLine === -1) {
  console.error('✗ 找不到 DEFAULT_UI 的结尾')
  process.exit(1)
}

const BLOCK = `export const DEFAULT_UI: UiCopy = {
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
}`

const before = lines.slice(0, endLine).join('\n')
const after = lines.slice(endLine + 1).join('\n')

/* 保留对象之前的所有内容（含 import 与注释），只换这一块 */
const head = src.slice(0, startAt)
src = head + BLOCK + (after ? `\n${after}` : '\n')

writeFileSync(FILE, src, 'utf8')
console.log(`✓ DEFAULT_UI 已整块替换（原 ${endLine} 行 → 新 ${BLOCK.split('\n').length} 行）`)
console.log(`  替换前该块起始于第 ${src.slice(0, startAt).split('\n').length} 行`)
console.log(`  保留的前置内容 ${before.split('\n').length} 行，后续内容 ${after.split('\n').length} 行`)
