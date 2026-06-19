<script>
  import Lenis from 'lenis'
  import { setLenis } from '@/lib/lenis'

  let { minThumbHeight = 40, hoverToShow = false } = $props()

  let scrollProgress = $state(0)
  let containerHeight = $state(0)
  let contentHeight = $state(0)
  let isDragging = $state(false)
  let isScrolling = $state(false)
  let isHovered = $state(false)

  let lenis = null
  let dragStart = { y: 0, progress: 0 }
  let scrollingTimeout

  let heightRatio = $derived(
    contentHeight > 0 ? containerHeight / contentHeight : 1,
  )
  let thumbHeight = $derived(
    Math.min(
      containerHeight,
      Math.max(minThumbHeight, heightRatio * containerHeight),
    ),
  )
  let trackSpace = $derived(Math.max(0, containerHeight - thumbHeight))
  let thumbTop = $derived(scrollProgress * trackSpace)
  let hideTrack = $derived(heightRatio >= 1)
  let maxScroll = $derived(Math.max(0, contentHeight - containerHeight))
  let ariaValue = $derived(Math.round(scrollProgress * 100))

  $effect(() => {
    const lenisInstance = new Lenis({
      autoRaf: true,
      smoothWheel: true,
    })

    lenisInstance.on('scroll', e => {
      scrollProgress = e.progress
      isScrolling = true
      clearTimeout(scrollingTimeout)
      scrollingTimeout = setTimeout(() => {
        isScrolling = false
      }, 100)
    })

    const updateDimensions = () => {
      containerHeight = window.innerHeight
      contentHeight = document.documentElement.scrollHeight
    }
    const resizeObserver = new ResizeObserver(updateDimensions)

    updateDimensions()
    resizeObserver.observe(document.documentElement)
    lenis = lenisInstance
    setLenis(lenisInstance)

    return () => {
      lenisInstance.destroy()
      resizeObserver.disconnect()
      clearTimeout(scrollingTimeout)
      lenis = null
      setLenis(null)
    }
  })

  function getClientY(e) {
    return e.touches ? e.touches[0].clientY : e.clientY
  }

  function scrollToProgress(progress) {
    if (!lenis) return
    const targetProgress = Math.max(0, Math.min(1, progress))
    lenis.scrollTo(targetProgress * maxScroll, { immediate: true })
    scrollProgress = targetProgress
  }

  function onDragStart(e) {
    isDragging = true
    isScrolling = true
    dragStart.y = getClientY(e)
    dragStart.progress = scrollProgress
    if (e.cancelable) e.preventDefault()
  }

  function handleGlobalMove(e) {
    if (!isDragging || trackSpace <= 0) return
    const deltaY = getClientY(e) - dragStart.y
    const progressDelta = deltaY / trackSpace
    scrollToProgress(dragStart.progress + progressDelta)
  }

  function handleGlobalUp() {
    isDragging = false
    isScrolling = false
  }

  function handleKeydown(e) {
    const smallStep = 0.05
    const largeStep = 0.2

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      scrollToProgress(scrollProgress + smallStep)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      scrollToProgress(scrollProgress - smallStep)
    } else if (e.key === 'PageDown') {
      e.preventDefault()
      scrollToProgress(scrollProgress + largeStep)
    } else if (e.key === 'PageUp') {
      e.preventDefault()
      scrollToProgress(scrollProgress - largeStep)
    } else if (e.key === 'Home') {
      e.preventDefault()
      scrollToProgress(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      scrollToProgress(1)
    }
  }
</script>

<svelte:window
  onmousemove={handleGlobalMove}
  onmouseup={handleGlobalUp}
  ontouchmove={handleGlobalMove}
  ontouchend={handleGlobalUp}
/>

<div
  class={[
    'track-container',
    {
      'is-active': isDragging || isScrolling || isHovered,
      'hover-show': hoverToShow,
      hide: hideTrack,
    },
  ]}
  onmouseenter={() => (isHovered = true)}
  onmouseleave={() => (isHovered = false)}
  onmousedown={onDragStart}
  ontouchstart={onDragStart}
  onkeydown={handleKeydown}
  role="scrollbar"
  aria-controls="main-content"
  aria-orientation="vertical"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow={ariaValue}
  aria-valuetext={`${ariaValue}%`}
  tabindex="0"
>
  <div class="track">
    <div
      class={['thumb', { 'no-transition': isScrolling || isDragging }]}
      style="height: {thumbHeight}px; transform: translateY({thumbTop}px);"
    ></div>
  </div>
</div>

<style>
  .track-container {
    --scrollbar-width: 16px;
    --thumb-visible-width: 8px;
    --thumb-bg: rgba(136, 136, 136, 0.4);
    --thumb-bg-active: var(--outline);

    position: fixed;
    right: 0;
    top: 0;
    height: 100vh;
    width: var(--scrollbar-width);
    z-index: 9999;
    background: transparent;
    user-select: none;
    touch-action: pan-y;
    transition: opacity 0.3s;
  }

  .track-container:focus-visible {
    outline: 2px solid var(--outline);
    outline-offset: -2px;
  }

  .hover-show {
    opacity: 0;
  }

  .is-active {
    opacity: 1;
  }

  .track {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .thumb {
    position: absolute;
    left: 50%;
    width: var(--thumb-visible-width);
    background: var(--thumb-bg);
    border-radius: 10px;
    cursor: grab;
    translate: -50% 0;
    transition:
      transform 0.2s cubic-bezier(0.23, 1, 0.32, 1),
      width 0.15s,
      background 0.15s;
    will-change: transform;
  }

  .thumb.no-transition {
    transition:
      width 0.15s,
      background 0.15s !important;
  }

  .thumb::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 100%;
  }

  .track-container:hover .thumb,
  .is-active .thumb {
    background: var(--thumb-bg-active);
    width: calc(var(--thumb-visible-width) + 2px);
  }

  .hide {
    display: none !important;
  }
</style>
