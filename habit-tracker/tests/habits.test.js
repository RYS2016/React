import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STORAGE_KEY, calculateStreak, calculateWeekCompletion, getWeekDates,
  loadHabits, makeHabit, saveHabits, toLocalDateKey, toggleCompletion,
} from '../src/habits.js';

test('week starts Monday and spans seven local days across month boundary', () => {
  const dates = getWeekDates(new Date(2026, 9, 30));
  assert.deepEqual(dates.map(toLocalDateKey), [
    '2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29',
    '2026-10-30', '2026-10-31', '2026-11-01',
  ]);
});

test('toggle completion adds and removes a check-in without mutating original', () => {
  const habit = { id: 'one', name: 'Read', emoji: '📚', completedDates: [] };
  const done = toggleCompletion(habit, '2026-10-30');
  assert.deepEqual(done.completedDates, ['2026-10-30']);
  assert.deepEqual(habit.completedDates, []);
  assert.deepEqual(toggleCompletion(done, '2026-10-30').completedDates, []);
});

test('weekly progress counts only dates in selected week', () => {
  const dates = getWeekDates(new Date(2026, 9, 30));
  const habits = [
    { completedDates: ['2026-10-26', '2026-10-27', '2026-10-20'] },
    { completedDates: ['2026-10-30'] },
  ];
  assert.deepEqual(calculateWeekCompletion(habits, dates), { completed: 3, possible: 14, percent: 21 });
  assert.deepEqual(calculateWeekCompletion([], dates), { completed: 0, possible: 0, percent: 0 });
});

test('streak allows missing today but not gaps beyond yesterday', () => {
  const today = new Date(2026, 9, 30);
  assert.equal(calculateStreak(['2026-10-29', '2026-10-28', '2026-10-26'], today), 2);
  assert.equal(calculateStreak(['2026-10-30', '2026-10-29'], today), 2);
  assert.equal(calculateStreak(['2026-10-26'], today), 0);
});

test('new habit validates name and uses chosen icon', () => {
  const habit = makeHabit('  Morning   walk ', '🏃');
  assert.equal(habit.name, 'Morning walk');
  assert.equal(habit.emoji, '🏃');
  assert.ok(habit.id);
  assert.throws(() => makeHabit('  '));
});

test('storage roundtrip and safe handling of malformed data', () => {
  const data = new Map();
  const storage = { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
  const habit = makeHabit('Journal');
  assert.equal(saveHabits(storage, [habit]), true);
  assert.deepEqual(loadHabits(storage), [habit]);
  data.set(STORAGE_KEY, '{invalid');
  assert.deepEqual(loadHabits(storage), []);
  data.set(STORAGE_KEY, JSON.stringify([{ ...habit, completedDates: ['2026-10-30', '2026-10-30', 'oops'] }]));
  assert.deepEqual(loadHabits(storage)[0].completedDates, ['2026-10-30']);
});
