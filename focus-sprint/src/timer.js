export const DEFAULT_SETTINGS = Object.freeze({ focusMinutes: 25, breakMinutes: 5 });
export const SETTINGS_KEY = 'focus-sprint:settings';
export const SESSIONS_KEY = 'focus-sprint:sessions';

export function validMinutes(value, fallback) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 1 && number <= 120 ? number : fallback;
}

export function loadSettings(storage) {
  try {
    const saved = JSON.parse(storage?.getItem(SETTINGS_KEY) ?? 'null');
    return {
      focusMinutes: validMinutes(saved?.focusMinutes, DEFAULT_SETTINGS.focusMinutes),
      breakMinutes: validMinutes(saved?.breakMinutes, DEFAULT_SETTINGS.breakMinutes),
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function loadSessions(storage) {
  try {
    const value = Number(storage?.getItem(SESSIONS_KEY));
    return Number.isSafeInteger(value) && value >= 0 ? value : 0;
  } catch {
    return 0;
  }
}

export function formatTime(seconds) {
  const safe = Math.max(0, Math.floor(Number(seconds) || 0));
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
}

export function nextPhase(phase, settings) {
  return phase === 'focus'
    ? { phase: 'break', seconds: settings.breakMinutes * 60, completedFocus: true }
    : { phase: 'focus', seconds: settings.focusMinutes * 60, completedFocus: false };
}
