export type Difficulty = "Easy" | "Medium" | "Hard" | "Super Hard";

export type FrontendProblem = {
  index: number;
  slug: string;
  title: string;
  difficulty: Difficulty;
  companies: string[];
  tags: string[];
  estimatedMinutes: number;
  summary: string;
  requirements: string[];
  constraints: string[];
  solutionNotes: string[];
  solutionCode: string;
  solutionCss: string;
  starterCode: string;
  starterCss: string;
  testScript: string;
};
