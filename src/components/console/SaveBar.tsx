import { useEffect, useState } from 'react'
import { ArrowUpRight, Check, RotateCcw, Save, Undo2 } from 'lucide-react'
import { useConfig, type SectionKey } from '../../config/store'
import { adminEntryUrl } from '../../lib/adminRoute'

/**
 * 每个标签底部的保存栏。
 *
 * 为什么要有它：这里改的是草稿，只在你当前浏览器里预览。
 * 不点保存，线上和其它设备看到的还是旧内容 —— 按钮存在的意义就在这。
 *
 * 三种状态，文案必须让用户一眼分清：
 *   有改动    → 主按钮可用，角标亮起
 *   刚保存    → 打勾 + 时间，几秒后回到「已保存」
 *   无改动    → 主按钮禁用，避免误以为没生效
 *
 * 关键：一个标签往往改的不是一个区块。
 * 「品牌」标签里同时有品牌信息和下载埋点（含 Pixel ID），
 * 「安装」标签里横跨安装文案、步骤、弹窗、拦截弹窗、页脚五个区块。
 *
 * 以前这里只接收一个 section，于是点「保存」只存了其中一个 ——
 * 你在「品牌」标签填的 Pixel ID 属于 download 区块，根本没被存进去，
 * 界面却显示「已保存」，刷新就丢。所以现在收一个数组，逐个存。
 */
export function SaveBar({ sections }: { sections: SectionKey[] }) {
  const { isDirty, saveSection, discardSection, resetSectionToBase } = useConfig()
  const dirty = sections.some(isDirty)
  const [justSaved, setJustSaved] = useState(false)
  const [savedAt, setSavedAt] = useState<string>('')

  /** 保存成功后闪一下「已保存」 */
  useEffect(() => {
    if (!justSaved) return
    const t = window.setTimeout(() => setJustSaved(false), 2400)
    return () => window.clearTimeout(t)
  }, [justSaved])

  const handleSave = () => {
    sections.forEach(saveSection)
    setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    setJustSaved(true)
  }

  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-4 border-t border-cream/[0.08] bg-[#0d0d0f]/95 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12.5px] font-bold transition ${
            dirty
              ? 'bg-gradient-to-r from-wine via-copper to-blush text-white shadow-glow hover:brightness-110 active:scale-[0.98]'
              : 'bg-cream/[0.06] text-cream/30'
          }`}
        >
          {justSaved && !dirty ? (
            <>
              <Check className="h-3.5 w-3.5" />
              已保存
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              {dirty ? '保存这个标签' : '没有改动'}
            </>
          )}
        </button>

        {dirty && (
          <button
            type="button"
            onClick={() => sections.forEach(discardSection)}
            title="放弃这个标签下的改动，回到上次保存的内容"
            className="flex shrink-0 items-center gap-1.5 rounded-xl border border-cream/12 px-3 py-2.5 text-[12px] font-medium text-cream/55 transition hover:bg-cream/[0.07] hover:text-cream"
          >
            <Undo2 className="h-3.5 w-3.5" />
            撤销
          </button>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-[10px] leading-relaxed text-cream/30">
          {dirty ? (
            <>还没保存 · 只有你这台设备能看到</>
          ) : savedAt ? (
            <>
              已保存到本机 · <span className="text-cream/45">{savedAt}</span>
            </>
          ) : (
            <>已和线上一致</>
          )}
        </p>

        <button
          type="button"
          onClick={() => {
            if (window.confirm('把这个标签恢复成初始默认内容？会直接覆盖已保存的版本。')) {
              sections.forEach(resetSectionToBase)
            }
          }}
          className="inline-flex shrink-0 items-center gap-1 text-[10px] text-cream/25 transition hover:text-red-300"
        >
          <RotateCcw className="h-3 w-3" />
          恢复默认
        </button>
      </div>
    </div>
  )
}

/**
 * 顶部提示条。
 *
 * 两件事在这里说清楚，因为它们最容易搞混：
 *   1. 有未保存的改动 → 「保存」按钮管的是这个
 *   2. 刚跑了 config:apply 部署 → 本机旧覆盖已自动清掉，别再怀疑部署没生效
 */
export function PublishHint() {
  const { dirtySections, saveAll, baseChanged } = useConfig()
  const [open, setOpen] = useState(false)
  const count = dirtySections.length

  /** 部署了新内容：提示一次就够，用户关掉就不再打扰 */
  const [seenBaseChange, setSeenBaseChange] = useState(false)
  const showBaseChanged = baseChanged && !seenBaseChange

  if (count === 0 && !showBaseChanged) return null

  return (
    <div className="mx-4 mb-1 mt-2 grid gap-2">
      {showBaseChanged && (
        <div className="rounded-xl border border-emerald-400/25 bg-emerald-400/[0.07] p-2.5">
          <div className="flex items-start gap-2">
            <p className="flex-1 text-[10.5px] leading-relaxed text-emerald-100/80">
              <b className="font-semibold text-emerald-200">线上内容已更新。</b>
              你本机残留的旧草稿已自动清空，现在看到的就是仓库里的正式内容。
            </p>
            <button
              type="button"
              onClick={() => setSeenBaseChange(true)}
              aria-label="知道了"
              className="shrink-0 rounded-md px-1.5 text-[11px] text-emerald-200/50 transition hover:text-emerald-100"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {count > 0 && (
        <div className="rounded-xl border border-amber-400/25 bg-amber-400/[0.07] p-2.5">
          <div className="flex items-center gap-2">
            <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-amber-400/25 text-[9px] font-bold text-amber-200">
              {count}
            </span>
            <p className="flex-1 text-[10.5px] leading-tight text-amber-100/80">
              {count} 个区块有未保存的改动
            </p>
            <button
              type="button"
              onClick={saveAll}
              className="shrink-0 rounded-md bg-amber-400/20 px-2 py-1 text-[10px] font-semibold text-amber-100 transition hover:bg-amber-400/30"
            >
              全部保存
            </button>
          </div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-amber-200/60 hover:text-amber-100"
          >
            保存之后，别人还是看不到？
            <ArrowUpRight className={`h-2.5 w-2.5 transition ${open ? 'rotate-90' : ''}`} />
          </button>
          {open && (
            <p className="mt-1.5 text-[10px] leading-relaxed text-amber-100/55">
              对。保存只写进你这台设备的浏览器。要让线上访客看到，去「数据」标签导出
              site-config.json → 运行 <span className="font-mono">npm run config:apply</span> →
              提交推送。入口：
              <a
                href={adminEntryUrl()}
                className="mx-1 underline decoration-dotted hover:text-amber-100"
              >
                /admin
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  )
}
