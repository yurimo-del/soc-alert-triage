import type { Metadata } from "next";
import { ConceptPage } from "../concept-page";

export const metadata: Metadata = {
  title: "Concept B: Lanes | SOC Alert Triage",
  description: "Wireframe concept B. Lanes by how much attention an alert needs.",
};

export default function Page() {
  return <ConceptPage id="B" />;
}
