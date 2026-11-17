import { AlertTriangle, Check, ExternalLink, Link2 } from 'lucide-react'
import { useConfig } from '../config/store'
import { fill } from '../lib/format'
import { appLabelAr, type InAppFamily } from '../lib/inApp'
import { useInAppActions } from '../hooks/useInAppActions'

/**
 * 内嵌浏览器提示条（下载弹窗内）。
 *
 * ── 它解决的具体问题 ─────────────────────────────────────
 *  FB 投流进来的用户点「下载」时，人在 Facebook 的 WebView 里。
 *  这个 WebView 不放行 APK：
 *    · Android：点下去毫无反应，连个错误都没有
 *    · iOS：直接没有任何可安装的路径
 *  用户以为按钮坏了，就此流失；像素那边还照常记一笔 Purchase。
 *
 *  所以这条提示做三件事，顺序就是用户的决策顺序：
 *    1. 先说清楚「不是按钮坏了，是这里装不了」
 *    2. 给一个自动尝试（Android intent / iOS x-safari）
 *    3. 自动尝试不灵就复制链接，让人自己粘到浏览器
 *
 * ── 为什么不做成整屏拦截 ─────────────────────────────────
 *  弹窗底下就是「开始下载」和「取消」，用户已经点到这里了。
 *  把整屏换掉等于把已经产生的意图清零。做成一条嵌在弹窗里的提示，
 *  想跳过的人可以直接忽略它继续点下载 —— 那是他的选择。
 *
 *  动作逻辑（打开 / 复制 / 失败降级）和首屏卡片共用
 *  hooks/useInAppActions.ts，两处行为永远一致。
 */
export function InAppBanner({ family }: { family: InAppFamily }) {
  const { config } = useConfig()
  const ui = config.ui
  const { opening, copyState, handleCopy, handleOpen } = useInAppActions()

  return (
    <div className="border-t border-amber-400/25 bg-amber-400/[0.08] px-5 py-3.5 sm:px-7">
      <p className="flex items-start gap-2 text-[12.5px] font-semibold leading-snug text-amber-200">
        <AlertTriangle className="mt-[2px] h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{fill(ui.inAppTitle, { app: appLabelAr(family) })}</span>
      </p>

      <p className="mt-1 ps-6 text-[11px] leading-[1.7] text-amber-100/60">{ui.inAppHint}</p>

      <div className="mt-2.5 flex gap-2">
        <button
          type="button"
          onClick={handleOpen}
          disabled={opening}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-2.5 text-[12px] font-bold text-black/85 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-70"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          {opening ? ui.inAppOpening : ui.inAppOpen}
        </button>

        <button
          type="button"
          onClick={() => void handleCopy()}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-amber-300/40 bg-amber-300/[0.06] py-2.5 text-[12px] font-semibold text-amber-100 transition hover:bg-amber-300/[0.14] active:scale-[0.98]"
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
        复制结果的反馈区。

        高度写死一档（约两行），避免出现/消失时把下面的下载按钮顶上去 ——
        那一下跳动会让正要按的手指落空。
      */}
      <div aria-live="polite" className="mt-2 min-h-[30px]">
        {copyState === 'copied' && (
          <p className="text-[10.5px] leading-relaxed text-emerald-300/90">{ui.inAppCopied}</p>
        )}

        {copyState === 'manual' && (
          <>
            <p className="text-[10.5px] leading-relaxed text-amber-100/70">{ui.inAppManual}</p>
            {/*
              链接本身必须强制 LTR：这是拉丁字符，
              放在 RTL 页面里会长得前后颠倒，用户照着打字根本对不上。
            */}
            <input
              readOnly
              dir="ltr"
              value={typeof window === 'undefined' ? '' : window.location.href}
              onFocus={(e) => e.currentTarget.select()}
              onClick={(e) => e.currentTarget.select()}
              className="mt-1 w-full select-all rounded-lg border border-amber-300/30 bg-black/30 px-2 py-1.5 text-[10.5px] text-amber-50/80 outline-none"
            />
          </>
        )}
      </div>
    </div>
  )
}
