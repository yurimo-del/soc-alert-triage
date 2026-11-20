import type { Metadata } from "next";
import { ConceptPage } from "../concept-page";

export const metadata: Metadata = {
  title: "Concept C: Case file, one at a time | SOC Alert Triage",
  description: "Wireframe concept C. A worklist rail and one alert open as a case file.",
};

export default function Page() {
  return <ConceptPage id="C" />;
}
