import type { DeepPartial } from '../merge'
import type { SiteConfig } from '../../config/store'

/**
 * 阿语覆盖层 —— 现在是空的。
 *
 * 为什么空了：主库（src/config/defaults.ts）本身已经全部写成约旦阿拉伯语。
 * 覆盖层的作用是「盖在主库上」，它一旦写了内容，就会盖住你在控制台里的修改 ——
 * 改了文案却看不到变化，问题就出在这。
 *
 * 现在只有两个来源：
 *   主库（阿语）  ← 控制台编辑的就是它
 *   英文覆盖层    ← 只换文字，不动结构
 *
 * 将来若想给阿语单独换某几句（比如节日活动文案），
 * 仍然可以往下面写，规则不变：只写要覆盖的字段。
 */
export const ar: DeepPartial<SiteConfig> = {}
