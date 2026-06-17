<main class="home-welcome">
  <div class="background"></div>
  <div class="home-container">
    <div class="home-copy">
      <h1>Kino Motion</h1>
      <p>Interaction Lab by Kino</p>
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
      url('/assets/hero-image.png');
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

  :global(.theme-dark) .home-copy {
    flex: 0 1 auto;
    margin-top: 7rem;
    transform: rotate(-2deg);
  }

  :global(.theme-dark) .home-copy h1 {
    display: inline-block;
    margin: 0 0 0.2em;
    color: var(--p5-white);
    font-family: 'Impact Regular';
    font-size: clamp(4rem, 13vw, 12rem);
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
    transform: skewX(-12deg);
    box-shadow: 0.35em 0.35em 0 var(--primary);
  }

  :global(.theme-dark) .home-copy p a {
    color: var(--p5-black);
    box-shadow: inset 0 -0.18em 0 var(--primary);
  }

  @media (max-width: 800px) {
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
