<script>
  import Noise from './noise.js'

  let container = $state(null)
  let canvasEl = $state(null)
  let ctx = null
  let width = $state(0)
  let height = $state(0)
  let pointerX = $state(-10)
  let pointerY = $state(0)

  let mouse = {
    x: -10,
    y: 0,
    lx: 0,
    ly: 0,
    sx: 0,
    sy: 0,
    v: 0,
    vs: 0,
    a: 0,
    set: false,
  }
  let lines = []
  let noise = new Noise(Math.random())
  let rafId
  let strokeColor = ''

  function readStrokeColor() {
    if (!container) return
    strokeColor = getComputedStyle(container).getPropertyValue('--wavy-stroke').trim()
  }

  function setLines() {
    if (width <= 0 || height <= 0) return

    const xGap = 10
    const yGap = 32
    const oWidth = width + 200
    const oHeight = height + 30

    const totalLines = Math.ceil(oWidth / xGap)
    const totalPoints = Math.ceil(oHeight / yGap)
    const xStart = (width - xGap * totalLines) / 2
    const yStart = (height - yGap * totalPoints) / 2

    lines = Array.from({ length: totalLines + 1 }, (_, i) =>
      Array.from({ length: totalPoints + 1 }, (_, j) => ({
        x: xStart + xGap * i,
        y: yStart + yGap * j,
        wave: { x: 0, y: 0 },
        cursor: { x: 0, y: 0, vx: 0, vy: 0 },
      })),
    )
  }

  function moved(point, withCursorForce = true) {
    const x = point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0)
    const y = point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0)
    return {
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
    }
  }

  function updatePhysics(time) {
    mouse.sx += (mouse.x - mouse.sx) * 0.1
    mouse.sy += (mouse.y - mouse.sy) * 0.1
    pointerX = mouse.sx
    pointerY = mouse.sy

    const dx = mouse.x - mouse.lx
    const dy = mouse.y - mouse.ly
    mouse.v = Math.hypot(dx, dy)
    mouse.vs += (mouse.v - mouse.vs) * 0.1
    mouse.vs = Math.min(100, mouse.vs)
    mouse.lx = mouse.x
    mouse.ly = mouse.y
    mouse.a = Math.atan2(dy, dx)

    for (const points of lines) {
      for (const p of points) {
        const move =
          noise.perlin2(
            (p.x + time * 0.0125) * 0.002,
            (p.y + time * 0.005) * 0.0015,
          ) * 12
        p.wave.x = Math.cos(move) * 32
        p.wave.y = Math.sin(move) * 16

        const mdx = p.x - mouse.sx
        const mdy = p.y - mouse.sy
        const dist = Math.hypot(mdx, mdy)
        const limit = Math.max(175, mouse.vs)

        if (dist < limit) {
          const s = 1 - dist / limit
          const f = Math.cos(dist * 0.001) * s
          p.cursor.vx += Math.cos(mouse.a) * f * limit * mouse.vs * 0.00065
          p.cursor.vy += Math.sin(mouse.a) * f * limit * mouse.vs * 0.00065
        }

        p.cursor.vx += (0 - p.cursor.x) * 0.0016
        p.cursor.vy += (0 - p.cursor.y) * 0.0016
        p.cursor.vx *= 0.96
        p.cursor.vy *= 0.96
        p.cursor.x += p.cursor.vx * 2
        p.cursor.y += p.cursor.vy * 2
        p.cursor.x = Math.max(-100, Math.min(100, p.cursor.x))
        p.cursor.y = Math.max(-100, Math.min(100, p.cursor.y))
      }
    }
  }

  function drawLines() {
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)
    ctx.beginPath()
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = 1

    for (const points of lines) {
      const p0 = moved(points[0], false)
      ctx.moveTo(p0.x, p0.y)

      for (let i = 1; i < points.length; i++) {
        const pos = moved(points[i], i < points.length - 1)
        ctx.lineTo(pos.x, pos.y)
      }
    }

    ctx.stroke()
  }

  function tick(time) {
    updatePhysics(time)
    drawLines()
    rafId = requestAnimationFrame(tick)
  }

  function updateMousePosition(pageX, pageY) {
    if (!container) return
    const rect = container.getBoundingClientRect()

    mouse.x = pageX - rect.left
    mouse.y = pageY - (rect.top + window.scrollY)

    if (!mouse.set) {
      mouse.sx = mouse.lx = mouse.x
      mouse.sy = mouse.ly = mouse.y
      mouse.set = true
    }
  }

  function onMouseMove(e) {
    updateMousePosition(e.pageX, e.pageY)
  }

  function onTouchMove(e) {
    if (e.cancelable) e.preventDefault()

    const touch = e.touches[0]
    updateMousePosition(
      touch.clientX + window.scrollX,
      touch.clientY + window.scrollY,
    )
  }

  function onResize() {
    if (!canvasEl) return
    const dpr = window.devicePixelRatio || 1
    canvasEl.width = width * dpr
    canvasEl.height = height * dpr
    canvasEl.style.width = width + 'px'
    canvasEl.style.height = height + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    setLines()
  }

  $effect(() => {
    if (canvasEl) {
      ctx = canvasEl.getContext('2d')
      readStrokeColor()

      // Re-read color when theme changes
      const observer = new MutationObserver(readStrokeColor)
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
      return () => observer.disconnect()
    }
  })

  $effect(() => {
    width
    height
    onResize()
  })

  $effect(() => {
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
    }
  })
</script>

<div
  bind:this={container}
  class="home-wavy-lines"
  bind:clientWidth={width}
  bind:clientHeight={height}
  onmousemove={onMouseMove}
  ontouchmove={onTouchMove}
  role="presentation"
>
  <div
    class="pointer-dot"
    style:--x="{pointerX}px"
    style:--y="{pointerY}px"
  ></div>

  <canvas bind:this={canvasEl}></canvas>
</div>

<style>
  .home-wavy-lines {
    --wavy-stroke: var(--text-main);
    position: relative;
    max-width: 100dvw;
    height: 60dvh;
    background-color: var(--bg-color);
    overflow: hidden;
    touch-action: none;
  }

  .pointer-dot {
    position: absolute;
    top: 0;
    left: 0;
    width: 0.5rem;
    height: 0.5rem;
    background: var(--text-secondary);
    border-radius: 50%;
    transform: translate3d(calc(var(--x) - 50%), calc(var(--y) - 50%), 0);
    will-change: transform;
    pointer-events: none;
    z-index: 2;
  }

  :global(.theme-dark) .home-wavy-lines {
    --wavy-stroke: var(--p5-black);
    background: var(--p5-red);
  }

  :global(.theme-dark) .pointer-dot {
    width: 0.8rem;
    height: 0.8rem;
    background: var(--primary);
    border: 2px solid var(--p5-white);
    border-radius: 0;
    box-shadow: 0.18rem 0.18rem 0 var(--p5-white);
  }

  canvas {
    display: block;
    pointer-events: none;
  }
</style>
