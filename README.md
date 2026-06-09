# Kino Motion

Kino Motion is a personal frontend interaction lab built with Astro, Svelte and TypeScript.

[![Astro](https://img.shields.io/badge/Astro-6.1.8-FF5D01?style=flat&logo=astro)](https://astro.build/)
[![Svelte](https://img.shields.io/badge/Svelte-5.55.4-FF3E00?style=flat&logo=svelte)](https://svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)

## Features

- Astro static site generation
- Svelte 5 interactive components
- Markdown and MDX notes through Astro Content Collections
- Light and dark themes
- RSS and sitemap generation

## Tech Stack

- Astro 6.1.8
- Svelte 5.55.4
- TypeScript 5.9.3
- Lenis for smooth scrolling
- Sharp for image processing

## Project Structure

```text
kinomotion/
├── public/
│   ├── assets/
│   └── fonts/
├── src/
│   ├── components/
│   ├── content/note/
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── astro.config.mjs
├── svelte.config.js
└── tsconfig.json
```

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:4321](http://localhost:4321).

## Quality Checks

```bash
pnpm check
pnpm build
```

Use `pnpm verify` to run both checks before publishing.

## Content

Create Markdown or MDX notes in `src/content/note/`.

```markdown
---
title: 'Note title'
description: 'Short summary'
pubDate: 2024-01-01
updatedDate: 2024-01-02
tags: ['frontend']
---

Note content...
```

## License

MIT
