/** Formats whole seconds as a "M:SS" clock. */
export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`;
}
