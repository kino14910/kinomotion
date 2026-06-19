import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import { defineConfig } from 'astro/config';
import rehypeExternalLinks from 'rehype-external-links';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';

// https://astro.build/config
export default defineConfig({
  site: 'https://kinomotion.vercel.app',
  integrations: [mdx(), sitemap(), svelte()],
  markdown: {
    shikiConfig: {
      theme: 'dark-plus',
    },
    processor: unified({
      remarkPlugins: [remarkGfm, remarkSmartypants],
      rehypePlugins: [
        [
          rehypeExternalLinks,
          {
            target: '_blank',
            rel: ['nofollow', 'noopener', 'noreferrer'],
          },
        ],
      ],
    }),
  },
})
