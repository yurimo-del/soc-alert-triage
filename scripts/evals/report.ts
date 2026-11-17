// Renders the baseline report. Facts only: no analysis section by design.
import type { EvalCase, TriageResult } from "../../lib/schemas";
import { CRITERIA, findFlips, scoreFailedRun, scoreRun, type Criterion, type RunRecord } from "./score";

export type AlertRuns = { case: EvalCase; runs: RunRecord[] };

export type ReportMeta = {
  date: string;
  provider: string;
  model: string;
  promptVersions: string[];
  runsRequested: number;
};

const CATEGORIES = [
  { label: "Threat", classification: "true_positive" },
  { label: "False positive", classification: "false_positive" },
  { label: "Ambiguous", classification: "needs_investigation" },
] as const;

const CRITERION_LABEL: Record<Criterion, string> = {
  severity_exact: "Severity (exact)",
  severity_within_1: "Severity (within ±1)",
  classification: "Classification (exact)",
  action: "Recommended action (exact)",
  needs_human_review: "needs_human_review (exact)",
  required_fields: "Required fields cited",
};

const cell = (text: string) => text.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");

function scored(item: AlertRuns) {
  // Transient failures (after retries) are excluded. Other failed runs score as
  // a fail on every criterion.
  return item.runs.flatMap((r) => {
    if (r.ok) return [{ run: r.run, score: scoreRun(item.case.expected, r.result) }];
    return r.transient ? [] : [{ run: r.run, score: scoreFailedRun() }];
  });
}

function rate(passed: number, total: number): string {
  return total === 0 ? "n/a" : `${passed}/${total} (${Math.round((passed / total) * 100)}%)`;
}

function describe(result: TriageResult): string {
  return `${result.severity} / ${result.classification} / ${result.recommended_action.type} / review:${result.needs_human_review} / conf:${result.confidence}`;
}

export function renderReport(items: AlertRuns[], meta: ReportMeta): string {
  const out: string[] = [];
  const allRuns = items.flatMap((i) => i.runs);
  const transient = allRuns.filter((r) => !r.ok && r.transient);
  const failedRuns = allRuns.filter((r) => !r.ok && !r.transient);
  const retried = allRuns.filter((r) => r.attempts > 1).length;
  const sources = new Set(
    allRuns.flatMap((r) => (r.ok ? [r.result.meta.source] : [])),
  );

  out.push(`# Eval baseline ${meta.date}`, "");
  out.push(
    `- Provider: ${meta.provider}`,
    `- Model: ${meta.model || "(none)"}`,
    `- Prompt version: ${meta.promptVersions.join(", ") || "(none)"}`,
    `- Result source: ${[...sources].join(", ") || "(none)"}`,
    `- Alerts: ${items.length}`,
    `- Runs per alert: ${meta.runsRequested}`,
    `- Scored runs: ${allRuns.length - transient.length} of ${allRuns.length}`,
    `- Transient failures after retries (excluded from rates): ${transient.length}`,
    `- Failed runs (invalid output, refusal or max_tokens; counted as a fail on every criterion): ${failedRuns.length}`,
    `- Runs that needed a retry: ${retried}`,
    "",
  );

  out.push(
    "## How scores are computed",
    "",
    "- Severity order: Low < Medium < High < Critical. \"Within ±1\" allows one step of distance.",
    "- needs_human_review is the `computeReview()` output, not the model's opinion.",
    "- Required fields: every `must_cite_fields` key must equal some `evidence[].field` (trimmed, case-sensitive, a leading `raw_payload.` is ignored).",
    "  It does not check `value`, `why` or the summary, and does not match renamed keys.",
    "- Category comes from the expected classification: true_positive = Threat, false_positive = False positive, needs_investigation = Ambiguous.",
    "- Rates are passed/total over scored runs. Only transient failures (429, 5xx, connection error or timeout after retries) are left out of the denominator.",
    "- Invalid output, a refusal or max_tokens counts as a failed run on every criterion.",
    "- A flip is a criterion whose pass/fail result differs between runs of the same alert.",
    "",
  );

  // Summary table.
  out.push("## Summary: pass rate per criterion", "");
  const header = ["Criterion", "All", ...CATEGORIES.map((c) => `${c.label} (${items.filter((i) => i.case.expected.classification === c.classification).length} alerts)`)];
  out.push(`| ${header.join(" | ")} |`, `|${header.map(() => "---").join("|")}|`);
  for (const criterion of CRITERIA) {
    const cols = [
      items,
      ...CATEGORIES.map((c) => items.filter((i) => i.case.expected.classification === c.classification)),
    ].map((group) => {
      const runs = group.flatMap(scored);
      return rate(runs.filter((r) => r.score.passes[criterion]).length, runs.length);
    });
    out.push(`| ${CRITERION_LABEL[criterion]} | ${cols.join(" | ")} |`);
  }
  out.push("");

  // Per-alert table.
  out.push("## Per alert", "");
  out.push(
    "Format of each cell: severity / classification / action / review / confidence.",
    "",
  );
  const runCols = Array.from({ length: meta.runsRequested }, (_, i) => `Run ${i + 1}`);
  const alertHeader = ["Alert", "Category", "Expected", ...runCols, "Failed criteria (per run)", "Missing required fields", "Flips"];
  out.push(`| ${alertHeader.join(" | ")} |`, `|${alertHeader.map(() => "---").join("|")}|`);
  for (const item of items) {
    const e = item.case.expected;
    const category = CATEGORIES.find((c) => c.classification === e.classification)?.label ?? "";
    const expected = `${e.severity} / ${e.classification} / ${e.action_type} / review:${e.needs_human_review}`;
    const runCells = item.runs.map((r) =>
      r.ok ? describe(r.result) : `${r.transient ? "EXCLUDED (transient)" : "FAILED"}: ${r.error}`,
    );
    const runScores = scored(item);
    const failed = runScores
      .map((s) => {
        const f = CRITERIA.filter((c) => !s.score.passes[c]);
        return `R${s.run}: ${f.length === CRITERIA.length ? "all (run failed)" : f.length ? f.join(", ") : "none"}`;
      })
      .join("<br>");
    const missing = runScores
      .filter((s) => s.score.missing_fields.length > 0)
      .map((s) => `R${s.run}: ${s.score.missing_fields.join(", ")}`)
      .join("<br>");
    const flips = findFlips(runScores.map((s) => s.score));
    const row = [
      item.case.alert.id,
      category,
      expected,
      ...runCells,
      failed || "n/a",
      missing || "none",
      flips.length ? flips.join(", ") : "none",
    ];
    out.push(`| ${row.map(cell).join(" | ")} |`);
  }
  out.push("");

  if (transient.length + failedRuns.length > 0) {
    out.push("## Runs that returned no result", "");
    for (const item of items)
      for (const r of item.runs)
        if (!r.ok)
          out.push(
            `- ${item.case.alert.id} run ${r.run} (${r.attempts} attempt(s), ${r.transient ? "transient, excluded" : "counted as failed"}): ${r.error}`,
          );
    out.push("");
  }

  return out.join("\n");
}
