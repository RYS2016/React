export const STORAGE_KEY = 'habit-garden-v1';

export const EMOJI_OPTIONS = ['🌿', '💧', '📚', '🏃', '🧘', '🎨', '💤', '✍️'];

export const INITIAL_HABITS = [
  { id: 'sample-water', name: 'Drink more water', emoji: '💧', completedDates: [] },
  { id: 'sample-read', name: 'Read for 20 minutes', emoji: '📚', completedDates: [] },
  { id: 'sample-move', name: 'Move my body', emoji: '🏃', completedDates: [] },
];

export function toLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

export function getWeekDates(date) {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);
    return day;
  });
}

export function toggleCompletion(habit, dateKey) {
  const dates = new Set(habit.completedDates);
  if (dates.has(dateKey)) dates.delete(dateKey);
  else dates.add(dateKey);
  return { ...habit, completedDates: [...dates].sort() };
}

export function calculateWeekCompletion(habits, weekDates) {
  const keys = new Set(weekDates.map(toLocalDateKey));
  const completed = habits.reduce(
    (total, habit) => total + habit.completedDates.filter((date) => keys.has(date)).length,
    0,
  );
  const possible = habits.length * weekDates.length;
  return { completed, possible, percent: possible ? Math.round((completed / possible) * 100) : 0 };
}

export function calculateStreak(completedDates, today = new Date()) {
  const dates = new Set(completedDates);
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!dates.has(toLocalDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (dates.has(toLocalDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function makeHabit(name, emoji = '🌿') {
  const cleanName = name.trim().replace(/\s+/g, ' ');
  if (!cleanName || cleanName.length > 60) throw new Error('Habit name must be 1–60 characters.');
  return {
    id: globalThis.crypto?.randomUUID?.() ?? 'habit-' + Date.now() + '-' + Math.random().toString(36).slice(2),
    name: cleanName,
    emoji: EMOJI_OPTIONS.includes(emoji) ? emoji : '🌿',
    completedDates: [],
  };
}

export function loadHabits(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return INITIAL_HABITS.map((habit) => ({ ...habit, completedDates: [] }));
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((habit) =>
      habit && typeof habit.id === 'string' && typeof habit.name === 'string' &&
      typeof habit.emoji === 'string' && Array.isArray(habit.completedDates),
    ).map((habit) => ({
      id: habit.id,
      name: habit.name.slice(0, 60),
      emoji: habit.emoji,
      completedDates: [...new Set(habit.completedDates.filter((date) =>
        typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date),
      ))],
    }));
  } catch {
    return [];
  }
}

export function saveHabits(storage, habits) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(habits));
    return true;
  } catch {
    return false;
  }
}
