import { useEffect, useRef, type ReactNode } from 'react';
import { useTaskStore } from '@/store/task-store';
import { ACCENTS } from '@/types/domain';

/** A small, focus-trapping settings dialog: timer on/off, length, theme, accent. */
export function SettingsOverlay({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const settings = useTaskStore((state) => state.settings);
  const setUseTimer = useTaskStore((state) => state.setUseTimer);
  const setMins = useTaskStore((state) => state.setMins);
  const setTheme = useTaskStore((state) => state.setTheme);
  const setAccent = useTaskStore((state) => state.setAccent);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
      ref={ref}
      tabIndex={-1}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(4,4,5,0.66)',
        backdropFilter: 'blur(4px)',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 340,
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 18,
          padding: 24,
          color: 'var(--ink)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 22,
          }}
        >
          <span style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>Settings</span>
          <button
            onClick={onClose}
            className="corner"
            type="button"
            aria-label="Close"
            style={{ position: 'static' }}
          >
            ✕
          </button>
        </div>
        <button
          type="button"
          onClick={() => setUseTimer(!settings.useTimer)}
          aria-pressed={settings.useTimer}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: 0,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--ink)',
            fontFamily: 'var(--ui)',
            fontSize: 15,
            marginBottom: 22,
          }}
        >
          <span>Use a timer</span>
          <span
            aria-hidden="true"
            style={{
              width: 44,
              height: 26,
              borderRadius: 999,
              flexShrink: 0,
              background: settings.useTimer ? 'var(--accent)' : 'var(--surface2)',
              border: '1px solid var(--line)',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: 2,
                insetInlineStart: settings.useTimer ? 20 : 2,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: settings.useTimer ? 'var(--on)' : 'var(--faint)',
                transition: 'inset-inline-start .25s ease',
              }}
            />
          </span>
        </button>
        <Label>{`Timer length · ${settings.mins}m`}</Label>
        <input
          type="range"
          min={10}
          max={60}
          step={5}
          value={settings.mins}
          onChange={(e) => setMins(Number(e.target.value))}
          aria-label="Timer length"
          style={{ width: '100%', accentColor: 'var(--accent)', marginBottom: 22 }}
        />
        <Label>Theme</Label>
        <div role="group" style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
          {(['void', 'paper'] as const).map((option) => {
            const selected = settings.theme === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setTheme(option)}
                aria-pressed={selected}
                style={{
                  padding: '9px 18px',
                  borderRadius: 999,
                  cursor: 'pointer',
                  fontFamily: 'var(--ui)',
                  fontSize: 14,
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  background: selected ? 'var(--soft)' : 'transparent',
                  color: selected ? 'var(--accent)' : 'var(--dim)',
                  border: `1px solid ${selected ? 'var(--accent)' : 'var(--line)'}`,
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
        <Label>Accent</Label>
        <div role="group" aria-label="Accent" style={{ display: 'flex', gap: 12 }}>
          {ACCENTS.map((color) => {
            const selected = settings.accent === color;
            return (
              <button
                key={color}
                type="button"
                onClick={() => setAccent(color)}
                aria-pressed={selected}
                aria-label={color}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  background: color,
                  border: `2.5px solid ${selected ? 'var(--ink)' : 'transparent'}`,
                  boxShadow: '0 0 0 1px var(--line)',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: 'var(--ui)',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--faint)',
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}
