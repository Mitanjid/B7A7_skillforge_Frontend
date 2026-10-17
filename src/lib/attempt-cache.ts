import type { StartAttemptProblem } from "@/types/api";

export interface CachedAttempt {
  problems: StartAttemptProblem[];
  deadline: string;
}

const keyFor = (attemptId: string) => `sf:attempt:${attemptId}`;

// The backend only returns the question list from POST /attempts/start, so we
// keep it in this browser to survive a refresh while the exam is running.
export function cacheAttempt(attemptId: string, data: CachedAttempt) {
  try {
    localStorage.setItem(keyFor(attemptId), JSON.stringify(data));
  } catch {
    // Storage unavailable: the exam still works, it just won't survive a reload.
  }
}

export function getCachedAttempt(attemptId: string): CachedAttempt | null {
  try {
    const raw = localStorage.getItem(keyFor(attemptId));
    return raw ? (JSON.parse(raw) as CachedAttempt) : null;
  } catch {
    return null;
  }
}

export function clearCachedAttempt(attemptId: string) {
  try {
    localStorage.removeItem(keyFor(attemptId));
  } catch {
    // ignore
  }
}
