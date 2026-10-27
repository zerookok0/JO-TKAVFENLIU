import { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  /** 0..1 progress of the scroll-through intro (muted, purely visual). */
  progress: number
  active: number
}

/**
 * Ambient background: slow drifting aurora blobs + fine grid + film grain.
 * Decorative only, pointer-events disabled.
 */
export function Ambient({ progress, active }: Props) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink" aria-hidden="true">
      {/* deep base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,#2b2350_0%,#171717_52%,#111111_100%)]" />

      {/* aurora blobs */}
      <div
        className="absolute -left-[18%] top-[-14%] h-[62vw] w-[62vw] max-h-[760px] max-w-[760px] rounded-full opacity-[0.45] blur-[110px] transition-transform duration-[1600ms] ease-out"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #9E7FFF 0%, rgba(158,127,255,0) 68%)',
          transform: `translate3d(${progress * 6}%, ${progress * 4 + active * 0.6}%, 0) scale(${1 + progress * 0.06})`,
        }}
      />
      <div
        className="absolute right-[-16%] top-[6%] h-[48vw] w-[48vw] max-h-[620px] max-w-[620px] rounded-full opacity-[0.34] blur-[120px] transition-transform duration-[1600ms] ease-out"
        style={{
          background: 'radial-gradient(circle at 60% 40%, #f472b6 0%, rgba(244,114,182,0) 70%)',
          transform: `translate3d(${-progress * 5}%, ${progress * -6}%, 0) scale(${1 + progress * 0.08})`,
        }}
      />
      <div
        className="absolute bottom-[-22%] left-[26%] h-[52vw] w-[52vw] max-h-[680px] max-w-[680px] rounded-full opacity-[0.26] blur-[130px] transition-transform duration-[1600ms] ease-out"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #38bdf8 0%, rgba(56,189,248,0) 70%)',
          transform: `translate3d(${progress * -4}%, ${progress * -3}%, 0)`,
        }}
      />

      {/* grid */}
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, #000 20%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, #000 20%, transparent 78%)',
        }}
      />

      {/* grain */}
      <div className="noise-overlay absolute inset-0 opacity-[0.05] mix-blend-soft-light" />

      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  )
}

/** Thin animated progress rail pinned to the very top of the viewport. */
export function ScrollRail({ progress }: { progress: number }) {
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-white/[0.06]" aria-hidden="true">
      <div
        className="h-full origin-left bg-gradient-to-r from-brand via-accent to-sky transition-[width] duration-150"
        style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
      />
    </div>
  )
}

/**
 * 滚动进度（0~1）。
 *
 * 两个性能约束，都是踩过坑的：
 *
 *   1. 用 rAF 节流
 *      scroll 事件在手机上可能一帧触发多次。每触发一次就 setState，
 *      带着渐变和模糊的整棵背景都要重算，滑起来就是卡顿。
 *
 *   2. 量化到 1/100
 *      进度只用来做轻微视差，差 1% 根本看不出来。但如果不量化，
 *      几乎每个滚动事件都会产生一个「新值」，React 就会一直重渲染。
 *      量化之后，只有真的跨过 1% 才更新 —— 重渲染次数降一个数量级。
 */
export function useElementProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [progress, setProgress] = useState(0)
  const rafId = useRef(0)
  const last = useRef(-1)

  const measure = useCallback(() => {
    if (rafId.current) return
    rafId.current = window.requestAnimationFrame(() => {
      rafId.current = 0
      const el = ref.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const total = rect.height + vh
      const passed = vh - rect.top
      const raw = Math.min(1, Math.max(0, passed / total))
      const next = Math.round(raw * 100) / 100

      if (next !== last.current) {
        last.current = next
        setProgress(next)
      }
    })
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      if (rafId.current) window.cancelAnimationFrame(rafId.current)
    }
  }, [measure])

  return { ref, progress }
}
