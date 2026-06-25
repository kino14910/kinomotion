import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import { defineConfig } from 'astro/config';
import rehypeExternalLinks from 'rehype-external-links';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';
import rehypeSlug from 'rehype-slug';

// https://astro.build/config
export default defineConfig({
  site: 'https://kinomotion.pages.dev',
  integrations: [mdx(), sitemap(), svelte()],
  markdown: {
    shikiConfig: {
      theme: 'dark-plus',
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
