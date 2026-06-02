import { beforeEach, describe, expect, it } from 'vitest';
import { createLocalStorageRepository, type Repository } from './repository';

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k: string) => map.get(k) ?? null,
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    removeItem: (k: string) => {
      map.delete(k);
    },
    setItem: (k: string, v: string) => {
      map.set(k, v);
    },
  } as Storage;
}

describe('repository', () => {
  let repo: Repository;
  let storage: Storage;
  beforeEach(() => {
    storage = memoryStorage();
    repo = createLocalStorageRepository(storage);
  });
  it('returns defaults / tolerates corrupt data', () => {
    expect(repo.getState().settings.mins).toBe(25);
    storage.setItem('st-v1', 'nope');
    expect(repo.getState().queue).toEqual([]);
  });
  it('round-trips queue and settings', () => {
    repo.setQueue(['email', 'invoice']);
    repo.setSettings({ useTimer: false, mins: 40 });
    expect(repo.getState().queue).toEqual(['email', 'invoice']);
    expect(repo.getState().settings.useTimer).toBe(false);
    expect(repo.getState().settings.mins).toBe(40);
  });
});
