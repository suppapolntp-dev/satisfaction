# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Build for production
npm run lint         # Run ESLint

# Database (requires .env.local with DATABASE_URL)
npm run db:generate  # Generate Drizzle migration files from schema changes
npm run db:migrate   # Apply migrations to the database
npm run db:push      # Push schema directly (no migration files)
npm run db:studio    # Open Drizzle Studio GUI

# Docker (start MySQL)
docker-compose up -d

# Seed admin user
npm run seed:admin   # runs scripts/seed-admin.ts via tsx
```

## Environment Setup

Create `.env.local` with:
```
DATABASE_URL=mysql://root@localhost:3306/satisfaction_db
AUTH_SECRET=<random string>
```

The MySQL database runs via Docker (`docker-compose up -d`) creating `satisfaction_db`. Default `.env.local` uses `password123` as the root password.

First-time setup order:
```bash
docker-compose up -d
npm run db:push
npm run seed:admin   # creates admin / admin1234
npm run dev
```

## Architecture

### Route Groups & Middleware
- `(admin)/` — protected admin panel (dashboard, manager pages); uses `AdminSidebar` layout
- `(auth)/login` — credential login page (redirects to `/dashboard` if already authenticated)
- `(user)/satisfaction` — staff satisfaction kiosk (requires login; submits with session `userId` + `branchIds[0]`)

Route protection is handled by [src/middleware.ts](src/middleware.ts) using NextAuth's `auth` middleware.

### Auth & Permissions
NextAuth v5 (beta) with JWT strategy. On login, all role permissions are loaded from the DB and embedded directly into the JWT token and session. Permission keys stored on `session.user`:

- `canViewAll`, `canViewDashboard`, `canViewSatisfaction`
- `canManageBrand`, `canManageBranch`, `canManageArea`, `canManageUser`, `canManageRole`

`canViewAll` is auto-computed if the user has all `canManage*` permissions (i.e., full admin).

### Database (Drizzle + MySQL)
Schema defined in [src/db/schema.ts](src/db/schema.ts). Key tables:
- `Brand`, `Branch` — store/branch hierarchy
- `Role` — permission flags per role (tinyint 0/1)
- `Account` — users with `roleId`, `areaId`
- `UserBranch`, `UserBrand` — many-to-many user↔branch/brand assignments
- `AreaBranch` — many-to-many area↔branch groupings
- `Satisfaction` — records with `satisfactionName` ∈ `['ดี','ปานกลาง','แย่']`

### API Routes (`src/app/api/`)
All routes return `ApiResponse<T>` shape: `{ success, data?, error?, count?, message? }`. Pattern: GET (list/single), POST (create), PUT (update), DELETE (`?id=`).

### Generic CRUD Hook
[src/hooks/useCrudManager.ts](src/hooks/useCrudManager.ts) — used by all admin management pages. Provides `items`, `loading`, `related` state plus `handleCreate`, `handleSave`, `handleDeleteConfirm` and delete confirmation flow. Configure with `{ endpoint, idKey, relatedEndpoints? }`.

### Shared Types
[src/types/models.ts](src/types/models.ts) — all shared types (`Brand`, `Branch`, `Area`, `Role`, `Account`, `ApiResponse`, `StatsData`, `ColumnDef`, `PermKey`, `PERMISSIONS` array).

### UI Component Conventions
- `AdminPageContent` — wraps page body with consistent max-width (1400px) and padding
- `AdminModal` — modal for create/edit forms
- `RowActions` — edit/delete buttons for table rows
- `SectionHeader` / `PageHeader` — consistent page titles
- `useCrudManager` + `AdminModal` + `RowActions` is the standard pattern for all manager pages
- Styling: Bootstrap 5 utility classes + inline styles; Bootstrap Icons (`bi-*`); accent color `#10b981` (green)
