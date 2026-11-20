import type { Metadata } from "next";
import { ConceptPage } from "../concept-page";

export const metadata: Metadata = {
  title: "Concept A: Ranked queue | SOC Alert Triage",
  description: "Wireframe concept A. One sorted table with a side panel.",
};

export default function Page() {
  return <ConceptPage id="A" />;
}
