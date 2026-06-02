import { create } from 'zustand';
import { repository } from '@/lib/repository';
import type { Accent, Settings, Theme } from '@/types/domain';

interface TaskState {
  settings: Settings;
  /** The one thing in focus right now (persisted), or null when none. */
  active: string | null;
  queue: string[];
  setActive: (active: string | null) => void;
  enqueue: (task: string) => void;
  dequeueAt: (index: number) => void;
  setUseTimer: (on: boolean) => void;
  setMins: (n: number) => void;
  setTheme: (theme: Theme) => void;
  setAccent: (accent: Accent) => void;
}

const initial = repository.getState();

export const useTaskStore = create<TaskState>((set, get) => {
  function commit(queue: string[]): void {
    set({ queue: repository.setQueue(queue).queue });
  }
  function patchSettings(patch: Partial<Settings>): void {
    set({ settings: repository.setSettings(patch).settings });
  }
  return {
    settings: initial.settings,
    active: initial.active,
    queue: initial.queue,
    setActive: (active) => set({ active: repository.setActive(active).active }),
    enqueue: (task) => {
      if (task.trim()) commit([...get().queue, task.trim()]);
    },
    dequeueAt: (index) => commit(get().queue.filter((_, i) => i !== index)),
    setUseTimer: (useTimer) => patchSettings({ useTimer }),
    setMins: (mins) => patchSettings({ mins }),
    setTheme: (theme) => patchSettings({ theme }),
    setAccent: (accent) => patchSettings({ accent }),
  };
});
