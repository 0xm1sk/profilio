import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://0xm1sk.github.io',
  base: '/profilio',
  trailingSlash: 'always',
  integrations: [tailwind()],
});
