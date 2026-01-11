import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Dynamically import netlify adapter only for build to avoid fetch issues in dev
const isBuild = process.env.npm_lifecycle_event === 'build';
const netlifyAdapter = isBuild ? (await import('@astrojs/netlify')).default : undefined;

// https://astro.build/config
export default defineConfig({
  site: 'https://technologiyaa.netlify.app',
  integrations: [react()],
  output: 'server',
  adapter: netlifyAdapter ? netlifyAdapter() : undefined,
  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },
});

