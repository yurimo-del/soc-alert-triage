import { readFileSync } from "node:fs";
import path from "node:path";
import {
  EvalSetSchema,
  TriageResultSchema,
  type ActionType,
  type Classification,
  type Confidence,
  type EvalCase,
  type Severity,
} from "../../lib/schemas";

// Read at build time. Parsed with the project schemas so a bad file fails the build.
const readJson = (file: string): unknown => JSON.parse(readFileSync(file, "utf8"));

const evalSet = EvalSetSchema.parse(
  readJson(path.join(process.cwd(), "data", "alerts", "eval-set.json")),
);

export type Evidence = { field: string; value: string; why: string | null };

// One shape for every screen. A null text field means "not available for this alert".
export type AlertView = {
  id: string;
  source: string;
  timestamp: string;
  title: string;
  payload: [string, string][];
  severity: Severity;
  classification: Classification;
  action_type: ActionType;
  needs_human_review: boolean;
  review_reasons: string[];
  confidence: Confidence | null;
  summary: string | null;
  evidence: Evidence[];
  action_detail: string | null;
  // "recorded" = fallback file. "eval-label" = expected answer from the eval set.
  origin: "recorded" | "eval-label";
};

const SEVERITY_RANK: Record<Severity, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };

function payloadOf(c: EvalCase): [string, string][] {
  return Object.entries(c.alert.raw_payload).map(([k, v]) => [k, String(v)]);
}

function fromEvalLabel(c: EvalCase, reasons: string[]): AlertView {
  const p = c.alert.raw_payload;
  return {
    id: c.alert.id,
    source: c.alert.source,
    timestamp: c.alert.timestamp,
    title: c.alert.title,
    payload: payloadOf(c),
    severity: c.expected.severity,
    classification: c.expected.classification,
    action_type: c.expected.action_type,
    needs_human_review: c.expected.needs_human_review,
    review_reasons: reasons,
    // The eval label has no confidence, summary, evidence text or action detail.
    confidence: null,
    summary: null,
    evidence: c.expected.must_cite_fields.map((f) => ({
      field: f,
      value: String(p[f]),
      why: null,
    })),
    action_detail: null,
    origin: "eval-label",
  };
}

function fromRecorded(c: EvalCase): AlertView {
  const r = TriageResultSchema.parse(readJson(path.join(process.cwd(), "data", "fallback", `${c.alert.id}.json`)));
  return {
    id: c.alert.id,
    source: c.alert.source,
    timestamp: c.alert.timestamp,
    title: c.alert.title,
    payload: payloadOf(c),
    severity: r.severity,
    classification: r.classification,
    action_type: r.recommended_action.type,
    needs_human_review: r.needs_human_review,
    review_reasons: r.review_reasons,
    confidence: r.confidence,
    summary: r.summary,
    evidence: r.evidence.map((e) => ({ field: e.field, value: e.value, why: e.why })),
    action_detail: r.recommended_action.detail,
    origin: "recorded",
  };
}

const byId = (id: string) => {
  const c = evalSet.find((e) => e.alert.id === id);
  if (!c) throw new Error(`${id} missing from eval set`);
  return c;
};

// The three alerts used on every detail screen.
// alert-003 uses the eval label on purpose (step 2: draw the AI as always right).
// Its recorded answer differs. That mismatch is listed in concepts/README.md.
// Review reason text is the draft v0 rule text from lib/schemas/review-rules.ts.
export const DETAIL: Record<"alert-006" | "alert-003" | "alert-011", AlertView> = {
  "alert-006": fromRecorded(byId("alert-006")),
  "alert-003": fromEvalLabel(byId("alert-003"), ["Recommended action resets credentials"]),
  "alert-011": fromRecorded(byId("alert-011")),
};

// List rows use the eval labels for all 15 alerts, so the list is consistent.
// Confidence is not part of the eval label, so no list shows it.
export type ListRow = Pick<
  AlertView,
  | "id"
  | "source"
  | "timestamp"
  | "title"
  | "severity"
  | "classification"
  | "action_type"
  | "needs_human_review"
>;

const rows: ListRow[] = evalSet.map((c) => ({
  id: c.alert.id,
  source: c.alert.source,
  timestamp: c.alert.timestamp,
  title: c.alert.title,
  severity: c.expected.severity,
  classification: c.expected.classification,
  action_type: c.expected.action_type,
  needs_human_review: c.expected.needs_human_review,
}));

// Review-required first, then severity, then oldest first (it has waited longest).
export const RANKED: ListRow[] = [...rows].sort(
  (a, b) =>
    Number(b.needs_human_review) - Number(a.needs_human_review) ||
    SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] ||
    a.timestamp.localeCompare(b.timestamp),
);

export const LANE_CONFIRM = RANKED.filter((r) => !r.needs_human_review);
export const LANE_REVIEW = RANKED.filter((r) => r.needs_human_review);

export const shortTime = (iso: string) => iso.slice(5, 16).replace("T", " ");
