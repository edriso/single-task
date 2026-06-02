import { z } from 'zod';

export const THEMES = ['void', 'paper'] as const;
export const themeSchema = z.enum(THEMES);
export type Theme = z.infer<typeof themeSchema>;

export const ACCENTS = ['#d8c8a0', '#a0c8d8', '#c8a0b8', '#a8c8a0'] as const;
export const accentSchema = z.enum(ACCENTS);
export type Accent = z.infer<typeof accentSchema>;

export const settingsSchema = z.object({
  useTimer: z.boolean(),
  mins: z.number().int().min(10).max(60),
  theme: themeSchema,
  accent: accentSchema,
});
export type Settings = z.infer<typeof settingsSchema>;

export const persistedStateSchema = z.object({
  version: z.literal(1),
  settings: settingsSchema,
  /** The one thing in focus right now — survives a reload so it's never lost. */
  active: z.string().nullable().default(null),
  /** Tasks parked "for later" — one thing at a time, the rest wait here. */
  queue: z.array(z.string()),
});
export type PersistedState = z.infer<typeof persistedStateSchema>;
