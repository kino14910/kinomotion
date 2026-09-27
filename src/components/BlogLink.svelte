<script>
  import FormattedDate from './FormattedDate.svelte'
  const { url, title, showDate, pubDate, index = 0 } = $props()

  const num = $derived(String(index + 1).padStart(2, '0'))
</script>

<a href={url}>
  <span class="ghost-num" aria-hidden="true">{num}</span>
  <h2 class="title">{title}</h2>
  {#if showDate}
    <p class="date">
      <FormattedDate date={pubDate} />
    </p>
  {/if}
</a>

<style>
  a {
    position: relative;
    display: block;
    min-height: 100%;
    padding: 1.4rem 1.6rem 1.2rem;
    box-sizing: border-box;
    text-decoration: none;
    background: var(--p5-white);
    border: 3px solid var(--p5-ink);
    clip-path: var(--cut-notch);
    box-shadow: 0.35rem 0.35rem 0 var(--p5-red);
    transform: skewX(-4deg) rotate(var(--tilt, 0deg));
    transition:
      transform 0.18s ease,
      box-shadow 0.18s ease,
      background-color 0.18s ease;
    overflow: hidden;
  }

  a:hover {
    background: var(--p5-red);
    border-color: var(--p5-ink);
    box-shadow: 0.5rem 0.5rem 0 var(--p5-ink);
    transform: translate(-0.12rem, -0.12rem) skewX(-4deg) rotate(0deg);
  }

  .ghost-num {
    position: absolute;
    top: -0.18em;
    right: 0.08em;
    font-family: var(--font-family-display);
    font-size: 4.6rem;
    line-height: 1;
    color: transparent;
    -webkit-text-stroke: 2.5px var(--p5-red);
    opacity: 0.7;
    transform: skewX(4deg);
    transition:
      -webkit-text-stroke-color 0.18s ease,
      opacity 0.18s ease;
    pointer-events: none;
  }

  a:hover .ghost-num {
    -webkit-text-stroke-color: var(--p5-white);
    opacity: 0.9;
  }

  .title {
    position: relative;
    margin: 0;
    font-family: var(--font-family-display);
    font-size: clamp(1.3rem, 1.7vw, 1.7rem);
    font-weight: 800;
    line-height: 1.1;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    color: var(--p5-ink);
    display: inline-block;
    transition: color 0.18s ease;
  }

  @keyframes blink-in {
    0%,
    30%,
    60% {
      opacity: 0;
    }

    15%,
    45%,
    75%,
    to {
      opacity: 1;
    }
  }

  .title::before {
    content: '';
    position: absolute;
    top: calc(50% - 6px);
    left: -20px;
    border-top: 6px solid transparent;
    border-left: 11px solid currentcolor;
    border-bottom: 6px solid transparent;
    opacity: 0;
  }

  a:hover .title::before {
    animation: blink-in 0.3s cubic-bezier(1, 0, 0, 1) forwards;
  }

  .date {
    position: relative;
    display: inline-block;
    margin: 0.7rem 0 0;
    padding: 0.15em 0.55em;
    font-family: var(--font-family-sans-code);
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--p5-white);
    background: var(--p5-ink);
    transform: skewX(-8deg);
    transition:
      color 0.18s ease,
      background-color 0.18s ease;
  }

  a:hover .title {
    color: var(--p5-white);
  }

  a:hover .date {
    background: var(--p5-white);
    color: var(--p5-ink);
  }

  :global(.theme-dark) a {
    background: var(--p5-black);
    border-color: var(--p5-white);
    box-shadow: 0.35rem 0.35rem 0 var(--p5-red);
  }

  :global(.theme-dark) a:hover {
    background: var(--p5-red);
    border-color: var(--p5-white);
    box-shadow: 0.5rem 0.5rem 0 var(--p5-white);
  }

  :global(.theme-dark) .title {
    color: var(--p5-white);
  }

  :global(.theme-dark) a:hover .title {
    color: var(--p5-white);
  }

  :global(.theme-dark) .date {
    background: var(--p5-white);
    color: var(--p5-black);
  }

  :global(.theme-dark) a:hover .date {
    background: var(--p5-black);
    color: var(--p5-white);
  }
</style>
