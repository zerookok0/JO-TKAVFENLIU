/**
 * 覆盖层合并。
 *
 * 规则很简单，但每条都有原因：
 *
 *  1. 数组里带 id 的 → 按 id 对齐
 *     翻译可以只写一半、也可以乱序，甚至某个人的名字保持中文不翻。
 *     这样加一条新卡片时，英文版不会整体错位。
 *
 *  2. 数组里没 id 的 → 按索引对齐
 *     比如「变声器三个档位」「弹窗三条排错」，位置本身就是语义。
 *
 *  3. 对象 → 只覆盖出现的键
 *     所以英文文件可以只写「和中文不一样的那几句」。
 *
 *  4. 类型不一致 → 保留中文
 *     防止手滑把数字写成字符串把页面搞崩。
 */

type Plain = Record<string, unknown>

const isPlain = (v: unknown): v is Plain =>
  !!v && typeof v === 'object' && !Array.isArray(v)

const hasId = (v: unknown): v is Plain & { id: string } =>
  isPlain(v) && typeof v.id === 'string' && v.id.length > 0

export function applyLocale<T>(base: T, patch: unknown): T {
  if (patch === undefined || patch === null) return base

  /* ── 数组 ── */
  if (Array.isArray(base)) {
    if (!Array.isArray(patch)) return base

    const idPatches = patch.filter(hasId)

    if (idPatches.length) {
      const byId = new Map<string, unknown>()
      for (const p of idPatches) byId.set(p.id, p)

      const merged = base.map((item) =>
        hasId(item) && byId.has(item.id)
          ? applyLocale(item, byId.get(item.id))
          : item,
      )

      // 覆盖层里出现了主库没有的 id：当成新增项挂在末尾
      const baseIds = new Set(base.filter(hasId).map((i) => i.id))
      for (const p of idPatches) {
        if (!baseIds.has(p.id)) merged.push(p as never)
      }

      return merged as unknown as T
    }

    // 没有 id：按位置对齐
    return base.map((item, i) => applyLocale(item, patch[i])) as unknown as T
  }

  /* ── 对象 ── */
  if (isPlain(base)) {
    if (!isPlain(patch)) return base
    const out: Plain = { ...base }
    for (const [key, value] of Object.entries(patch)) {
      out[key] = key in out ? applyLocale((base as Plain)[key], value) : value
    }
    return out as T
  }

  /* ── 原始值 ── */
  if (typeof patch !== typeof base) return base
  return patch as T
}

/** 覆盖层的类型：任意深度，随便漏写 */
export type DeepPartial<T> = T extends (infer U)[]
  ? DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T
