import type { Metadata } from "next";
import { ConceptPage } from "../concept-page";

export const metadata: Metadata = {
  title: "Concept C v2.1: Case file with lanes | SOC Alert Triage",
  description:
    "Wireframe concept C v2.1. A revision of C v2: lanes with filter and sort, an overview with details, and a decision panel that holds the recommended action.",
};

export default function Page() {
  return <ConceptPage id="C21" />;
}
