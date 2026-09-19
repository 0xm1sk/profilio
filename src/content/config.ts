import { defineCollection, z } from 'astro:content';

const baseSchema = z.object({
  title: z.string(),
  date: z.date(),
});

export const collections = {
  research: defineCollection({
    schema: baseSchema.extend({
      tags: z.array(z.string()),
      category: z.string(),
      status: z.string(),
    }),
  }),
  writeups: defineCollection({
    schema: baseSchema.extend({
      target: z.string(),
      difficulty: z.string(),
      tags: z.array(z.string()),
    }),
  }),
  projects: defineCollection({
    schema: baseSchema.extend({
      github: z.string().url(),
      tech_stack: z.array(z.string()),
      description: z.string(),
    }),
  }),
  tools: defineCollection({
    schema: baseSchema.extend({
      version: z.string(),
      language: z.string(),
      github: z.string().url(),
      description: z.string(),
    }),
  }),
  notes: defineCollection({
    schema: baseSchema.extend({
      tags: z.array(z.string()),
    }),
  }),
  progress: defineCollection({
    schema: baseSchema.extend({
      phase: z.string(),
      completion: z.number().min(0).max(100),
      updated: z.date(),
    }),
  }),
};
