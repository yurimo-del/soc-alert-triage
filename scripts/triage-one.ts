// Runs one eval alert through the AI pipeline. Run: npm run triage:one -- alert-001
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { EvalSetSchema } from "../lib/schemas";
import { triageAlert } from "../lib/ai/triage";

async function main() {
  const id = process.argv[2];
  if (!id) {
    console.error("Usage: npm run triage:one -- <alert-id>   (e.g. alert-001)");
    process.exit(1);
  }

  const evalSet = EvalSetSchema.parse(
    JSON.parse(readFileSync(resolve(process.cwd(), "data/alerts/eval-set.json"), "utf8")),
  );
  const found = evalSet.find((c) => c.alert.id === id);
  if (!found) {
    console.error(`No eval alert with id "${id}"`);
    process.exit(1);
  }

  const outcome = await triageAlert(found.alert);
  if (!outcome.ok) {
    console.error(`Triage failed: ${outcome.error.code}: ${outcome.error.message}`);
    process.exit(1);
  }
  console.log(JSON.stringify(outcome.result, null, 2));
}

main();
