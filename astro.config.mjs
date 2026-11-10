import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import { defineConfig } from 'astro/config';
import rehypeExternalLinks from 'rehype-external-links';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';
import rehypeSlug from 'rehype-slug';

const shikiTokenColors = new Set([
  '#d4d4d4',
  '#9cdcfe',
  '#569cd6',
  '#dcdcaa',
  '#6a9955',
  '#ce9178',
  '#4ec9b0',
  '#b5cea8',
  '#808080',
  '#c586c0',
  '#4fc1ff',
  '#c8c8c8',
  '#d16969',
  '#d7ba7d',
  '#f44747',
]);

// 把 dark-plus 的 token 颜色从内联 style 换成等值 CSS 类，颜色不变但 HTML 更小。
// 未列出的颜色保持内联，避免以后换主题时丢色。
function shikiColorClassTransformer() {
  return {
    name: 'shiki-color-class',
    span(hast) {
      const style = hast.properties?.style;
      if (typeof style !== 'string') return;
      const match = style.match(/^color:(#[0-9a-fA-F]{6});?$/);
      if (!match) return;
      const color = match[1].toLowerCase();
      if (!shikiTokenColors.has(color)) return;
      hast.properties.class = `tc${color.slice(1)}`;
      delete hast.properties.style;
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://kinomotion.pages.dev',
  trailingSlash: 'always',
  prefetch: true,
  integrations: [mdx(), sitemap(), svelte()],
  vite: {
    optimizeDeps: {
      noDiscovery: true,
      include: ['gsap', 'gsap/ScrollTrigger', 'gsap/SplitText', 'lenis'],
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'dark-plus',
      transformers: [shikiColorClassTransformer()],
    },
    processor: unified({
      remarkPlugins: [remarkGfm, remarkSmartypants],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeExternalLinks,
          {
            target: '_blank',
            rel: ['noopener', 'noreferrer'],
          },
        ],
      ],
    }),
  },
})
