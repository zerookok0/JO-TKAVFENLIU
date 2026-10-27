import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Flame, Send } from 'lucide-react'
import { useConfig } from '../config/store'
import { Icon } from './Icon'
import { safeImageUrl } from '../lib/format'

type Props = {
  /** 点输入框 / 点「接着聊」→ 打开下载弹窗 */
  onStart: () => void
}

export function NightChat({ onStart }: Props) {
  const { config } = useConfig()
  const { chatCopy, ui } = config
  const story = config.chat[0]

  const [shown, setShown] = useState(0)
  const [started, setStarted] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  const total = story?.lines.length ?? 0

  /** 滚到视野内才开始逐条浮现 —— 制造「正在聊」的错觉 */
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
      setShown(total)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStarted(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [total])

  useEffect(() => {
    if (!started || shown >= total) return
    const t = window.setTimeout(() => setShown((n) => n + 1), shown === 0 ? 320 : 720)
    return () => window.clearTimeout(t)
  }, [started, shown, total])

  if (!story) return null

  const avatar = safeImageUrl(story.avatar)

  return (
    <section id="chat" className="relative overflow-hidden py-16 sm:py-24">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[560px] w-[860px] -translate-x-1/2 -translate-y-1/2 opacity-60 blur-[110px]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(124,27,44,0.3) 0%, rgba(192,138,92,0.1) 45%, transparent 72%)',
        }}
        aria-hidden="true"
      />

      <div className="container-page">
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          {/* 左：说明 */}
          <div className="reveal order-2 lg:order-1">
            <p className="eyebrow">{chatCopy.eyebrow}</p>
            <h2 className="mt-3.5 text-balance text-[clamp(1.6rem,4.4vw,2.4rem)] font-semibold leading-[1.3] tracking-[-0.01em] text-cream">
              {chatCopy.title}
            </h2>
            <p className="mt-4 max-w-[420px] text-[14px] leading-[1.9] text-cream/45">
              {chatCopy.sub}
            </p>

            <ul className="mt-7 grid gap-3">
              {chatCopy.features.map((f, i) => (
                <li
                  key={`${f.title}-${i}`}
                  className="flex items-start gap-3 rounded-2xl border border-cream/[0.07] bg-cream/[0.025] p-4 transition duration-500 hover:border-copper/25 hover:bg-cream/[0.05]"
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-wine/20 text-blush ring-1 ring-wine/30">
                    <Icon name={f.icon} className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-[13.5px] font-semibold text-cream/90">{f.title}</p>
                    <p className="mt-1 text-[12px] leading-[1.75] text-cream/40">{f.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 右：聊天窗 */}
          <div className="reveal order-1 lg:order-2">
            <div
              ref={wrapRef}
              className="relative mx-auto w-full max-w-[430px] overflow-hidden rounded-[30px] border border-cream/[0.09] bg-surface/90 shadow-ember backdrop-blur-xl"
            >
              {/* 顶栏 */}
              <div className="flex items-center gap-3 border-b border-cream/[0.07] px-4 py-3.5">
                <div className="relative">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={story.name}
                      className="h-9 w-9 rounded-full object-cover ring-1 ring-cream/15"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-white/10" />
                  )}
                  <span className="absolute -bottom-0.5 -end-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-blush" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-semibold text-cream">{story.name}</p>
                  <p className="mt-0.5 text-[10.5px] tracking-wide text-cream/35">{story.meta}</p>
                </div>
                <span className="rounded-full border border-copper/25 bg-copper/10 px-2 py-[3px] text-[9.5px] font-medium tracking-wide text-copper">
                  {chatCopy.burnBadge}
                </span>
              </div>

              {/* 消息区 */}
              <div className="hide-scrollbar flex max-h-[420px] min-h-[330px] flex-col gap-2 overflow-y-auto px-4 py-5">
                {story.lines.slice(0, shown).map((line) => {
                  if (line.system) {
                    return (
                      <div
                        key={line.id}
                        className="msg-in mx-auto my-1 flex items-center gap-1.5 rounded-full border border-cream/[0.08] bg-cream/[0.03] px-3 py-1.5"
                      >
                        <Flame className="h-3 w-3 text-blush/80" />
                        <span className="text-[10.5px] tracking-wide text-cream/35">
                          {line.text}
                        </span>
                      </div>
                    )
                  }

                  const mine = line.from === 'you'
                  return (
                    <div
                      key={line.id}
                      className={`msg-in flex ${mine ? 'justify-end' : 'justify-start'}`}
                    >
                      <p
                        className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-[1.65] ${
                          mine
                            ? 'rounded-ee-md bg-gradient-to-br from-wine to-wineDeep text-cream'
                            : 'rounded-es-md border border-cream/[0.07] bg-cream/[0.055] text-cream/85'
                        }`}
                      >
                        {line.text}
                      </p>
                    </div>
                  )
                })}

                {/* 正在输入 */}
                {shown < total && shown > 0 && (
                  <div className="mt-1 flex justify-start">
                    <div className="flex items-center gap-1 rounded-2xl rounded-es-md border border-cream/[0.07] bg-cream/[0.055] px-3.5 py-3">
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="h-1.5 w-1.5 rounded-full bg-cream/40"
                          style={{
                            animation: `pulse-bar 1s ease-in-out ${d * 0.18}s infinite alternate`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 结尾留白 */}
                {shown >= total && chatCopy.endNote && (
                  <p className="mt-3 text-center text-[11px] tracking-[0.16em] text-cream/20">
                    {chatCopy.endNote}
                  </p>
                )}
              </div>

              {/* 输入框：点了就引导下载 */}
              <div className="relative border-t border-cream/[0.07] px-4 py-3">
                <button
                  type="button"
                  onClick={onStart}
                  aria-label={ui.chatInputAria}
                  className="group flex w-full items-center gap-2 rounded-full border border-cream/[0.08] bg-cream/[0.03] px-3.5 py-2.5 text-start transition hover:border-copper/40 hover:bg-copper/[0.08]"
                >
                  <span className="flex-1 truncate text-[12px] text-cream/30 transition group-hover:text-cream/50">
                    {chatCopy.inputPlaceholder}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-cream/90 px-3 py-1 text-[10.5px] font-semibold text-ink transition group-hover:bg-copper group-hover:text-white">
                    {chatCopy.sendLabel}
                    <Send className="h-2.5 w-2.5" />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onStart}
                  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-wine via-copper to-blush py-2.5 text-[12px] font-bold text-white shadow-glow transition hover:brightness-110 active:scale-[0.98]"
                >
                  {ui.chatContinueCta}
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
