"use client";

import { Filter, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProblemCard } from "@/components/problem-card";
import type { FrontendProblem } from "@/types/problem";
import { loadLocalSubmissionSummaries } from "@/features/frontend/submissions/local-submissions";
import type { LocalSubmissionSummary } from "@/features/frontend/submissions/types";

type FrontendProblemBrowserProps = {
  problems: FrontendProblem[];
};

type ProgressFilter = "All" | "Attempted" | "Passed" | "Failed";

export function FrontendProblemBrowser({ problems }: FrontendProblemBrowserProps) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [company, setCompany] = useState("All");
  const [progressFilter, setProgressFilter] = useState<ProgressFilter>("All");
  const [progressBySlug, setProgressBySlug] = useState<
    Record<string, LocalSubmissionSummary>
  >({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    setProgressBySlug(
      loadLocalSubmissionSummaries(problems.map((problem) => problem.slug)),
    );
  }, [problems]);

  const companies = useMemo(
    () => Array.from(new Set(problems.flatMap((problem) => problem.companies))).sort(),
    [problems],
  );

  const progressStats = useMemo(() => {
    const summaries = Object.values(progressBySlug);

    return {
      attempted: summaries.length,
      passed: summaries.filter((summary) => summary.hasPassed).length,
      failed: summaries.filter((summary) => !summary.hasPassed).length,
      total: problems.length,
    };
  }, [problems.length, progressBySlug]);

  const visibleProblems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return problems.filter((problem) => {
      const progress = progressBySlug[problem.slug];
      const matchesDifficulty =
        difficulty === "All" || problem.difficulty === difficulty;
      const matchesCompany = company === "All" || problem.companies.includes(company);
      const matchesProgress =
        progressFilter === "All" ||
        (progressFilter === "Attempted" && progress) ||
        (progressFilter === "Passed" && progress?.hasPassed) ||
        (progressFilter === "Failed" && progress && !progress.hasPassed);
      const matchesQuery =
        !normalizedQuery ||
        problem.title.toLowerCase().includes(normalizedQuery) ||
        problem.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)) ||
        problem.companies.some((company) =>
          company.toLowerCase().includes(normalizedQuery),
        );

      return matchesDifficulty && matchesCompany && matchesProgress && matchesQuery;
    });
  }, [company, difficulty, problems, progressBySlug, progressFilter, query]);

  const pageSize = 9;
  const pageCount = Math.max(1, Math.ceil(visibleProblems.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageProblems = visibleProblems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <section className="modulePanel">
      <div className="filterBar">
        <label className="searchBox">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by problem, tag, or company"
          />
        </label>

        <select
          value={difficulty}
          onChange={(event) => {
            setDifficulty(event.target.value);
            setPage(1);
          }}
          aria-label="Filter by difficulty"
        >
          <option value="All">Difficulty</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
          <option>Super Hard</option>
        </select>

        <label className="companySelect">
          <Filter size={18} />
          <select
            value={company}
            onChange={(event) => {
              setCompany(event.target.value);
              setPage(1);
            }}
            aria-label="Filter by company"
          >
            <option>All</option>
            {companies.map((companyName) => (
              <option key={companyName}>{companyName}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="progressOverview" aria-label="Local progress">
        <button
          className={progressFilter === "All" ? "active" : ""}
          onClick={() => {
            setProgressFilter("All");
            setPage(1);
          }}
        >
          <strong>{progressStats.total}</strong>
          <span>All</span>
        </button>
        <button
          className={progressFilter === "Attempted" ? "active" : ""}
          onClick={() => {
            setProgressFilter("Attempted");
            setPage(1);
          }}
        >
          <strong>{progressStats.attempted}</strong>
          <span>Attempted</span>
        </button>
        <button
          className={progressFilter === "Passed" ? "active" : ""}
          onClick={() => {
            setProgressFilter("Passed");
            setPage(1);
          }}
        >
          <strong>{progressStats.passed}</strong>
          <span>Passed</span>
        </button>
        <button
          className={progressFilter === "Failed" ? "active" : ""}
          onClick={() => {
            setProgressFilter("Failed");
            setPage(1);
          }}
        >
          <strong>{progressStats.failed}</strong>
          <span>Needs Work</span>
        </button>
      </div>

      <div className="resultMeta">
        Showing {visibleProblems.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
        {Math.min(currentPage * pageSize, visibleProblems.length)} of{" "}
        {visibleProblems.length} problems
      </div>

      <div className="problemGrid">
        {pageProblems.map((problem) => (
          <ProblemCard
            key={problem.slug}
            problem={problem}
            progress={progressBySlug[problem.slug]}
          />
        ))}
      </div>

      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
          Prev
        </button>
        <span>
          Page {currentPage} of {pageCount}
        </span>
        <button
          disabled={currentPage === pageCount}
          onClick={() => setPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}
