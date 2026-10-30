import { useEffect, useMemo, useState } from 'react';
import {
  EMOJI_OPTIONS,
  calculateStreak,
  calculateWeekCompletion,
  getWeekDates,
  loadHabits,
  makeHabit,
  saveHabits,
  toLocalDateKey,
  toggleCompletion,
} from './habits.js';

const WEEKDAY = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
const MONTH = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const LONG_DATE = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

function ProgressRing({ percent }) {
  return (
    <div className="progress-ring" style={{ '--progress': percent + '%' }} aria-label={percent + '% completed today'} role="img">
      <div className="progress-ring-inner">
        <strong>{percent}%</strong>
        <span>today</span>
      </div>
    </div>
  );
}

function HabitRow({ habit, weekDates, todayKey, onToggle, onDelete }) {
  const streak = calculateStreak(habit.completedDates);
  return (
    <div className="habit-row">
      <div className="habit-label">
        <span className="habit-emoji" aria-hidden="true">{habit.emoji}</span>
        <div className="habit-copy">
          <strong>{habit.name}</strong>
          <span>{streak ? '🔥 ' + streak + ' day streak' : 'Start your streak today'}</span>
        </div>
      </div>
      <div className="habit-days">
        {weekDates.map((date) => {
          const key = toLocalDateKey(date);
          const checked = habit.completedDates.includes(key);
          const future = key > todayKey;
          return (
            <button
              key={key}
              type="button"
              className={'day-check ' + (checked ? 'checked' : '') + ' ' + (key === todayKey ? 'is-today' : '')}
              onClick={() => onToggle(habit.id, key)}
              disabled={future}
              aria-label={habit.name + ': ' + MONTH.format(date) + ', ' + (checked ? 'completed' : 'not completed')}
              aria-pressed={checked}
              title={MONTH.format(date) + (future ? ' (upcoming)' : '')}
            >
              {checked ? '✓' : <span aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      <button type="button" className="delete-button" onClick={() => onDelete(habit.id)} aria-label={'Delete ' + habit.name} title="Delete habit">×</button>
    </div>
  );
}

export default function App() {
  const [habits, setHabits] = useState(() => loadHabits(window.localStorage));
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🌿');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(true);
  const [now, setNow] = useState(() => new Date());
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    setSaved(saveHabits(window.localStorage, habits));
  }, [habits]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const todayKey = toLocalDateKey(now);
  const weekDates = useMemo(() => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    date.setDate(date.getDate() + weekOffset * 7);
    return getWeekDates(date);
  }, [todayKey, weekOffset]);
  const week = calculateWeekCompletion(habits, weekDates);
  const completedToday = habits.filter((habit) => habit.completedDates.includes(todayKey)).length;
  const todayPercent = habits.length ? Math.round((completedToday / habits.length) * 100) : 0;
  const bestStreak = Math.max(0, ...habits.map((habit) => calculateStreak(habit.completedDates, now)));
  const weekLabel = MONTH.format(weekDates[0]) + ' – ' + MONTH.format(weekDates[6]);

  function addHabit(event) {
    event.preventDefault();
    try {
      const newHabit = makeHabit(name, emoji);
      if (habits.some((habit) => habit.name.toLowerCase() === newHabit.name.toLowerCase())) {
        setError('You already track a habit with that name.');
        return;
      }
      setHabits((previous) => [...previous, newHabit]);
      setName('');
      setError('');
    } catch (exception) {
      setError(exception.message);
    }
  }

  function removeHabit(id) {
    const habit = habits.find((item) => item.id === id);
    if (habit && window.confirm('Delete “' + habit.name + '” and its check-ins?')) {
      setHabits((previous) => previous.filter((item) => item.id !== id));
    }
  }

  function toggleHabit(id, key) {
    setHabits((previous) => previous.map((habit) =>
      habit.id === id ? toggleCompletion(habit, key) : habit,
    ));
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-icon">✳</span><span>habit<span className="brand-light">garden</span></span></div>
        <div className="sidebar-content">
          <span className="eyebrow sidebar-eyebrow">GROW A LITTLE, DAILY</span>
          <h1>Small steps.<br /><em>Big change.</em></h1>
          <p>Consistency beats intensity. Build a routine you love, one check-in at a time.</p>
          <div className="plant-art" aria-hidden="true"><span className="plant-orbit orbit-one"/><span className="plant-orbit orbit-two"/><span className="plant-illustration">🌱</span><span className="plant-sparkle sparkle-one">✦</span><span className="plant-sparkle sparkle-two">✧</span></div>
        </div>
        <div className="sidebar-bottom"><span className="sidebar-dot" /> Progress, not perfection.</div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div><span className="eyebrow">YOUR PERSONAL GROWTH SPACE</span><h2>My Habit Garden <span aria-hidden="true">✳</span></h2><p>{LONG_DATE.format(now)} · Make today count.</p></div><div className="avatar" aria-label="Your workspace">HG</div></header>

        <section className="overview" aria-label="Your progress">
          <div className="today-card"><div><span className="card-kicker">TODAY'S PROGRESS</span><h3>{completedToday === habits.length && habits.length ? 'You did it! 🎉' : 'Keep it growing.'}</h3><p>{completedToday} of {habits.length} habits completed</p><div className="small-progress"><span style={{ width: todayPercent + '%' }} /></div></div><ProgressRing percent={todayPercent} /></div>
          <div className="stat-card"><span className="stat-icon lavender">✦</span><span className="card-kicker">WEEKLY CHECK-INS</span><strong>{week.completed}<small> / {week.possible}</small></strong><p>{week.percent}% of your weekly goal</p></div>
          <div className="stat-card"><span className="stat-icon peach">🔥</span><span className="card-kicker">BEST CURRENT STREAK</span><strong>{bestStreak}<small> days</small></strong><p>Every day adds up</p></div>
        </section>

        <section className="tracker-panel" aria-labelledby="tracker-heading">
          <div className="section-heading"><div><span className="eyebrow">STAY CONSISTENT</span><h3 id="tracker-heading">Your weekly tracker</h3><p>Tap a circle to mark a habit as complete.</p></div><div className="week-controls"><button type="button" onClick={() => setWeekOffset((offset) => offset - 1)} aria-label="Previous week">‹</button><span>{weekLabel}</span><button type="button" onClick={() => setWeekOffset((offset) => Math.min(0, offset + 1))} disabled={weekOffset === 0} aria-label="Next week">›</button></div></div>
          <div className="tracker-scroll"><div className="tracker-grid"><div className="day-header"><span>MY HABITS</span><div className="day-names">{weekDates.map((date) => <div key={toLocalDateKey(date)} className={toLocalDateKey(date) === todayKey ? 'active-day' : ''}><span>{WEEKDAY.format(date)}</span><strong>{date.getDate()}</strong></div>)}</div><span className="delete-placeholder" /></div>
            {habits.length ? habits.map((habit) => <HabitRow key={habit.id} habit={habit} weekDates={weekDates} todayKey={todayKey} onToggle={toggleHabit} onDelete={removeHabit} />) : <div className="empty-state">🌱 Your garden is ready. Add your first habit below.</div>}
          </div></div>
          <div className="tracker-footer"><span><span className="legend-dot done" /> Completed</span><span><span className="legend-dot pending" /> Not yet</span><span className="tracker-footer-note">{habits.length} active habits</span></div>
        </section>

        <section className="add-panel" aria-labelledby="add-heading"><div className="add-copy"><span className="eyebrow">PLANT SOMETHING NEW</span><h3 id="add-heading">Add a new habit <span aria-hidden="true">🌱</span></h3><p>Pick something small you can do consistently.</p></div><form onSubmit={addHabit} className="add-form"><div className="emoji-select"><label htmlFor="habit-emoji">Icon</label><select id="habit-emoji" value={emoji} onChange={(event) => setEmoji(event.target.value)}>{EMOJI_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></div><div className="name-field"><label htmlFor="habit-name">Habit name</label><input id="habit-name" type="text" maxLength={60} value={name} onChange={(event) => { setName(event.target.value); if (error) setError(''); }} placeholder="e.g. Take a 10-minute walk" required /></div><button className="add-button" type="submit">+ Add habit</button></form>{error && <p className="form-error" role="alert">{error}</p>}{!saved && <p className="form-error" role="alert">Unable to save changes. Check your browser's storage settings.</p>}</section>
        <footer className="main-footer">Made for the little wins. <span>✳</span> Your habits stay in this browser.</footer>
      </main>
    </div>
  );
}
