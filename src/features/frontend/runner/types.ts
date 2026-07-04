export type TestResult = {
  name: string;
  passed: boolean;
  message?: string;
};

export type PreviewStatus = "passed" | "failed" | "error";

export type PreviewMessage = {
  source: "interview-studio-preview";
  runId: number;
  status: PreviewStatus;
  tests?: TestResult[];
  error?: string;
};
