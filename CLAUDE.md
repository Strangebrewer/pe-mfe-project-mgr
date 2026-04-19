# pe-mfe-project-mgr — Claude Context

## What This Is

GraphQL MFE for project and task management. Basic functionality deployed; needs significant work.

Port: 3005. Accessed via the shell at `/projects/*`.

---

## Domain Model

Both domains defined in `src/types/projectMgr.ts`.

**Project** (`PRJ-` prefix IDs): `id`, `name`, `description?`, `status?` (enum), `dueDate?`
- `ProjectStatus`: `NOT_STARTED` | `IN_PROGRESS` | `COMPLETED` | `ON_HOLD`

**Task** (`TSK-` prefix IDs): `id`, `projectId`, `name`, `description?`, `status?` (enum), `dueDate?`
- `TaskStatus`: `TODO` | `IN_PROGRESS` | `DONE`

Tasks belong to a project. The backend query for tasks is `getTasksByProject(projectId)` — there is no global get-all-tasks query.

---

## What's Implemented

- `GET_PROJECTS` — `getProjects` query; returns `id`, `name`, `description`, `status`, `dueDate`
- Index page displaying project list

---

## What's Not Here Yet

- Task queries (including `getTasksByProject`)
- Create/update/delete mutations for projects and tasks
- Project detail page
- Task display

---

## GraphQL Pattern

Follows the pe-mfe-recipes canonical pattern:

```
src/
  utils/
    authClient.ts     ← axiosPublic (AUTH_URL) and axiosAuth (GQL_URL); calls createAuthClient()
    graphqlClient.ts  ← gqlRequest<T>(query, variables?) — POSTs to GQL_URL via axiosAuth
  gql/
    queries/          ← plain GraphQL strings (no gql tag)
    hooks/            ← TanStack Query hooks; mutations invalidate relevant query keys on success
  types/              ← TypeScript types
```

No intermediate API layer — hooks call `gqlRequest` directly.

---

## env vars

- `AUTH_URL` → go-auth base URL for token refresh (default: `http://localhost:8080`)
- `GQL_URL` → Apollo Router URL (default: `http://localhost:4000`)

---

## Tailwind
Uses `tw:` prefix (`tw:flex`, `tw:text-sm`, etc.) — required by the MFE Tailwind config.

## pe-mfe-utils
`@bka-stuff/pe-mfe-utils` is installed via `github:` URL (public tarball). Never use `pnpm link` or workspace overrides — breaks CI.
