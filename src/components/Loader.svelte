<script lang="ts">
  import { onMount } from 'svelte'

  type Phase = 'entering' | 'covering' | 'exiting' | 'done'

  interface BeforeSwapEvent extends Event {
    newDocument: Document
    direction: string
    resume: () => void
  }

  let phase: Phase = $state('covering')

  const ENTER_DURATION = 600
  const HOLD_DURATION = 400
  const EXIT_DURATION = 800

  let timers: ReturnType<typeof setTimeout>[] = []
  let enterComplete = false
  let pendingSwapEvent: BeforeSwapEvent | null = null

  function clearTimers() {
    timers.forEach(clearTimeout)
    timers = []
  }

  function scheduleExit() {
    const exitTimer = setTimeout(() => {
      phase = 'exiting'
    }, HOLD_DURATION)

    const doneTimer = setTimeout(() => {
      phase = 'done'
      document.body.style.overflow = ''
    }, HOLD_DURATION + EXIT_DURATION)

    timers.push(exitTimer, doneTimer)
  }

  function onNavigationStart() {
    enterComplete = false
    pendingSwapEvent = null
    clearTimers()
    document.body.style.overflow = 'hidden'
    phase = 'entering'

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        phase = 'covering'
      })
    })

    const enterTimer = setTimeout(() => {
      enterComplete = true
      if (pendingSwapEvent) {
        pendingSwapEvent.resume()
        pendingSwapEvent = null
      }
    }, ENTER_DURATION)
    timers.push(enterTimer)
  }

  function onBeforeSwap(event: Event) {
    if (!enterComplete) {
      event.preventDefault()
      pendingSwapEvent = event as BeforeSwapEvent
    }
  }

  function onNavigationEnd() {
    clearTimers()
    scheduleExit()
  }

  onMount(() => {
    document.body.style.overflow = 'hidden'
    scheduleExit()

    document.addEventListener('astro:before-preparation', onNavigationStart)
    document.addEventListener('astro:before-swap', onBeforeSwap)
    document.addEventListener('astro:page-load', onNavigationEnd)

    return () => {
      document.body.style.overflow = ''
      clearTimers()
      document.removeEventListener(
        'astro:before-preparation',
        onNavigationStart,
      )
      document.removeEventListener('astro:before-swap', onBeforeSwap)
      document.removeEventListener('astro:page-load', onNavigationEnd)
    }
  })
</script>

<div
  class="loader-wrapper"
  class:entering={phase === 'entering'}
  class:covering={phase === 'covering'}
  class:exiting={phase === 'exiting'}
  class:done={phase === 'done'}
>
  <div class="panel panel-back"></div>
  <div class="panel panel-mid"></div>
  <div class="panel panel-front"></div>

  <div class="loader-inner">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="62"
      height="22"
      viewBox="0 0 62 22"
      class="logo-svg"
    >
      <path
        d="M60.493,3.675,49.176,14.992,37.684,3.5,26.309,14.817,15.05,3.558,3.5,15.167"
        transform="translate(-1.019 1.443)"
        fill="none"
        stroke="currentColor"
        stroke-miterlimit="10"
        stroke-width="7"
      />
      <g class="rects">
        <rect width="7" height="7" x="-9" y="24"></rect>
        <rect width="7" height="7" x="66" y="-9"></rect>
        <rect width="7" height="7" x="66" y="-9"></rect>
      </g>
    </svg>
  </div>
</div>

<style>
  .loader-wrapper {
    position: fixed;
    inset: 0;
    z-index: 9999;
    pointer-events: none;
  }

  .loader-wrapper.done {
    visibility: hidden;
  }

  .panel {
    position: absolute;
    inset: 0;
    width: 104vw;
    clip-path: polygon(0 0, 100% 0, calc(100% - 4vw) 100%, 0 100%);
    transform: translateX(0);
    transition:
      transform 560ms cubic-bezier(0.16, 1, 0.3, 1),
      visibility 0ms;
    will-change: transform;
  }

  .panel-back {
    background: var(--panel-back);
  }

  .panel-mid {
    background: var(--panel-mid);
  }

  .panel-front {
    background: var(--panel-front);
    background-image: repeating-linear-gradient(
      -45deg,
      transparent 0 34px,
      rgb(255 255 255 / 0.14) 34px 40px
    );
  }

  :global(.theme-dark) .loader-wrapper {
    --panel-back: var(--p5-white);
    --panel-mid: var(--p5-black);
    --panel-front: var(--p5-red);
  }

  .loader-wrapper {
    --panel-back: var(--dd-cyan);
    --panel-mid: var(--dd-yellow);
    --panel-front: var(--dd-pink);
  }

  .entering .panel {
    transform: translateX(-104%);
    transition: none;
  }

  .covering .panel {
    transform: translateX(0);
  }

  .covering .panel-back {
    transition-delay: 0ms;
  }
  .covering .panel-mid {
    transition-delay: 70ms;
  }
  .covering .panel-front {
    transition-delay: 140ms;
  }

  .exiting .panel {
    transform: translateX(104%);
    transition-timing-function: cubic-bezier(0.7, 0, 0.84, 1);
  }

  .exiting .panel-front {
    transition-delay: 0ms;
  }
  .exiting .panel-mid {
    transition-delay: 80ms;
  }
  .exiting .panel-back {
    transition-delay: 160ms;
  }

  .loader-inner {
    position: absolute;
    top: 50%;
    left: 50%;
    display: grid;
    place-items: center;
    width: 8rem;
    height: 8rem;
    background: var(--box-bg);
    border: 4px solid var(--box-border);
    color: var(--box-fg);
    box-shadow: 0.6rem 0.6rem 0 var(--p5-red);
    transform: translate(-50%, -50%) rotate(-5deg);
    transition:
      transform 420ms cubic-bezier(0.7, 0, 0.84, 1),
      opacity 320ms ease;
  }

  :global(.theme-dark) .loader-inner {
    --box-bg: var(--p5-black);
    --box-border: var(--p5-white);
    --box-fg: var(--p5-white);
  }

  .loader-inner {
    --box-bg: var(--p5-paper);
    --box-border: var(--p5-ink);
    --box-fg: var(--p5-ink);
  }

  .entering .loader-inner {
    transform: translate(-50%, -50%) rotate(-5deg) scale(0.6);
    opacity: 0;
    transition: none;
  }

  .covering .loader-inner {
    transform: translate(-50%, -50%) rotate(-5deg) scale(1);
    opacity: 1;
  }

  .exiting .loader-inner {
    transform: translate(-50%, -50%) rotate(6deg) scale(0.5);
    opacity: 0;
  }

  .done .loader-inner {
    opacity: 0;
  }

  .logo-svg {
    width: 62px;
    height: auto;
    overflow: visible;
    transform: rotate(5deg);
    filter: drop-shadow(0.18rem 0.18rem 0 var(--p5-red));
  }

  .logo-svg path {
    stroke-dasharray: 81px 100px;
    stroke-dashoffset: -99px;
    animation: snake 2s linear infinite;
  }

  @keyframes snake {
    0%,
    19% {
      stroke-dashoffset: -81px;
    }
    50%,
    100% {
      stroke-dashoffset: 81px;
    }
  }

  .rects rect {
    fill: currentColor;
  }

  .rects rect:nth-child(1) {
    animation: drop-in 2.4s cubic-bezier(0.32, 0, 0.67, 0) infinite;
    transform-origin: -9px 24px;
  }
  .rects rect:nth-child(2) {
    animation: drop-out 2.4s cubic-bezier(0.33, 1, 0.68, 1) infinite;
    transform-origin: 66px -9px;
  }
  .rects rect:nth-child(3) {
    animation: drop-out-2 2.4s cubic-bezier(0.33, 1, 0.68, 1) infinite;
    transform-origin: 66px -9px;
  }

  @keyframes drop-in {
    0% {
      transform: translate3d(-20px, 20px, 0) scale(0.1);
    }
    20% {
      transform: translate3d(10px, -10px, 0) scale(1);
    }
    20.01%,
    100% {
      transform: scale(0);
    }
  }

  @keyframes drop-out {
    0%,
    49.99% {
      transform: translate3d(20px, -20px, 0) scale(0);
    }
    50% {
      transform: translate3d(-10px, 10px, 0) scale(1);
    }
    80%,
    100% {
      transform: translate3d(15px, -15px, 0) scale(0);
    }
  }

  @keyframes drop-out-2 {
    0%,
    49.99% {
      transform: translate3d(20px, -20px, 0) scale(0);
    }
    50% {
      transform: translate3d(-10px, 10px, 0) scale(1);
    }
    100% {
      transform: translate3d(10px, -20px, 0) scale(0);
    }
  }
</style>
