## What changed

<!-- Describe the change in 1-3 sentences -->

## How to test

<!-- Commands or steps the reviewer should run, e.g. -->

- [ ] `npm install && npm run dev` runs without errors
- [ ] `npm run build` passes
- [ ] Manually verified affected pages/routes:

## Checklist

- [ ] No `node_modules` / `dist` committed
- [ ] Search + type filter still driven by URL (`useSearchParams`, no duplicate `useState`)
- [ ] Team rules intact: max 6, no duplicates, survives refresh
- [ ] No Redux/Zustand added
- [ ] Only one `useContext(TeamContext)` (inside `useTeam()`)
