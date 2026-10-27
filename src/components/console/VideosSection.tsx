import { ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react'
import { VideoThumb } from './VideoThumb'
import { CoverPicker } from './CoverPicker'
import { useConfig } from '../../config/store'
import { uid } from '../../lib/format'
import {
  AddButton,
  Field,
  Grid,
  ItemCard,
  NumberInput,
  Section,
  StringList,
  TextArea,
  TextInput,
} from './fields'

/**
 * 首屏手机框里的短视频。
 *
 * 这一块被两处复用：
 *   · 控制台「首屏」标签  —— 手机预览就在这一屏，看到就能改
 *   · 控制台「手机视频」标签 —— 只放视频，列表长的时候更好翻
 *
 * 两处改的是同一份 config.videos，所以不存在「两个地方内容对不上」。
 */
export function VideosSection({
  defaultOpen = true,
  onlyVideos = false,
}: {
  defaultOpen?: boolean
  onlyVideos?: boolean
}) {
  const { config, set, resetSection } = useConfig()
  const videos = config.videos

  /** 上下移动：手机里就是按这个顺序从上往下滑的 */
  const move = (from: number, to: number) => {
    if (to < 0 || to >= videos.length) return
    const next = [...videos]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    set('videos', next)
  }

  return (
    <div className="pt-1">
      <Section
        title="手机里的短视频"
        desc={`首屏手机框内上下滑的那 ${videos.length} 条 · 顺序即滑动顺序`}
        defaultOpen={defaultOpen}
        onReset={() => resetSection('videos')}
      >
        {videos.length === 0 && (
          <p className="mb-2 rounded-lg border border-amber-400/25 bg-amber-400/[0.07] px-2.5 py-2 text-[10.5px] leading-relaxed text-amber-100/70">
            现在一条视频都没有，手机框里会显示空状态。点下面的「添加视频」放第一条。
          </p>
        )}

        <div className="grid gap-2">
          {videos.map((v, i) => {
            return (
              <ItemCard
                key={v.id}
                index={i}
                title={v.name || `第 ${i + 1} 条`}
                canRemove
                onRemove={() => set('videos', videos.filter((x) => x.id !== v.id))}
              >
                {/* 缩略图 + 排序 */}
                <div className="flex gap-2">
                  <VideoThumb item={v} className="h-20 w-14" />

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-1.5">
                    <p
                      className={`truncate rounded-md px-2 py-1 text-[10px] ${
                        v.src
                          ? 'bg-emerald-500/10 text-emerald-300/80'
                          : 'bg-amber-400/10 text-amber-200/80'
                      }`}
                    >
                      {v.src ? '已填写视频链接' : '还没填视频链接，手机里会显示占位'}
                    </p>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => move(i, i - 1)}
                        disabled={i === 0}
                        aria-label="上移一位"
                        className="flex flex-1 items-center justify-center gap-1 rounded-md border border-cream/10 py-1.5 text-[10.5px] text-cream/45 transition enabled:hover:bg-cream/[0.07] enabled:hover:text-cream/85 disabled:opacity-25"
                      >
                        <ChevronUp className="h-3 w-3" />
                        上移
                      </button>
                      <button
                        type="button"
                        onClick={() => move(i, i + 1)}
                        disabled={i === videos.length - 1}
                        aria-label="下移一位"
                        className="flex flex-1 items-center justify-center gap-1 rounded-md border border-cream/10 py-1.5 text-[10.5px] text-cream/45 transition enabled:hover:bg-cream/[0.07] enabled:hover:text-cream/85 disabled:opacity-25"
                      >
                        <ChevronDown className="h-3 w-3" />
                        下移
                      </button>
                    </div>
                  </div>
                </div>

                <Field label="视频直链（.mp4）" hint="必须是能直接播放的地址">
                  <TextArea
                    value={v.src}
                    onChange={(val) => set(`videos.${i}.src`, val)}
                    rows={2}
                    placeholder="https://…/clip.mp4"
                  />
                </Field>

                {/*
                  封面：可以抓帧挑一张，也可以自己贴 URL。
                  选过之后就是静态图，手机上不再运行时取帧。
                */}
                <CoverPicker item={v} index={i} />

                <Field label="封面图 URL（可选）" hint="也可以直接贴一张图">
                  <TextInput
                    value={v.poster.startsWith('data:') ? '' : v.poster}
                    onChange={(val) => set(`videos.${i}.poster`, val)}
                    placeholder="https://…/cover.jpg"
                    mono
                  />
                </Field>

                {v.src && (
                  <a
                    href={v.src}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-copper/70 underline decoration-dotted hover:text-copper"
                  >
                    在新标签页测试这个视频
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                )}

                <Grid cols={2}>
                  <Field label="昵称">
                    <TextInput value={v.name} onChange={(val) => set(`videos.${i}.name`, val)} />
                  </Field>
                  <Field label="角标">
                    <TextInput
                      value={v.badge}
                      onChange={(val) => set(`videos.${i}.badge`, val)}
                      placeholder="留空不显示"
                    />
                  </Field>
                </Grid>

                <Field label="头像 URL">
                  <TextInput value={v.avatar} onChange={(val) => set(`videos.${i}.avatar`, val)} mono />
                </Field>

                <Field label="文案">
                  <TextArea
                    value={v.caption}
                    onChange={(val) => set(`videos.${i}.caption`, val)}
                    rows={2}
                  />
                </Field>

                <Field label="话题标签">
                  <StringList
                    items={v.tags}
                    onChange={(val) => set(`videos.${i}.tags`, val)}
                    placeholder="#话题"
                    addLabel="添加话题"
                  />
                </Field>

                <Field label="音乐">
                  <TextInput value={v.music} onChange={(val) => set(`videos.${i}.music`, val)} />
                </Field>

                <Grid cols={2}>
                  <Field label="距离（km）">
                    <NumberInput
                      value={v.distanceKm}
                      step={0.1}
                      onChange={(val) => set(`videos.${i}.distanceKm`, val)}
                    />
                  </Field>
                  <Field label="发布时间">
                    <TextInput
                      value={v.postedAt}
                      onChange={(val) => set(`videos.${i}.postedAt`, val)}
                    />
                  </Field>
                  <Field label="点赞">
                    <NumberInput value={v.likes} onChange={(val) => set(`videos.${i}.likes`, val)} />
                  </Field>
                  <Field label="评论">
                    <NumberInput
                      value={v.comments}
                      onChange={(val) => set(`videos.${i}.comments`, val)}
                    />
                  </Field>
                  <Field label="收藏">
                    <NumberInput value={v.saves} onChange={(val) => set(`videos.${i}.saves`, val)} />
                  </Field>
                  <Field label="分享">
                    <NumberInput value={v.shares} onChange={(val) => set(`videos.${i}.shares`, val)} />
                  </Field>
                </Grid>
              </ItemCard>
            )
          })}

          <AddButton
            onClick={() =>
              set('videos', [
                ...videos,
                {
                  id: uid('vid'),
                  src: '',
                  poster: '',
                  frameOptions: [],
                  name: '新视频',
                  avatar: '',
                  caption: '这条视频的文案。',
                  tags: ['#新话题'],
                  music: '原声',
                  distanceKm: 1,
                  postedAt: '刚刚',
                  likes: 0,
                  comments: 0,
                  saves: 0,
                  shares: 0,
                  badge: '',
                },
              ])
            }
            label="添加视频"
          />
        </div>

        {onlyVideos && (
          <div className="mt-3 rounded-xl border border-cream/[0.08] bg-white/[0.02] p-3 text-[10px] leading-relaxed text-cream/35">
            <p className="font-semibold text-cream/60">视频规格建议</p>
            <p className="mt-1">
              竖屏 720×1280，码率 1.5–2.5 Mbps，8–15 秒，单条 2–4 MB。手机里只有 420px 宽，720p 足够清晰。
            </p>
            <p className="mt-1.5">
              链接必须是可直接访问的 .mp4（不能是网页地址）。填好后点上面那行「测试这个视频」确认能播。
            </p>
          </div>
        )}
      </Section>
    </div>
  )
}
