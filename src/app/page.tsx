import Link from "next/link";
import { ArrowRight, Code2, LayoutDashboard } from "lucide-react";
import { frontendProblems } from "@/features/frontend/data/problems";

export default function HomePage() {
  const hardCount = frontendProblems.filter(
    (problem) => problem.difficulty === "Hard" || problem.difficulty === "Super Hard",
  ).length;

  return (
    <main className="pageShell">
      <section className="dashboardHero">
        <div>
          <p className="eyebrow">Frontend module first</p>
          <h1>Practice machine-coding interviews in a real workspace.</h1>
          <p>
            We are starting with a focused frontend module: problem discovery,
            coding workspace, preview, and evaluation flow.
          </p>
        </div>
        <Link className="heroAction" href="/frontend">
          Open Frontend <ArrowRight size={18} />
        </Link>
      </section>

      <section className="statsGrid">
        <div>
          <Code2 size={24} />
          <strong>{frontendProblems.length}</strong>
          <span>Seed frontend problems</span>
        </div>
        <div>
          <LayoutDashboard size={24} />
          <strong>{hardCount}</strong>
          <span>Advanced workspaces planned</span>
        </div>
      </section>
    </main>
  );
}

