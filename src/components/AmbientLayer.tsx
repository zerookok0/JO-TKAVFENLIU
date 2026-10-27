import { Ambient, ScrollRail, useElementProgress } from './Ambient'

/**
 * 滚动背景层。
 *
 * 为什么要单独抽出来：
 *
 * 之前 progress 是在 Site 里算的，而进度几乎每次滚动都变 ——
 * 结果整个页面（Hero、附近、聊天、安装…）跟着一起重渲染，
 * 滑动的每一帧都在做无用功。模糊光斑尤其贵。
 *
 * 现在把进度收进这个小组件：滚动只重渲染这一层，
 * 页面主体完全不动。视觉一样，开销小一个数量级。
 */
export function AmbientLayer() {
  const { ref, progress } = useElementProgress<HTMLDivElement>()

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <Ambient progress={progress} active={0} />
      <ScrollRail progress={progress} />
    </div>
  )
}
