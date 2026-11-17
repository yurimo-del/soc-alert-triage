// Runs the eval set through the triage pipeline and writes a factual report.
// Live mode makes one paid API call per alert per run (plus retries).
// Run: npm run eval [-- --runs 3 --provider claude|fallback --force]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { EvalSetSchema, type TriageResult } from "../lib/schemas";
import { getAiConfig, type AiConfig } from "../lib/ai/config";
import { runLiveTriage, triageAlert } from "../lib/ai/triage";
import { renderReport, type AlertRuns } from "./evals/report";
import { scoreFailedRun, scoreRun, type RunRecord } from "./evals/score";

const MAX_ATTEMPTS = 3;
const RETRY_WAIT_MS = [1000, 2000];

function readFlag(name: string): string | undefined {
  const args = process.argv.slice(2);
  const i = args.findIndex((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (i === -1) return undefined;
  return args[i].includes("=") ? args[i].split("=")[1] : args[i + 1];
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

// Transient: rate limit, server errors, connection problems, pipeline timeout.
function isTransient(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const status = (error as { status?: number }).status;
  if (status !== undefined)
    return status === 408 || status === 429 || status >= 500;
  return /^APIConnection/.test(error.name) || error.message.startsWith("Provider timed out");
}

function errorText(error: unknown): string {
  const text = error instanceof Error ? `${error.name}: ${error.message}` : "unknown error";
  return text.slice(0, 300);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function triageOnce(
  alert: Parameters<typeof runLiveTriage>[0],
  config: AiConfig,
): Promise<TriageResult> {
  if (config.provider === "fallback") {
    const outcome = await triageAlert(alert);
    if (!outcome.ok) throw new Error(outcome.error.message);
    return outcome.result;
  }
  // Same function the route uses, without its fallback step, so a failed
  // live call is recorded as an error and not scored as a live answer.
  return runLiveTriage(alert, {}, config);
}

async function runOne(
  alert: Parameters<typeof runLiveTriage>[0],
  config: AiConfig,
  run: number,
): Promise<RunRecord> {
  for (let attempt = 1; ; attempt++) {
    try {
      return { run, ok: true, attempts: attempt, result: await triageOnce(alert, config) };
    } catch (error) {
      if (attempt >= MAX_ATTEMPTS || !isTransient(error))
        return {
          run,
          ok: false,
          attempts: attempt,
          error: errorText(error),
          transient: isTransient(error),
        };
      await sleep(RETRY_WAIT_MS[attempt - 1] ?? 2000);
    }
  }
}

async function main() {
  const runsRaw = readFlag("runs") ?? "3";
  const runs = Number(runsRaw);
  if (!Number.isInteger(runs) || runs < 1) fail(`--runs must be a positive integer, got "${runsRaw}"`);

  const base = getAiConfig();
  const provider = readFlag("provider") ?? base.provider;
  if (provider !== "claude" && provider !== "fallback")
    fail(`--provider must be claude or fallback, got "${provider}"`);
  const config: AiConfig = { provider, model: base.model };
  // triageAlert reads the provider from the environment.
  process.env.AI_PROVIDER = provider;

  const date = new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD, local
  const dir = resolve(process.cwd(), "docs/evals");
  const mdPath = resolve(dir, `${date}-baseline.md`);
  const jsonPath = resolve(dir, `${date}-baseline.json`);
  if ((existsSync(mdPath) || existsSync(jsonPath)) && !process.argv.includes("--force"))
    fail(`Report for ${date} already exists. Use --force to overwrite.`);

  const evalSet = EvalSetSchema.parse(
    JSON.parse(readFileSync(resolve(process.cwd(), "data/alerts/eval-set.json"), "utf8")),
  );

  console.log(`Eval: ${evalSet.length} alerts x ${runs} run(s), provider ${provider}`);
  const items: AlertRuns[] = [];
  // Sequential on purpose: no parallel fan-out against the API.
  for (const evalCase of evalSet) {
    const records: RunRecord[] = [];
    for (let run = 1; run <= runs; run++) {
      const record = await runOne(evalCase.alert, config, run);
      records.push(record);
      console.log(
        record.ok
          ? `ok    ${evalCase.alert.id} run ${run}`
          : `ERROR ${evalCase.alert.id} run ${run}: ${record.error}`,
      );
    }
    items.push({ case: evalCase, runs: records });
  }

  const results = items.flatMap((i) => i.runs.flatMap((r) => (r.ok ? [r.result] : [])));
  const promptVersions = [...new Set(results.map((r) => r.meta.prompt_version))];
  const model = config.model || [...new Set(results.map((r) => r.meta.model))].join(", ");

  mkdirSync(dir, { recursive: true });
  writeFileSync(
    mdPath,
    renderReport(items, { date, provider, model, promptVersions, runsRequested: runs }),
  );
  writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        date,
        provider,
        model,
        prompt_versions: promptVersions,
        runs_requested: runs,
        alerts: items.map((i) => ({
          id: i.case.alert.id,
          expected: i.case.expected,
          runs: i.runs.map((r) => ({
            ...r,
            score: r.ok
              ? scoreRun(i.case.expected, r.result)
              : r.transient
                ? undefined // excluded from rates
                : scoreFailedRun(),
          })),
        })),
      },
      null,
      2,
    ) + "\n",
  );
  console.log(`Wrote ${mdPath}\nWrote ${jsonPath}`);
}

main();
