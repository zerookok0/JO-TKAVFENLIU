import { useSyncExternalStore } from 'react'

/**
 * ════════════════════════════════════════════════════════════════
 *  本地实时时钟
 * ════════════════════════════════════════════════════════════════
 *  首屏状态条和手机状态栏读的是同一个 hook、同一份快照，
 *  所以两处永远显示同一分钟 —— 不会一边 01:24、另一边 9:41。
 *
 *  时区不用配置：直接跟着访客的设备走。手机和电脑的系统时区
 *  本来就按所在地设好了（换地区会自动同步网络时间），
 *  拿到的就是「他现在看到的那个时间」。
 *
 *  为什么按分钟刷新，而不是每秒：
 *  两处都只显示 HH:MM，没有秒。对齐到整分钟刷新既省重渲染，
 *  也不会出现「秒数对不上」的穿帮。
 *
 *  为什么自己拼 HH:MM，而不用 toLocaleTimeString：
 *    · 输出会跟着浏览器语言变（1:24 AM / 01:24 / ٠١:٢٤），
 *      界面里其他数字都是拉丁数字，混在一起会很跳；
 *    · 状态栏本身固定 24 小时制，写死反而稳定。
 */

const pad = (n: number): string => String(n).padStart(2, '0')

/** 设备本地时间 → "01:24"（24 小时制，补前导零） */
export function formatClock(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/* ── 全站共用一个节拍 ─────────────────────────────────────── */

type Listener = () => void

const listeners = new Set<Listener>()
let snapshot = formatClock(new Date())
let timer = 0

/** 对齐到下一分钟整点，避免 setInterval 累积漂移 */
function schedule() {
  const delay = 60_000 - (Date.now() % 60_000) + 30
  timer = window.setTimeout(() => {
    const next = formatClock(new Date())
    if (next !== snapshot) {
      snapshot = next
      listeners.forEach((fn) => fn())
    }
    schedule()
  }, delay)
}

function start() {
  if (timer || typeof window === 'undefined') return
  schedule()
}

function stop() {
  if (!timer) return
  window.clearTimeout(timer)
  timer = 0
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  start()
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) stop()
  }
}

const getSnapshot = (): string => snapshot

/**
 * 当前本地时间，"01:24"。
 *
 * 用 useSyncExternalStore 而不是 useState + useEffect：
 * 组件挂载时不会先渲染一个占位时间再补丁，首帧就是准的。
 */
export function useClock(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
