# Constraints

Draft v0, AI-assisted, pending security expert review.

- **Data:** synthetic only. All alerts are synthetic JSON (`README.md`, `CLAUDE.md` rule 1).
- **Confidentiality:** no real company names, customer data, real incidents or real public IPs. Documentation IP ranges, private ranges and `example.com` only. API keys only in server code. The repo is public, so people appear as roles only, never by name.
- **Compliance / regulation:** none for this learning prototype (product owner's decision, `docs/REQUIREMENTS.md` section 6). [MISSING: compliance needs of a real product]
- **Technical:** Next.js 16 App Router, TypeScript strict, `@carbon/react` ^1.120.0, Tailwind installed from the template (styling decision open, ADR-06), `zod` ^4.6.7. AI through a provider adapter, Claude by default, with recorded fallback responses (ADR-07). Deployed on Vercel with `AI_PROVIDER=fallback` and no API key (ADR-07). No live integrations.
- **Timeline:** sprint from Nov 15 to Dec 4, 2026 (`docs/SPRINT_PLAN.md`).
- **People available:** three security expert proxies (roles only): two give independent direction picks on wireframes, a third validates the prototype. One React developer builds from the handover package (ADR-05, contacted, call pending). [MISSING: which of them have confirmed, and how much time each has]
