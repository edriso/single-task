import { useState } from 'react';
import { SettingsOverlay } from '@/components/settings-overlay';
import { useApplyTheme } from '@/hooks/use-apply-theme';
import { useInterval } from '@/hooks/use-interval';
import { formatClock } from '@/lib/format';
import { useTaskStore } from '@/store/task-store';

export function App() {
  useApplyTheme();
  const { useTimer, mins, theme } = useTaskStore((state) => state.settings);
  const active = useTaskStore((state) => state.active);
  const setActive = useTaskStore((state) => state.setActive);
  const queue = useTaskStore((state) => state.queue);
  const enqueue = useTaskStore((state) => state.enqueue);
  const dequeueAt = useTaskStore((state) => state.dequeueAt);
  const setTheme = useTaskStore((state) => state.setTheme);

  const [draft, setDraft] = useState('');
  // A restored task comes back paused at full time — the exact countdown is never persisted.
  const [left, setLeft] = useState(() =>
    useTaskStore.getState().active ? useTaskStore.getState().settings.mins * 60 : 0,
  );
  const [running, setRunning] = useState(false);
  const [doneMsg, setDoneMsg] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // The optional focus timer.
  useInterval(
    () =>
      setLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      }),
    running ? 1000 : null,
  );

  function start(task: string, fromQueueIndex?: number) {
    setActive(task);
    setLeft(mins * 60);
    setRunning(useTimer);
    setDoneMsg(false);
    if (fromQueueIndex !== undefined) {
      dequeueAt(fromQueueIndex);
    }
  }
  function complete() {
    // The task is finished — clear it from storage so a reload won't resurrect it.
    setActive(null);
    setDoneMsg(true);
    setRunning(false);
  }
  function exit() {
    setActive(null);
    setDoneMsg(false);
    setRunning(false);
  }

  if (active !== null || doneMsg) {
    return (
      <div className="focus fadein">
        <div className="haze" aria-hidden="true" />
        {doneMsg ? (
          <div className="rise" style={{ position: 'relative', zIndex: 1 }}>
            <div className="done-mark" aria-hidden="true">
              ✓
            </div>
            <h1 className="the-task" style={{ fontSize: 'clamp(26px,6vw,38px)' }}>
              Done.
            </h1>
            <p className="sub" style={{ margin: '0 auto 30px' }}>
              One thing, finished. That&rsquo;s how the list actually shrinks.
            </p>
            <div className="fbtns" style={{ justifyContent: 'center' }}>
              {queue.length > 0 && (
                <button className="cta" type="button" onClick={() => start(queue[0], 0)}>
                  Next: {queue[0].length > 20 ? `${queue[0].slice(0, 20)}…` : queue[0]}
                </button>
              )}
              <button className="cta ghost" type="button" onClick={exit}>
                Back
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div className="meta">the only thing right now</div>
            <h1 className="the-task">{active}</h1>
            {useTimer && (
              <div
                className="meta ftimer"
                style={{
                  fontSize: 18,
                  letterSpacing: '.05em',
                  marginBottom: 30,
                  color: running ? 'var(--accent)' : 'var(--faint)',
                }}
                aria-live="polite"
              >
                {formatClock(left)}
              </div>
            )}
            <div className="fbtns">
              {useTimer && (
                <button className="cta ghost" type="button" onClick={() => setRunning((r) => !r)}>
                  {running ? 'Pause' : 'Resume'}
                </button>
              )}
              <button className="cta" type="button" onClick={complete}>
                Done
              </button>
            </div>
            <button
              className="cta ghost"
              style={{ marginTop: 14, border: 'none' }}
              type="button"
              onClick={exit}
            >
              give up for now
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <button
        className="corner corner-l"
        type="button"
        onClick={() => setSettingsOpen(true)}
        aria-label="Settings"
      >
        ⚙
      </button>
      <button
        className="corner"
        type="button"
        onClick={() => setTheme(theme === 'void' ? 'paper' : 'void')}
        aria-label="Theme"
      >
        {theme === 'void' ? '☀' : '☾'}
      </button>
      <div className="stage">
        <div className="word">Single-Task</div>
        <div
          className="rise"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
        >
          <h1 className="h1">What&rsquo;s the one thing?</h1>
          <p className="sub">
            Name it. Everything else fades away so there&rsquo;s nothing to do but the one thing.
          </p>
          <input
            className="field"
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="the one thing…"
            aria-label="The one thing"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && draft.trim()) start(draft.trim());
            }}
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="cta"
              type="button"
              disabled={!draft.trim()}
              onClick={() => start(draft.trim())}
            >
              Begin
            </button>
            {draft.trim() && (
              <button
                className="cta ghost"
                type="button"
                onClick={() => {
                  enqueue(draft.trim());
                  setDraft('');
                }}
              >
                Queue for later
              </button>
            )}
          </div>

          {queue.length > 0 && (
            <div className="queue">
              <div className="ql">After, maybe · {queue.length}</div>
              {queue.map((q, i) => (
                <div key={`${q}-${i}`} className="qrow">
                  <span>{q}</span>
                  <button
                    className="qx"
                    type="button"
                    onClick={() => dequeueAt(i)}
                    aria-label={`Remove: ${q}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <p className="sub" style={{ fontSize: 13, marginTop: 14, color: 'var(--faint)' }}>
                These are parked, not now. One thing at a time.
              </p>
            </div>
          )}
        </div>
      </div>

      {settingsOpen && <SettingsOverlay onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
