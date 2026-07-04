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
  starterCode: string;
  starterCss: string;
};
