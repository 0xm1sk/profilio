import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: "https://0xm1sk.github.io",
  base: '/profilio',
  // Accept URLs both with and without a trailing slash. This keeps old links,
  // manual URLs, and cached pages working instead of 404-ing in dev.
  trailingSlash: 'ignore',
  integrations: [tailwind()],
});
