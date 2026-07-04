import type { PreviewStatus, TestResult } from "@/features/frontend/runner/types";

export type LocalSubmissionAttempt = {
  id: string;
  problemSlug: string;
  problemTitle: string;
  submittedAt: string;
  status: PreviewStatus;
  passedCount: number;
  totalCount: number;
  appCode: string;
  cssCode: string;
  tests: TestResult[];
  runtimeError?: string;
};
