<script>
  let container = $state(null)

  $effect(() => {
    if (!container) return

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
      const specBlock = container.querySelectorAll('.spec-block')
      const split = new SplitText(specBlock, {
        type: 'chars',
        charsClass: 'split-char',
      })

      const tweens = []

      if (!reduced) {
        tweens.push(
          gsap.from(split.chars, {
            autoAlpha: 0,
            duration: 0.01,
            stagger: 0.004,
            scrollTrigger: {
              trigger: container.querySelector('.spec-block'),
              start: 'top 88%',
            },
          }),
        )

        tweens.push(
          gsap.from(container.querySelector('.avatar-frame'), {
            xPercent: -24,
            rotate: -10,
            autoAlpha: 0,
            duration: 0.7,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: container,
              start: 'top 78%',
            },
          }),
        )

        tweens.push(
          gsap.from(container.querySelectorAll('.status-tag'), {
            y: 26,
            autoAlpha: 0,
            duration: 0.4,
            ease: 'power2.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: container,
              start: 'top 80%',
            },
          }),
        )

        tweens.push(
          gsap.to(container.querySelector('.about-ghost'), {
            yPercent: -34,
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }),
        )
      }

      cleanup = () => {
        tweens.forEach(t => {
          t.scrollTrigger?.kill()
          t.kill()
        })
        split.revert()
      }
    })()

    return () => {
      cancelled = true
      cleanup?.()
    }
  })
</script>

<section class="about-section" bind:this={container}>
  <span class="about-ghost" aria-hidden="true">01</span>

  <div class="about-inner">
    <div class="about-header">
      <h2 class="about-title">
        <span class="title-line">ABOUT</span>
        <span class="title-line outline">ME</span>
      </h2>

      <div class="status-row">
        <span class="status-tag">Status: Active</span>
        <span class="status-tag">Role: Engineer</span>
        <span class="status-tag">Loc: CN</span>
      </div>
    </div>

    <div class="about-body">
      <div class="avatar-frame">
        <div class="reg-mark tl"></div>
        <div class="reg-mark tr"></div>
        <div class="reg-mark bl"></div>
        <div class="reg-mark br"></div>
        <img src="/assets/QQAvatar.webp" alt="Headshot of Kino" width="210" height="210" />
        <span class="avatar-label">Fig.01 — Portrait</span>
        <svg class="frame-star" viewBox="-50 -50 100 100" aria-hidden="true">
          <path d="M0,-44 C5,-9 9,-5 44,0 C9,5 5,9 0,44 C-5,9 -9,5 -44,0 C-9,-5 -5,-9 0,-44 Z" />
        </svg>
      </div>

      <div class="about-specs">
        <div class="spec-block">
          <span class="spec-num">01</span>
          <p>
            Hi, I'm <strong>Kino</strong>, a software engineer dedicated to
            building clean, scalable, and user-centric applications. I find joy
            in translating complex problems into elegant lines of code.
          </p>
          <p>
            I believe that good software isn't just about functionality — it's
            about creating something that feels right. Currently, I'm focused on
            exploring the synergy between modern web architectures and seamless
            user experiences.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .about-section {
    position: relative;
    padding: 6rem 2rem 7rem;
    background: var(--bg-color);
    overflow: hidden;
  }

  :global(.theme-dark) .about-section {
    border-top: 10px solid var(--p5-red);
    background-image: repeating-linear-gradient(
      135deg,
      transparent 0 34px,
      rgb(230 0 18 / 0.05) 34px 36px
    );
  }

  .about-ghost {
    position: absolute;
    right: -2%;
    top: 7rem;
    font-family: var(--font-family-display);
    font-size: clamp(14rem, 30vw, 26rem);
    line-height: 1;
    color: transparent;
    -webkit-text-stroke: 3px var(--ghost-stroke);
    opacity: 0.35;
    user-select: none;
    pointer-events: none;
    will-change: transform;
  }

  :global(.theme-dark) .about-ghost {
    --ghost-stroke: var(--p5-red);
  }

  .about-ghost {
    --ghost-stroke: rgb(230 0 18 / 0.3);
  }

  .about-inner {
    position: relative;
    z-index: 1;
    max-width: 1000px;
    margin: 0 auto;
  }

  .about-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .about-title {
    margin: 0 0 2rem;
    display: flex;
    gap: 0.2em;
    user-select: none;
    transform: rotate(-2deg);
  }

  .title-line {
    display: block;
    font-family: var(--font-family-display);
    font-size: clamp(3.4rem, 14vw, 11rem);
    font-weight: 400;
    line-height: 0.82;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    transform: skewX(-8deg);
    color: var(--p5-ink);
    text-shadow:
      0.05em 0.05em 0 var(--p5-red),
      0.09em 0.09em 0 var(--p5-paper);
  }

  .title-line.outline {
    color: transparent;
    -webkit-text-stroke: 0.035em var(--p5-red);
    text-shadow: none;
  }

  :global(.theme-dark) .title-line {
    color: var(--p5-white);
    -webkit-text-stroke: 0.02em var(--p5-black);
    text-shadow:
      0.05em 0.05em 0 var(--p5-red),
      0.09em 0.09em 0 var(--p5-white);
  }

  :global(.theme-dark) .title-line.outline {
    color: transparent;
    -webkit-text-stroke: 0.035em var(--p5-white);
    text-shadow: 0.06em 0.06em 0 var(--p5-red);
  }

  .status-row {
    display: flex;
    gap: 0.9rem;
    flex-wrap: wrap;
    margin-bottom: 3rem;
  }

  .status-tag {
    font-family: var(--font-family-sans-code);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.4rem 0.85rem;
    border: 2px solid var(--p5-ink);
    color: var(--p5-ink);
    background: var(--p5-paper);
    transform: skewX(-10deg);
    box-shadow: 0.25rem 0.25rem 0 var(--p5-red);
  }

  .status-tag:first-child::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    background: var(--p5-red);
    margin-right: 0.5rem;
    vertical-align: middle;
    box-shadow: 0 0 6px var(--p5-red);
  }

  :global(.theme-dark) .status-tag {
    border-color: var(--p5-white);
    color: var(--p5-white);
    background: var(--p5-black);
    box-shadow: 0.25rem 0.25rem 0 var(--p5-red);
  }

  .about-body {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 3rem;
    align-items: start;
  }

  .avatar-frame {
    position: relative;
    padding: 12px;
    border: 3px solid var(--p5-ink);
    background: var(--p5-white);
    transform: rotate(-3deg);
    box-shadow: 0.7rem 0.7rem 0 var(--p5-red);
  }

  .avatar-frame img {
    display: block;
    width: 100%;
    height: auto;
    pointer-events: none;
    filter: contrast(1.05);
  }

  .frame-star {
    position: absolute;
    width: 3rem;
    right: -1.4rem;
    top: -1.4rem;
    fill: var(--p5-gold);
    stroke: var(--p5-ink);
    stroke-width: 7;
    paint-order: stroke;
    transform: rotate(14deg);
  }

  .avatar-label {
    display: block;
    font-family: var(--font-family-sans-code);
    font-size: 0.62rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--p5-ink);
    margin-top: 0.6rem;
    text-align: right;
  }

  :global(.theme-dark) .avatar-frame {
    border-color: var(--p5-white);
    background: var(--p5-black);
    box-shadow: 0.7rem 0.7rem 0 var(--p5-red);
  }

  :global(.theme-dark) .avatar-label {
    color: var(--p5-white);
    opacity: 0.75;
  }

  .reg-mark {
    position: absolute;
    width: 16px;
    height: 16px;
    z-index: 2;
  }

  .reg-mark::before,
  .reg-mark::after {
    content: '';
    position: absolute;
    background: var(--p5-ink);
  }

  .reg-mark::before {
    width: 100%;
    height: 2px;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }

  .reg-mark::after {
    width: 2px;
    height: 100%;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
  }

  :global(.theme-dark) .reg-mark::before,
  :global(.theme-dark) .reg-mark::after {
    background: var(--p5-white);
  }

  .reg-mark.tl {
    top: -8px;
    left: -8px;
  }
  .reg-mark.tr {
    top: -8px;
    right: -8px;
  }
  .reg-mark.bl {
    bottom: -8px;
    left: -8px;
  }
  .reg-mark.br {
    bottom: -8px;
    right: -8px;
  }

  .spec-block {
    position: relative;
    padding: 1.3rem 1.6rem 1.3rem 3.6rem;
    background: var(--p5-white);
    border: 3px solid var(--p5-ink);
    clip-path: var(--cut-notch);
    box-shadow: 0.45rem 0.45rem 0 var(--p5-red);
  }

  .spec-num {
    position: absolute;
    top: 1.3rem;
    left: 1rem;
    font-family: var(--font-family-display);
    font-size: 1.6rem;
    line-height: 1;
    color: var(--p5-red);
    transform: skewX(-8deg);
  }

  .spec-block :global(p) {
    font-size: 1.05rem;
    line-height: 1.8;
    margin: 0 0 0.8em;
    color: var(--p5-ink);
  }

  .spec-block :global(p:last-child) {
    margin-bottom: 0;
  }

  .spec-block :global(a) {
    color: var(--p5-ink);
    text-decoration: none;
    box-shadow: inset 0 -2px 0 var(--p5-red);
    transition:
      box-shadow 0.15s,
      color 0.15s;
  }

  .spec-block :global(a:hover) {
    box-shadow: inset 0 -1.8em 0 var(--p5-red);
    color: var(--p5-white);
  }

  :global(.theme-dark) .spec-block {
    background: var(--p5-white);
    border-color: var(--p5-white);
    box-shadow: 0.45rem 0.45rem 0 var(--p5-red);
  }

  :global(.theme-dark) .spec-block :global(p) {
    color: var(--p5-black);
    font-weight: 600;
  }

  :global(.theme-dark) .spec-block :global(a) {
    color: var(--p5-black);
  }

  :global(.theme-dark) .spec-block :global(a:hover) {
    color: var(--p5-white);
  }

  @media (max-width: 700px) {
    .about-body {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .avatar-frame {
      max-width: 200px;
      margin: 0 auto;
    }

    .status-row {
      justify-content: center;
    }
  }
</style>
