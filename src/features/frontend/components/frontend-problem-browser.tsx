"use client";

import { Filter, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ProblemCard } from "@/components/problem-card";
import type { FrontendProblem } from "@/types/problem";

type FrontendProblemBrowserProps = {
  problems: FrontendProblem[];
};

export function FrontendProblemBrowser({ problems }: FrontendProblemBrowserProps) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [company, setCompany] = useState("All");
  const [page, setPage] = useState(1);

  const companies = useMemo(
    () => Array.from(new Set(problems.flatMap((problem) => problem.companies))).sort(),
    [problems],
  );

  const visibleProblems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return problems.filter((problem) => {
      const matchesDifficulty =
        difficulty === "All" || problem.difficulty === difficulty;
      const matchesCompany = company === "All" || problem.companies.includes(company);
      const matchesQuery =
        !normalizedQuery ||
        problem.title.toLowerCase().includes(normalizedQuery) ||
        problem.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)) ||
        problem.companies.some((company) =>
          company.toLowerCase().includes(normalizedQuery),
        );

      return matchesDifficulty && matchesCompany && matchesQuery;
    });
  }, [company, difficulty, problems, query]);

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

      <div className="resultMeta">
        Showing {(currentPage - 1) * pageSize + 1}-
        {Math.min(currentPage * pageSize, visibleProblems.length)} of{" "}
        {visibleProblems.length} problems
      </div>

      <div className="problemGrid">
        {pageProblems.map((problem) => (
          <ProblemCard key={problem.slug} problem={problem} />
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
