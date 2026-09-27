<script>
  let {
    items = [],
    speed = 22,
    variant = 'red',
    separator = '★',
  } = $props()
</script>

<div class={['marquee', `marquee-${variant}`]} style:--speed="{speed}s" aria-hidden="true">
  <div class="marquee-track">
    {#each [0, 1] as copy (copy)}
      <div class="marquee-group">
        {#each items as item, i (i)}
          <span class="marquee-item" class:outline={i % 2 === 1}>{item}</span>
          <span class="marquee-star">{separator}</span>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .marquee {
    overflow: hidden;
    user-select: none;
    white-space: nowrap;
    border-block: 4px solid var(--band-border);
    background: var(--band-bg);
    color: var(--band-fg);
  }

  .marquee-red {
    --band-bg: var(--p5-red);
    --band-fg: var(--p5-white);
    --band-border: var(--p5-black);
    --band-stroke: var(--p5-black);
  }

  .marquee-ink {
    --band-bg: var(--p5-ink);
    --band-fg: var(--p5-paper);
    --band-border: var(--p5-red);
    --band-stroke: var(--p5-paper);
  }

  :global(.theme-dark) .marquee-ink {
    --band-bg: var(--p5-black);
    --band-fg: var(--p5-white);
  }

  .marquee-paper {
    --band-bg: var(--p5-paper);
    --band-fg: var(--p5-ink);
    --band-border: var(--p5-red);
    --band-stroke: var(--p5-red);
  }

  :global(html:not(.theme-dark)) .marquee-red {
    --band-bg: var(--dd-yellow);
    --band-fg: var(--dd-ink);
    --band-border: var(--dd-pink);
    --band-stroke: var(--dd-pink);
  }

  :global(html:not(.theme-dark)) .marquee-ink {
    --band-bg: var(--dd-pink);
    --band-fg: var(--p5-white);
    --band-border: var(--dd-ink);
    --band-stroke: var(--dd-yellow);
  }

  .marquee-track {
    display: flex;
    width: max-content;
    animation: marquee-scroll var(--speed) linear infinite;
  }

  .marquee-group {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .marquee-item {
    font-family: var(--font-family-display);
    font-size: clamp(1.6rem, 3.4vw, 3rem);
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 0.35em 0.5em;
    transform: skewX(-6deg);
  }

  .marquee-item.outline {
    color: transparent;
    -webkit-text-stroke: 2px var(--band-fg);
  }

  .marquee-star {
    font-size: clamp(1.1rem, 2.2vw, 1.9rem);
    color: var(--band-stroke);
    transform: rotate(12deg);
  }

  @keyframes marquee-scroll {
    to {
      transform: translateX(-50%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .marquee-track {
      animation: none;
    }
  }
</style>
