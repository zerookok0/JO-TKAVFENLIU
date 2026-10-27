/**
 * ════════════════════════════════════════════════════════════════
 *  内容版本号  ·  换语言 / 大改文案时 +1
 * ════════════════════════════════════════════════════════════════
 *
 *  为什么需要这个东西：
 *  控制台把所有编辑都存进浏览器的 localStorage。一旦文案大改
 *  （比如从中文母版换成阿拉伯语，或删掉英文层），
 *  老访客的浏览器里还压着旧数据 —— 他们打开页面看到的仍是旧文案，
 *  看起来就像「改了没生效」。
 *
 *  改这个版本号，等于给所有本机缓存换了一把钥匙：
 *  旧键读不到，直接落到仓库里的正式内容。
 *
 *  ⚠️ 这个值只允许往上加，不要改回去。
 */

export const CONTENT_VERSION = 6

/** 本机存储的键名。版本号并进去，旧键自然失效 */
export const STORAGE_KEYS = {
  saved: `nightyle.${CONTENT_VERSION}.saved`,
  draft: `nightyle.${CONTENT_VERSION}.draft`,
  /** 仓库正式内容的指纹，用来判断部署后要不要清本机覆盖 */
  baseSig: `nightyle.${CONTENT_VERSION}.basesig`,
} as const

/**
 * 以前用过的键。启动时清一遍，避免占着几 MB 的 localStorage。
 * 注意：只清不读 —— 旧数据是中文母版和英文覆盖层，留着只会串味。
 */
export const LEGACY_KEYS = [
  'nightyle.config.v1',
  'nightyle.config.draft.v1',
  'nightyle.config.basesig.v1',
  'nightyle.locale.v1',
  /* 第 3 版时期的本机覆盖：里面压着旧视频，留着只会把人拉回旧内容 */
  'nightyle.3.saved',
  'nightyle.3.draft',
  'nightyle.3.basesig',
]
