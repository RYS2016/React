# Habit Garden 🌱 — Mini Habit Tracker

A small, responsive React app for building consistent daily habits. A standalone project in `RYS2016/React/habit-tracker`, independent of Focus Sprint and the other mini-apps.

## Features

- Add a habit with a name and one of eight icons; prevent duplicate names.
- Delete a habit (with confirmation), including its check-in history.
- Mark/unmark each day through the current date; future dates are disabled.
- Navigate to previous weeks, with Monday–Sunday columns.
- See today's completion percentage, weekly check-ins, and best current streak.
- Automatically persist habits and check-ins in browser `localStorage`.
- Responsive layout, keyboard-accessible buttons, and no backend or account required.

Three example habits appear on first visit. You can remove them and create your own. Data stays in the current browser/device. Clearing browser storage removes your data.

## Run locally

Requires Node.js 20.19+ or 22.12+ (Vite 7 requirement).

```bash
cd habit-tracker
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Verify

```bash
npm test
npm run build
npm run preview
```

Tests cover weekly date calculation, toggling check-ins, weekly progress, streaks, validation, and persistence. Production output is written to `dist/`.

## Notes

- Browser time zone determines what counts as today; week starts on Monday.
- Weekly progress uses all seven days in the selected week (including future days), while today's progress uses today's check-ins only.
- Current streak counts consecutive days from today, or yesterday if today's check-in is still pending.
- Fonts are loaded from Google Fonts when online; system fallbacks work offline. No habit data is sent anywhere.
