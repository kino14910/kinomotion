<script lang="ts">
  import { SvelteMap } from 'svelte/reactivity'
  import type { Attachment } from 'svelte/attachments'

  const imageCount = 10
  let imgs = $state(
    Array.from({ length: imageCount }, (_, i) => `/assets/pokers/poker${i}.jpg`),
  )
  let imgIndex = $state(5)
  let transformDatas = [
    'rotate(-10deg)',
    'rotate(-6deg) translate(35%, -12%)',
    'rotate(-2deg) translate(65%, -19%)',
    'rotate(2deg) translate(95%, -26%)',
    'rotate(6deg) translate(125%, -23%)',
  ]
  let cards = $state([
    {
      id: 0,
      nums: 0,
      src: imgs[4],
      transitioning: true,
      dragging: false,
      offsetX: 0,
      offsetY: 0,
    },
    {
      id: 1,
      nums: 1,
      src: imgs[3],
      transitioning: true,
      dragging: false,
      offsetX: 0,
      offsetY: 0,
    },
    {
      id: 2,
      nums: 2,
      src: imgs[2],
      transitioning: true,
      dragging: false,
      offsetX: 0,
      offsetY: 0,
    },
    {
      id: 3,
      nums: 3,
      src: imgs[1],
      transitioning: true,
      dragging: false,
      offsetX: 0,
      offsetY: 0,
    },
    {
      id: 4,
      nums: 4,
      src: imgs[0],
      transitioning: true,
      dragging: false,
      offsetX: 0,
      offsetY: 0,
    },
  ])

  // $inspect(cards[1].offsetX)

  let cardElements = new SvelteMap<number, HTMLElement>()
  let container: HTMLElement | null

  function cardRef(id: number): Attachment {
    return (el) => {
      cardElements.set(id, el as HTMLElement)
      return () => {
        cardElements.delete(id)
      }
    }
  }

  let activeCardId: number | null

  function handlePointerDown(e: PointerEvent, cardId: number) {
    activeCardId = cardId
    const card = cards.find(c => c.id === cardId)
    const draggingCard = cardElements.get(cardId)
    if (card && draggingCard && container) {
      draggingCard.setPointerCapture(e.pointerId)
      card.dragging = true
      card.transitioning = false

      const cardRect = draggingCard.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()

      card.offsetX = e.clientX - containerRect.x - cardRect.width / 2
      card.offsetY = e.clientY - containerRect.y - cardRect.height / 2
    }
  }

  function handlePointerMove(e: PointerEvent) {
    if (activeCardId === null) return
    const card = cards.find(c => c.id === activeCardId)
    const draggingCard = cardElements.get(activeCardId)
    if (!(card && card.dragging && draggingCard && container)) return
    const cardRect = draggingCard.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    card.offsetX = e.clientX - containerRect.x - cardRect.width / 2
    card.offsetY = e.clientY - containerRect.y - cardRect.height / 2
  }

  function handlePointerUp(e?: PointerEvent) {
    if (activeCardId === null) return
    const draggingCard = cardElements.get(activeCardId)
    if (e && draggingCard?.hasPointerCapture(e.pointerId)) {
      draggingCard.releasePointerCapture(e.pointerId)
    }
    const card = cards.find(c => c.id === activeCardId)
    if (card) {
      card.dragging = false
      card.transitioning = true
      card.offsetX = 0
      card.offsetY = 0
    }
    activeCardId = null
  }

  function move() {
    for (let card of cards) {
      let newNums = card.nums + 1

      if (newNums >= transformDatas.length) {
        card.nums = 0
        card.transitioning = false
        card.src = imgs[imgIndex]
        imgIndex = (imgIndex + 1) % imgs.length
      } else {
        card.nums = newNums
        card.transitioning = true
      }
    }
  }
</script>

<main
  class="home-photos"
  onpointermove={handlePointerMove}
  onpointerup={handlePointerUp}
  onpointercancel={handlePointerUp}
>
  <div class="home-photos-container">
    <h4 class="title">POKER</h4>
    <div class="home-photos-plates" bind:this={container}>
      {#each cards as card, index (card.id)}
        <div
          class={['poker', { dragging: card.dragging }]}
          role="img"
          style:--poker-transform={transformDatas[card.nums]}
          style:z-index={card.nums}
          style:transform={card.dragging
            ? `translate(${card.offsetX}px, ${card.offsetY}px) scale(1.2)`
            : 'var(--poker-transform)'}
          style:transition={card.transitioning && !card.dragging
            ? 'transform 0.3s ease'
            : 'none'}
          onpointerdown={e => handlePointerDown(e, card.id)}
          {@attach cardRef(card.id)}
        >
          <img src={card.src} alt="Poker Card" loading="lazy" />
        </div>
      {/each}
      <div
        class="poker-top"
        onclick={move}
        onkeydown={e => (e.key === 'Enter' || e.key === ' ') && move()}
        role="button"
        tabindex="0"
        aria-label="Next Card"
      >
        <img
          src="/assets/pokers/poker-back.jpg"
          alt="Poker Card Back"
          loading="lazy"
        />
        <div class="arrow-wrapper">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  .home-photos {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100dvw;
    height: 100dvh;
    /* overflow: hidden; */
    isolation: isolate;
  }

  .home-photos-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    width: 45rem;
    height: 100%;
  }

  .title {
    display: block;
    font-size: clamp(6rem, 13vw, 12rem);
    font-family: 'Impact Regular';
    font-weight: 400;
    color: transparent;
    letter-spacing: 0.15rem;
    -webkit-text-stroke: 0.15rem var(--on-secondary-fixed-variant);
    transform: scaleY(70%);
  }

  :global(.theme-dark) .title {
    color: var(--p5-white);
    -webkit-text-stroke: 0.12rem var(--p5-black);
    text-shadow:
      0.06em 0.06em 0 var(--primary),
      0.1em 0.1em 0 var(--p5-white);
    transform: scaleY(70%) skewX(-8deg) rotate(-2deg);
  }

  .home-photos-plates {
    position: relative;
    width: 45rem;
    height: 25rem;
    margin-bottom: 1rem;
  }

  .poker,
  .poker-top {
    user-select: none;
    position: absolute;
    width: 20rem;
    height: 26rem;
    border: 0.2rem solid var(--on-background);
    border-radius: 1.5rem;
    background-color: var(--primary-dark);
    transform-origin: bottom left;
    overflow: hidden;
    transform: var(--poker-transform);
  }

  .poker:hover {
    transform: var(--poker-transform) translateY(-50px);
  }

  .poker.dragging {
    position: absolute;
    cursor: grabbing;
    z-index: 1000 !important;
  }

  .poker img {
    position: relative;
    width: 100%;
    height: 100%;
    object-fit: fill;
    pointer-events: none;
  }

  .poker-top {
    background-color: var(--primary);
    border: none;
    cursor: pointer;
    z-index: 9;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: rotate(6deg) translate(125%, -23%);

    & img {
      position: relative;
      width: 100%;
      height: 100%;
      object-fit: fill;
      pointer-events: none;
    }
  }

  .arrow-wrapper {
    position: absolute;
    width: 3rem;
    height: 3rem;
    background-color: var(--on-primary-fixed);
    color: var(--on-primary);
    border-radius: 50%;
    animation: arrow-move 1.5s infinite ease-in-out;
    filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.5));
  }

  :global(.theme-dark) .arrow-wrapper {
    background-color: var(--p5-white);
    color: var(--p5-black);
    border: 0.18rem solid var(--primary);
    border-radius: 0;
    filter: drop-shadow(0.22rem 0.22rem 0 var(--primary));
  }

  @keyframes arrow-move {
    0%,
    100% {
      transform: translateX(0);
      opacity: 0.6;
    }
    50% {
      transform: translateX(15px);
      opacity: 0.9;
    }
  }

  .arrow-wrapper svg {
    width: 100%;
    height: 100%;
  }

  @media screen and (max-width: 520px) {
    .home-photos {
      height: 60dvh;
    }
    .home-photos-container,
    .home-photos-plates {
      width: 23rem;
    }
    .poker,
    .poker-top {
      width: 10rem;
      height: 13rem;
    }
  }
</style>
