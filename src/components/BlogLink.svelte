<script>
  import FormattedDate from './FormattedDate.svelte'
  const { url, title, showDate, pubDate } = $props()
</script>

<a href={url}>
  <h6 class="title">{title}</h6>
  {#if showDate}
    <p class="date">
      <FormattedDate date={pubDate} />
    </p>
  {/if}
</a>

<style>
  .title {
    margin: 0;
    color: var(--text-main);
    line-height: 1;
  }

  * {
    text-decoration: none;
    transition: 0.2s ease;
  }

  a {
    display: block;
  }

  .title {
    margin: 0;
    color: var(--text-main);
    line-height: 1;
    position: relative;
    display: inline-block;
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

  .title:before {
    position: absolute;
    top: calc(50% - 4px);
    left: -13px;
    border-top: 4px solid transparent;
    border-left: 8px solid currentcolor;
    border-bottom: 4px solid transparent;
    opacity: 0;
    content: '';
  }

  a:hover .title:before {
    animation: blink-in 0.3s cubic-bezier(1, 0, 0, 1) forwards;
  }

  .date {
    margin: 0;
    color: var(--primary-gray);
  }

  a:hover h6,
  a:hover .date {
    color: var(--primary);
  }

  :global(.theme-dark) a {
    min-height: 100%;
    padding: 1rem 2rem;
    background: var(--p5-black);
    border: 3px solid var(--p5-white);
    box-shadow: 0.35rem 0.35rem 0 var(--primary);
    /* clip-path: polygon(0.8rem 0, 100% 0, calc(100% - 0.8rem) 100%, 0 100%); */
    transform: skewX(-5deg);
  }

  :global(.theme-dark) a:hover {
    background: var(--primary);
    color: var(--p5-white);
    border-color: var(--p5-white);
    box-shadow: 0.5rem 0.5rem 0 var(--p5-white);
    transform: translate(-0.12rem, -0.12rem) rotate(-1deg) skewX(-5deg);
  }

  :global(.theme-dark) .title {
    color: var(--p5-white);
    font-family: 'Impact Regular';
    font-size: clamp(1.25rem, 1.8vw, 1.85rem);
    font-weight: 400;
    line-height: 0.95;
    text-transform: uppercase;
  }

  :global(.theme-dark) .title:before {
    left: -18px;
    border-top-width: 7px;
    border-left-width: 13px;
    border-bottom-width: 7px;
    color: var(--p5-white);
  }

  :global(.theme-dark) .date {
    margin-top: 0.6rem;
    color: var(--p5-white);
    font-weight: 800;
  }

  :global(.theme-dark) a:hover .title,
  :global(.theme-dark) a:hover .date {
    color: var(--p5-white);
  }
</style>
