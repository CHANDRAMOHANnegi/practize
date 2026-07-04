import Link from "next/link";
import { Code2 } from "lucide-react";
import type { FrontendProblem } from "@/types/problem";
import { cn } from "@/lib/cn";

const difficultyClass: Record<FrontendProblem["difficulty"], string> = {
  Easy: "badgeEasy",
  Medium: "badgeMedium",
  Hard: "badgeHard",
  "Super Hard": "badgeSuperHard",
};

type ProblemCardProps = {
  problem: FrontendProblem;
};

export function ProblemCard({ problem }: ProblemCardProps) {
  return (
    <Link className="problemCard" href={`/frontend/${problem.slug}`}>
      <div className="cardTopline">
        <div className="cardMeta">
          <span className="problemNumber">{problem.index}</span>
          <span className={cn("difficultyBadge", difficultyClass[problem.difficulty])}>
            {problem.difficulty}
          </span>
        </div>
        <Code2 className="cardCodeIcon" size={25} />
      </div>

      <h3>{problem.title}</h3>
      <p>{problem.summary}</p>

      <div className="tagRow">
        {problem.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <div className="companyRow">
        {problem.companies.slice(0, 4).map((company) => (
          <span className="companyLogo" key={company} title={company}>
            {company.slice(0, 2).toUpperCase()}
          </span>
        ))}
        {problem.companies.length > 4 && <small>+{problem.companies.length - 4}</small>}
      </div>
    </Link>
  );
}
