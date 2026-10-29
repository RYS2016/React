import { useEffect, useRef, useState } from 'react';
import {
  DEFAULT_SETTINGS, SETTINGS_KEY, SESSIONS_KEY,
  formatTime, loadSettings, loadSessions, nextPhase, validMinutes,
} from './timer.js';

export default function App() {
  const [settings, setSettings] = useState(() => loadSettings(window.localStorage));
  const [phase, setPhase] = useState('focus');
  const [seconds, setSeconds] = useState(() => loadSettings(window.localStorage).focusMinutes * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(() => loadSessions(window.localStorage));
  const [notice, setNotice] = useState('Choose a task and start your sprint.');
  const deadline = useRef(null);
  const duration = phase === 'focus' ? settings.focusMinutes : settings.breakMinutes;
  const progress = 100 * (1 - seconds / (duration * 60));

  useEffect(() => {
    try { window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch { /* storage blocked */ }
  }, [settings]);

  useEffect(() => {
    try { window.localStorage.setItem(SESSIONS_KEY, String(sessions)); } catch { /* storage blocked */ }
  }, [sessions]);

  useEffect(() => {
    if (!running) return undefined;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setSeconds(remaining);
      if (remaining === 0) {
        setRunning(false);
        deadline.current = null;
        const next = nextPhase(phase, settings);
        if (next.completedFocus) setSessions((count) => count + 1);
        setPhase(next.phase);
        setSeconds(next.seconds);
        setNotice(next.completedFocus ? 'Sprint complete! Enjoy your break.' : 'Break complete! Ready to focus?');
      }
    };
    const id = window.setInterval(tick, 250);
    tick();
    return () => window.clearInterval(id);
  }, [running, phase, settings]);

  function start() {
    if (running) return;
    deadline.current = Date.now() + seconds * 1000;
    setRunning(true);
    setNotice(phase === 'focus' ? 'You’ve got this. One thing at a time.' : 'Recharge. You earned it.');
  }

  function pause() {
    if (!running) return;
    setSeconds(Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)));
    deadline.current = null;
    setRunning(false);
    setNotice('Paused. Resume whenever you’re ready.');
  }

  function reset() {
    deadline.current = null;
    setRunning(false);
    setSeconds(duration * 60);
    setNotice('Timer reset. Fresh start!');
  }

  function choosePhase(next) {
    deadline.current = null;
    setRunning(false);
    setPhase(next);
    setSeconds((next === 'focus' ? settings.focusMinutes : settings.breakMinutes) * 60);
    setNotice(next === 'focus' ? 'Ready for your next sprint?' : 'Take a moment for yourself.');
  }

  function changeDuration(key, value) {
    const minutes = validMinutes(value, null);
    if (minutes === null) return;
    deadline.current = null;
    setRunning(false);
    setSettings((current) => ({ ...current, [key]: minutes }));
    if ((key === 'focusMinutes' && phase === 'focus') || (key === 'breakMinutes' && phase === 'break')) {
      setSeconds(minutes * 60);
    }
    setNotice('Duration updated. Timer is ready.');
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true">✦</div>
        <div><div className="eyebrow">A LITTLE SPACE TO FOCUS</div><h1>Focus Sprint<span>.</span></h1></div>
      </header>

      <section className="dashboard" aria-label="Focus timer">
        <div className="hero-copy"><span className="pill">YOUR PRODUCTIVITY COMPANION</span><h2>Make room for<br /><em>deep work.</em></h2><p>Small sprints. Clear mind. Meaningful progress.</p></div>
        <div className="timer-card">
          <div className="mode-switch" aria-label="Timer mode">
            <button className={phase === 'focus' ? 'selected' : ''} onClick={() => choosePhase('focus')} aria-pressed={phase === 'focus'}>✦ Focus</button>
            <button className={phase === 'break' ? 'selected' : ''} onClick={() => choosePhase('break')} aria-pressed={phase === 'break'}>☕ Short break</button>
          </div>
          <div className="clock" role="timer" aria-label={`${phase} time remaining: ${formatTime(seconds)}`}>
            <div className="clock-inner"><span className="clock-label">{phase === 'focus' ? 'FOCUS TIME' : 'BREAK TIME'}</span><strong>{formatTime(seconds)}</strong><span className="clock-caption">{phase === 'focus' ? 'stay in your flow' : 'rest and reset'}</span></div>
            <svg viewBox="0 0 300 300" className="progress-ring" aria-hidden="true"><circle cx="150" cy="150" r="138" className="ring-track"/><circle cx="150" cy="150" r="138" className="ring-progress" style={{ strokeDasharray: `${2 * Math.PI * 138}`, strokeDashoffset: `${2 * Math.PI * 138 * (1 - progress / 100)}` }}/></svg>
          </div>
          <div className="controls">
            <button className="primary-button" onClick={running ? pause : start}>{running ? 'Ⅱ  Pause' : '▶  Start sprint'}</button>
            <button className="secondary-button" onClick={reset} title="Reset timer">↻ Reset</button>
          </div>
          <p className="notice" role="status">{notice}</p>
        </div>
      </section>

      <section className="bottom-grid" aria-label="Progress and settings">
        <article className="info-card"><div className="card-heading"><span>◉</span> TODAY'S PROGRESS</div><div className="session-row"><strong>{sessions}</strong><div><b>Completed sprints</b><p>One session at a time adds up.</p></div></div><button className="text-button" onClick={() => setSessions(0)}>Reset session count ↗</button></article>
        <article className="info-card"><div className="card-heading"><span>⚙</span> MAKE IT YOURS</div><div className="settings-grid"><label>Focus <span>(minutes)</span><input type="number" min="1" max="120" value={settings.focusMinutes} onChange={(e) => changeDuration('focusMinutes', e.target.value)} /></label><label>Break <span>(minutes)</span><input type="number" min="1" max="120" value={settings.breakMinutes} onChange={(e) => changeDuration('breakMinutes', e.target.value)} /></label></div><p className="setting-note">Saved automatically in this browser. 1–120 minutes.</p></article>
      </section>
      <footer>Designed for progress, not perfection. <span>✦</span></footer>
    </main>
  );
}
