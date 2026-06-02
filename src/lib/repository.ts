import { type PersistedState, persistedStateSchema, type Settings } from '@/types/domain';

const STORAGE_KEY = 'st-v1';

export function createDefaultState(): PersistedState {
  return {
    version: 1,
    settings: { useTimer: true, mins: 25, theme: 'void', accent: '#d8c8a0' },
    active: null,
    queue: [],
  };
}

export interface Repository {
  getState(): PersistedState;
  saveState(state: PersistedState): void;
  setSettings(patch: Partial<Settings>): PersistedState;
  setActive(active: string | null): PersistedState;
  setQueue(queue: string[]): PersistedState;
  clear(): void;
}

export function createLocalStorageRepository(storage: Storage = localStorage): Repository {
  function read(): PersistedState {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return createDefaultState();
      const parsed = persistedStateSchema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : createDefaultState();
    } catch {
      return createDefaultState();
    }
  }
  function saveState(state: PersistedState): void {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }
  function setSettings(patch: Partial<Settings>): PersistedState {
    const current = read();
    const next = { ...current, settings: { ...current.settings, ...patch } };
    saveState(next);
    return next;
  }
  function setActive(active: string | null): PersistedState {
    const next = { ...read(), active };
    saveState(next);
    return next;
  }
  function setQueue(queue: string[]): PersistedState {
    const next = { ...read(), queue };
    saveState(next);
    return next;
  }
  function clear(): void {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
  return { getState: read, saveState, setSettings, setActive, setQueue, clear };
}

export const repository: Repository = createLocalStorageRepository();
