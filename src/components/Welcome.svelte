<script>
  import Marquee from './Marquee.svelte'

  let container = $state(null)
  let copyEl = $state(null)
  let titleEl = $state(null)
  let kickerEl = $state(null)
  let subEl = $state(null)
  let slashEl = $state(null)
  let starEl = $state(null)
  let bgEl = $state(null)

  $effect(() => {
    if (!container || !copyEl || !titleEl || !subEl) return

    let cancelled = false
    let cleanup

    ;(async () => {
      const [{ default: gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('gsap/SplitText'),
      ])
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger, SplitText)

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const split = new SplitText(titleEl.querySelectorAll('.title-line'), {
        type: 'chars',
        charsClass: 'hero-char',
      })

      let intro
      if (!reduced) {
        gsap.set(titleEl, { autoAlpha: 1 })
        intro = gsap.timeline({ delay: 0.9 })
        intro.from(split.chars, {
          yPercent: 130,
          rotate: 12,
          autoAlpha: 0,
          duration: 0.65,
          ease: 'back.out(1.6)',
          stagger: 0.045,
        })
        intro.from(
          kickerEl,
          { xPercent: -30, autoAlpha: 0, duration: 0.4, ease: 'power2.out' },
          '-=0.35',
        )
        intro.from(
          subEl,
          { scale: 0, rotate: -8, autoAlpha: 0, duration: 0.45, ease: 'back.out(2.2)' },
          '-=0.15',
        )
      } else {
        gsap.set(titleEl, { autoAlpha: 1 })
      }

      const tiltX = gsap.quickTo(copyEl, 'rotationY', { duration: 0.5, ease: 'power2.out' })
      const tiltY = gsap.quickTo(copyEl, 'rotationX', { duration: 0.5, ease: 'power2.out' })
      const bgX = gsap.quickTo(bgEl, 'x', { duration: 0.9, ease: 'power2.out' })
      const bgY = gsap.quickTo(bgEl, 'y', { duration: 0.9, ease: 'power2.out' })
      const starRot = gsap.quickTo(starEl, 'rotation', { duration: 1.2, ease: 'power2.out' })
      const subX = gsap.quickTo(subEl, 'x', { duration: 0.4, ease: 'power2.out' })
      const subY = gsap.quickTo(subEl, 'y', { duration: 0.4, ease: 'power2.out' })

      function onMouseMove(e) {
        if (reduced) return
        const nx = e.clientX / window.innerWidth - 0.5
        const ny = e.clientY / window.innerHeight - 0.5
        tiltX(nx * 14)
        tiltY(-ny * 12)
        bgX(nx * -26)
        bgY(ny * -18)
        starRot(nx * 40)
        const rect = subEl.getBoundingClientRect()
        const dx = e.clientX - (rect.left + rect.width / 2)
        const dy = e.clientY - (rect.top + rect.height / 2)
        const dist = Math.hypot(dx, dy)
        const pull = dist < 260 ? (1 - dist / 260) * 0.3 : 0
        subX(dx * pull)
        subY(dy * pull)
      }
      window.addEventListener('mousemove', onMouseMove)

      const scrollTween = gsap.to(copyEl, {
        yPercent: -32,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
      const bgTween = gsap.to(bgEl, {
        yPercent: 16,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
      const slashTween = gsap.to(slashEl, {
        xPercent: -6,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      ScrollTrigger.refresh()

      cleanup = () => {
        intro?.kill()
        ;[scrollTween, bgTween, slashTween].forEach(t => {
          t.scrollTrigger?.kill()
          t.kill()
        })
        split.revert()
        window.removeEventListener('mousemove', onMouseMove)
        gsap.set([copyEl, bgEl, slashEl, starEl, subEl], { clearProps: 'all' })
      }
    })()

    return () => {
      cancelled = true
      cleanup?.()
    }
  })
</script>

<main class="hero" bind:this={container}>
  <div class="hero-bg" bind:this={bgEl}></div>
  <div class="hero-halftone p5-halftone"></div>

  <div class="hero-inner">
    <div class="hero-copy" bind:this={copyEl}>
      <div class="hero-slash" bind:this={slashEl}></div>

      <svg class="hero-star" bind:this={starEl} viewBox="-50 -50 100 100" aria-hidden="true">
        <path d="M0,-44 C5,-9 9,-5 44,0 C9,5 5,9 0,44 C-5,9 -9,5 -44,0 C-9,-5 -5,-9 0,-44 Z" />
      </svg>
      <svg class="hero-star small" viewBox="-50 -50 100 100" aria-hidden="true">
        <path d="M0,-44 C5,-9 9,-5 44,0 C9,5 5,9 0,44 C-5,9 -9,5 -44,0 C-9,-5 -5,-9 0,-44 Z" />
      </svg>

      <p class="hero-kicker" bind:this={kickerEl}>
        <span>Take Your Heart — Interaction Lab</span>
      </p>

      <h1 bind:this={titleEl} style="opacity:0">
        <span class="title-line">KINO</span>
        <span class="title-line accent">MOTION</span>
      </h1>

      <p class="hero-sub" bind:this={subEl}>
        <span>Frontend · Motion · Playground</span>
      </p>    </div>
  </div>

  <div class="hero-marquee">
    <Marquee
      items={['Kino Motion', 'Take Your Heart', 'Phantom Edition', 'Interaction Lab']}
      variant="red"
    />
  </div>
</main>

<style>
  .hero {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    width: 100%;
    overflow: hidden;
  }

  .hero-bg {
    position: absolute;
    inset: -5%;
    z-index: -2;
    background-image:
      linear-gradient(var(--hero-veil), var(--hero-veil)),
      repeating-linear-gradient(
        112deg,
        var(--hero-stripe-a) 0 12px,
        transparent 12px 40px,
        var(--hero-stripe-b) 40px 64px,
        transparent 64px 100px
      );
    will-change: transform;
  }

  :global(.theme-dark) .hero-bg {
    --hero-veil: rgb(0 0 0 / 0.45);
    --hero-stripe-a: rgb(255 255 255 / 0.85);
    --hero-stripe-b: rgb(230 0 18 / 0.72);
  }

  .hero-bg {
    --hero-veil: rgb(245 241 232 / 0.55);
    --hero-stripe-a: rgb(23 19 15 / 0.16);
    --hero-stripe-b: rgb(230 0 18 / 0.3);
  }

  .hero-halftone {
    position: absolute;
    inset: 0;
    z-index: -1;
    color: var(--hero-dots);
    opacity: 0.5;
    pointer-events: none;
    mask-image: radial-gradient(ellipse 90% 70% at 70% 30%, black, transparent 70%);
  }

  :global(.theme-dark) .hero-halftone {
    --hero-dots: var(--p5-white);
  }

  .hero-halftone {
    --hero-dots: var(--p5-ink);
  }

  .hero-inner {
    flex: 1;
    display: flex;
    align-items: center;
    padding: clamp(1rem, 5vw, 5rem);
    perspective: 1100px;
  }

  .hero-copy {
    position: relative;
    margin-top: 4rem;
    transform: rotate(-2deg);
    transform-style: preserve-3d;
    will-change: transform;
  }

  .hero-slash {
    position: absolute;
    left: -12%;
    top: 38%;
    width: 130%;
    height: 34%;
    z-index: -1;
    background: var(--p5-red);
    transform: rotate(-3deg) skewX(-14deg);
    box-shadow: 0.08em 0.08em 0 0.04em var(--slash-edge);
    will-change: transform;
  }

  :global(.theme-dark) .hero-slash {
    --slash-edge: var(--p5-white);
  }

  .hero-slash {
    --slash-edge: var(--p5-ink);
  }

  .hero-star {
    position: absolute;
    width: clamp(4rem, 9vw, 8rem);
    right: -8%;
    top: -22%;
    fill: var(--p5-gold);
    stroke: var(--p5-ink);
    stroke-width: 6;
    paint-order: stroke;
    z-index: 1;
    filter: drop-shadow(0.06em 0.06em 0 var(--p5-red));
  }

  .hero-star.small {
    width: clamp(1.6rem, 3.4vw, 2.8rem);
    right: 22%;
    top: -14%;
    fill: var(--p5-white);
  }

  :global(.theme-dark) .hero-star.small {
    fill: var(--p5-red);
    stroke: var(--p5-white);
  }

  .hero-kicker {
    display: inline-block;
    margin: 0 0 0.4em;
    background: var(--p5-red);
    color: var(--p5-white);
    font-family: var(--font-family-sans-code);
    font-size: clamp(0.7rem, 1.4vw, 0.95rem);
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 0.4em 0.9em;
    transform: skewX(-12deg);
    box-shadow: 0.3em 0.3em 0 var(--kicker-shadow);
  }

  :global(.theme-dark) .hero-kicker {
    --kicker-shadow: var(--p5-white);
  }

  .hero-kicker {
    --kicker-shadow: var(--p5-ink);
  }

  .hero-kicker span {
    display: inline-block;
    transform: skewX(12deg);
  }

  h1 {
    margin: 0;
    line-height: 0.82;
    user-select: none;
  }

  .title-line {
    display: block;
    font-family: var(--font-family-display);
    font-size: clamp(5rem, 15vw, 13.5rem);
    font-weight: 400;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    transform: skewX(-8deg);
  }

  .title-line.accent {
    margin-left: 0.55em;
    transform: skewX(-8deg) rotate(-1.2deg);
  }

  :global(.theme-dark) .title-line {
    color: var(--p5-white);
    -webkit-text-stroke: 0.03em var(--p5-black);
    text-shadow:
      0.05em 0.05em 0 var(--p5-red),
      0.1em 0.1em 0 var(--p5-white);
  }

  :global(.theme-dark) .title-line.accent {
    color: transparent;
    -webkit-text-stroke: 0.035em var(--p5-white);
    text-shadow: 0.07em 0.07em 0 var(--p5-red);
  }

  .title-line {
    color: var(--p5-ink);
    -webkit-text-stroke: 0.02em var(--p5-ink);
    text-shadow:
      0.05em 0.05em 0 var(--p5-red),
      0.09em 0.09em 0 var(--p5-paper);
  }

  .title-line.accent {
    color: var(--p5-red);
    text-shadow:
      0.05em 0.05em 0 var(--p5-ink),
      0.09em 0.09em 0 var(--p5-paper);
  }

  .hero-sub {
    position: relative;
    display: inline-block;
    margin: 1.5em 0 0 0.4em;
    background: var(--sub-bg);
    color: var(--sub-fg);
    font-family: var(--font-family-sans-code);
    font-weight: 700;
    font-size: clamp(0.8rem, 1.5vw, 1rem);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    padding: 0.55em 1.1em 0.55em 1.5em;
    border: 2px solid var(--sub-border);
    transform: skewX(-12deg);
    box-shadow: 0.35em 0.35em 0 var(--p5-red);
    will-change: transform;
  }

  .hero-sub::before {
    content: '';
    position: absolute;
    left: 0.55em;
    top: 50%;
    width: 0.55em;
    height: 0.55em;
    background: var(--p5-red);
    transform: translateY(-50%) rotate(45deg);
  }

  :global(.theme-dark) .hero-sub {
    --sub-bg: var(--p5-white);
    --sub-fg: var(--p5-black);
    --sub-border: var(--p5-black);
  }

  .hero-sub {
    --sub-bg: var(--p5-ink);
    --sub-fg: var(--p5-paper);
    --sub-border: var(--p5-red);
  }

  .hero-sub span {
    display: inline-block;
    transform: skewX(12deg);
  }

  .hero-marquee {
    transform: rotate(-1.5deg) scale(1.02);
    margin-bottom: 2.2rem;
  }

  :global(.hero-char) {
    display: inline-block;
    will-change: transform;
  }

  @media (max-width: 800px) {
    .hero-copy {
      margin-top: 2rem;
    }

    .hero-star {
      right: 2%;
      top: -16%;
    }
  }
</style>
