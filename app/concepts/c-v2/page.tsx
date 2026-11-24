import type { Metadata } from "next";
import { ConceptPage } from "../concept-page";

export const metadata: Metadata = {
  title: "Concept C v2: Case file with lanes | SOC Alert Triage",
  description:
    "Wireframe concept C v2. A revision of concept C: a lane switch and a one-column case file with a decision block.",
};

export default function Page() {
  return <ConceptPage id="C2" />;
}
