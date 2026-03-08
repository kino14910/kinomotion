<script>
  import Lenis from 'lenis'
  import { untrack } from 'svelte'

  let { minThumbHeight = 40, hoverToShow = false } = $props()

  // --- 状态 ---
  let scrollProgress = $state(0)
  let containerHeight = $state(0)
  let contentHeight = $state(0)
  let isDragging = $state(false)
  let isHovered = $state(false)

  let lenis = $state(null)
  let dragStart = { y: 0, progress: 0 }

  // --- 派生计算 ---
  let heightRatio = $derived(
    contentHeight > 0 ? containerHeight / contentHeight : 1,
  )

  let thumbHeight = $derived(
    Math.max(minThumbHeight, heightRatio * containerHeight),
  )

  // 滑块可移动的总空间（容器高度 - 滑块高度）
  let trackSpace = $derived(containerHeight - thumbHeight)

  let thumbTop = $derived(scrollProgress * trackSpace)

  let hideTrack = $derived(heightRatio >= 1)

  $effect(() => {
    // 1. 初始化 Lenis
    const lenisInstance = new Lenis({
      autoRaf: true,
      smoothWheel: true,
    })

    lenisInstance.on('scroll', e => {
      untrack(() => {
        scrollProgress = e.progress
        window.scrollProgress = e.progress
        window.scrollY = e.scroll
      })
    })

    // 2. 监测高度变化
    const resizeObserver = new ResizeObserver(() => {
      untrack(() => {
        containerHeight = window.innerHeight
        contentHeight = document.body.scrollHeight
        window.maxScrollTop = contentHeight - containerHeight
      })
    })

    resizeObserver.observe(document.body)
    lenis = lenisInstance
    window.lenis = lenisInstance

    return () => {
      lenisInstance.destroy()
      resizeObserver.disconnect()
      window.lenis = null
    }
  })

  // --- 交互逻辑 ---

  // 点击滑道跳转
  function onTrackMouseDown(e) {
    // 如果点击的是滑块本身，则交给 onDragStart 处理
    if (e.target.classList.contains('thumb')) return

    const clickY = e.clientY
    // 计算目标进度，使滑块中心对齐点击位置
    const targetProgress = (clickY - thumbHeight / 2) / trackSpace
    const clampedProgress = Math.max(0, Math.min(1, targetProgress))

    // 触发平滑滚动
    lenis?.scrollTo(clampedProgress * (contentHeight - containerHeight))
  }

  function onDragStart(e) {
    isDragging = true
    const clientY = e.clientY || e.touches?.[0].clientY
    dragStart.y = clientY
    dragStart.progress = scrollProgress
    // 阻止冒泡，防止触发 track 的点击事件
    e.stopPropagation()
    e.preventDefault()
  }

  function handleGlobalMove(e) {
    if (!isDragging || !lenis) return
    const clientY = e.clientY || e.touches?.[0].clientY

    const deltaY = clientY - dragStart.y
    const progressDelta = deltaY / trackSpace

    let targetProgress = dragStart.progress + progressDelta
    targetProgress = Math.max(0, Math.min(1, targetProgress))

    // 拖拽时使用 immediate 保证物理对齐
    const targetScroll = targetProgress * (contentHeight - containerHeight)
    lenis.scrollTo(targetScroll, { immediate: true })

    scrollProgress = targetProgress
  }

  function handleGlobalUp() {
    isDragging = false
  }
</script>

<svelte:window
  onmousemove={handleGlobalMove}
  onmouseup={handleGlobalUp}
  ontouchmove={handleGlobalMove}
  ontouchend={handleGlobalUp}
/>

<div
  class="track-container"
  class:is-dragging={isDragging}
  class:is-hovered={isHovered}
  class:hover-show={hoverToShow}
  class:hide={hideTrack}
  onmouseenter={() => (isHovered = true)}
  onmouseleave={() => (isHovered = false)}
  onmousedown={onTrackMouseDown}
  role="scrollbar"
  aria-controls="content"
  aria-valuenow={scrollProgress * 100}
>
  <div class="track">
    <div
      class="thumb"
      onmousedown={onDragStart}
      ontouchstart={onDragStart}
      style="height: {thumbHeight}px; transform: translateY({thumbTop}px);"
      role="slider"
      aria-valuenow={scrollProgress * 100}
      tabindex="-1"
    ></div>
  </div>
</div>

<style>
  .track-container {
    --scrollbar-width: 16px;
    --thumb-bg: #888;
    --thumb-bg-active: #555;

    position: fixed;
    right: 0;
    top: 0;
    height: 100vh;
    width: var(--scrollbar-width);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    background: transparent;
    transition:
      background 0.2s,
      opacity 0.3s;
    user-select: none;
  }

  .track-container.is-hovered,
  .track-container.is-dragging {
    background: rgba(0, 0, 0, 0.05);
  }

  .hover-show {
    opacity: 0;
  }
  .track-container:hover,
  .is-dragging {
    opacity: 1;
  }

  .track {
    flex: 1;
    position: relative;
    width: 100%;
  }

  .thumb {
    position: absolute;
    left: 4px;
    width: 8px;
    background: var(--thumb-bg);
    border-radius: 10px;
    cursor: grab;
    will-change: transform;
    transition:
      width 0.15s,
      left 0.15s,
      background 0.15s,
      height 0.15s;
  }

  .track-container:not(.is-dragging) .thumb {
    transition:
      transform 0.2s cubic-bezier(0.23, 1, 0.32, 1),
      width 0.15s,
      left 0.15s,
      background 0.15s;
  }

  .track-container:hover .thumb,
  .is-dragging .thumb {
    width: 12px;
    left: 2px;
    background: var(--thumb-bg-active);
  }

  .is-dragging .thumb {
    cursor: grabbing;
  }

  .hide {
    display: none !important;
  }
</style>
