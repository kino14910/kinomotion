<script>
  let container = $state(null)

  $effect(() => {
    if (!container) return

    let cancelled = false
    let cleanup

    ;(async () => {
      const [{ default: gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/SplitText"),
      ])
      if (cancelled) return

      gsap.registerPlugin(ScrollTrigger, SplitText)

      const specBlock = container.querySelectorAll(".spec-block")
      const split = new SplitText(specBlock, {
        type: "chars",
        charsClass: "split-char",
      })

      const tween = gsap.from(split.chars, {
        autoAlpha: 0,
        duration: 0.01,
        stagger: 0.025,
        scrollTrigger: {
          trigger: specBlock,
          start: "top 95%",
        },
      })

      cleanup = () => {
        tween.scrollTrigger?.kill()
        tween.kill()
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
  <div class="dot-grid"></div>

  <div class="about-inner">
    <div class="about-header">
      <h2 class="about-title">
        <span class="title-line" data-text="ABOUT">ABOUT</span>
        <span class="title-line outline" data-text="ME">ME</span>
      </h2>

      <div class="status-row">
        <span class="status-tag">STATUS: ACTIVE</span>
        <span class="status-tag">ROLE: ENGINEER</span>
        <span class="status-tag">LOC: CN</span>
      </div>
    </div>

    <div class="about-body">
      <div class="avatar-frame">
        <div class="reg-mark tl"></div>
        <div class="reg-mark tr"></div>
        <div class="reg-mark bl"></div>
        <div class="reg-mark br"></div>
        <img src="/assets/QQAvatar.webp" alt="Headshot of Kino" width="210" height="210" />
        <span class="avatar-label">FIG.01 — PORTRAIT</span>
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
    padding: 5rem 2rem 6rem;
    background: var(--bg-color);
    overflow: hidden;
  }

  .dot-grid {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      circle,
      var(--outline-variant) 0.8px,
      transparent 0.8px
    );
    background-size: 24px 24px;
    opacity: 0.45;
    pointer-events: none;
    z-index: 0;
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
    font-weight: 400;
    line-height: 0.82;
    margin: 0 0 2rem;
    color: var(--primary-dark);
    display: flex;
    gap: 0.2em;
    user-select: none;
    letter-spacing: 0.04em;
    position: relative;
  }

  .title-line {
    position: relative;
    display: block;
    font-family: "Impact Regular", Impact, sans-serif;
    font-size: clamp(6rem, 13vw, 12rem);
    transform: scaleY(70%);
  }

  /* .title-line::after {
    content: attr(data-text);
    position: absolute;
    top: 0.06em;
    left: 0.06em;
    color: var(--white);
    opacity: 0.2;
    z-index: -1;
    pointer-events: none;
  } */
   
  :global(.theme-dark) .title-line {
    color: var(--p5-white);
    -webkit-text-stroke: 0.12rem var(--p5-black);
    text-shadow:
      0.06em 0.06em 0 var(--primary),
      0.1em 0.1em 0 var(--p5-white);
    transform: scaleY(70%) skewX(-8deg) rotate(-2deg);
  }

  .title-line.outline {
    color: transparent;
    -webkit-text-stroke: 3px var(--primary-dark);
  }

  .title-line.outline::after {
    color: var(--primary);
    opacity: 0.15;
    -webkit-text-stroke: 3px var(--primary);
  }

  .status-row {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 3rem;
  }

  .status-tag {
    font-family: "Roboto Mono", monospace;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.35rem 0.75rem;
    border: 2px solid var(--text-main);
    color: var(--text-main);
    background: transparent;
    position: relative;
  }

  .status-tag:first-child::before {
    content: "";
    display: inline-block;
    width: 6px;
    height: 6px;
    background: #22c55e;
    border-radius: 50%;
    margin-right: 0.5rem;
    vertical-align: middle;
    box-shadow: 0 0 6px #22c55e;
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
    border: 3px solid var(--text-main);
    background: var(--surface-container-low, var(--bg-color));
    transform: rotate(-2deg);
  }

  .avatar-frame img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 0;
    pointer-events: none;
    box-shadow: 8px 8px 0 var(--primary);
  }

  .avatar-label {
    display: block;
    font-family: "Roboto Mono", monospace;
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin-top: 0.6rem;
    text-align: right;
  }

  .reg-mark {
    position: absolute;
    width: 16px;
    height: 16px;
    z-index: 2;
  }

  .reg-mark::before,
  .reg-mark::after {
    content: "";
    position: absolute;
    background: var(--text-main);
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

  .about-specs {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .spec-block {
    position: relative;
    padding: 1.2rem 1.5rem 1.2rem 3.5rem;
    border-left: 4px solid var(--primary);
    background: var(--surface-container-low, transparent);
  }

  .spec-num {
    position: absolute;
    top: 1.2rem;
    left: 0.8rem;
    font-family: "Roboto Mono", monospace;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--primary);
    letter-spacing: 0.08em;
  }

  .spec-block :global(p) {
    font-size: 1.05rem;
    line-height: 1.8;
    margin: 0;
    color: var(--text-main);
  }

  .spec-block :global(a) {
    color: var(--primary-dark);
    text-decoration: none;
    box-shadow: inset 0 -2px 0 var(--primary);
    transition:
      box-shadow 0.15s,
      color 0.15s;
  }

  .spec-block :global(a:hover) {
    box-shadow: inset 0 -1.8em 0 var(--primary);
    color: var(--on-primary);
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

  /* Dark theme */
  :global(.theme-dark) .about-section {
    background: var(--p5-black);
    border-top: 10px solid var(--primary);
  }

  :global(.theme-dark) .dot-grid {
    background-image: repeating-linear-gradient(
      135deg,
      transparent 0 30px,
      rgba(230 0 32 / 0.06) 30px 32px
    );
    background-size: auto;
    opacity: 1;
  }

  :global(.theme-dark) .about-title {
    font-family: "Impact Regular", Impact, sans-serif;
    font-weight: 400;
    font-size: clamp(4rem, 12vw, 12rem);
    color: var(--p5-white);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    text-shadow:
      0.06em 0.06em 0 var(--primary),
      -0.04em -0.03em 0 var(--p5-black);
    -webkit-text-stroke: 0.02em var(--p5-black);
    transform: skewX(-4deg);
    margin: 0 0 2rem;
  }

  :global(.theme-dark) .title-line::after {
    color: var(--primary);
    opacity: 0.25;
    -webkit-text-stroke: 0;
  }

  :global(.theme-dark) .title-line.outline {
    -webkit-text-stroke: 4px var(--p5-white);
    color: transparent;
  }

  :global(.theme-dark) .title-line.outline::after {
    color: transparent;
    -webkit-text-stroke: 4px var(--primary);
    opacity: 0.35;
  }

  :global(.theme-dark) .status-tag {
    border-color: var(--p5-white);
    color: var(--p5-white);
    font-weight: 400;
    box-shadow: 0.2rem 0.2rem 0 var(--primary);
  }

  :global(.theme-dark) .status-tag:first-child::before {
    background: var(--primary);
    box-shadow: 0 0 6px var(--primary);
  }

  :global(.theme-dark) .avatar-frame {
    border-color: var(--p5-white);
    background: var(--p5-ink, var(--p5-black));
    padding: 10px;
  }

  :global(.theme-dark) .avatar-frame img {
    box-shadow: 0.6rem 0.6rem 0 var(--primary);
  }
  :global(.theme-dark) .avatar-label {
    color: var(--p5-white);
    opacity: 0.7;
  }
  :global(.theme-dark) .reg-mark::before,
  :global(.theme-dark) .reg-mark::after {
    background: var(--p5-white);
  }

  :global(.theme-dark) .spec-block {
    border-left-color: var(--primary);
    background: var(--p5-white);
    padding: 1.1rem 1.4rem 1.1rem 3.2rem;
    box-shadow: 0.4rem 0.4rem 0 var(--primary);
  }

  :global(.theme-dark) .spec-num {
    color: var(--primary);
    left: 0.7rem;
  }
  :global(.theme-dark) .spec-block :global(p) {
    color: var(--p5-black);
    font-weight: 700;
  }
  :global(.theme-dark) .spec-block :global(a) {
    color: var(--p5-black);
    box-shadow: inset 0 -2px 0 var(--primary);
  }
  :global(.theme-dark) .spec-block :global(a:hover) {
    box-shadow:
      inset 0 -1.8em 0 var(--primary),
      0.12em 0.12em 0 var(--p5-white);
  }

</style>
