import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { AmbientLayer } from './components/AmbientLayer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Highlights, HowItWorks } from './components/Highlights'
import { InstallSection } from './components/InstallSection'
import { Footer, MobileDock } from './components/Footer'
import { InstallModal } from './components/InstallModal'
import { Nearby } from './components/Nearby'
import { NightChat } from './components/NightChat'
import { GeoGate } from './components/GeoGate'
import { useReveal } from './hooks/useReveal'
import { initPixel, resetInnerGuard, trackInnerAndGo, trackOuter } from './lib/pixel'
import { ConfigProvider, themeVars, useConfig } from './config/store'
import { DIR, HTML_LANG } from './config/locale'
import { isAdminRoute } from './lib/adminRoute'
import type { GateKey } from './config/defaults'

/**
 * 控制台按需加载。
 *
 * 为什么这么做：这个面板是中文的（给运营自己用），
 * 而访客看到的是阿拉伯语站点。如果直接静态 import，
 * 那一整包中文界面文案会打进首屏 JS —— 谁打开页面都下载一份，
 * 只是不显示而已。用 lazy 切开，公开页面根本不会加载它。
 *
 * 触发条件只有一个：地址命中 /admin。
 */
const Console = lazy(() =>
  import('./components/console/Console').then((m) => ({ default: m.Console })),
)

function Site() {
  useReveal()
  const { config } = useConfig()
  const [sheetOpen, setSheetOpen] = useState(false)

  /**
   * 语言与方向钉死在阿拉伯语。
   *
   * 为什么还要在运行时再写一次：
   * 静态托管上有人会直接分享带 ?lang=en 的老链接，
   * 或者浏览器装了自动翻译插件改写了 <html>。
   * 这里强制写回，页面永远是从右往左的阿拉伯语。
   */
  useEffect(() => {
    const root = document.documentElement
    root.lang = HTML_LANG
    root.dir = DIR
    root.dataset.locale = HTML_LANG
  }, [])

  /** Pixel 只在填了 ID 时才注入 */
  useEffect(() => {
    initPixel(config.download.pixelId)
  }, [config.download.pixelId])

  /** 主题色落到 CSS 变量 */
  useEffect(() => {
    const vars = themeVars(config.theme)
    const root = document.documentElement
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
  }, [config.theme])

  /**
   * 外层下载按钮 → InitiateCheckout。
   *
   * 每次打开都复位 Purchase 的防重标记：
   * 上一次弹窗可能已经上报过、用户取消后又点了别处的下载，
   * 那是一次新的下载意向，应该照常计数 —— 不能被上一次永久锁死。
   */
  const openSheet = useCallback(
    (source: string) => {
      trackOuter(config.download.pixelId, source)
      resetInnerGuard()
      setSheetOpen(true)
    },
    [config.download.pixelId],
  )

  const closeSheet = useCallback(() => setSheetOpen(false), [])

  /** 弹窗内「开始下载」→ Purchase，然后跳转 */
  const confirmDownload = useCallback(() => {
    trackInnerAndGo(config.download.pixelId, config.download.apkUrl, 'dl_inner_modal')
  }, [config.download.pixelId, config.download.apkUrl])

  /** 手机内点赞/评论 → 打开同一个弹窗 */
  const handleGate = useCallback(
    (_action?: GateKey) => openSheet('dl_inner_phone'),
    [openSheet],
  )

  /**
   * 唯一的下载入口。所有会弹出下载框的地方都必须走这里 ——
   * 这样每个入口都会带回一条 InitiateCheckout，
   * 不会再出现「能弹框但不回传」的旁路。
   */
  const DOWNLOAD_SOURCES = {
    header: 'dl_outer_header',
    hero: 'dl_outer_hero',
    heroSecondary: 'dl_outer_hero_secondary',
    phone: 'dl_inner_phone',
    nearby: 'dl_nearby_card',
    chat: 'dl_chat_input',
    install: 'dl_outer_install',
    bypass: 'dl_outer_bypass',
    dock: 'dl_outer_dock',
  } as const

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink">
      {/* 滚动进度只影响这一层，不带着整页重渲染 */}
      <AmbientLayer />

      <a
        href="#nearby"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
      >
        {config.ui.skipToContent}
      </a>

      <Header onDownload={() => openSheet(DOWNLOAD_SOURCES.header)} />

      {/* 动线：看视频（第 1 屏）→ 看附近的人（第 2 屏）→ 开始聊天（第 3 屏） */}
      <main>
        <Hero
          onDownload={() => openSheet(DOWNLOAD_SOURCES.hero)}
          onGate={handleGate}
        />

        <Nearby onChat={() => openSheet(DOWNLOAD_SOURCES.nearby)} />

        <NightChat onStart={() => openSheet(DOWNLOAD_SOURCES.chat)} />

        <Highlights />
        <HowItWorks />
        <InstallSection
          onDownload={() => openSheet(DOWNLOAD_SOURCES.install)}
          onBypass={() => openSheet(DOWNLOAD_SOURCES.bypass)}
        />
      </main>

      <Footer />
      <MobileDock onDownload={() => openSheet(DOWNLOAD_SOURCES.dock)} />

      <InstallModal open={sheetOpen} onClose={closeSheet} onConfirm={confirmDownload} />
    </div>
  )
}

/**
 * 只有一个配置层，没有语言层。
 *
 * 之前是 ConfigProvider → LocaleProvider 两层：页面读「译文」，
 * 控制台读「母版」。站点只剩阿拉伯语之后，这一层就没有存在意义了 ——
 * 它带来的只是「改了看不到变化」和「切到某种语言冒出另一种文字」。
 *
 * 现在页面和控制台读的是同一份内容，改完保存就生效。
 *
 * 控制台只在 /admin 下才挂载，而且走懒加载 ——
 * 公开页面上既不会出现中文节点，也不会下载那部分代码。
 */
export default function App() {
  const admin = isAdminRoute()

  return (
    <ConfigProvider>
      {/* 公开页面过地区分流门：非目标国家的访客只见到安全页。
          控制台在门外面 —— 你自己永远进得去 /admin。 */}
      <GeoGate>
        <Site />
      </GeoGate>
      {admin && (
        <Suspense fallback={null}>
          <Console />
        </Suspense>
      )}
    </ConfigProvider>
  )
}
