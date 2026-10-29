import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_SETTINGS, SETTINGS_KEY, SESSIONS_KEY,
  formatTime, loadSettings, loadSessions, nextPhase, validMinutes,
} from './timer.js';

const memoryStorage = (entries = {}) => ({ getItem: (key) => entries[key] ?? null });

test('defaults to 25/5 with empty storage', () => {
  assert.deepEqual(loadSettings(memoryStorage()), DEFAULT_SETTINGS);
});

test('restores valid saved durations', () => {
  assert.deepEqual(loadSettings(memoryStorage({
    [SETTINGS_KEY]: JSON.stringify({ focusMinutes: 45, breakMinutes: 10 }),
  })), { focusMinutes: 45, breakMinutes: 10 });
});

test('rejects invalid settings and malformed JSON', () => {
  assert.deepEqual(loadSettings(memoryStorage({
    [SETTINGS_KEY]: JSON.stringify({ focusMinutes: 0, breakMinutes: 200 }),
  })), DEFAULT_SETTINGS);
  assert.deepEqual(loadSettings(memoryStorage({ [SETTINGS_KEY]: '{broken' })), DEFAULT_SETTINGS);
  assert.equal(validMinutes('15', 25), 15);
  assert.equal(validMinutes('2.5', 25), 25);
});

test('formats countdown values', () => {
  assert.equal(formatTime(1500), '25:00');
  assert.equal(formatTime(65), '01:05');
  assert.equal(formatTime(-1), '00:00');
});

test('switches between focus and break without auto-start', () => {
  assert.deepEqual(nextPhase('focus', { focusMinutes: 25, breakMinutes: 5 }), {
    phase: 'break', seconds: 300, completedFocus: true,
  });
  assert.deepEqual(nextPhase('break', { focusMinutes: 25, breakMinutes: 5 }), {
    phase: 'focus', seconds: 1500, completedFocus: false,
  });
});

test('restores a non-negative session count', () => {
  assert.equal(loadSessions(memoryStorage({ [SESSIONS_KEY]: '7' })), 7);
  assert.equal(loadSessions(memoryStorage({ [SESSIONS_KEY]: '-4' })), 0);
  assert.equal(loadSessions(memoryStorage({ [SESSIONS_KEY]: 'invalid' })), 0);
});
