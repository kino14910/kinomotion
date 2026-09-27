<script>
  import { onMount } from 'svelte'

  let theme = $state(
    typeof document !== 'undefined' && document.documentElement.classList.contains('theme-dark')
      ? 'dark'
      : 'light'
  )

  onMount(() => {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme && storedTheme !== theme) {
      theme = storedTheme
    } else if (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme = 'dark'
    }
  })

  $effect(() => {
    const rootEl = document.documentElement
    if (theme === 'dark') {
      rootEl.classList.add('theme-dark')
    } else {
      rootEl.classList.remove('theme-dark')
    }
  })

  let buttonEl = $state(null)

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', next)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || typeof document.startViewTransition !== 'function' || !buttonEl) {
      theme = next
      return
    }

    const rect = buttonEl.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    const transition = document.startViewTransition(() => {
      document.documentElement.classList.add('vt-active')
      document.documentElement.classList.toggle('theme-dark', next === 'dark')
    })

    theme = next

    transition.finished
      .catch(() => {})
      .then(() => {
        document.documentElement.classList.remove('vt-active')
      })

    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 500,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        )
      })
      .catch(() => {})
  }
</script>

<div class="theme-toggle">
  <button
    class="theme-button"
    bind:this={buttonEl}
    onclick={toggleTheme}
    title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
    aria-label={theme === 'light'
      ? 'Switch to dark theme'
      : 'Switch to light theme'}
  >
    {#key theme}
      {#if theme === 'light'}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
          />
        </svg>
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clip-rule="evenodd"
          />
        </svg>
      {/if}
    {/key}
  </button>
</div>

<style>
  .theme-toggle {
    display: inline-flex;
    align-items: center;
    margin-left: 12px;
  }

  .theme-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    padding: 0;
    cursor: pointer;
    background: var(--dd-yellow);
    color: var(--dd-ink);
    border: 2px solid var(--dd-ink);
    box-shadow: 0.2rem 0.2rem 0 var(--dd-pink);
    transform: skewX(-10deg);
    transition:
      transform 0.18s ease,
      box-shadow 0.18s ease,
      background-color 0.18s ease,
      color 0.18s ease;
  }

  .theme-button:hover {
    background: var(--dd-pink);
    color: var(--p5-white);
    box-shadow: 0.3rem 0.3rem 0 var(--dd-ink);
    transform: translate(-0.06rem, -0.06rem) skewX(-10deg);
  }

  .theme-button:focus-visible {
    outline: 3px solid var(--p5-red);
    outline-offset: 3px;
  }

  .theme-button svg {
    width: 20px;
    height: 20px;
    transform: skewX(10deg);
    animation: icon-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes icon-pop {
    from {
      transform: skewX(10deg) rotate(-100deg) scale(0.4);
      opacity: 0;
    }
    to {
      transform: skewX(10deg) rotate(0deg) scale(1);
      opacity: 1;
    }
  }

  :global(.theme-dark) .theme-button {
    background: var(--p5-white);
    color: var(--p5-black);
    border-color: var(--p5-red);
    box-shadow: 0.2rem 0.2rem 0 var(--p5-red);
  }

  :global(.theme-dark) .theme-button:hover {
    background: var(--p5-red);
    color: var(--p5-white);
    box-shadow: 0.3rem 0.3rem 0 var(--p5-white);
  }

  :global(.theme-dark) .theme-button:focus-visible {
    outline-color: var(--p5-white);
  }
</style>
