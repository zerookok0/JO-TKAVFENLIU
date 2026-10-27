import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  DEFAULT_BRAND,
  DEFAULT_BUTTONS,
  DEFAULT_CHAT,
  DEFAULT_CHAT_COPY,
  DEFAULT_DOWNLOAD,
  DEFAULT_FAQS,
  DEFAULT_FOOTER,
  DEFAULT_GATES,
  DEFAULT_GEO,
  DEFAULT_HERO,
  DEFAULT_HERO_SLIDES,
  DEFAULT_HIGHLIGHTS,
  DEFAULT_HIGHLIGHTS_COPY,
  DEFAULT_HOW_COPY,
  DEFAULT_INSTALL_COPY,
  DEFAULT_INSTALL_STEPS,
  DEFAULT_MODAL_COPY,
  DEFAULT_NAV,
  DEFAULT_NEARBY_COPY,
  DEFAULT_PEOPLE,
  DEFAULT_SAFETY,
  DEFAULT_STEPS,
  DEFAULT_THEME,
  DEFAULT_UI,
  type BrandConfig,
  type ButtonCopy,
  type DownloadConfig,
  type FaqItem,
  type FooterGroup,
  type GateEntry,
  type GeoConfig,
  type HighlightsConfig,
  type InstallStep,
  type SafetyPoint,
  type StepItem,
  type ThemeConfig,
  type UiCopy,
} from './defaults'
import { DEFAULT_VIDEOS, type VideoItem } from './videos'
import { SITE_CONTENT } from './site.content'
import { LEGACY_KEYS, STORAGE_KEYS } from './version'
import { hexToRgbChannels } from '../lib/format'
import type {
  ChatStory,
  HeroSlide,
  HighlightItem,
  NavItem,
  PersonCard,
} from './types'

export type SiteConfig = {
  brand: BrandConfig
  download: DownloadConfig
  theme: ThemeConfig
  nav: NavItem[]
  buttons: ButtonCopy
  hero: typeof DEFAULT_HERO
  heroSlides: HeroSlide[]
  highlightsCopy: HighlightsConfig
  highlights: HighlightItem[]
  nearbyCopy: typeof DEFAULT_NEARBY_COPY
  people: PersonCard[]
  howCopy: typeof DEFAULT_HOW_COPY
  steps: StepItem[]
  chatCopy: typeof DEFAULT_CHAT_COPY
  chat: ChatStory[]
  installCopy: typeof DEFAULT_INSTALL_COPY
  installSteps: InstallStep[]
  safety: SafetyPoint[]
  faqs: FaqItem[]
  modalCopy: typeof DEFAULT_MODAL_COPY
  gates: Record<string, GateEntry>
  /** 地区分流：目标国家看正常页，非目标国家看安全页 */
  geo: GeoConfig
  footer: { about: string; groups: FooterGroup[]; dockNote: string }
  videos: VideoItem[]
  /** 零散界面文字（朗读标签、空状态、模板句） */
  ui: UiCopy
}

/** 一个可独立保存的区块 = SiteConfig 的顶层键 */
export type SectionKey = keyof SiteConfig

export const DEFAULT_CONFIG: SiteConfig = {
  brand: DEFAULT_BRAND,
  download: DEFAULT_DOWNLOAD,
  theme: DEFAULT_THEME,
  nav: DEFAULT_NAV,
  buttons: DEFAULT_BUTTONS,
  hero: DEFAULT_HERO,
  heroSlides: DEFAULT_HERO_SLIDES,
  highlightsCopy: DEFAULT_HIGHLIGHTS_COPY,
  highlights: DEFAULT_HIGHLIGHTS,
  nearbyCopy: DEFAULT_NEARBY_COPY,
  people: DEFAULT_PEOPLE,
  howCopy: DEFAULT_HOW_COPY,
  steps: DEFAULT_STEPS,
  chatCopy: DEFAULT_CHAT_COPY,
  chat: DEFAULT_CHAT,
  installCopy: DEFAULT_INSTALL_COPY,
  installSteps: DEFAULT_INSTALL_STEPS,
  safety: DEFAULT_SAFETY,
  faqs: DEFAULT_FAQS,
  modalCopy: DEFAULT_MODAL_COPY,
  gates: DEFAULT_GATES,
  geo: DEFAULT_GEO,
  footer: DEFAULT_FOOTER,
  videos: DEFAULT_VIDEOS,
  ui: DEFAULT_UI,
}

/**
 * 本机存储键。
 *
 * 键名里带内容版本号（见 ./version.ts）：文案大改就把版本号 +1，
 * 旧键立刻读不到。
 *
 * 这正是「切到阿拉伯语却看到中文」的根因：
 * 主库早已写成阿语，但老访客的浏览器里存着更早那版「中文主库」，
 * 读取时合并优先级高于默认值，于是文字被中文覆盖回去了。
 * 换一把新钥匙，旧的覆盖就再也读不到。
 */
const STORAGE_KEY = STORAGE_KEYS.saved

/** 草稿（改了还没点保存的内容）单独存一份：刷新不丢，也不会污染已保存的内容 */
const DRAFT_KEY = STORAGE_KEYS.draft

/**
 * 深合并：保证新增字段能从默认值补上，
 * 用户存过的旧数据结构不会因为升级而缺键。
 */
function merge<T>(base: T, patch: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(patch) ? patch : base) as T
  }
  if (base && typeof base === 'object') {
    if (!patch || typeof patch !== 'object' || Array.isArray(patch)) return base
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) }
    for (const key of Object.keys(base as Record<string, unknown>)) {
      const b = (base as Record<string, unknown>)[key]
      const p = (patch as Record<string, unknown>)[key]
      out[key] = p === undefined ? b : merge(b, p)
    }
    return out as T
  }
  if (patch === undefined || patch === null) return base
  if (typeof patch !== typeof base) return base
  return patch as T
}

/**
 * 仓库里的基线配置。
 *
 * DEFAULT_CONFIG 是代码里的兜底值；SITE_CONTENT 是 `npm run config:apply`
 * 从你导出的 JSON 生成的那份「正式内容」。两者合并，才是站点真正的初始状态。
 *
 * 关键点：这份基线是进 git 的 —— 线上、别人的浏览器，看到的都是它。
 * 而 localStorage 只在你自己的设备上生效，那是草稿，不是发布。
 */
export const BASE_CONFIG: SiteConfig = merge(DEFAULT_CONFIG, SITE_CONTENT)

/** 仓库基线内容的指纹：部署新内容后，它的值会变 */
const BASE_SIG_KEY = STORAGE_KEYS.baseSig

/**
 * 清掉以前版本的键。
 *
 * 为什么主动清，而不是放着不管：
 * 旧键里存的是「中文主库 + 英文覆盖层」那个时期的配置。
 * 占几 MB 只是小事 —— 真正的风险是它一旦被读到，
 * 页面又冒出中文或英文。删干净最省事。
 */
function purgeLegacy() {
  try {
    LEGACY_KEYS.forEach((key) => window.localStorage.removeItem(key))
  } catch {
    /* 隐私模式：忽略 */
  }
}

/** 内容指纹（djb2）：只用来判断「仓库里的正式内容有没有换过」 */
function baseSignature(): string {
  const raw = JSON.stringify(SITE_CONTENT)
  let h = 5381
  for (let i = 0; i < raw.length; i += 1) {
    h = ((h << 5) + h + raw.charCodeAt(i)) | 0
  }
  return String(h)
}

type Loaded = { saved: SiteConfig; draft: SiteConfig; baseChanged: boolean }

/**
 * 读取本机状态。
 *
 * 关键的一段在 baseChanged：
 * 你跑完 `npm run config:apply` 并重新部署之后，仓库里的 SITE_CONTENT 变了，
 * 但本机 localStorage 还压着旧的「已保存」和「草稿」。
 * 如果不清掉，**你自己打开网站看到的还是旧内容**，会误以为部署没生效。
 *
 * 所以这里用内容指纹判断：指纹变了 = 线上正式内容更新过 → 丢掉本机旧覆盖。
 */
function readStored(): Loaded {
  if (typeof window === 'undefined') {
    return { saved: BASE_CONFIG, draft: BASE_CONFIG, baseChanged: false }
  }

  purgeLegacy()

  let baseChanged = false
  try {
    const sig = baseSignature()
    const stored = window.localStorage.getItem(BASE_SIG_KEY)
    if (stored && stored !== sig) {
      window.localStorage.removeItem(STORAGE_KEY)
      window.localStorage.removeItem(DRAFT_KEY)
      baseChanged = true
    }
    window.localStorage.setItem(BASE_SIG_KEY, sig)
  } catch {
    /* 隐私模式：忽略 */
  }

  let saved = BASE_CONFIG
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) saved = merge(BASE_CONFIG, JSON.parse(raw))
  } catch {
    saved = BASE_CONFIG
  }

  let draft = saved
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY)
    if (raw) draft = merge(saved, JSON.parse(raw))
  } catch {
    draft = saved
  }

  return { saved, draft, baseChanged }
}

/**
 * 配置读写的完整接口。
 *
 * 页面直接读 config；控制台改的也是同一份 ——
 * 站点只有阿拉伯语，不再有「母版 / 译文」两层，
 * 所以改完保存，页面立刻就是改后的样子。
 */
export type Store = {
  /** 当前内容（可能含未保存的草稿）—— 页面渲染读这个 */
  config: SiteConfig
  /** 深路径更新，例如 set('brand.name', 'xx') */
  set: (path: string, value: unknown) => void
  update: (patch: Partial<SiteConfig>) => void
  reset: () => void
  resetSection: (key: SectionKey) => void
  replaceAll: (next: SiteConfig) => void
  exportJson: () => string
  importJson: (raw: string) => { ok: boolean; error?: string }

  /* ── 保存：草稿 → 已保存 ───────────────────────────── */

  /** 已保存的那份内容，用来判断某个区块改没改 */
  saved: SiteConfig
  /** 这个区块有没有还没保存的改动 */
  isDirty: (key: SectionKey) => boolean
  /** 所有有改动的区块 */
  dirtySections: SectionKey[]
  /** 保存单个区块 */
  saveSection: (key: SectionKey) => void
  /** 保存全部改动 */
  saveAll: () => void
  /** 撤销单个区块：回到上次保存的样子 */
  discardSection: (key: SectionKey) => void
  /** 把区块恢复成仓库基线并直接存下 */
  resetSectionToBase: (key: SectionKey) => void
  /** 整体是否有未保存改动 */
  dirty: boolean
  /** 本机旧的覆盖已被清掉（说明部署了新内容）—— 用来提示用户 */
  baseChanged: boolean
}

/** 配置上下文 */
export const ConfigContext = createContext<Store | null>(null)

function setPath<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split('.')
  const clone: any = Array.isArray(obj) ? [...(obj as any)] : { ...(obj as any) }
  let cursor = clone
  for (let i = 0; i < keys.length - 1; i += 1) {
    const k = keys[i]
    const nextSource = cursor[k]
    cursor[k] = Array.isArray(nextSource) ? [...nextSource] : { ...nextSource }
    cursor = cursor[k]
  }
  cursor[keys[keys.length - 1]] = value
  return clone as T
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  /** 首次读取：已保存、草稿、以及「仓库正式内容是否刚换过」 */
  const [initial] = useState(readStored)
  /** 已保存的内容 —— 真正对访客生效的那份 */
  const [saved, setSaved] = useState<SiteConfig>(initial.saved)
  /** 正在编辑的内容（含未保存草稿）—— 页面读它，所以改完能即时预览 */
  const [config, setConfig] = useState<SiteConfig>(initial.draft)

  /** 仓库内容更新过的提示：部署后你本机的旧覆盖已被自动清掉 */
  const [baseChanged] = useState(initial.baseChanged)

  /** 已保存内容落盘 */
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    } catch {
      /* ignore quota / private mode */
    }
  }, [saved])

  /** 草稿落盘：没点保存就关掉页面，下次回来还能接着改 */
  useEffect(() => {
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(config))
    } catch {
      /* ignore */
    }
  }, [config])

  /** 同步页签标题与描述 */
  useEffect(() => {
    if (config.brand.docTitle) document.title = config.brand.docTitle
    const meta = document.querySelector('meta[name="description"]')
    if (meta && config.brand.docDescription) {
      meta.setAttribute('content', config.brand.docDescription)
    }
  }, [config.brand.docTitle, config.brand.docDescription])

  const set = useCallback((path: string, value: unknown) => {
    setConfig((prev) => setPath(prev, path, value))
  }, [])

  const update = useCallback((patch: Partial<SiteConfig>) => {
    setConfig((prev) => merge(prev, patch))
  }, [])

  /** 全部重置：草稿和已保存一起清空，否则刷新草稿又回来 */
  const reset = useCallback(() => {
    setConfig(BASE_CONFIG)
    setSaved(BASE_CONFIG)
    try {
      window.localStorage.removeItem(STORAGE_KEY)
      window.localStorage.removeItem(DRAFT_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const resetSection = useCallback((key: SectionKey) => {
    setConfig((prev) => ({ ...prev, [key]: BASE_CONFIG[key] }))
  }, [])

  const replaceAll = useCallback((next: SiteConfig) => {
    setConfig(merge(BASE_CONFIG, next))
  }, [])

  const exportJson = useCallback(() => JSON.stringify(config, null, 2), [config])

  const importJson = useCallback((raw: string) => {
    try {
      const parsed = JSON.parse(raw)
      if (!parsed || typeof parsed !== 'object') {
        return { ok: false, error: 'المحتوى ليس كائنًا' }
      }
      setConfig(merge(BASE_CONFIG, parsed))
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'صيغة JSON غير صحيحة' }
    }
  }, [])

  /* ── 保存（草稿 → 已保存）────────────────────────────── */

  /** 逐区块比对：只比这个区块自己的内容，别的标签改了不会连坐 */
  const isDirty = useCallback(
    (key: SectionKey) =>
      JSON.stringify(config[key]) !== JSON.stringify(saved[key]),
    [config, saved],
  )

  const dirtySections = useMemo(
    () =>
      (Object.keys(saved) as SectionKey[]).filter(
        (key) => JSON.stringify(config[key]) !== JSON.stringify(saved[key]),
      ),
    [config, saved],
  )

  const saveSection = useCallback(
    (key: SectionKey) => setSaved((prev) => ({ ...prev, [key]: config[key] })),
    [config],
  )

  const saveAll = useCallback(() => setSaved(config), [config])

  const discardSection = useCallback(
    (key: SectionKey) => setConfig((prev) => ({ ...prev, [key]: saved[key] })),
    [saved],
  )

  /** 恢复出厂：改回仓库基线并直接存下，否则刷新又回来 */
  const resetSectionToBase = useCallback((key: SectionKey) => {
    setConfig((prev) => ({ ...prev, [key]: BASE_CONFIG[key] }))
    setSaved((prev) => ({ ...prev, [key]: BASE_CONFIG[key] }))
  }, [])

  const dirty = dirtySections.length > 0

  const value = useMemo<Store>(
    () => ({
      config,
      set,
      update,
      reset,
      resetSection,
      replaceAll,
      exportJson,
      importJson,
      saved,
      isDirty,
      dirtySections,
      saveSection,
      saveAll,
      discardSection,
      resetSectionToBase,
      dirty,
      baseChanged,
    }),
    [
      config,
      set,
      update,
      reset,
      resetSection,
      replaceAll,
      exportJson,
      importJson,
      saved,
      isDirty,
      dirtySections,
      saveSection,
      saveAll,
      discardSection,
      resetSectionToBase,
      dirty,
      baseChanged,
    ],
  )

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
}

export function useConfig(): Store {
  const ctx = useContext(ConfigContext)
  // 开发者内部错误：访客正常使用永远碰不到，所以直接写阿语，别把中文带进构建产物
  if (!ctx) throw new Error('useConfig يجب أن يُستخدم داخل ConfigProvider')
  return ctx
}

/**
 * 主题落地：把配置里的颜色写进 CSS 变量，
 * 页面所有组件读 var(--...) 就自动跟着变。
 *
 * 每个颜色写两份：
 *   --c-xxx      hex，用于渐变、SVG 等直接取值
 *   --c-xxx-rgb  通道，供 Tailwind 的 /60 透明度修饰使用
 */
export function themeVars(theme: ThemeConfig): Record<string, string> {
  const hex = {
    '--c-bg': theme.bg,
    '--c-surface': theme.surface,
    '--c-text': theme.text,
    '--c-muted': theme.muted,
    '--c-wine': theme.wine,
    '--c-copper': theme.copper,
    '--c-blush': theme.blush,
  }
  const vars: Record<string, string> = { ...hex }
  Object.entries(hex).forEach(([k, v]) => {
    vars[`${k}-rgb`] = hexToRgbChannels(v)
  })
  return vars
}
