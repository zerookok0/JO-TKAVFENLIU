import { useEffect, useMemo, useRef, useState } from 'react'
import { Film } from 'lucide-react'
import { safeImageUrl } from '../../lib/format'
import type { VideoItem } from '../../config/videos'

/**
 * 视频缩略图。
 *
 * 为什么不直接用 <video> 的默认首帧：
 * 很多视频第 0 秒是黑场或淡入，显示出来就是一块黑 —— 用户以为加载失败。
 *
 * 所以这里自己 seek 到中段某一帧再停住：
 *   · 位置按 id 派生 → 同一条视频每次都是同一帧，不会一刷新就变
 *   · 避开开头 12% → 黑场和转场基本都在这段
 *   · 手填了封面图就优先用图，不覆盖作者的选择
 */
export function VideoThumb({
  item,
  className = 'h-20 w-14',
}: {
  item: VideoItem
  className?: string
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [failed, setFailed] = useState(false)
  const poster = safeImageUrl(item.poster)
  const src = item.src.trim()

  /** 该停在哪一帧（0~1），按 id 稳定派生 */
  const ratio = useMemo(() => {
    let h = 5381
    for (let i = 0; i < item.id.length; i += 1) h = ((h << 5) + h + item.id.charCodeAt(i)) | 0
    // 12% ~ 80% 之间取值
    return 0.12 + (Math.abs(h % 1000) / 1000) * 0.68
  }, [item.id])

  useEffect(() => {
    const el = videoRef.current
    if (!el || poster || !src) return

    let done = false
    const seek = () => {
      if (done) return
      const d = el.duration
      if (!Number.isFinite(d) || d <= 0) {
        setFailed(true)
        return
      }
      done = true
      // 留点余量，别正好落在最后一帧
      el.currentTime = Math.min(d * ratio, d - 0.15)
    }

    el.addEventListener('loadedmetadata', seek)
    el.addEventListener('error', () => setFailed(true))
    if (el.readyState >= 1) seek()

    return () => el.removeEventListener('loadedmetadata', seek)
  }, [src, ratio, poster])

  /* 有封面图：直接显示图 */
  if (poster) {
    return (
      <div className={`relative shrink-0 overflow-hidden rounded-lg bg-black/50 ring-1 ring-cream/10 ${className}`}>
        <img
          src={poster}
          alt=""
          className="h-full w-full object-cover"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).style.opacity = '0.15'
          }}
        />
      </div>
    )
  }

  /* 没填封面：用视频中段某一帧 */
  if (src && !failed) {
    return (
      <div className={`relative shrink-0 overflow-hidden rounded-lg bg-black/50 ring-1 ring-cream/10 ${className}`}>
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="metadata"
          tabIndex={-1}
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  /* 兜底：链接坏了、或没填 —— 明确标出「失效」，别让人以为是加载慢 */
  return (
    <div
      className={`grid shrink-0 place-items-center overflow-hidden rounded-lg bg-black/50 ring-1 ${
        src && failed ? 'ring-amber-400/40' : 'ring-cream/10'
      } ${className}`}
      title={src && failed ? '视频链接加载失败（404 或格式不支持）' : '还没有视频'}
    >
      {src && failed ? (
        <span className="text-[8px] font-semibold leading-tight text-amber-300/80">失效</span>
      ) : (
        <Film className="h-4 w-4 text-cream/20" />
      )}
    </div>
  )
}
