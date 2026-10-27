import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Check, Loader2, Mail } from 'lucide-react'
import { useConfig } from '../config/store'
import { detectCountry, isLanguageBlocked, isMobileDevice } from '../lib/geo'
import { fill, safeImageUrl } from '../lib/format'

type Verdict = 'checking' | 'allow' | 'deny'

/**
 * 地区分流门。
 *
 * 包裹在公开页面（Site）外面，三道检查全过才给看正常落地页：
 *   国家    命中 countries 列表（多源兜底检测，失败按 onError 处理）
 *   设备    mobileOnly 开启时，电脑访客直接拦住
 *   语言    界面语言命中 blockLanguages 的访客拦住
 *
 * 任一不满足 → 品牌介绍页（没有下载按钮、没有任何埋点）。
 * 检测中显示极简加载画面，不渲染真实内容，避免闪一下再跳走。
 *
 * 开关没开（config.geo.enabled = false）时不发任何请求，
 * 行为和没装这个功能完全一样。
 *
 * 控制台（/admin）不经过这扇门 —— App.tsx 里 Console 在 GeoGate 之外。
 *
 * 预览：?geo=US 指定国家、?device=desktop 指定电脑、?lang=zh 指定语言，
 * 三个参数可叠加。
 */
export function GeoGate({ children }: { children: ReactNode }) {
  const { config } = useConfig()
  const geo = config.geo
  const [verdict, setVerdict] = useState<Verdict>(() =>
    geo.enabled ? 'checking' : 'allow',
  )

  useEffect(() => {
    if (!geo.enabled) {
      setVerdict('allow')
      return
    }

    let cancelled = false
    setVerdict('checking')

    detectCountry().then((country) => {
      if (cancelled) return

      /* 国家：查出来了按列表判定；所有源都失败 → onError 决定这一环过不过 */
      const countryOk =
        country === null ? geo.onError !== 'deny' : geo.countries.includes(country)

      /* 设备、语言是本机判断，永远有结果，不受 IP 源故障影响 */
      const deviceOk = !geo.mobileOnly || isMobileDevice()
      const languageOk = !isLanguageBlocked(geo.blockLanguages)

      setVerdict(countryOk && deviceOk && languageOk ? 'allow' : 'deny')
    })

    return () => {
      cancelled = true
    }
  }, [geo])

  if (verdict === 'checking') {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-ink text-cream/50"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
      </div>
    )
  }

  if (verdict === 'deny') {
    return <GeoBrandPage />
  }

  return <>{children}</>
}

/**
 * 品牌介绍页 —— 非目标访客看到的唯一内容。
 *
 * 真实展示品牌信息（名字 / 标语 / 图标都读 brand 配置），
 * 没有下载按钮、没有任何埋点；访客可以订阅品牌通讯邮箱，
 * 之后收到新闻和更新。
 *
 * 静态站没有后端：提交后唤起访客自己的邮件客户端，
 * 把订阅请求写给品牌联系邮箱（控制台「品牌」里那个），
 * 同时页面切换成感谢状态。想让表单直连数据库/邮件服务，
 * 以后在 submit 里换实现即可，配置结构不用动。
 */
function GeoBrandPage() {
  const { config } = useConfig()
  const { geo, brand } = config
  const page = geo.page
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (page.docTitle) document.title = page.docTitle
  }, [page.docTitle])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const address = email.trim()
    if (!address.includes('@')) return

    const to = brand.email.trim()
    if (to.includes('@')) {
      const subject = `اشتراك في النشرة البريدية — ${brand.name}`
      const body = [
        'مرحبًا،',
        '',
        `أرغب في الاشتراك في نشرة ${brand.name} البريدية لمتابعة الأخبار والتحديثات.`,
        '',
        `بريدي الإلكتروني: ${address}`,
        '',
        'شكرًا لكم.',
      ].join('\n')
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`
    }

    setSent(true)
  }

  const iconUrl = safeImageUrl(brand.iconUrl)

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-5 py-16 text-cream">
      {/* 一点和主站同风格的氛围光，避免整页白花花显得突兀 */}
      <div
        className="animate-breathe pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-wine/20 blur-[120px]"
        aria-hidden="true"
      />

      <main className="relative w-full max-w-lg text-center">
        {/* 品牌标识：直接读配置里的真实品牌信息 */}
        {iconUrl ? (
          <img
            src={iconUrl}
            alt=""
            className="mx-auto mb-5 h-16 w-16 rounded-2xl border border-cream/10 object-cover"
          />
        ) : null}
        <p className="eyebrow">{brand.tagline}</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
          {fill(page.title, { name: brand.name })}
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[15px] text-cream/70">
          {fill(page.intro, { name: brand.name })}
        </p>

        <div className="hairline mx-auto mt-10 max-w-[260px]" aria-hidden="true" />

        {sent ? (
          /* 感谢状态：替换整个表单，避免重复提交 */
          <div className="mx-auto mt-10 max-w-md">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-copper/30 bg-copper/10">
              <Check className="h-6 w-6 text-copper" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold">{page.sentTitle}</h2>
            <p className="mt-3 text-sm text-cream/60">
              {fill(page.sentBody, { email: brand.email })}
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mx-auto mt-10 max-w-md text-start">
            <label htmlFor="geo-email" className="block text-sm font-semibold">
              <Mail className="me-2 inline h-4 w-4 text-copper" aria-hidden="true" />
              {page.formTitle}
            </label>
            {/*
              邮箱地址是拉丁字符，在 RTL 页面里必须强制 LTR，
              否则 @ 前后的顺序看起来是反的。
            */}
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                id="geo-email"
                type="email"
                required
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={page.formPlaceholder}
                className="w-full flex-1 rounded-2xl border border-cream/15 bg-cream/[0.04] px-4 py-3.5 text-sm text-cream placeholder:text-cream/30 focus:border-copper/60 focus:outline-none"
              />
              <button type="submit" className="btn-brand shrink-0 justify-center">
                {page.formButton}
              </button>
            </div>
            <p className="mt-3 text-xs text-cream/40">{page.formNote}</p>
          </form>
        )}

        <p className="mt-14 text-xs text-cream/35">{page.footnote}</p>
      </main>
    </div>
  )
}
