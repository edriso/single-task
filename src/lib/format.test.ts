import { describe, expect, it } from 'vitest';
import { formatClock } from './format';

describe('formatClock', () => {
  it('formats seconds as M:SS', () => {
    expect(formatClock(25 * 60)).toBe('25:00');
    expect(formatClock(65)).toBe('1:05');
    expect(formatClock(-3)).toBe('0:00');
  });
});
