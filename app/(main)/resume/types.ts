import type { z } from "zod";
import type { entrySchema } from "@/app/lib/schema";

// Form input shape for a single entry before transformations
export type EntryInput = z.input<typeof entrySchema>;

// Output shape after zod refinement; used for display/storage in this feature
export type Entry = z.output<typeof entrySchema>;

// Constrained kinds used for AI improvement in this feature
export type ImproveKind = "experience" | "education" | "project";
