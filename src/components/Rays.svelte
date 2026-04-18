<script>
  let container = $state()
  class Ray {
    constructor(containerWidth, containerHeight) {
      this.containerWidth = containerWidth

      const gap = 12
      this.x = Math.random() * containerWidth
      this.y = Math.floor(Math.random() * (containerHeight / gap + 1)) * gap

      this.width = 50 * Math.random()
      this.velocity = 0.25 + this.width / 50
      this.d = ''
    }

    update() {
      this.x -= this.velocity
      if (this.x < -this.width) {
        this.x = this.containerWidth
      }
    }

    draw() {
      this.d = `M ${this.x},${this.y} h ${this.width} v 1 h -${this.width} z `
    }

    tick() {
      this.update()
      this.draw()
    }
  }

  $effect(() => {
    if (!container) return

    let width = 0
    let height = 0
    let rays = []
    let animationFrameId

    const emit = () => {
      rays = []
      const totalRays = height * 0.75
      for (let i = 0; i < totalRays; i++) {
        rays.push(new Ray(width, height))
      }
    }

    const handleResize = () => {
      width = container.clientWidth
      height = container.clientHeight
      emit()
    }

    const tick = () => {
      let path = ''
      for (let i = 0; i < rays.length; i++) {
        rays[i].tick()
        path += rays[i].d
      }

      container.style.clipPath = `path("${path}")`
      container.style.webkitClipPath = `path("${path}")`

      animationFrameId = requestAnimationFrame(tick)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    animationFrameId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  })
</script>

<!-- <div class="a-rays-wrapper"> -->
<div class="a-rays" bind:this={container}></div>

<!-- </div> -->

<style>
  /* 增加一个外层 wrapper 防止内部绝对定位的元素溢出干扰页面布局 */
  /* .a-rays-wrapper {
    position: relative;
    width: 100dvw;
    height: 100dvh;
    overflow: hidden;
  } */

  .a-rays {
    position: absolute;
    top: 50%;
    left: 50%;

    width: 200vh;
    height: 200vw;

    background-image: repeating-linear-gradient(
      50deg,
      var(--rays-color-1) 0,
      var(--rays-color-2) 20px,
      var(--rays-color-3) 40px,
      var(--rays-color-2) 60px,
      var(--rays-color-1) 80px
    );

    transform: translate3d(-50%, -50%, 0) rotate(-70deg);

    /* 避免某些浏览器下的渲染毛边 */
    will-change: clip-path;
    z-index: -1;
  }
</style>
