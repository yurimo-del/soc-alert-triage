import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import {
  TriageResultSchema,
  computeReview,
  type TriageResult,
} from "../../schemas";

export const DEFAULT_FALLBACK_DIR = "data/fallback";

// Alert ids come from request bodies. Restrict them before they touch a path.
const SAFE_ID = /^[a-z0-9-]+$/i;

export type FallbackReadResult =
  | { ok: true; result: TriageResult }
  | { ok: false; reason: string };

// Not a TriageProvider: recorded files are full stored results, not raw model output.
export async function readFallback(
  alertId: string,
  dir: string = DEFAULT_FALLBACK_DIR,
): Promise<FallbackReadResult> {
  if (!SAFE_ID.test(alertId))
    return { ok: false, reason: "alert id has unsafe characters" };

  const path = join(resolve(process.cwd(), dir), `${alertId}.json`);
  let json: unknown;
  try {
    json = JSON.parse(await readFile(path, "utf8"));
  } catch {
    return { ok: false, reason: `no readable fallback file for ${alertId}` };
  }

  const parsed = TriageResultSchema.safeParse(json);
  if (!parsed.success)
    return { ok: false, reason: "fallback file does not match TriageResultSchema" };
  const result = parsed.data;

  if (result.meta.source !== "fallback")
    return { ok: false, reason: 'fallback file meta.source is not "fallback"' };

  // Guards against hand-edited files drifting from the review rules (ADR-03).
  const review = computeReview(result);
  if (review.needs_human_review !== result.needs_human_review)
    return { ok: false, reason: "fallback file review flag does not match computeReview" };

  return { ok: true, result };
}
