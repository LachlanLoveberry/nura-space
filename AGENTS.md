# AGENTS.md

Purpose: Provide concise repository context and actionable conventions so AI coding agents can be productive immediately.

---

## Quick Commands

- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev`
- Build production: `pnpm build`
- Start built server: `pnpm start`
- Run tests: `pnpm test`
- Lint / Format: `pnpm lint`, `pnpm format`

---

## Project Summary

- Tech stack: React + TanStack Start (file-based routing) with Nitro server support and Tailwind CSS.
- Frontend code lives under `src/` with routes in `src/routes/` and components in `src/components/`.
- Server-side endpoints are served via Nitro and should live under `src/routes/api/` (currently minimal).
- Sentry instrumentation is initialized in `instrument.server.mjs` and is imported during startup.

---

## Key Files

- [package.json](package.json)
- [vite.config.ts](vite.config.ts)
- [instrument.server.mjs](instrument.server.mjs)
- [src/router.tsx](src/router.tsx)
- [src/routes/__root.tsx](src/routes/__root.tsx)
- [src/routes/index.tsx](src/routes/index.tsx)
- [src/routes/api/](src/routes/api/)
- [src/integrations/tanstack-query/root-provider.tsx](src/integrations/tanstack-query/root-provider.tsx)
- [src/components/](src/components/)
- [src/lib/utils.ts](src/lib/utils.ts)

---

## Conventions & Implications

- File naming: kebab-case for files (e.g., `login-form.tsx`), PascalCase for exported components.
- Routing: File-based routes in `src/routes/` are used to define application routes.
- Styling: Tailwind CSS + class-variance-authority (CVA) patterns in UI primitives; use `cn()` utility from `src/lib/utils.ts` to merge classes.
- Data fetching: TanStack Query is integrated via router context in `src/integrations/tanstack-query/root-provider.tsx` — prefer query hooks and the router's context for shared `QueryClient`.
- Server endpoints: Add Nitro-compatible route files under `src/routes/api/` for backend logic; server instrumentation from `instrument.server.mjs` is imported at runtime.
- Persistence: Demo endpoints may use in-memory storage; review existing files before adding heavy dependencies.

---

## How Agents Should Act

- Prefer linking to existing documentation and source files rather than copying large blocks of text.
- Make minimal, focused edits. When adding endpoints, place them under `src/routes/api/` and follow existing patterns.
- Use TanStack Query and the router context for consistent data fetching behavior.
- Keep changes isolated and testable; run `pnpm dev` and verify basic flows after modifications.
- Anything that isn't server-side state should be in query params

---

## Where To Look For More Context

- [README.md](README.md) — setup and build notes.
- [brief.md](brief.md) — project overview.
- [job-description.md](job-description.md) — additional technology expectations.
- [landing-page.md](landing-page.md) — marketing content (not implementation details).

---

If you want additional agent customization files (for example `.github/copilot-instructions.md` or skill files), tell me which to create next and I will add them.
