// Records live results for all eval alerts as fallback files.
// Makes one paid API call per alert. Run: npm run record:fallbacks [-- --force]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { EvalSetSchema, TriageResultSchema } from "../lib/schemas";
import { runLiveTriage } from "../lib/ai/triage";
import { DEFAULT_FALLBACK_DIR } from "../lib/ai/providers/fallback";

async function main() {
  const force = process.argv.includes("--force");
  const evalSet = EvalSetSchema.parse(
    JSON.parse(readFileSync(resolve(process.cwd(), "data/alerts/eval-set.json"), "utf8")),
  );
  const dir = resolve(process.cwd(), DEFAULT_FALLBACK_DIR);
  mkdirSync(dir, { recursive: true });

  const failures: string[] = [];
  let written = 0;
  for (const { alert } of evalSet) {
    const path = join(dir, `${alert.id}.json`);
    if (existsSync(path) && !force) {
      console.log(`skip ${alert.id}: file exists (use --force to overwrite)`);
      continue;
    }
    try {
      // Real pipeline output, so the file matches what production would produce.
      const live = await runLiveTriage(alert);
      const recorded = TriageResultSchema.parse({
        ...live,
        meta: { ...live.meta, source: "fallback" },
      });
      writeFileSync(path, JSON.stringify(recorded, null, 2) + "\n");
      written++;
      console.log(`ok   ${alert.id}`);
    } catch (error) {
      failures.push(alert.id);
      console.error(`FAIL ${alert.id}: ${error instanceof Error ? error.message : "error"}`);
    }
  }

  console.log(`Recorded ${written} file(s), ${failures.length} failure(s).`);
  if (failures.length > 0) process.exit(1);
}

main();
