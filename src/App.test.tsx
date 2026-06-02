import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { createDefaultState } from './lib/repository';
import { useTaskStore } from './store/task-store';

function reset() {
  localStorage.clear();
  const d = createDefaultState();
  useTaskStore.setState({ settings: d.settings, queue: d.queue });
}
beforeEach(reset);
afterEach(() => vi.useRealTimers());

describe('Single-Task', () => {
  it('shows the prompt and is visible (no opacity-freeze)', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /one thing/ })).toBeVisible();
  });

  it('begins focus mode showing only the one task, and the timer counts then pauses', () => {
    vi.useFakeTimers();
    render(<App />);
    fireEvent.change(screen.getByLabelText('The one thing'), {
      target: { value: 'write the report' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Begin' }));
    expect(screen.getByText('the only thing right now')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'write the report' })).toBeInTheDocument();
    expect(screen.getByText('25:00')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText('24:57')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText('24:57')).toBeInTheDocument(); // paused
  });

  it('queues extras and offers the next on completion', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('The one thing'), { target: { value: 'task A' } });
    fireEvent.click(screen.getByRole('button', { name: 'Queue for later' }));
    expect(useTaskStore.getState().queue).toEqual(['task A']);
    fireEvent.change(screen.getByLabelText('The one thing'), { target: { value: 'task B' } });
    fireEvent.click(screen.getByRole('button', { name: 'Begin' }));
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.getByRole('heading', { name: 'Done.' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next: task A/ })).toBeInTheDocument();
  });
});
