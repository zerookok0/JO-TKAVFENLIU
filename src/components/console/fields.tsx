import { useId, type ReactNode } from 'react'
import { ChevronDown, GripVertical, Plus, Trash2 } from 'lucide-react'
import { ICON_LABELS, ICON_NAMES, type IconName } from '../../config/types'
import { Icon } from '../Icon'

/* ───────────────────────── 基础布局 ───────────────────────── */

export function Field({
  label,
  hint,
  children,
  wide,
}: {
  label: string
  hint?: string
  children: ReactNode
  wide?: boolean
}) {
  return (
    <label className={`block ${wide ? 'sm:col-span-2' : ''}`}>
      <span className="mb-1.5 flex items-baseline gap-2">
        <span className="text-[11.5px] font-medium text-cream/70">{label}</span>
        {hint && <span className="truncate text-[10px] text-cream/25">{hint}</span>}
      </span>
      {children}
    </label>
  )
}

export function Grid({ children, cols = 2 }: { children: ReactNode; cols?: 1 | 2 | 3 }) {
  const map = { 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3' }
  return <div className={`grid gap-3 ${map[cols]}`}>{children}</div>
}

export function Section({
  title,
  desc,
  children,
  defaultOpen,
  onReset,
}: {
  title: string
  desc?: string
  children: ReactNode
  defaultOpen?: boolean
  onReset?: () => void
}) {
  return (
    <details open={defaultOpen} className="group border-b border-cream/[0.07] last:border-0">
      <summary className="flex cursor-pointer list-none items-center gap-2 py-3.5">
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-cream/30 transition-transform group-open:rotate-0 -rotate-90" />
        <span className="flex-1">
          <span className="block text-[12.5px] font-semibold text-cream/85">{title}</span>
          {desc && <span className="mt-0.5 block text-[10.5px] leading-relaxed text-cream/30">{desc}</span>}
        </span>
        {onReset && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onReset()
            }}
            className="rounded-md px-2 py-1 text-[10px] text-cream/30 transition hover:bg-cream/10 hover:text-cream/70"
          >
            重置
          </button>
        )}
      </summary>
      <div className="pb-4 pl-5.5">{children}</div>
    </details>
  )
}

/* ───────────────────────── 输入控件 ───────────────────────── */

const inputBase =
  'w-full rounded-lg border border-cream/10 bg-black/30 px-2.5 py-2 text-[12px] text-cream outline-none transition placeholder:text-cream/20 focus:border-copper/50 focus:bg-black/45'

export function TextInput({
  value,
  onChange,
  placeholder,
  mono,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  mono?: boolean
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${inputBase} ${mono ? 'font-mono text-[11px]' : ''}`}
    />
  )
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`${inputBase} resize-y leading-relaxed`}
    />
  )
}

export function NumberInput({
  value,
  onChange,
  step = 1,
  min = 0,
}: {
  value: number
  onChange: (v: number) => void
  step?: number
  min?: number
}) {
  return (
    <input
      type="number"
      value={Number.isFinite(value) ? value : 0}
      step={step}
      min={min}
      onChange={(e) => onChange(Number(e.target.value))}
      className={inputBase}
    />
  )
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-lg border border-cream/10 bg-black/25 px-2.5 py-2 text-left"
    >
      <span className="text-[11.5px] text-cream/70">{label}</span>
      <span
        className={`relative h-4 w-7 shrink-0 rounded-full transition ${
          checked ? 'bg-copper' : 'bg-cream/15'
        }`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${
            checked ? 'left-3.5' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  )
}

export function ColorInput({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const id = useId()
  return (
    <div className="flex items-center gap-2">
      <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-cream/15">
        <input
          id={id}
          type="color"
          value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : '#000000'}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="absolute -inset-2 h-[calc(100%+16px)] w-[calc(100%+16px)] cursor-pointer border-0 bg-transparent p-0"
          aria-label="选择颜色"
        />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBase} font-mono text-[11px] uppercase`}
        spellCheck={false}
      />
    </div>
  )
}

export function IconPicker({
  value,
  onChange,
}: {
  value: IconName
  onChange: (v: IconName) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-wine/30 to-accent/10 text-copper ring-1 ring-white/10">
        <Icon name={value} className="h-4 w-4" />
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as IconName)}
        className={`${inputBase} cursor-pointer appearance-none`}
      >
        {ICON_NAMES.map((n) => (
          <option key={n} value={n} className="bg-[#171719]">
            {ICON_LABELS[n]} · {n}
          </option>
        ))}
      </select>
    </div>
  )
}

/* ───────────────────────── 列表操作 ───────────────────────── */

export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-cream/15 py-2 text-[11px] font-medium text-cream/40 transition hover:border-copper/40 hover:text-copper"
    >
      <Plus className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}

export function ItemCard({
  index,
  title,
  onRemove,
  children,
  canRemove = true,
}: {
  index: number
  title: string
  onRemove: () => void
  children: ReactNode
  canRemove?: boolean
}) {
  return (
    <div className="rounded-xl border border-cream/[0.08] bg-white/[0.02] p-3">
      <div className="mb-2.5 flex items-center gap-1.5">
        <GripVertical className="h-3.5 w-3.5 text-cream/15" />
        <span className="flex-1 truncate text-[11px] font-semibold text-cream/60">
          <span className="mr-1.5 text-cream/25">{String(index + 1).padStart(2, '0')}</span>
          {title || '未命名'}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="删除这一项"
            className="grid h-6 w-6 place-items-center rounded-md text-cream/25 transition hover:bg-red-500/15 hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="grid gap-2.5">{children}</div>
    </div>
  )
}

/** 字符串数组编辑器：一行一个值 */
export function StringList({
  items,
  onChange,
  placeholder,
  addLabel = '添加一行',
}: {
  items: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  addLabel?: string
}) {
  return (
    <div className="grid gap-1.5">
      {items.map((v, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <input
            type="text"
            value={v}
            placeholder={placeholder}
            onChange={(e) => {
              const next = [...items]
              next[i] = e.target.value
              onChange(next)
            }}
            className={inputBase}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            aria-label="删除"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-cream/25 transition hover:bg-red-500/15 hover:text-red-400"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      ))}
      <AddButton onClick={() => onChange([...items, ''])} label={addLabel} />
    </div>
  )
}
