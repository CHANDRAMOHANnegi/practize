import type { LocalSubmissionAttempt } from "./types";

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

  if (isBrowser()) {
    window.localStorage.setItem(
      keyFor(attempt.problemSlug),
      JSON.stringify(nextAttempts),
    );
  }

  return nextAttempts;
}
