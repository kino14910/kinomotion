import type Lenis from 'lenis'

let instance: Lenis | null = null

export function setLenis(lenis: Lenis | null) {
  instance = lenis
}

export function scrollTo(
  target: number | string | HTMLElement,
  options: { offset?: number } = {},
) {
  if (instance) {
    instance.scrollTo(target, options)
    return
  }
  // Fallback when Lenis is not available
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' })
  } else if (target instanceof HTMLElement) {
    const top =
      target.getBoundingClientRect().top + window.scrollY - (options.offset ?? 0)
    window.scrollTo({ top, behavior: 'smooth' })
  }
}
