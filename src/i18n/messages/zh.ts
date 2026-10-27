import type { DeepPartial } from '../merge'
import type { SiteConfig } from '../../config/store'

/**
 * 中文覆盖层 = 空。
 *
 * 中文就是主库本身（控制台里改的那份），所以这里不需要任何内容。
 * 留着这个文件，是为了让三种语言在代码里长得一样，
 * 将来想临时替换某几句中文，也可以直接写在这里。
 */
export const zh: DeepPartial<SiteConfig> = {}
