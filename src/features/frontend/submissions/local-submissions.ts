import type { LocalSubmissionAttempt, LocalSubmissionSummary } from "./types";

const storagePrefix = "interview-studio:submissions:";

function keyFor(problemSlug: string) {
  return `${storagePrefix}${problemSlug}`;
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadLocalSubmissions(problemSlug: string): LocalSubmissionAttempt[] {
  if (!isBrowser()) {
    return [];
  }

  const rawValue = window.localStorage.getItem(keyFor(problemSlug));
  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

export function saveLocalSubmission(
  attempt: LocalSubmissionAttempt,
): LocalSubmissionAttempt[] {
  const currentAttempts = loadLocalSubmissions(attempt.problemSlug);
  const nextAttempts = [attempt, ...currentAttempts].slice(0, 20);

  return replaceLocalSubmissions(attempt.problemSlug, nextAttempts);
}

export function replaceLocalSubmissions(
  problemSlug: string,
  attempts: LocalSubmissionAttempt[],
): LocalSubmissionAttempt[] {
  if (isBrowser()) {
    window.localStorage.setItem(keyFor(problemSlug), JSON.stringify(attempts));
  }

  return attempts;
}

export function deleteLocalSubmission(
  problemSlug: string,
  attemptId: string,
): LocalSubmissionAttempt[] {
  return replaceLocalSubmissions(
    problemSlug,
    loadLocalSubmissions(problemSlug).filter((attempt) => attempt.id !== attemptId),
  );
}

export function clearLocalSubmissions(problemSlug: string): LocalSubmissionAttempt[] {
  if (isBrowser()) {
    window.localStorage.removeItem(keyFor(problemSlug));
  }

  return [];
}

export function summarizeLocalSubmissions(
  attempts: LocalSubmissionAttempt[],
): LocalSubmissionSummary | null {
  if (attempts.length === 0) {
    return null;
  }

  const [latestAttempt] = attempts;
  const bestAttempt = attempts.reduce((best, attempt) => {
    if (attempt.passedCount > best.passedCount) {
      return attempt;
    }

    if (
      attempt.passedCount === best.passedCount &&
      attempt.totalCount > best.totalCount
    ) {
      return attempt;
    }

    return best;
  }, latestAttempt);

  return {
    problemSlug: latestAttempt.problemSlug,
    attempts: attempts.length,
    latestStatus: latestAttempt.status,
    latestPassedCount: latestAttempt.passedCount,
    latestTotalCount: latestAttempt.totalCount,
    lastSubmittedAt: latestAttempt.submittedAt,
    bestPassedCount: bestAttempt.passedCount,
    bestTotalCount: bestAttempt.totalCount,
    hasPassed: attempts.some((attempt) => attempt.status === "passed"),
  };
}

export function loadLocalSubmissionSummaries(
  problemSlugs: string[],
): Record<string, LocalSubmissionSummary> {
  return problemSlugs.reduce<Record<string, LocalSubmissionSummary>>(
    (summaries, problemSlug) => {
      const summary = summarizeLocalSubmissions(loadLocalSubmissions(problemSlug));

      if (summary) {
        summaries[problemSlug] = summary;
      }

      return summaries;
    },
    {},
  );
}
