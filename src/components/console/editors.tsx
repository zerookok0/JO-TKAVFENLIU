import { Plus } from 'lucide-react'
import { useConfig } from '../../config/store'
import { uid } from '../../lib/format'
import {
  AddButton,
  ColorInput,
  Field,
  Grid,
  IconPicker,
  ItemCard,
  NumberInput,
  Section,
  StringList,
  TextArea,
  TextInput,
  Toggle,
} from './fields'
import { VideosSection } from './VideosSection'

/* ══════════════════════ 品牌 ══════════════════════ */

export function BrandEditor() {
  const { config, set, resetSection } = useConfig()
  const b = config.brand

  return (
    <div className="pt-1">
      <Section title="品牌信息" desc="名字、图标、页签标题" defaultOpen onReset={() => resetSection('brand')}>
        <Grid cols={2}>
          <Field label="应用名称">
            <TextInput value={b.name} onChange={(v) => set('brand.name', v)} placeholder="NITE BANANA" />
          </Field>
          <Field label="副标题">
            <TextInput value={b.tagline} onChange={(v) => set('brand.tagline', v)} />
          </Field>
          <Field label="应用图标 URL" hint="留空显示占位" wide>
            <TextInput
              value={b.iconUrl}
              onChange={(v) => set('brand.iconUrl', v)}
              placeholder="https://…/icon.png"
              mono
            />
          </Field>
          {b.iconUrl && (
            <div className="flex items-center gap-3 sm:col-span-2">
              <img
                src={b.iconUrl}
                alt="图标预览"
                className="h-12 w-12 rounded-xl object-cover ring-1 ring-white/15"
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).style.opacity = '0.2'
                }}
              />
              <span className="text-[10px] text-cream/30">图标预览 · 加载失败会变暗</span>
            </div>
          )}
          <Field label="页签标题" wide>
            <TextInput value={b.docTitle} onChange={(v) => set('brand.docTitle', v)} />
          </Field>
          <Field label="页面描述（SEO）" wide>
            <TextArea
              value={b.docDescription}
              onChange={(v) => set('brand.docDescription', v)}
              rows={3}
            />
          </Field>
          <Field label="联系邮箱">
            <TextInput value={b.email} onChange={(v) => set('brand.email', v)} mono />
          </Field>
          <Field label="版权文案">
            <TextInput value={b.copyright} onChange={(v) => set('brand.copyright', v)} />
          </Field>
        </Grid>
      </Section>

      <Section title="下载与埋点" desc="APK 直链、版本信息、Facebook Pixel">
        <Grid cols={2}>
          <Field label="APK 下载直链" wide>
            <TextInput
              value={config.download.apkUrl}
              onChange={(v) => set('download.apkUrl', v)}
              placeholder="https://…/app.apk"
              mono
            />
          </Field>
          <Field label="版本号">
            <TextInput value={config.download.version} onChange={(v) => set('download.version', v)} />
          </Field>
          <Field label="安装包大小">
            <TextInput value={config.download.size} onChange={(v) => set('download.size', v)} />
          </Field>
          <Field label="最低系统">
            <TextInput
              value={config.download.minAndroid}
              onChange={(v) => set('download.minAndroid', v)}
            />
          </Field>
          <Field label="Pixel ID" hint="留空不加载">
            <TextInput
              value={config.download.pixelId}
              onChange={(v) => set('download.pixelId', v)}
              placeholder="1234567890"
              mono
            />
          </Field>
        </Grid>
        <p className="mt-2 text-[10px] leading-relaxed text-cream/25">
          填了 Pixel 后：所有「下载」入口上报 InitiateCheckout，弹窗内确认按钮上报 Purchase。
        </p>
      </Section>

      <Section title="导航" desc="顶部菜单项">
        <div className="grid gap-2">
          {config.nav.map((item, i) => (
            <ItemCard
              key={item.id}
              index={i}
              title={item.label}
              canRemove={config.nav.length > 1}
              onRemove={() => set('nav', config.nav.filter((n) => n.id !== item.id))}
            >
              <Grid cols={2}>
                <Field label="文字">
                  <TextInput
                    value={item.label}
                    onChange={(v) => set(`nav.${i}.label`, v)}
                  />
                </Field>
                <Field label="锚点">
                  <TextInput
                    value={item.href}
                    onChange={(v) => set(`nav.${i}.href`, v)}
                    mono
                  />
                </Field>
              </Grid>
            </ItemCard>
          ))}
          <AddButton
            onClick={() =>
              set('nav', [...config.nav, { id: uid('nav'), label: '新菜单', href: '#top' }])
            }
            label="添加导航项"
          />
        </div>
      </Section>

      <Section title="按钮文案" desc="全站所有按钮文字">
        <Grid cols={2}>
          {(
            [
              ['headerCta', '顶部下载按钮'],
              ['heroCta', '首屏主按钮'],
              ['heroSecondary', '首屏次按钮'],
              ['dockCta', '手机底栏按钮'],
              ['installCta', '安装区按钮'],
              ['phoneEndCta', '手机结尾按钮'],
              ['phoneEndTitle', '手机结尾标题'],
              ['phoneEndBody', '手机结尾说明'],
              ['modalCancel', '弹窗取消'],
              ['modalConfirm', '弹窗确认'],
            ] as const
          ).map(([key, label]) => (
            <Field key={key} label={label} wide={key === 'phoneEndBody'}>
              <TextInput
                value={config.buttons[key]}
                onChange={(v) => set(`buttons.${key}`, v)}
              />
            </Field>
          ))}
        </Grid>
      </Section>
    </div>
  )
}

/* ══════════════════════ 配色 ══════════════════════ */

const THEME_ROWS: { key: keyof import('../../config/defaults').ThemeConfig; label: string }[] = [
  { key: 'bg', label: '页面背景' },
  { key: 'surface', label: '卡片底色' },
  { key: 'text', label: '主要文字' },
  { key: 'muted', label: '次要文字' },
  { key: 'wine', label: '主色（酒红）' },
  { key: 'copper', label: '点缀（铜金）' },
  { key: 'blush', label: '高亮（胭脂）' },
]

export function ThemeEditor() {
  const { config, set, resetSection } = useConfig()

  return (
    <div className="pt-1">
      <Section title="主题配色" desc="改完立刻作用到整站" defaultOpen onReset={() => resetSection('theme')}>
        <div className="grid gap-2.5">
          {THEME_ROWS.map((row) => (
            <div key={row.key} className="grid grid-cols-[86px_1fr] items-center gap-2">
              <span className="text-[11px] text-cream/60">{row.label}</span>
              <ColorInput
                value={config.theme[row.key]}
                onChange={(v) => set(`theme.${row.key}`, v)}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="实时预览" defaultOpen>
        <div className="grid gap-2">
          <div className="rounded-xl border border-cream/10 p-3" style={{ background: 'var(--c-surface)' }}>
            <p className="text-[12px] font-semibold" style={{ color: 'var(--c-text)' }}>
              卡片里的标题
            </p>
            <p className="mt-1 text-[10.5px]" style={{ color: 'var(--c-muted)' }}>
              次要说明文字，用来看对比度是否够。
            </p>
          </div>
          <div className="flex gap-1.5">
            {(['wine', 'copper', 'blush'] as const).map((k) => (
              <span
                key={k}
                className="h-8 flex-1 rounded-lg"
                style={{ background: `var(--c-${k})` }}
                title={k}
              />
            ))}
          </div>
          <button
            type="button"
            className="rounded-xl py-2.5 text-[11.5px] font-bold"
            style={{
              background: 'linear-gradient(90deg, var(--c-wine), var(--c-copper), var(--c-blush))',
              color: '#fff',
            }}
          >
            按钮渐变示例
          </button>
        </div>
      </Section>
    </div>
  )
}

/* ══════════════════════ 首屏 ══════════════════════ */

export function HeroEditor() {
  const { config, set, resetSection } = useConfig()
  const hero = config.hero

  return (
    <div className="pt-1">
      <Section title="首屏轮播文案" desc="最多两三条最耐看" defaultOpen onReset={() => resetSection('heroSlides')}>
        <div className="grid gap-2">
          {config.heroSlides.map((s, i) => (
            <ItemCard
              key={s.id}
              index={i}
              title={s.title}
              canRemove={config.heroSlides.length > 1}
              onRemove={() => set('heroSlides', config.heroSlides.filter((x) => x.id !== s.id))}
            >
              <Field label="小标签">
                <TextInput value={s.kicker} onChange={(v) => set(`heroSlides.${i}.kicker`, v)} />
              </Field>
              <Field label="大标题">
                <TextArea value={s.title} onChange={(v) => set(`heroSlides.${i}.title`, v)} rows={2} />
              </Field>
              <Field label="副标题">
                <TextArea value={s.sub} onChange={(v) => set(`heroSlides.${i}.sub`, v)} rows={2} />
              </Field>
            </ItemCard>
          ))}
          <AddButton
            onClick={() =>
              set('heroSlides', [
                ...config.heroSlides,
                { id: uid('hero'), kicker: '18+ · 此刻', title: '新的标题', sub: '新的副标题' },
              ])
            }
            label="添加一条轮播"
          />
        </div>
      </Section>

      <Section title="状态条与提示" onReset={() => resetSection('hero')}>
        <Grid cols={2}>
          <Field label="前缀">
            <TextInput value={hero.statusPre} onChange={(v) => set('hero.statusPre', v)} />
          </Field>
          <Field label="中段">
            <TextInput value={hero.statusMid} onChange={(v) => set('hero.statusMid', v)} />
          </Field>
          <Field label="人数">
            <TextInput value={hero.statusCount} onChange={(v) => set('hero.statusCount', v)} />
          </Field>
          <Field label="后缀" wide>
            <TextInput value={hero.statusPost} onChange={(v) => set('hero.statusPost', v)} />
          </Field>
        </Grid>

        <p className="mt-2 rounded-lg border border-copper/20 bg-copper/[0.06] px-2.5 py-2 text-[10px] leading-relaxed text-cream/45">
          中间那串时间是<strong className="font-semibold text-cream/70">实时本地时钟</strong>，
          首屏状态条和手机状态栏读同一份快照，永远同一分钟。不需要也不能手填 —— 访客几点看到就是几点。
        </p>

        <div className="mt-3">
          <Field label="信任行标签">
            <StringList
              items={hero.trusted}
              onChange={(v) => set('hero.trusted', v)}
              addLabel="添加标签"
            />
          </Field>
        </div>

        <div className="mt-3">
          <Field label="手机内标签页">
            <StringList items={hero.tabs} onChange={(v) => set('hero.tabs', v)} addLabel="添加标签页" />
          </Field>
        </div>

        <div className="mt-3 grid gap-2.5">
          <Field label="底部小字">
            <TextArea value={hero.note} onChange={(v) => set('hero.note', v)} rows={2} />
          </Field>
          <Grid cols={2}>
            <Field label="滑动提示">
              <TextInput value={hero.swipeHint} onChange={(v) => set('hero.swipeHint', v)} />
            </Field>
            <Field label="年龄角标">
              <TextInput value={hero.badge18} onChange={(v) => set('hero.badge18', v)} />
            </Field>
          </Grid>
        </div>

        <p className="mt-2 rounded-lg border border-copper/20 bg-copper/[0.06] px-2.5 py-2 text-[10px] leading-relaxed text-cream/45">
          首屏右边手机框里上下滑的那几条短视频，就在下面「手机里的短视频」里换 ——
          改完立刻能在手机里看到效果，不用切到别的标签。
        </p>
      </Section>

      {/* 手机框内的短视频：和「手机视频」标签是同一份数据 */}
      <VideosSection />
    </div>
  )
}

/* ══════════════════════ 亮点 ══════════════════════ */

export function HighlightsEditor() {
  const { config, set, resetSection } = useConfig()
  const copy = config.highlightsCopy

  return (
    <div className="pt-1">
      <Section title="区块标题" defaultOpen onReset={() => resetSection('highlightsCopy')}>
        <Grid cols={2}>
          <Field label="小标签" wide>
            <TextInput value={copy.eyebrow} onChange={(v) => set('highlightsCopy.eyebrow', v)} />
          </Field>
          <Field label="标题前缀">
            <TextInput value={copy.title} onChange={(v) => set('highlightsCopy.title', v)} />
          </Field>
          <Field label="渐变高亮">
            <TextInput
              value={copy.titleHighlight}
              onChange={(v) => set('highlightsCopy.titleHighlight', v)}
            />
          </Field>
          <Field label="标题后缀" wide>
            <TextInput value={copy.titleTail} onChange={(v) => set('highlightsCopy.titleTail', v)} />
          </Field>
          <Field label="说明" wide>
            <TextArea value={copy.sub} onChange={(v) => set('highlightsCopy.sub', v)} rows={2} />
          </Field>
        </Grid>
      </Section>

      <Section title="卡片列表" desc="勾选「大卡」会占整行" defaultOpen onReset={() => resetSection('highlights')}>
        <div className="grid gap-2">
          {config.highlights.map((h, i) => (
            <ItemCard
              key={h.id}
              index={i}
              title={h.title}
              canRemove={config.highlights.length > 1}
              onRemove={() => set('highlights', config.highlights.filter((x) => x.id !== h.id))}
            >
              <Field label="图标">
                <IconPicker value={h.icon} onChange={(v) => set(`highlights.${i}.icon`, v)} />
              </Field>
              <Field label="标题">
                <TextInput value={h.title} onChange={(v) => set(`highlights.${i}.title`, v)} />
              </Field>
              <Field label="正文">
                <TextArea value={h.body} onChange={(v) => set(`highlights.${i}.body`, v)} rows={2} />
              </Field>
              <Toggle
                checked={Boolean(h.featured)}
                label="作为大卡展示"
                onChange={(v) => set(`highlights.${i}.featured`, v)}
              />
            </ItemCard>
          ))}
          <AddButton
            onClick={() =>
              set('highlights', [
                ...config.highlights,
                { id: uid('hl'), icon: 'sparkles', title: '新亮点', body: '一句话说明。' },
              ])
            }
            label="添加亮点"
          />
        </div>
      </Section>

      <Section title="大卡细节" onReset={() => resetSection('highlightsCopy')}>
        <Grid cols={2}>
          <Field label="角标">
            <TextInput
              value={copy.featured.badge}
              onChange={(v) => set('highlightsCopy.featured.badge', v)}
            />
          </Field>
          <Field label="仪表标题">
            <TextInput
              value={copy.featured.meterTitle}
              onChange={(v) => set('highlightsCopy.featured.meterTitle', v)}
            />
          </Field>
          <Field label="仪表状态">
            <TextInput
              value={copy.featured.meterStatus}
              onChange={(v) => set('highlightsCopy.featured.meterStatus', v)}
            />
          </Field>
        </Grid>
        <div className="mt-3 grid gap-3">
          <Field label="要点列表">
            <StringList
              items={copy.featured.points}
              onChange={(v) => set('highlightsCopy.featured.points', v)}
              addLabel="添加要点"
            />
          </Field>
          <Field label="变声档位">
            <StringList
              items={copy.featured.meterOptions}
              onChange={(v) => set('highlightsCopy.featured.meterOptions', v)}
              addLabel="添加档位"
            />
          </Field>
        </div>
      </Section>
    </div>
  )
}

/* ══════════════════════ 附近 ══════════════════════ */

export function NearbyEditor() {
  const { config, set, resetSection } = useConfig()
  const copy = config.nearbyCopy

  return (
    <div className="pt-1">
      <Section title="区块文案" defaultOpen onReset={() => resetSection('nearbyCopy')}>
        <div className="grid gap-2.5">
          <Field label="小标签">
            <TextInput value={copy.eyebrow} onChange={(v) => set('nearbyCopy.eyebrow', v)} />
          </Field>
          <Field label="标题">
            <TextInput value={copy.title} onChange={(v) => set('nearbyCopy.title', v)} />
          </Field>
          <Field label="说明">
            <TextArea value={copy.sub} onChange={(v) => set('nearbyCopy.sub', v)} rows={2} />
          </Field>
          <Grid cols={2}>
            <Field label="在线提示">
              <TextInput value={copy.liveNote} onChange={(v) => set('nearbyCopy.liveNote', v)} />
            </Field>
            <Field label="在线标签">
              <TextInput value={copy.onlineLabel} onChange={(v) => set('nearbyCopy.onlineLabel', v)} />
            </Field>
            <Field label="离线标签">
              <TextInput value={copy.recentLabel} onChange={(v) => set('nearbyCopy.recentLabel', v)} />
            </Field>
          </Grid>
          <Field label="底部小字">
            <TextArea value={copy.footnote} onChange={(v) => set('nearbyCopy.footnote', v)} rows={2} />
          </Field>
        </div>
      </Section>

      <Section title="头像锁定" desc="网页上一律模糊，下载 App 才能看清" defaultOpen onReset={() => resetSection('nearbyCopy')}>
        <Grid cols={2}>
          <Field label="锁定标题">
            <TextInput value={copy.blurTitle} onChange={(v) => set('nearbyCopy.blurTitle', v)} />
          </Field>
          <Field label="解锁按钮">
            <TextInput value={copy.blurCta} onChange={(v) => set('nearbyCopy.blurCta', v)} />
          </Field>
          <Field label="模糊强度（px）" hint="0 = 关闭模糊，恢复原图" wide>
            <NumberInput
              value={copy.blurPx}
              step={2}
              onChange={(v) => set('nearbyCopy.blurPx', v)}
            />
          </Field>
          <Field label="锁定说明" wide>
            <TextArea
              value={copy.blurBody}
              onChange={(v) => set('nearbyCopy.blurBody', v)}
              rows={2}
            />
          </Field>
        </Grid>
        <p className="mt-2 rounded-lg border border-copper/20 bg-copper/[0.06] px-2.5 py-2 text-[10px] leading-relaxed text-cream/45">
          调一调这个数值：<strong className="font-semibold text-cream/70">太轻等于没锁，太重就是一块色块</strong>。
          推荐 18–30 —— 看得出是个人，但认不出是谁。
        </p>
      </Section>

      <Section title="真人卡片" desc="每张卡：距离 + 此刻 + 一句原话" defaultOpen onReset={() => resetSection('people')}>
        <div className="grid gap-2">
          {config.people.map((p, i) => (
            <ItemCard
              key={p.id}
              index={i}
              title={p.name}
              canRemove={config.people.length > 1}
              onRemove={() => set('people', config.people.filter((x) => x.id !== p.id))}
            >
              {p.avatar && (
                <img
                  src={p.avatar}
                  alt=""
                  className="h-24 w-full rounded-lg object-cover"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).style.opacity = '0.15'
                  }}
                />
              )}
              <Field label="头像 URL">
                <TextInput value={p.avatar} onChange={(v) => set(`people.${i}.avatar`, v)} mono />
              </Field>
              <Grid cols={2}>
                <Field label="名字">
                  <TextInput value={p.name} onChange={(v) => set(`people.${i}.name`, v)} />
                </Field>
                <Field label="年龄">
                  <NumberInput value={p.age} onChange={(v) => set(`people.${i}.age`, v)} />
                </Field>
                <Field label="距离（米）">
                  <NumberInput value={p.meters} onChange={(v) => set(`people.${i}.meters`, v)} step={50} />
                </Field>
                <Field label="状态">
                  <Toggle
                    checked={p.live}
                    label={p.live ? '在线' : '刚刚'}
                    onChange={(v) => set(`people.${i}.live`, v)}
                  />
                </Field>
              </Grid>
              <Field label="此刻在做什么">
                <TextInput value={p.now} onChange={(v) => set(`people.${i}.now`, v)} />
              </Field>
              <Field label="她说的话">
                <TextArea value={p.quote} onChange={(v) => set(`people.${i}.quote`, v)} rows={2} />
              </Field>
              <Field label="标签">
                <StringList
                  items={p.tags}
                  onChange={(v) => set(`people.${i}.tags`, v)}
                  addLabel="添加标签"
                />
              </Field>
            </ItemCard>
          ))}
          <AddButton
            onClick={() =>
              set('people', [
                ...config.people,
                {
                  id: uid('p'),
                  name: '新的人',
                  age: 24,
                  meters: 500,
                  now: '此刻在做什么',
                  quote: '一句她说的话。',
                  avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400&h=520&fit=crop',
                  live: true,
                  tags: ['附近'],
                },
              ])
            }
            label="添加一张卡片"
          />
        </div>
      </Section>

      <div className="mt-3 flex items-center gap-2 rounded-xl border border-cream/[0.08] bg-white/[0.02] px-3 py-2.5 text-[10px] text-cream/30">
        <Plus className="h-3 w-3 shrink-0" />
        图片建议用 Pexels 直链，宽高比 4:5 最贴合卡片。
      </div>
    </div>
  )
}
