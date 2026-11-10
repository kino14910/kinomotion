import FallbackImage from '@/assets/cg_rm18_0103.webp'
import type { ImageMetadata } from 'astro'
import { getImage } from 'astro:assets'

export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630

/** 将任意封面压缩成统一的社交分享图，避免直接引用原始大图 */
export function getOgImage(image?: ImageMetadata) {
  return getImage({
    src: image ?? FallbackImage,
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    fit: 'cover',
    format: 'jpeg',
    quality: 82,
  })
}
