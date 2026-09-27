<script lang="ts">
  import { scrollTo } from '@/lib/lenis'

  let visible = $state(false)

  function handleScroll() {
    visible = window.scrollY > 100
  }

  function scrollToTop() {
    scrollTo(0)
  }
</script>

<svelte:window onscroll={handleScroll} />

<button
  class={['back-to-top', { visible }]}
  onclick={scrollToTop}
  aria-label="回到顶部"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M18 15l-6-6-6 6" />
  </svg>
</button>

<style>
  .back-to-top {
    position: fixed;
    bottom: 2em;
    right: 2em;
    width: 48px;
    height: 48px;
    background: var(--p5-ink);
    color: var(--p5-paper);
    border: 3px solid var(--p5-ink);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px) skewX(-10deg);
    transition:
      opacity 0.3s ease,
      visibility 0.3s ease,
      transform 0.3s ease,
      background-color 0.18s ease,
      color 0.18s ease,
      box-shadow 0.18s ease;
    box-shadow: 0.3rem 0.3rem 0 var(--p5-red);
    z-index: 9;

    &.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) skewX(-10deg);
    }

    &:hover {
      background: var(--p5-red);
      color: var(--p5-white);
      transform: translateY(-3px) skewX(-10deg);
      box-shadow: 0.45rem 0.45rem 0 var(--p5-ink);
    }

    &:active {
      transform: translateY(0) skewX(-10deg);
    }

    & svg {
      transform: skewX(10deg);
    }
  }

  :global(.theme-dark) .back-to-top {
    background: var(--p5-red);
    color: var(--p5-white);
    border-color: var(--p5-white);
    box-shadow: 0.3rem 0.3rem 0 var(--p5-white);
  }

  :global(.theme-dark) .back-to-top:hover {
    background: var(--p5-white);
    color: var(--p5-black);
    box-shadow: 0.45rem 0.45rem 0 var(--p5-red);
  }

  @media (max-width: 768px) {
    .back-to-top {
      bottom: 1.5em;
      right: 1.5em;
      width: 40px;
      height: 40px;
    }
  }
</style>
