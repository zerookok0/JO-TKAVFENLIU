import { useCallback, useEffect, useState } from 'react'
import { DataPanel, ConsolePanel, type TabKey } from './ConsolePanel'
import {
  BrandEditor,
  HeroEditor,
  HighlightsEditor,
  NearbyEditor,
  ThemeEditor,
} from './editors'
import {
  ChatEditor,
  HowEditor,
  InstallEditor,
} from './editors2'
import { UiEditor } from './editors3'
import { VideosSection } from './VideosSection'
import { ADMIN_ENTRY } from '../../config/admin'
import { exitAdminRoute, isAdminRoute } from '../../lib/adminRoute'

/**
 * 控制台总入口 —— 没有账号、没有口令。
 *
 * 进入：网址后加 /admin 或 #admin 或 ?admin
 * 退出：点面板右上角的关闭，地址会自动回到公开页面
 *
 * ── 为什么这个面板不在公开页面的 DOM 里 ─────────────────────
 *
 * 面板本身是中文的（给运营自己看），而站点是面向约旦访客的阿拉伯语。
 * 如果它一直挂在页面上、只是用 translate 移出屏幕，
 * 那它仍然在 DOM 里：屏幕阅读器会读到一串中文，
 * 浏览器的「查找」也能翻到这些字 —— 等于中文漏到了公开页面。
 *
 * 所以这里只在地址命中入口时才真正挂载，
 * 平时 public 页面上一个中文节点都没有。
 */
export function Console() {
  const [open, setOpen] = useState(isAdminRoute)
  const [tab, setTab] = useState<TabKey>('brand')
  const routeOn = isAdminRoute()

  /** 浏览器前进/后退时跟着地址栏走 */
  useEffect(() => {
    const sync = () => setOpen(isAdminRoute())
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
    }
  }, [])

  /** 手动把 /admin 敲进地址栏时（不刷新页面）也能打开 */
  useEffect(() => {
    if (routeOn) setOpen(true)
  }, [routeOn])

  /** 关闭 = 退出控制台：地址栏回到干净状态 */
  const close = useCallback(() => {
    setOpen(false)
    exitAdminRoute()
  }, [])

  /** Ctrl / ⌘ + K：默认关闭，见 src/config/admin.ts */
  useEffect(() => {
    if (!ADMIN_ENTRY.enableHotkey) return
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'k') return
      const el = document.activeElement as HTMLElement | null
      const typing = el && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)
      if (typing) return
      e.preventDefault()
      setOpen(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /** 锁定滚动：控制台打开时背景不跟着滚 */
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  /**
   * 没打开就直接不渲染。
   *
   * 这一步是「一点中文都不要出现」的最终保障：
   * 不是隐藏，而是根本不进 DOM。
   */
  if (!open) return null

  return (
    <>
      <ConsolePanel
        open={open}
        onClose={close}
        tab={tab}
        onTab={setTab}
      >
        {tab === 'brand' && <BrandEditor />}
        {tab === 'theme' && <ThemeEditor />}
        {tab === 'hero' && <HeroEditor />}
        {tab === 'highlights' && <HighlightsEditor />}
        {tab === 'nearby' && <NearbyEditor />}
        {tab === 'how' && <HowEditor />}
        {tab === 'chat' && <ChatEditor />}
        {tab === 'install' && <InstallEditor />}
        {tab === 'videos' && <VideosSection onlyVideos />}
        {tab === 'ui' && <UiEditor />}
        {tab === 'data' && <DataPanel />}
      </ConsolePanel>
    </>
  )
}
