import { z } from "zod";

export const ALERT_SOURCES = [
  "EDR",
  "WAF",
  "Antivirus",
  "IAM",
  "Email",
  "Network",
] as const;

export const AlertSourceSchema = z.enum(ALERT_SOURCES);

// Strict: stored alerts and the eval set must not drift from the schema.
export const AlertSchema = z.strictObject({
  id: z.string().min(1),
  source: AlertSourceSchema,
  timestamp: z.iso.datetime(),
  title: z.string().min(1),
  // Source-specific fields differ per tool, so the shape stays open.
  raw_payload: z.record(z.string(), z.unknown()),
});

export type AlertSource = z.infer<typeof AlertSourceSchema>;
export type Alert = z.infer<typeof AlertSchema>;
