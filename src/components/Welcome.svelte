<script>
  let container = $state(null)
  let copyEl = $state(null)
  let titleEl = $state(null)
  let subEl = $state(null)
  let canvasEl = $state(null)

  let isDark = $state(
    typeof document !== 'undefined' &&
      document.documentElement.classList.contains('theme-dark'),
  )

  // const prefersReducedMotion =
  //   typeof window !== 'undefined' &&
  //   window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // 主题切换监听：实时响应亮/暗模式切换
  $effect(() => {
    const observer = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains('theme-dark')
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => observer.disconnect()
  })

  // 亮色模式：SplitText 文字入场 + 鼠标视差 + 滚动驱动视差
  async function initLight() {
    if (!titleEl || !subEl || !copyEl || !container) return

    // 动态导入 gsap（仅亮色模式需要，暗色模式用 canvas/CSS 变量）
    const [{ default: gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('gsap/SplitText'),
    ])
    gsap.registerPlugin(ScrollTrigger, SplitText)

    // 入场动画：reduced-motion 时跳过自动播放
    let split
    let intro
    // if (!prefersReducedMotion) {
      split = new SplitText(titleEl, {
        type: 'chars',
        charsClass: 'hero-char',
      })
      intro = gsap.timeline()
      intro.from(split.chars, {
        yPercent: 120,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.04,
      })
      intro.from(
        subEl,
        { y: 20, autoAlpha: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.3',
      )
    // }

    // 鼠标视差：标题与副标题跟随鼠标轻微位移
    const parallaxX = gsap.quickTo(titleEl, 'x', { duration: 0.6, ease: 'power2.out' })
    const parallaxY = gsap.quickTo(titleEl, 'y', { duration: 0.6, ease: 'power2.out' })
    const subParallaxX = gsap.quickTo(subEl, 'x', { duration: 0.6, ease: 'power2.out' })
    const subParallaxY = gsap.quickTo(subEl, 'y', { duration: 0.6, ease: 'power2.out' })

    function onMouseMove(e) {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      parallaxX(nx * 18)
      parallaxY(ny * 12)
      subParallaxX(nx * 8)
      subParallaxY(ny * 6)
    }
    window.addEventListener('mousemove', onMouseMove)

    // 滚动驱动视差：向下滚动时标题上移并淡出
    const scrollTween = gsap.to(copyEl, {
      yPercent: -40,
      autoAlpha: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })

    ScrollTrigger.refresh()

    return () => {
      intro?.kill()
      scrollTween.scrollTrigger?.kill()
      scrollTween.kill()
      split?.revert()
      window.removeEventListener('mousemove', onMouseMove)
      gsap.set([titleEl, subEl, copyEl], { clearProps: 'all' })
    }
  }

  // 暗色模式：Canvas 粒子背景 + 3D 倾斜 + 磁吸
  function initDark() {
    if (!canvasEl || !copyEl || !subEl || !container) return

    const mouse = { x: -999, y: -999 }
    let rafId
    let ro

    // 粒子背景：reduced-motion 时跳过持续运动
    // if (!prefersReducedMotion) {
      const ctx = canvasEl.getContext('2d')
      if (ctx) {
        let w = canvasEl.clientWidth || window.innerWidth
        let h = canvasEl.clientHeight || window.innerHeight

        function resize() {
          w = canvasEl.clientWidth || window.innerWidth
          h = canvasEl.clientHeight || window.innerHeight
          const dpr = window.devicePixelRatio || 1
          canvasEl.width = w * dpr
          canvasEl.height = h * dpr
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }
        resize()

        ro = new ResizeObserver(resize)
        ro.observe(canvasEl)

        // 粒子系统：飘动的小点 + 近距离连线 + 鼠标排斥
        const count = window.innerWidth < 768 ? 35 : 70
        const mouseRadius = 140
        const connectDist = 110
        const particles = []

        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 1.5 + 0.5,
          })
        }

        function tick() {
          ctx.clearRect(0, 0, w, h)

          for (const p of particles) {
            const dx = p.x - mouse.x
            const dy = p.y - mouse.y
            const dist = Math.hypot(dx, dy)
            if (dist < mouseRadius && dist > 0) {
              const force = (1 - dist / mouseRadius) * 2.5
              p.vx += (dx / dist) * force * 0.5
              p.vy += (dy / dist) * force * 0.5
            }
            p.x += p.vx
            p.y += p.vy
            p.vx *= 0.97
            p.vy *= 0.97
            if (p.x < 0 || p.x > w) p.vx *= -1
            if (p.y < 0 || p.y > h) p.vy *= -1
            p.x = Math.max(0, Math.min(w, p.x))
            p.y = Math.max(0, Math.min(h, p.y))
          }

          // 近距离粒子连线
          ctx.lineWidth = 0.5
          for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
              const dx = particles[i].x - particles[j].x
              const dy = particles[i].y - particles[j].y
              const dist = Math.hypot(dx, dy)
              if (dist < connectDist) {
                ctx.globalAlpha = (1 - dist / connectDist) * 0.35
                ctx.strokeStyle = 'rgba(255,255,255,0.9)'
                ctx.beginPath()
                ctx.moveTo(particles[i].x, particles[i].y)
                ctx.lineTo(particles[j].x, particles[j].y)
                ctx.stroke()
              }
            }
          }

          // 粒子点
          ctx.globalAlpha = 0.75
          ctx.fillStyle = '#fff'
          for (const p of particles) {
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
            ctx.fill()
          }
          ctx.globalAlpha = 1

          rafId = requestAnimationFrame(tick)
        }
        rafId = requestAnimationFrame(tick)
      }
    // }

    // 3D 倾斜 + 磁吸：用 CSS 变量驱动，避免与现有 skewX/rotate transform 冲突
    const magnetRadius = 250
    function onMouseMove(e) {
      const rect = container.getBoundingClientRect()
      const px = e.clientX - rect.left
      const py = e.clientY - rect.top
      const nx = px / rect.width - 0.5
      const ny = py / rect.height - 0.5

      // 3D 倾斜
      copyEl.style.setProperty('--tilt-y', `${nx * 18}deg`)
      copyEl.style.setProperty('--tilt-x', `${-ny * 18}deg`)

      // 磁吸：副标题被鼠标吸引
      const subRect = subEl.getBoundingClientRect()
      const cx = subRect.left + subRect.width / 2
      const cy = subRect.top + subRect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      if (dist < magnetRadius) {
        const strength = (1 - dist / magnetRadius) * 0.35
        subEl.style.setProperty('--magnet-x', `${dx * strength}px`)
        subEl.style.setProperty('--magnet-y', `${dy * strength}px`)
      } else {
        subEl.style.setProperty('--magnet-x', '0px')
        subEl.style.setProperty('--magnet-y', '0px')
      }

      mouse.x = px
      mouse.y = py
    }
    container.addEventListener('mousemove', onMouseMove)

    function onTouch(e) {
      const touch = e.touches[0]
      if (!touch) return
      const rect = container.getBoundingClientRect()
      mouse.x = touch.clientX - rect.left
      mouse.y = touch.clientY - rect.top
    }
    container.addEventListener('touchmove', onTouch, { passive: true })

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      ro?.disconnect()
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('touchmove', onTouch)
      copyEl.style.setProperty('--tilt-x', '0deg')
      copyEl.style.setProperty('--tilt-y', '0deg')
      subEl.style.setProperty('--magnet-x', '0px')
      subEl.style.setProperty('--magnet-y', '0px')
    }
  }

  // 根据主题初始化对应效果，切换时自动清理旧效果
  $effect(() => {
    if (!container) return
    const dark = isDark

    let cancelled = false
    let cleanup

    if (dark) {
      cleanup = initDark()
    } else {
      initLight().then((fn) => {
        if (cancelled) {
          fn?.()
        } else {
          cleanup = fn
        }
      })
    }

    return () => {
      cancelled = true
      cleanup?.()
    }
  })
</script>

<main class="home-welcome" bind:this={container}>
  <div class="background"></div>
  {#if isDark}
    <canvas class="particle-canvas" bind:this={canvasEl}></canvas>
  {/if}
  <div class="home-container">
    <div class="home-copy" bind:this={copyEl}>
      <h1 bind:this={titleEl}>Kino Motion</h1>
      <p bind:this={subEl}>Interaction Lab by Kino</p>
    </div>
  </div>
  <div class="scroll-hint">
    <svg class="scroll-arrow" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  </div>
</main>

<style>
  .home-welcome {
    margin: 0 auto;
    max-width: 1400px;
    padding: 1em 2em;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
  }
  .background {
    min-height: 100dvh;
    background-image: linear-gradient(var(--bgi-gradient)),
      url('/assets/hero-image.webp');
    object-fit: fill;
    background-size: cover;
    background-position: center;
    max-width: 100dvw;

    position: absolute;
    left: 0%;
    right: 0%;
    top: 0%;
    bottom: 0%;
    z-index: -9;
  }
  .home-container {
    align-items: center;
    display: flex;
    flex: 1;
    justify-content: center;
    margin: 2em 0;
    min-height: 400px;
  }

  .home-copy {
    flex: 1;
    padding: 0 1em;

    & h1 {
      font-weight: 700;
      margin-bottom: 0.5em;
      line-height: 1.3;
    }

    & p {
      font-size: 1.4em;
    }
  }

  :global(.theme-dark) .home-welcome {
    max-width: none;
    padding-inline: clamp(1rem, 5vw, 5rem);
    overflow: hidden;
    position: relative;
  }

  :global(.theme-dark) .background {
    background:
      linear-gradient(var(--bgi-gradient)),
      repeating-linear-gradient(
        112deg,
        rgba(255 255 255 / 0.92) 0 10px,
        transparent 10px 38px,
        rgba(230 0 32 / 0.78) 38px 62px,
        transparent 62px 96px
      );
    background-blend-mode: multiply, normal, normal;
    filter: contrast(1.22) saturate(1.35);
  }

  .particle-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: -8;
    pointer-events: none;
  }

  :global(.theme-dark) .home-container {
    perspective: 1000px;
  }

  :global(.theme-dark) .home-copy {
    flex: 0 1 auto;
    margin-top: 7rem;
    transform: rotate(-2deg) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg));
    transform-style: preserve-3d;
    transition: transform 0.2s ease-out;
    will-change: transform;
  }

  :global(.theme-dark) .home-copy h1 {
    display: inline-block;
    margin: 0 0 0.2em;
    color: var(--p5-white);
    font-family: 'Impact Regular';
    font-size: clamp(6rem, 13vw, 12rem);
    font-weight: 400;
    line-height: 0.84;
    text-transform: uppercase;
    text-shadow:
      0.055em 0.055em 0 var(--primary),
      -0.035em -0.025em 0 var(--p5-black),
      0.11em 0.11em 0 var(--p5-white);
    transform: skewX(-10deg);
    -webkit-text-stroke: 0.035em var(--p5-black);
  }

  :global(.theme-dark) .home-copy p {
    display: inline-block;
    margin: 0;
    padding: 0.25em 0.65em;
    background: var(--p5-white);
    color: var(--p5-black);
    font-weight: 900;
    text-transform: uppercase;
    transform: skewX(-12deg) translate(var(--magnet-x, 0px), var(--magnet-y, 0px));
    box-shadow: 0.35em 0.35em 0 var(--primary);
    transition: transform 0.3s ease-out;
    will-change: transform;
  }

  :global(.theme-dark) .home-copy p a {
    color: var(--p5-black);
    box-shadow: inset 0 -0.18em 0 var(--primary);
  }

  @media (max-width: 800px) {
    .background {
      background-position: 80% center;
    }

    .home-container {
      flex-direction: column;
    }

    .home-copy {
      flex: 0;
      padding-bottom: 2em;
      text-align: center;
    }
  }

  @media (max-width: 800px) {
    :global(.theme-dark) .home-copy {
      margin-top: 4rem;
      text-align: left;
    }
  }

  /* Scroll hint */
  .scroll-hint {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    color: var(--text-secondary);
    opacity: 0.6;
    animation: breathe 2s ease-in-out infinite;
  }

  .scroll-arrow {
    animation: bob 2s ease-in-out infinite;
  }

  @keyframes breathe {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 0.4; }
  }

  @keyframes bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(5px); }
  }

  :global(.theme-dark) .scroll-hint {
    color: var(--p5-white);
    opacity: 0.5;
  }
</style>
