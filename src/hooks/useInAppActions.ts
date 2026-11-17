import { useCallback, useEffect, useRef, useState } from 'react'
import { copyText, openInSystemBrowser } from '../lib/inApp'

export type CopyState = 'idle' | 'copied' | 'manual'

/**
 * 内嵌浏览器场景下的两个动作：尝试打开系统浏览器、复制当前链接。
 *
 * 为什么抽成 hook：
 *  首屏横幅和下载弹窗各有一份一模一样的交互 ——
 *  「点一下 → 可能被 WebView 拦截 → 必须降级到手动复制」。
 *  这套状态机（opening / copied / manual）复制两份，早晚会有一份忘了处理失败。
 *
 * 关键两处：
 *  · 自动打开没有返回值，只能等 1.4 秒看页面有没有被切走；
 *    没切走就顺手把链接复制好，省掉用户再点一次。
 *  · 剪贴板可能直接被拒（非 HTTPS、WebView 权限、焦点丢失）。
 *    失败也必须给反馈 —— 静默失败会让用户以为页面坏了。
 */
export function useInAppActions() {
  const [opening, setOpening] = useState(false)
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const timers = useRef<number[]>([])

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t))
      timers.current = []
    },
    [],
  )

  const handleCopy = useCallback(async () => {
    if (typeof window === 'undefined') return
    const ok = await copyText(window.location.href)
    setCopyState(ok ? 'copied' : 'manual')

    /* 12 秒后收回去，不然这行提示会一直挂在页面上 */
    timers.current.push(window.setTimeout(() => setCopyState('idle'), 12000))
  }, [])

  const handleOpen = useCallback(() => {
    if (typeof window === 'undefined') return
    setOpening(true)
    openInSystemBrowser(window.location.href)

    timers.current.push(
      window.setTimeout(() => {
        setOpening(false)
        if (document.visibilityState === 'visible') void handleCopy()
      }, 1400),
    )
  }, [handleCopy])

  return { opening, copyState, handleCopy, handleOpen }
}
