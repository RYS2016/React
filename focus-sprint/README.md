# Focus Sprint

A standalone, responsive React Pomodoro app built with Vite. This folder is intentionally independent of the other projects in `RYS2016/React`.

## Features

- 25-minute focus / 5-minute break defaults; switch modes anytime.
- Start, pause, and reset the countdown; countdown uses wall-clock time to reduce background-tab drift.
- Finishing a focus session increments the completed-sprint counter and switches to break mode (without auto-starting).
- Set focus and break durations from 1 to 120 minutes.
- Settings and completed-session count persist in `localStorage` (no account or backend required).
- Responsive, keyboard-accessible controls and live status messages.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
cd focus-sprint
npm install
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`).

## Check

```bash
npm test
npm run build
```

`npm test` covers timer utilities without third-party test packages. The Vite build requires dependencies from `npm install`.

## Notes

Changing a duration stops the running timer; changing the current mode's duration also resets its countdown. Browser storage may be unavailable in privacy-restricted environments; the app continues to work without persistence. No files outside `focus-sprint/` need modification.
