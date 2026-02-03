import { z } from "zod";

export const RoleEnum = z.enum(["ADMIN", "EDITOR", "TRANSLATOR", "VIEWER"]);
export type Role = z.infer<typeof RoleEnum>;

export const BookStatusEnum = z.enum(["ONGOING", "COMPLETED", "HIATUS"]);
export const PublishStatusEnum = z.enum(["DRAFT", "PUBLISHED"]);
export const ProjectStatusEnum = z.enum(["ACTIVE", "DONE", "ARCHIVED"]);
export const TranslationEntryStatusEnum = z.enum([
  "TODO",
  "IN_PROGRESS",
  "REVIEWED",
  "FINAL"
]);

export const ErrorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional()
});

export const AuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string()
});

export const CreateBookSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  altTitles: z.array(z.string()).default([]),
  description: z.string().optional(),
  language: z.string().min(2),
  status: BookStatusEnum,
  coverImageUrl: z.string().url().optional()
});

export const CreateChapterSchema = z.object({
  bookId: z.string().uuid(),
  number: z.string().min(1),
  title: z.string().optional(),
  orderIndex: z.number().int(),
  publishStatus: PublishStatusEnum
});

export const CreateTranslationEntrySchema = z.object({
  projectId: z.string().uuid(),
  pageId: z.string().uuid(),
  box: z.object({
    x: z.number(),
    y: z.number(),
    w: z.number(),
    h: z.number()
  }),
  sourceText: z.string().default(""),
  translatedText: z.string().default(""),
  status: TranslationEntryStatusEnum,
  metadata: z.record(z.unknown()).optional()
});

export type CreateBookInput = z.infer<typeof CreateBookSchema>;
export type CreateChapterInput = z.infer<typeof CreateChapterSchema>;
export type CreateTranslationEntryInput = z.infer<typeof CreateTranslationEntrySchema>;
