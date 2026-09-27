<script>
  let x = $state(-100)
  let y = $state(-100)
  let visible = $state(false)
  let active = $state(false)
  let pressed = $state(false)

  $effect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    let raf
    let tx = -100
    let ty = -100
    let cx = -100
    let cy = -100
    let running = false

    function tick() {
      cx += (tx - cx) * 0.18
      cy += (ty - cy) * 0.18
      x = cx
      y = cy
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
        raf = requestAnimationFrame(tick)
      } else {
        running = false
      }
    }

    function wake() {
      if (!running) {
        running = true
        raf = requestAnimationFrame(tick)
      }
    }

    function onMove(e) {
      tx = e.clientX
      ty = e.clientY
      visible = true
      const target = e.target
      active =
        target instanceof Element &&
        !!target.closest('a, button, [role="button"], input, textarea, select, label, .poker, .poker-top')
      wake()
    }

    function onLeave() {
      visible = false
    }

    function onDown() {
      pressed = true
    }

    function onUp() {
      pressed = false
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  })
</script>

<div
  class={['cursor', { visible, active, pressed }]}
  style:--x="{x}px"
  style:--y="{y}px"
  aria-hidden="true"
>
  <div class="cursor-ring"></div>
  <div class="cursor-dot"></div>
</div>

<style>
  .cursor {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
    mix-blend-mode: difference;
  }

  .cursor.visible {
    opacity: 1;
  }

  .cursor-ring {
    position: absolute;
    width: 2rem;
    height: 2rem;
    border: 2px solid #fff;
    transform: translate(-50%, -50%) rotate(45deg) scale(1);
    transition:
      transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
      border-radius 0.22s ease;
    translate: var(--x) var(--y);
  }

  .cursor-dot {
    position: absolute;
    width: 0.45rem;
    height: 0.45rem;
    background: #fff;
    transform: translate(-50%, -50%);
    translate: var(--x) var(--y);
    transition: transform 0.15s ease;
  }

  .cursor.active .cursor-ring {
    transform: translate(-50%, -50%) rotate(45deg) scale(1.5);
  }

  .cursor.pressed .cursor-ring {
    transform: translate(-50%, -50%) rotate(45deg) scale(0.75);
  }

  .cursor.pressed .cursor-dot {
    transform: translate(-50%, -50%) scale(1.8);
  }

  @media (pointer: coarse) {
    .cursor {
      display: none;
    }
  }
</style>
