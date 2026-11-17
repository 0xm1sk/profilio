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
      description: z.string().optional(),
    }),
  }),
  writeups: defineCollection({
    schema: baseSchema.extend({
      target: z.string(),
      difficulty: z.string(),
      tags: z.array(z.string()),
      category: z.string().optional(),
      description: z.string().optional(),
    }),
  }),
  projects: defineCollection({
    schema: baseSchema.extend({
      github: z.string().url(),
      tech_stack: z.array(z.string()),
      description: z.string(),
      category: z.string().optional(),
    }),
  }),
  tools: defineCollection({
    schema: baseSchema.extend({
      version: z.string(),
      language: z.string(),
      github: z.string().url(),
      description: z.string(),
      category: z.string().optional(),
    }),
  }),
  notes: defineCollection({
    schema: baseSchema.extend({
      tags: z.array(z.string()),
      category: z.string().optional(),
      description: z.string().optional(),
    }),
  }),
};
