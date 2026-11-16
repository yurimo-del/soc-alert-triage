// Validates data/alerts/eval-set.json. Run: npm run validate:evals
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  ALERT_SOURCES,
  EvalSetSchema,
  computeReview,
  type EvalCase,
} from "../lib/schemas";

const EVAL_SET_PATH = resolve(process.cwd(), "data/alerts/eval-set.json");

// Hard rule 1: documentation ranges and private ranges only.
const ALLOWED_IP_PREFIXES = [
  /^192\.0\.2\./,
  /^198\.51\.100\./,
  /^203\.0\.113\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
];
const isExampleDomain = (host: string) =>
  /(^|\.)example\.com$/i.test(host.trim());

const errors: string[] = [];
const fail = (id: string, message: string) => errors.push(`${id}: ${message}`);

// Collects every string in a value, with the key it sits under.
function collectStrings(
  value: unknown,
  key = "",
  out: { key: string; text: string }[] = [],
) {
  if (typeof value === "string") out.push({ key, text: value });
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, key, out));
  else if (value && typeof value === "object")
    for (const [k, v] of Object.entries(value)) collectStrings(v, k, out);
  return out;
}

// Encoded PowerShell hides URLs and IPs, so scan the decoded text too.
function decodeEncodedCommands(text: string): string[] {
  const decoded: string[] = [];
  for (const m of text.matchAll(/-enc\w*\s+([A-Za-z0-9+/=]{16,})/gi))
    decoded.push(Buffer.from(m[1], "base64").toString("utf16le"));
  return decoded;
}

function checkSyntheticData(c: EvalCase) {
  const id = c.alert.id;
  const strings = collectStrings(c.alert);
  const texts = strings.flatMap((s) => [s.text, ...decodeEncodedCommands(s.text)]);

  for (const text of texts) {
    for (const [ip] of text.matchAll(/\b\d{1,3}(?:\.\d{1,3}){3}\b/g))
      if (!ALLOWED_IP_PREFIXES.some((re) => re.test(ip)))
        fail(id, `IP ${ip} is not a documentation or private address`);
    for (const m of text.matchAll(/https?:\/\/([^/\s:'"?#]+)/gi))
      // An IP host is judged by the IP rule above, not the domain rule.
      if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(m[1]) && !isExampleDomain(m[1]))
        fail(id, `URL host ${m[1]} is not example.com`);
    for (const m of text.matchAll(/[\w.+-]+@([\w-]+(?:\.[\w-]+)+)/g))
      if (!isExampleDomain(m[1])) fail(id, `email domain ${m[1]} is not example.com`);
  }
  // Bare hostnames: only keys named *domain* or *host* that hold a dotted name.
  for (const { key, text } of strings)
    if (/domain|host/i.test(key) && text.includes(".") && !isExampleDomain(text))
      fail(id, `${key} "${text}" is not example.com`);
}

function main() {
  let json: unknown;
  try {
    json = JSON.parse(readFileSync(EVAL_SET_PATH, "utf8"));
  } catch (e) {
    console.error(`Cannot read ${EVAL_SET_PATH}: ${(e as Error).message}`);
    process.exit(1);
  }

  const parsed = EvalSetSchema.safeParse(json);
  if (!parsed.success) {
    for (const issue of parsed.error.issues)
      console.error(`schema: ${issue.path.join(".")}: ${issue.message}`);
    process.exit(1);
  }
  const cases = parsed.data;

  const seen = new Set<string>();
  for (const c of cases) {
    const id = c.alert.id;
    if (seen.has(id)) fail(id, "duplicate id");
    seen.add(id);

    for (const field of c.expected.must_cite_fields)
      if (!(field in c.alert.raw_payload))
        fail(id, `must_cite_fields "${field}" is not a raw_payload key`);

    // Expected confidence is not part of the ground truth, so use a neutral
    // "high": this checks the severity, classification and action rules only.
    const review = computeReview({
      severity: c.expected.severity,
      classification: c.expected.classification,
      confidence: "high",
      recommended_action: { type: c.expected.action_type },
    });
    if (review.needs_human_review !== c.expected.needs_human_review)
      fail(
        id,
        `needs_human_review is ${c.expected.needs_human_review}, computeReview says ${review.needs_human_review}`,
      );

    checkSyntheticData(c);
  }

  for (const source of ALERT_SOURCES)
    if (!cases.some((c) => c.alert.source === source))
      fail("eval-set", `no case for source ${source}`);

  if (errors.length > 0) {
    console.error(`Eval set invalid (${errors.length} problem(s)):`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log(`Eval set OK: ${cases.length} cases, all ${ALERT_SOURCES.length} sources covered.`);
}

main();
