import { AlertSchema } from "../../../lib/schemas";
import { triageAlert } from "../../../lib/ai/triage";

// Server only. The AI layer reads the API key from the server environment.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: { code: "invalid_alert", message: "Body must be valid JSON" } },
      { status: 400 },
    );
  }

  const alert = AlertSchema.safeParse(body);
  if (!alert.success) {
    return Response.json(
      {
        error: {
          code: "invalid_alert",
          message: alert.error.issues
            .slice(0, 5)
            .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
            .join("; "),
        },
      },
      { status: 400 },
    );
  }

  const outcome = await triageAlert(alert.data);
  if (!outcome.ok) return Response.json({ error: outcome.error }, { status: 503 });
  return Response.json(outcome.result);
}
