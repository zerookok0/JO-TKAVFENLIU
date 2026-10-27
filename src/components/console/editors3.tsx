import { useConfig } from '../../config/store'
import {
  AddButton,
  Field,
  Grid,
  Section,
  TextArea,
  TextInput,
} from './fields'
import type { UiCopy } from '../../config/defaults'

/**
 * 界面文字编辑器。
 *
 * 这里放的是按钮以外的短句：朗读标签、空状态、模板句。
 * 带 {xxx} 的是占位符，翻译成英文 / 阿语时由 fill() 填值 ——
 * 所以改文案时请把 {name}、{distance} 这类花括号原样保留。
 */

type TextRow = { key: keyof Omit<UiCopy, 'commentSamples'>; label: string }

const GLOBAL_ROWS: TextRow[] = [
  { key: 'skipToContent', label: '跳到主要内容' },
  { key: 'close', label: '关闭' },
  { key: 'closeDialog', label: '关闭弹窗' },
]

const NAV_ROWS: TextRow[] = [
  { key: 'backToTop', label: '回到顶部' },
  { key: 'openMenu', label: '打开菜单' },
  { key: 'closeMenu', label: '关闭菜单' },
  { key: 'mainNav', label: '主导航标签' },
  { key: 'mobileNav', label: '移动端导航标签' },
  { key: 'slideDot', label: '轮播点朗读' },
]

const FEED_ROWS: TextRow[] = [
  { key: 'feedRegionAria', label: '视频区朗读' },
  { key: 'previewLabel', label: '预览说明' },
  { key: 'previewDistance', label: '预览距离' },
  { key: 'previewQualityNote', label: '画质说明' },
  { key: 'videoLoading', label: '视频加载中' },
  { key: 'videoLoadingHint', label: '加载中补充说明' },
  { key: 'videoLoadingSlow', label: '加载慢时的提示' },
  { key: 'ageOnly', label: '仅限成年' },
  { key: 'officialBadge', label: '官方角标' },
  { key: 'appSummary', label: '应用简介' },
  { key: 'moreComments', label: '更多评论' },
  { key: 'gateLegal', label: '拦截弹窗声明' },
  { key: 'unmute', label: '开启声音' },
  { key: 'mute', label: '静音' },
  { key: 'likeAria', label: '点赞朗读' },
  { key: 'commentAria', label: '评论朗读' },
  { key: 'saveAria', label: '收藏朗读' },
  { key: 'shareAria', label: '分享朗读' },
]

const EMPTY_ROWS: TextRow[] = [
  { key: 'emptyFeedTitle', label: '空状态标题' },
  { key: 'emptyFeedBody', label: '空状态说明' },
  { key: 'videoMissingSrc', label: '缺视频链接' },
]

const NEARBY_ROWS: TextRow[] = [
  { key: 'cardAria', label: '卡片朗读' },
  { key: 'avatarAlt', label: '头像替代文字' },
  { key: 'sayHi', label: '打个招呼按钮' },
  { key: 'noAvatar', label: '无头像占位' },
  { key: 'bridgeTitle', label: '引导标题' },
  { key: 'bridgeBody', label: '引导说明' },
  { key: 'bridgeCta', label: '引导按钮' },
]

const CHAT_ROWS: TextRow[] = [
  { key: 'chatInputAria', label: '输入框朗读' },
  { key: 'chatContinueCta', label: '继续聊按钮' },
]

const META_ROWS: TextRow[] = [
  { key: 'metaVersion', label: '安装包—版本' },
  { key: 'metaSize', label: '安装包—大小' },
  { key: 'metaSystem', label: '安装包—系统' },
]

function Rows({ rows, hint }: { rows: TextRow[]; hint?: string }) {
  const { config, set } = useConfig()
  return (
    <Grid cols={2}>
      {rows.map((row) => (
        <Field
          key={row.key}
          label={row.label}
          hint={hint}
          wide={
            row.key === 'emptyFeedBody' ||
            row.key === 'bridgeBody' ||
            row.key === 'previewQualityNote'
          }
        >
          <TextInput
            value={String(config.ui[row.key] ?? '')}
            onChange={(v) => set(`ui.${row.key}`, v)}
          />
        </Field>
      ))}
    </Grid>
  )
}

export function UiEditor() {
  const { config, set, resetSection } = useConfig()
  const samples = config.ui.commentSamples

  return (
    <div className="pt-1">
      <div className="mb-3 rounded-xl border border-copper/25 bg-copper/[0.07] p-3">
        <p className="text-[11.5px] font-semibold text-copper/90">花括号要留着</p>
        <p className="mt-1 text-[10.5px] leading-relaxed text-cream/45">
          像 <span className="font-mono text-cream/70">{'{name}'}</span>、
          <span className="font-mono text-cream/70">{'{distance}'}</span> 是占位符，
          渲染时会替换成真实内容。翻译成英文或阿语时词序会变，靠的就是它 ——
          删掉花括号那一段文字就会丢失。
        </p>
      </div>

      <Section title="全局与导航" defaultOpen onReset={() => resetSection('ui')}>
        <Rows rows={GLOBAL_ROWS} />
        <div className="mt-3">
          <Rows rows={NAV_ROWS} />
        </div>
      </Section>

      <Section title="手机预览" desc="朗读标签与视频操作">
        <Rows rows={FEED_ROWS} />
      </Section>

      <Section title="空状态">
        <Rows rows={EMPTY_ROWS} />
      </Section>

      <Section title="附近的人">
        <Rows rows={NEARBY_ROWS} />
      </Section>

      <Section title="私聊">
        <Rows rows={CHAT_ROWS} />
      </Section>

      <Section title="安装包标签" desc="安装区与下载弹窗共用">
        <Rows rows={META_ROWS} />
      </Section>

      <Section title="示例评论" desc="点评论时弹窗里显示的两条">
        <div className="grid gap-2">
          {samples.map((s, i) => (
            <div key={`${s.name}-${i}`} className="grid gap-1.5 rounded-lg border border-cream/[0.08] p-2">
              <TextInput
                value={s.name}
                onChange={(v) => set(`ui.commentSamples.${i}.name`, v)}
                placeholder="昵称"
              />
              <div className="flex gap-1">
                <TextArea
                  value={s.text}
                  onChange={(v) => set(`ui.commentSamples.${i}.text`, v)}
                  rows={2}
                />
                <button
                  type="button"
                  onClick={() =>
                    set(
                      'ui.commentSamples',
                      samples.filter((_, j) => j !== i),
                    )
                  }
                  className="shrink-0 self-start rounded-md px-2 py-1 text-[11px] text-cream/25 transition hover:bg-red-500/15 hover:text-red-400"
                >
                  删
                </button>
              </div>
            </div>
          ))}
          <AddButton
            onClick={() =>
              set('ui.commentSamples', [...samples, { name: '昵称', text: '一句评论。' }])
            }
            label="添加一条评论"
          />
        </div>
      </Section>
    </div>
  )
}
