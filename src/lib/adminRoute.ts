import { ADMIN_ENTRY } from '../config/admin'

/**
 * 网址 → 控制台。
 *
 * 支持三种写法，全部不区分大小写：
 *   /admin          （路径）
 *   #admin          （哈希，静态托管也能用，不需要服务器重写）
 *   ?admin          （查询参数）
 *
 * 也兼容 /admin/、#/admin、/Admin 这类变体。
 */

const keys = ADMIN_ENTRY.keys.map((k) => k.trim().toLowerCase()).filter(Boolean)

const isKey = (value: string): boolean => keys.includes(value.toLowerCase())

/** 把 "#admin" / "/admin/" / "?admin" 统一成 "admin" */
const normalize = (raw: string): string =>
  raw
    .toLowerCase()
    .replace(/^[#/?]+/, '')
    .replace(/[/?#].*$/, '')
    .trim()

/** 当前网址是否指向控制台 */
export function isAdminRoute(): boolean {
  if (typeof window === 'undefined') return false

  const { pathname, hash, search } = window.location

  const segments = pathname.split('/').filter(Boolean)
  if (segments.some(isKey)) return true

  if (hash && isKey(normalize(hash))) return true

  try {
    const params = new URLSearchParams(search)
    for (const key of Array.from(params.keys())) {
      if (isKey(key)) return true
    }
  } catch {
    /* 查询串异常时忽略 */
  }

  return false
}

/**
 * 退出控制台：把 /admin、#admin、?admin 从地址栏抹掉。
 * 用 replaceState，不产生历史记录，也不会刷新页面。
 */
export function exitAdminRoute() {
  if (typeof window === 'undefined') return

  try {
    const url = new URL(window.location.href)

    const segments = url.pathname.split('/').filter(Boolean).filter((s) => !isKey(s))
    url.pathname = `/${segments.join('/')}`

    const params = new URLSearchParams(url.search)
    for (const key of Array.from(params.keys())) {
      if (isKey(key)) params.delete(key)
    }
    const query = params.toString()
    url.search = query ? `?${query}` : ''

    const hashKey = url.hash ? normalize(url.hash) : ''
    if (hashKey && isKey(hashKey)) url.hash = ''

    window.history.replaceState(null, '', url.toString())
  } catch {
    /* 极端环境下地址栏没改掉也不影响使用 */
  }
}

/** 控制台的直达链接，用来复制发给同事 */
export function adminEntryUrl(): string {
  if (typeof window === 'undefined') return '/admin'
  return `${window.location.origin}/${keys[0] ?? 'admin'}`
}
