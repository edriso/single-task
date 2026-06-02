import { useEffect } from 'react';
import { useTaskStore } from '@/store/task-store';

export function useApplyTheme(): void {
  const theme = useTaskStore((state) => state.settings.theme);
  const accent = useTaskStore((state) => state.settings.accent);
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.setProperty('--accent', accent);
  }, [theme, accent]);
}
