import { FrontendProblemBrowser } from "@/features/frontend/components/frontend-problem-browser";
import { frontendProblems } from "@/features/frontend/data/problems";

export default function FrontendPage() {
  return (
    <main className="pageShell">
      <section className="moduleHeader">
        <p className="eyebrow">Module 01</p>
        <h1>Frontend Machine Coding</h1>
        <p>
          Build real-world React components in our interactive workspace.{" "}
          {frontendProblems.length} problems from top companies.
        </p>
      </section>

      <FrontendProblemBrowser problems={frontendProblems} />
    </main>
  );
}
