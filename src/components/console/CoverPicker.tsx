import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, Camera, Check, ImagePlus, Loader2, ShieldQuestion, Trash2 } from 'lucide-react'
import { useConfig } from '../../config/store'
import { captureFrames, checkCors, type CapturedFrame, type CorsCheck } from '../../lib/frameGrab'
import { safeImageUrl } from '../../lib/format'
import type { VideoItem } from '../../config/videos'

type Status =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'checking' }
  | { kind: 'cors'; result: CorsCheck }
  | { kind: 'error'; error: string; hint: string; fix?: string; cors: boolean }
  | { kind: 'done'; n: number }

/**
 * 封面选择。
 *
 * 三条路，按推荐顺序：
 *   1. 抓 5 帧 → 点一张（最快，但要求视频服务器开了 CORS）
 *   2. 本地选一张图 → 直接读成 dataURL（不依赖任何服务器）
 *   3. 贴图片 URL
 *
 * 为什么要留第 2 条：抓帧受浏览器跨域限制，
 * 公共示例源基本都不给 CORS。这时候本地选图是唯一能立刻走通的路。
 */
export function CoverPicker({ item, index }: { item: VideoItem; index: number }) {
  const { set } = useConfig()
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const fileRef = useRef<HTMLInputElement | null>(null)

  const frames = useMemo(() => item.frameOptions ?? [], [item.frameOptions])
  const current = safeImageUrl(item.poster)

  /** 抓帧 */
  const grab = useCallback(async () => {
    setStatus({ kind: 'loading' })
    const res = await captureFrames(item.src)

    if (!res.ok) {
      setStatus({
        kind: 'error',
        error: res.error,
        hint: res.hint,
        fix: res.fix,
        cors: res.cors,
      })
      return
    }

    set(
      `videos.${index}.frameOptions`,
      res.frames.map((f: CapturedFrame) => f.dataUrl),
    )
    setStatus({ kind: 'done', n: res.frames.length })
  }, [item.src, index, set])

  /** 检查跨域是否配好 —— 配完不用猜 */
  const diagnose = useCallback(async () => {
    setStatus({ kind: 'checking' })
    const result = await checkCors(item.src)
    setStatus({ kind: 'cors', result })
  }, [item.src])

  /** 抓完提示几秒后收起 */
  useEffect(() => {
    if (status.kind !== 'done') return
    const t = window.setTimeout(() => setStatus({ kind: 'idle' }), 2600)
    return () => window.clearTimeout(t)
  }, [status])

  /**
   * 本地选图。
   *
   * 读成 dataURL 存进配置 —— 不依赖任何服务器，也不需要 CORS。
   * 代价是图片进了 localStorage / 导出文件，所以要压一下尺寸：
   * 手机框里只有 420px 宽，720px 宽足够，再大只是白占体积。
   */
  const pickFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setStatus({
        kind: 'error',
        error: '这不是图片文件',
        hint: '请选 JPG / PNG / WebP 这类图片。',
        cors: false,
      })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const raw = String(reader.result ?? '')
      const img = new Image()
      img.onload = () => {
        const targetW = 720
        const scale = Math.min(1, targetW / img.width)
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)

        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          set(`videos.${index}.poster`, raw)
          return
        }
        ctx.drawImage(img, 0, 0, w, h)
        // 质量 0.78：肉眼几乎看不出差别，体积比原图小很多
        set(`videos.${index}.poster`, canvas.toDataURL('image/jpeg', 0.78))
      }
      img.onerror = () => {
        setStatus({
          kind: 'error',
          error: '这张图读不出来',
          hint: '文件可能损坏，换一张试试。',
          cors: false,
        })
      }
      img.src = raw
    }
    reader.readAsDataURL(file)
  }

  const pick = (dataUrl: string) => set(`videos.${index}.poster`, dataUrl)
  const clear = () => set(`videos.${index}.poster`, '')
  const clearOptions = () => set(`videos.${index}.frameOptions`, [])

  const loading = status.kind === 'loading'

  return (
    <div className="rounded-xl border border-cream/[0.08] bg-white/[0.02] p-2.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold text-cream/70">封面</p>

        <div className="flex items-center gap-1">
          {current && (
            <button
              type="button"
              onClick={clear}
              title="清掉封面，回到自动取帧"
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] text-cream/35 transition hover:text-red-300"
            >
              <Trash2 className="h-3 w-3" />
              清除
            </button>
          )}

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1 rounded-md bg-cream/[0.07] px-2 py-1 text-[10.5px] font-medium text-cream/70 transition hover:bg-cream/15 hover:text-cream"
          >
            <ImagePlus className="h-3 w-3" />
            选图
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) pickFile(f)
              e.target.value = ''
            }}
          />

          <button
            type="button"
            onClick={diagnose}
            disabled={!item.src || status.kind === 'checking'}
            title="只检查服务器有没有放开跨域，不抓帧"
            className="inline-flex items-center gap-1 rounded-md bg-cream/[0.07] px-2 py-1 text-[10.5px] font-medium text-cream/60 transition enabled:hover:bg-cream/15 enabled:hover:text-cream disabled:opacity-40"
          >
            {status.kind === 'checking' ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <ShieldQuestion className="h-3 w-3" />
            )}
            测跨域
          </button>

          <button
            type="button"
            onClick={grab}
            disabled={!item.src || loading}
            title={item.src ? '从视频里抓 5 帧让你挑' : '先填视频链接'}
            className="inline-flex items-center gap-1 rounded-md bg-copper/15 px-2 py-1 text-[10.5px] font-semibold text-copper transition enabled:hover:bg-copper/25 disabled:opacity-40"
          >
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Camera className="h-3 w-3" />
            )}
            {loading ? '抓取中' : frames.length ? '重新抓帧' : '抓 5 帧'}
          </button>
        </div>
      </div>

      {/* 当前封面 */}
      {current ? (
        <div className="mt-2 flex items-center gap-2">
          <img
            src={current}
            alt="当前封面"
            className="h-16 w-11 shrink-0 rounded-md object-cover ring-1 ring-emerald-400/40"
          />
          <p className="text-[10px] leading-relaxed text-emerald-300/70">
            已选定 · 手机里直接显示这张，不再运行时取帧
          </p>
        </div>
      ) : (
        <p className="mt-1.5 text-[10px] leading-relaxed text-cream/30">
          留空会自动取视频中段某一帧（避开黑场）。想自己定就「选图」或「抓 5 帧」。
        </p>
      )}

      {/* 候选帧 */}
      {frames.length > 0 && (
        <>
          <div className="mt-2 grid grid-cols-5 gap-1">
            {frames.map((src, fi) => {
              const active = item.poster === src
              return (
                <button
                  key={fi}
                  type="button"
                  onClick={() => pick(src)}
                  title={`选第 ${fi + 1} 帧`}
                  className={`relative aspect-[9/16] overflow-hidden rounded-md ring-1 transition ${
                    active ? 'ring-2 ring-emerald-400' : 'ring-cream/10 hover:ring-copper/60'
                  }`}
                >
                  <img
                    src={src}
                    alt={`候选第 ${fi + 1} 帧`}
                    className="h-full w-full object-cover"
                  />
                  {active && (
                    <span className="absolute inset-0 grid place-items-center bg-emerald-400/25">
                      <Check className="h-4 w-4 text-white drop-shadow" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <p className="text-[10px] text-cream/30">点一张即可设为封面</p>
            <button
              type="button"
              onClick={clearOptions}
              className="text-[10px] text-cream/25 transition hover:text-red-300"
            >
              删除候选
            </button>
          </div>
        </>
      )}

      {/* 跨域检查结果 */}
      {status.kind === 'cors' && (
        <div
          className={`mt-1.5 rounded-md border p-2 ${
            status.result.ok
              ? 'border-emerald-400/25 bg-emerald-400/[0.07]'
              : 'border-amber-400/25 bg-amber-400/[0.07]'
          }`}
        >
          <p
            className={`text-[10.5px] font-semibold ${
              status.result.ok ? 'text-emerald-200' : 'text-amber-200'
            }`}
          >
            {status.result.ok ? '跨域可用' : '跨域没生效'}
            {status.result.acao && (
              <span className="ms-1 font-mono text-[9.5px] opacity-60">
                {status.result.acao}
              </span>
            )}
          </p>
          <p className="mt-1 text-[10px] leading-relaxed text-cream/50">
            {status.result.verdict}
          </p>
          <p className="mt-1 border-t border-cream/10 pt-1 text-[10px] leading-relaxed text-cream/40">
            {status.result.action}
          </p>

          {/* 同源时不用谈 CORS，直接说清楚 */}
          {status.result.sameOrigin ? (
            <p className="mt-1.5 rounded bg-emerald-400/10 px-1.5 py-1 text-[9.5px] leading-relaxed text-emerald-200/70">
              视频和页面同域名 → 走同源请求，完全不需要配 AllowedOrigins。
            </p>
          ) : (
            <>
              {/* 把当前域名摆出来 —— 对不上 AllowedOrigins 时一眼就看见 */}
              <p className="mt-1.5 flex flex-wrap items-center gap-1 text-[9.5px] text-cream/30">
                <span>你当前在这个域名下：</span>
                <span className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-cream/55">
                  {typeof window !== 'undefined' ? window.location.origin : ''}
                </span>
              </p>
              <p className="mt-1 text-[9.5px] leading-relaxed text-cream/25">
                AllowedOrigins 必须包含上面这个值（或写成 *）才能抓帧。
                换环境预览时容易出现「配了但没生效」，通常是这个原因。
              </p>
            </>
          )}
        </div>
      )}

      {/* 成功提示 */}
      {status.kind === 'done' && (
        <p className="mt-1.5 rounded-md bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-300/80">
          抓到 {status.n} 帧，上面挑一张
        </p>
      )}

      {/* 失败：把原因和解法分开写，别让人猜 */}
      {status.kind === 'error' && (
        <div className="mt-1.5 rounded-md border border-amber-400/25 bg-amber-400/[0.07] p-2">
          <p className="flex items-start gap-1 text-[10.5px] font-semibold leading-snug text-amber-200">
            <AlertTriangle className="mt-[1px] h-3 w-3 shrink-0" />
            {status.error}
          </p>
          <p className="mt-1 text-[10px] leading-relaxed text-amber-100/60">{status.hint}</p>
          {status.fix && (
            <p className="mt-1 border-t border-amber-400/15 pt-1 text-[10px] leading-relaxed text-amber-100/45">
              {status.fix}
            </p>
          )}
          {status.cors && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-md bg-amber-400/20 py-1.5 text-[10.5px] font-semibold text-amber-100 transition hover:bg-amber-400/30"
            >
              <ImagePlus className="h-3 w-3" />
              直接从电脑选一张图当封面
            </button>
          )}
        </div>
      )}
    </div>
  )
}
