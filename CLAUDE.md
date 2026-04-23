# pe-mfe-project-mgr — Claude Context

## What This Is

GraphQL MFE for project and task management. Full CRUD implemented for both projects and tasks.

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

**GQL layer** (`src/gql/`):
- `GET_PROJECTS` / `GET_PROJECT` — list and single-project queries
- `CREATE_PROJECT` / `UPDATE_PROJECT` / `DELETE_PROJECT` — full project CRUD
- `GET_TASKS_BY_PROJECT` — tasks scoped to a project (no global get-all-tasks)
- `CREATE_TASK` / `UPDATE_TASK` / `DELETE_TASK` — full task CRUD
- All queries share a `PROJECT_FIELDS` / `TASK_FIELDS` fragment string
- `useUpdateProject` sets single-project cache directly on success; also invalidates list
- `useDeleteTask` accepts `{ id, projectId }` so it can invalidate the correct task list cache key

**UI** (`src/components/`):
- `StatusChip` — color-coded chip for both `ProjectStatus` and `TaskStatus`
- `ProjectCard` — clickable list row with status chip and due date; navigates to detail
- `CreateProjectModal` — modal; submit requires name
- `ProjectDetail` — detail view at `/:id`; inline edit/delete for the project; task list section with "New Task" button
- `TaskCard` — inline edit/delete per task (no separate detail route needed)
- `CreateTaskModal` — modal; projectId pre-wired from route params

**Routes:**
- `/` — project list with status filter chips and "New Project" button
- `/:id` — project detail + task list

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

## Routing
MFE routes must NOT repeat the shell path prefix. Shell mounts at `/projects/*`; inside the MFE use `path=":id"` (not `path="projects/:id"`) and `navigate(project.id)` (not `navigate(`projects/${project.id}`)`).

## Tailwind
Uses `tw:` prefix (`tw:flex`, `tw:text-sm`, etc.) — required by the MFE Tailwind config.

## pe-mfe-utils
`@bka-stuff/pe-mfe-utils` is installed via `github:` URL (public tarball). Never use `pnpm link` or workspace overrides — breaks CI.
