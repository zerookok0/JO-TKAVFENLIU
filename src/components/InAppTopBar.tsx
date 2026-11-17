import { forwardRef } from 'react'
import { AlertTriangle, Check, ExternalLink, Link2, X } from 'lucide-react'
import { useConfig } from '../config/store'
import { fill } from '../lib/format'
import { appLabelAr, type InAppFamily } from '../lib/inApp'
import { useInAppActions } from '../hooks/useInAppActions'

/**
 * 吸顶提示条 —— 只在 FB / IG 这类内置浏览器里出现。
 *
 * ── 为什么必须吸顶，而不是放首屏第一行 ───────────────────
 *  放首屏只能救「第一屏就看到的人」。真实路径是：从 FB 点进来、
 *  被手机里的视频吸住往下滑几十秒，滑到底部才决定装不装 ——
 *  那时候早看不到第一屏的提示了，点下载照样是静默失败。
 *  这条东西要一直跟着，直到他做出决定为止。
 *
 * ── 和别的固定元素怎么相处 ───────────────────────────────
 *  顶栏 Header 是 `fixed top-0`（z-40），这条在它上面（z-45）。
 *  所以这条出现时，Header 必须整体下移同样的高度，
 *  Hero 也要跟着让出位置 —— 否则永远互相压。
 *
 *  高度不写死：文案换行、复制失败时多出来的那行链接、
 *  甚至系统字体放大，都会改变它的实际高度。
 *  父组件用 ResizeObserver 量真实高度，再把 Header 的 top 和
 *  内容区的 padding-top 都设成这个值。这样无论里面发生什么，
 *  下面永远刚好贴着它，不会压、也不会留一道缝。
 */
export const InAppTopBar = forwardRef<
  HTMLDivElement,
  { family: InAppFamily; onClose: () => void }
>(function InAppTopBar({ family, onClose }, ref) {
  const { config } = useConfig()
  const ui = config.ui
  const { opening, copyState, handleCopy, handleOpen } = useInAppActions()

  return (
    <div
      ref={ref}
      className="fixed inset-x-0 top-0 z-[45] border-b border-amber-400/30 bg-ink/95 backdrop-blur-md"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
      role="region"
      aria-label={fill(ui.inAppTitle, { app: appLabelAr(family) })}
    >
      <div className="container-page py-2">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-[2px] h-3.5 w-3.5 shrink-0 text-amber-300" aria-hidden="true" />

          <p className="min-w-0 flex-1 text-[11.5px] font-semibold leading-snug text-amber-200">
            {fill(ui.inAppTitle, { app: appLabelAr(family) })}
          </p>

          <button
            type="button"
            onClick={onClose}
            aria-label={ui.close}
            className="-me-1 -mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-amber-200/50 transition hover:bg-amber-300/10 hover:text-amber-100"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-1.5 flex gap-2 ps-[22px]">
          <button
            type="button"
            onClick={handleOpen}
            disabled={opening}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 py-2 text-[11.5px] font-bold text-black/85 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-70"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            {opening ? ui.inAppOpening : ui.inAppOpen}
          </button>

          <button
            type="button"
            onClick={() => void handleCopy()}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-amber-300/40 bg-amber-300/[0.06] py-2 text-[11.5px] font-semibold text-amber-100 transition hover:bg-amber-300/[0.14] active:scale-[0.98]"
          >
            {copyState === 'copied' ? (
              <Check className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
            ) : (
              <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {ui.inAppCopy}
          </button>
        </div>

        {/*
          复制结果的反馈。
          只有失败（剪贴板被拒）时才会多出这一块 —— 那是必须的兜底：
          用户点了「复制」什么都没发生，他只会以为页面坏了。
          多出来的高度由父组件的 ResizeObserver 接住，下面不会压上来。
        */}
        {copyState === 'copied' && (
          <p className="mt-1.5 ps-[22px] text-[10.5px] leading-relaxed text-emerald-300/90">
            {ui.inAppCopied}
          </p>
        )}

        {copyState === 'manual' && (
          <div className="mt-1.5 ps-[22px]">
            <p className="text-[10.5px] leading-relaxed text-amber-100/70">{ui.inAppManual}</p>
            {/* 拉丁字符强制 LTR，否则 RTL 里链接读起来是反的 */}
            <input
              readOnly
              dir="ltr"
              value={typeof window === 'undefined' ? '' : window.location.href}
              onFocus={(e) => e.currentTarget.select()}
              onClick={(e) => e.currentTarget.select()}
              className="mt-1 w-full select-all rounded-md border border-amber-300/30 bg-black/40 px-2 py-1 text-[10.5px] text-amber-50/80 outline-none"
            />
          </div>
        )}
      </div>
    </div>
  )
})
