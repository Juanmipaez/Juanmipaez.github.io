// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// TODO(domain): once the custom domain is set up, change `site` to it
// (e.g. 'https://juanpaez.dev') and remove `base`.
export default defineConfig({
  site: 'https://juanmipaez.github.io',
  trailingSlash: 'ignore',
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
