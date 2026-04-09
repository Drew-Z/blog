import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const publishedArticles = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/published-articles',
    generateId: ({ entry }) => entry.replace(/\.md$/, '')
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    coverImage: z.string().optional()
  })
});

const articleWorkbench = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/articles',
    generateId: ({ entry }) => entry.replace(/\.md$/, '')
  }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    pubDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(true),
    featured: z.boolean().default(false),
    coverImage: z.string().optional()
  })
});

const games = defineCollection({
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    status: z.enum(['prototype', 'playable', 'showcase', 'ongoing']),
    tags: z.array(z.string()).default([]),
    engine: z.string().default('Godot 4'),
    platforms: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    thumbnail: z.string().optional(),
    screenshots: z.array(
      z.object({
        src: z.string(),
        title: z.string(),
        note: z.string().optional()
      })
    ).default([]),
    playableWeb: z.boolean().default(false),
    embedUrl: z.string().optional(),
    downloadLinks: z.array(
      z.object({
        label: z.string(),
        url: z.string()
      })
    ).default([]),
    externalPage: z.string().optional(),
    role: z.string().optional(),
    teamSize: z.string().optional(),
    challenge: z.string().optional(),
    mechanic: z.string().optional(),
    contribution: z.array(z.string()).default([]),
    outcome: z.string().optional(),
    nextStep: z.array(z.string()).default([]),
    devlogSlugs: z.array(z.string()).default([])
  })
});

const devlogs = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    project: z.enum(['game-first-tetris', 'game-next-spacewar', 'blog-platform']),
    relatedGame: z.string().optional(),
    status: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    coverImage: z.string().optional(),
    highlights: z.array(z.string()).default([])
  })
});

export const collections = { publishedArticles, articleWorkbench, games, devlogs };
