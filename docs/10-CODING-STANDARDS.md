# 📏 Coding Standards & Conventions

> **PlayOps — KK Wagh Sports Portal**
> Next.js · TypeScript · Tailwind CSS · Supabase

This document defines the coding standards, naming conventions, and best practices for all contributors to the PlayOps project. Every pull request **must** adhere to these standards.

> [!IMPORTANT]
> Read this document fully before writing any code. These standards are enforced via ESLint, Prettier, and pre-commit hooks — violations will block your PR.

---

## Table of Contents

- [1. Naming Conventions](#1-naming-conventions)
- [2. Folder Structure](#2-folder-structure)
- [3. Component Patterns](#3-component-patterns)
- [4. TypeScript Standards](#4-typescript-standards)
- [5. Error Handling](#5-error-handling)
- [6. Database Query Patterns](#6-database-query-patterns)
- [7. Git Conventions](#7-git-conventions)
- [8. Code Quality](#8-code-quality)
- [9. Performance Best Practices](#9-performance-best-practices)
- [10. Security](#10-security)

---

## 1. Naming Conventions

Consistent naming across the codebase improves readability, reduces cognitive load, and makes searching/refactoring straightforward.

### Quick Reference Table

| Element             | Convention         | Example                          |
| ------------------- | ------------------ | -------------------------------- |
| **Files**           | `kebab-case`       | `player-card.tsx`, `match-service.ts` |
| **Components**      | `PascalCase`       | `PlayerCard`, `MatchList`        |
| **Functions**       | `camelCase`        | `getPlayerById`, `updateMatchScore` |
| **Variables**       | `camelCase`        | `currentPlayer`, `matchList`     |
| **Constants**       | `UPPER_SNAKE_CASE` | `MAX_TEAM_SIZE`, `API_BASE_URL`  |
| **Types/Interfaces**| `PascalCase`       | `Player`, `MatchStatus`          |
| **Enums**           | `PascalCase`       | `SportType`, `MatchPhase`        |
| **Enum Members**    | `UPPER_SNAKE_CASE` | `SportType.CRICKET`              |
| **Database Columns**| `snake_case`       | `created_at`, `team_id`          |
| **API Routes**      | `kebab-case`       | `/api/match-events`              |
| **CSS**             | Tailwind utilities  | Avoid custom CSS classes         |
| **Hooks**           | `use` prefix       | `usePlayer`, `useLiveScore`      |
| **Stores**          | `use` + `Store`    | `useAuthStore`, `useTournamentStore` |
| **Boolean vars**    | `is`/`has`/`can`   | `isLoading`, `hasAccess`         |
| **Event handlers**  | `handle` prefix    | `handleSubmit`, `handleScoreUpdate` |

### 1.1 File Naming

```
✅ Correct
player-card.tsx
match-service.ts
use-live-score.ts
create-tournament.schema.ts

❌ Wrong
PlayerCard.tsx
matchService.ts
useLiveScore.ts
createTournamentSchema.ts
```

> [!NOTE]
> The only exception is Next.js required files which must keep their exact names: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`, `middleware.ts`.

### 1.2 Component Naming

Components use **PascalCase** and must match their file name (in kebab-case form):

```tsx
// File: components/shared/player-card.tsx
export function PlayerCard({ player }: PlayerCardProps) { ... }

// File: components/forms/tournament-form.tsx
export function TournamentForm({ onSubmit }: TournamentFormProps) { ... }
```

### 1.3 Type & Interface Naming

Use **PascalCase** with descriptive, domain-specific names. Avoid generic prefixes like `I` or `T`:

```tsx
// ✅ Correct
interface Player { ... }
interface CreateTournamentInput { ... }
type MatchStatus = "scheduled" | "live" | "completed" | "cancelled";

// ❌ Wrong
interface IPlayer { ... }
type TMatchStatus = ...;
```

### 1.4 Constants

```tsx
// File: lib/constants/sport.ts
export const MAX_TEAM_SIZE = 15;
export const MIN_PLAYERS_FOR_MATCH = 2;
export const SUPPORTED_SPORTS = ["cricket", "football", "basketball"] as const;

// File: lib/constants/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const DEFAULT_PAGE_SIZE = 20;
```

---

## 2. Folder Structure

The project follows the **Next.js App Router** architecture with a clear separation of concerns.

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes group (no auth required)
│   │   ├── page.tsx              # Landing page
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── tournaments/
│   │   │   ├── page.tsx          # Tournament listing
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Tournament detail
│   │   ├── live/
│   │   │   └── page.tsx          # Live matches
│   │   └── results/
│   │       └── page.tsx          # Match results
│   ├── (player)/                 # Player routes group (player auth)
│   │   ├── layout.tsx            # Player layout with auth guard
│   │   └── player/
│   │       ├── dashboard/
│   │       │   └── page.tsx
│   │       ├── profile/
│   │       │   └── page.tsx
│   │       └── registrations/
│   │           └── page.tsx
│   ├── (admin)/                  # Admin routes group (admin auth)
│   │   ├── layout.tsx            # Admin layout with auth guard
│   │   └── admin/
│   │       ├── dashboard/
│   │       │   └── page.tsx
│   │       ├── tournaments/
│   │       │   └── page.tsx
│   │       ├── players/
│   │       │   └── page.tsx
│   │       └── settings/
│   │           └── page.tsx
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   │   └── route.ts
│   │   ├── match-events/
│   │   │   └── route.ts
│   │   └── webhooks/
│   │       └── route.ts
│   ├── layout.tsx                # Root layout
│   ├── loading.tsx               # Global loading
│   ├── error.tsx                 # Global error
│   └── not-found.tsx             # 404 page
├── components/
│   ├── ui/                       # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── dialog.tsx
│   ├── shared/                   # Shared domain components
│   │   ├── player-card.tsx
│   │   ├── match-timer.tsx
│   │   ├── score-display.tsx
│   │   └── sport-icon.tsx
│   ├── forms/                    # Form components
│   │   ├── login-form.tsx
│   │   ├── tournament-form.tsx
│   │   └── player-registration-form.tsx
│   ├── charts/                   # Chart & visualization components
│   │   ├── performance-chart.tsx
│   │   └── sport-distribution-chart.tsx
│   └── layouts/                  # Layout components
│       ├── header.tsx
│       ├── footer.tsx
│       ├── sidebar.tsx
│       └── mobile-nav.tsx
├── lib/
│   ├── supabase/                 # Supabase clients
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── admin.ts              # Service role client (admin only)
│   ├── utils/                    # Utility functions
│   │   ├── cn.ts                 # Class name merger (clsx + twMerge)
│   │   ├── format.ts             # Date, number formatting
│   │   └── helpers.ts            # General helpers
│   ├── validations/              # Zod schemas
│   │   ├── auth.schema.ts
│   │   ├── tournament.schema.ts
│   │   └── player.schema.ts
│   ├── services/                 # Business logic layer
│   │   ├── auth-service.ts
│   │   ├── tournament-service.ts
│   │   ├── match-service.ts
│   │   └── player-service.ts
│   └── constants/                # Application constants
│       ├── sport.ts
│       ├── routes.ts
│       └── config.ts
├── types/                        # TypeScript type definitions
│   ├── database.types.ts         # Supabase generated types
│   ├── player.ts
│   ├── tournament.ts
│   ├── match.ts
│   └── index.ts                  # Re-exports all types
├── hooks/                        # Custom React hooks
│   ├── use-auth.ts
│   ├── use-live-score.ts
│   ├── use-debounce.ts
│   └── use-media-query.ts
├── stores/                       # Zustand state stores
│   ├── auth-store.ts
│   ├── tournament-store.ts
│   └── notification-store.ts
└── styles/                       # Global styles
    └── globals.css               # Tailwind directives + minimal globals
```

### 2.1 Placement Rules

| What you're creating        | Where it goes                     |
| --------------------------- | --------------------------------- |
| A new page                  | `app/(group)/route/page.tsx`      |
| A reusable UI primitive     | `components/ui/`                  |
| A domain-specific component | `components/shared/`              |
| A form component            | `components/forms/`               |
| A chart/visualization       | `components/charts/`              |
| Business logic              | `lib/services/`                   |
| A Zod schema                | `lib/validations/`                |
| A TypeScript type           | `types/`                          |
| A custom hook               | `hooks/`                          |
| A state store               | `stores/`                         |
| A utility function          | `lib/utils/`                      |
| A constant value            | `lib/constants/`                  |

> [!TIP]
> When in doubt about where a file belongs, ask: "Is this UI, logic, or data?" UI → `components/`, Logic → `lib/services/`, Data shape → `types/`.

---

## 3. Component Patterns

### 3.1 Server Components by Default

Every component in the App Router is a **Server Component** by default. Only add `'use client'` when you **need** it.

**Use `'use client'` only when the component requires:**
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- React hooks (`useState`, `useEffect`, `useRef`, etc.)
- Browser-only APIs (`window`, `localStorage`, `IntersectionObserver`)
- Third-party client libraries (chart libraries, animation libraries)

```tsx
// ✅ Server Component (default) — no directive needed
// File: components/shared/player-stats.tsx
import { getPlayerStats } from "@/lib/services/player-service";

interface PlayerStatsProps {
  playerId: string;
}

export async function PlayerStats({ playerId }: PlayerStatsProps) {
  const stats = await getPlayerStats(playerId);

  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard label="Matches" value={stats.totalMatches} />
      <StatCard label="Wins" value={stats.wins} />
      <StatCard label="Win Rate" value={`${stats.winRate}%`} />
    </div>
  );
}
```

```tsx
// ✅ Client Component — needs interactivity
// File: components/shared/score-updater.tsx
"use client";

import { useState } from "react";
import { updateScore } from "@/lib/services/match-service";

interface ScoreUpdaterProps {
  matchId: string;
  teamId: string;
}

export function ScoreUpdater({ matchId, teamId }: ScoreUpdaterProps) {
  const [score, setScore] = useState(0);

  const handleIncrement = async () => {
    const newScore = score + 1;
    setScore(newScore);
    await updateScore(matchId, teamId, newScore);
  };

  return (
    <button
      onClick={handleIncrement}
      className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
    >
      Score: {score}
    </button>
  );
}
```

### 3.2 Component File Structure

Follow this **exact order** within every component file:

```tsx
// 1. Directive (if client component)
"use client";

// 2. External imports
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// 3. Internal imports (absolute paths using @/)
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { Player } from "@/types";

// 4. Types / Interfaces (props first)
interface PlayerCardProps {
  player: Player;
  variant?: "compact" | "detailed";
  className?: string;
  onSelect?: (playerId: string) => void;
}

// 5. Component definition
export function PlayerCard({
  player,
  variant = "compact",
  className,
  onSelect,
}: PlayerCardProps) {
  // a. Hooks
  const router = useRouter();

  // b. Derived state / computations
  const isActive = player.status === "active";

  // c. Event handlers
  const handleClick = useCallback(() => {
    onSelect?.(player.id);
  }, [onSelect, player.id]);

  // d. Early returns / guards
  if (!player) return null;

  // e. Render
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-4 shadow-sm",
        variant === "detailed" && "p-6",
        !isActive && "opacity-50",
        className
      )}
      onClick={handleClick}
    >
      <h3 className="text-lg font-semibold">{player.name}</h3>
      <p className="text-sm text-muted-foreground">{player.sport}</p>
    </div>
  );
}
```

### 3.3 Reusable Components with `forwardRef`

All reusable UI components in `components/ui/` should support ref forwarding:

```tsx
// File: components/ui/sport-badge.tsx
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface SportBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  sport: string;
  variant?: "default" | "outline";
}

export const SportBadge = forwardRef<HTMLSpanElement, SportBadgeProps>(
  ({ sport, variant = "default", className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          variant === "default" && "bg-primary/10 text-primary",
          variant === "outline" && "border border-primary text-primary",
          className
        )}
        {...props}
      >
        {sport}
      </span>
    );
  }
);

SportBadge.displayName = "SportBadge";
```

### 3.4 Composition Pattern

Prefer composition over monolithic components:

```tsx
// ✅ Composable — each piece is reusable and testable
<MatchCard>
  <MatchCard.Header sport="Cricket" status="live" />
  <MatchCard.Teams home={homeTeam} away={awayTeam} />
  <MatchCard.Score homeScore={120} awayScore={85} />
  <MatchCard.Footer>
    <LiveIndicator />
  </MatchCard.Footer>
</MatchCard>

// ❌ Monolithic — hard to maintain, impossible to reuse parts
<MatchCard
  sport="Cricket"
  status="live"
  homeTeam={homeTeam}
  awayTeam={awayTeam}
  homeScore={120}
  awayScore={85}
  showLiveIndicator
/>
```

---

## 4. TypeScript Standards

### 4.1 Strict Configuration

The project uses TypeScript **strict mode**. The following compiler options are enforced:

```jsonc
// tsconfig.json (relevant subset)
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInImports": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### 4.2 No `any` — Ever

```tsx
// ✅ Correct
function processEvent(event: MatchEvent): void { ... }
function parseResponse(data: unknown): Player { ... }

// ❌ Wrong — will fail lint
function processEvent(event: any): void { ... }
function parseResponse(data: any) { ... }
```

Use `unknown` instead of `any` when the type is genuinely unknown, then narrow it:

```tsx
function parseApiResponse(data: unknown): Player {
  if (!isPlayer(data)) {
    throw new Error("Invalid player data");
  }
  return data;
}
```

### 4.3 Interfaces vs Types

| Use             | When                                              |
| --------------- | ------------------------------------------------- |
| **`interface`** | Object shapes, component props, API responses     |
| **`type`**      | Unions, intersections, mapped types, aliases       |

```tsx
// ✅ Interface for object shapes
interface Player {
  id: string;
  name: string;
  email: string;
  sport: SportType;
  teamId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CreatePlayerInput {
  name: string;
  email: string;
  sport: SportType;
}

// ✅ Type for unions and aliases
type MatchStatus = "scheduled" | "live" | "completed" | "cancelled";
type SportType = "cricket" | "football" | "basketball" | "volleyball" | "badminton";
type MatchResult = MatchWin | MatchDraw | MatchCancelled;

// ✅ Type for utility / mapped types
type PartialPlayer = Partial<Player>;
type PlayerKeys = keyof Player;
```

### 4.4 Type Exports

All shared types live in `types/` and are re-exported from a barrel file:

```tsx
// File: types/player.ts
export interface Player { ... }
export interface CreatePlayerInput { ... }
export type PlayerStatus = "active" | "inactive" | "suspended";

// File: types/index.ts
export type { Player, CreatePlayerInput, PlayerStatus } from "./player";
export type { Tournament, CreateTournamentInput } from "./tournament";
export type { Match, MatchEvent, MatchStatus } from "./match";
```

Import from the barrel:

```tsx
import type { Player, Match, Tournament } from "@/types";
```

> [!NOTE]
> Always use `import type` when importing only types — this ensures they are erased at compile time and never bundled.

### 4.5 Zod for Runtime Validation

All data entering the system boundary (API routes, server actions, form submissions) **must** be validated with Zod:

```tsx
// File: lib/validations/tournament.schema.ts
import { z } from "zod";

export const createTournamentSchema = z.object({
  name: z
    .string()
    .min(3, "Tournament name must be at least 3 characters")
    .max(100, "Tournament name must be at most 100 characters"),
  sport: z.enum(["cricket", "football", "basketball", "volleyball", "badminton"]),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  maxTeams: z.number().int().min(2).max(64),
  description: z.string().max(500).optional(),
});

export type CreateTournamentInput = z.infer<typeof createTournamentSchema>;

// Usage in a Server Action
export async function createTournament(rawData: unknown) {
  const result = createTournamentSchema.safeParse(rawData);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors, code: "VALIDATION_ERROR" };
  }

  const data = result.data;
  // ... proceed with validated data
}
```

### 4.6 Discriminated Unions for State

Use discriminated unions to model states that are mutually exclusive:

```tsx
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

// Usage
function MatchDisplay({ state }: { state: AsyncState<Match> }) {
  switch (state.status) {
    case "idle":
      return null;
    case "loading":
      return <Skeleton />;
    case "success":
      return <MatchCard match={state.data} />;
    case "error":
      return <ErrorMessage message={state.error} />;
  }
}
```

---

## 5. Error Handling

### 5.1 Structured Error Responses

All server-side operations return a consistent error shape:

```tsx
// File: types/api.ts
interface SuccessResponse<T> {
  data: T;
  error: null;
}

interface ErrorResponse {
  data: null;
  error: string;
  code: ErrorCode;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

type ErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "INTERNAL_ERROR"
  | "CONFLICT"
  | "RATE_LIMITED";
```

### 5.2 Server Actions

```tsx
// File: lib/services/tournament-service.ts
"use server";

import { createServerClient } from "@/lib/supabase/server";
import { createTournamentSchema } from "@/lib/validations/tournament.schema";
import type { ApiResponse, Tournament } from "@/types";

export async function createTournament(
  rawData: unknown
): Promise<ApiResponse<Tournament>> {
  try {
    // 1. Validate input
    const parsed = createTournamentSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        data: null,
        error: "Invalid tournament data",
        code: "VALIDATION_ERROR",
      };
    }

    // 2. Auth check
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { data: null, error: "Unauthorized", code: "UNAUTHORIZED" };
    }

    // 3. Perform operation
    const { data, error } = await supabase
      .from("tournaments")
      .insert({
        name: parsed.data.name,
        sport: parsed.data.sport,
        start_date: parsed.data.startDate,
        end_date: parsed.data.endDate,
        max_teams: parsed.data.maxTeams,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message, code: "INTERNAL_ERROR" };
    }

    return { data, error: null };
  } catch (err) {
    console.error("[createTournament]", err);
    return {
      data: null,
      error: "An unexpected error occurred",
      code: "INTERNAL_ERROR",
    };
  }
}
```

### 5.3 API Route Handlers

```tsx
// File: app/api/match-events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get("matchId");

    if (!matchId) {
      return NextResponse.json(
        { data: null, error: "Match ID is required", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("match_events")
      .select("id, event_type, description, created_at")
      .eq("match_id", matchId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { data: null, error: error.message, code: "INTERNAL_ERROR" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data, error: null });
  } catch (err) {
    console.error("[GET /api/match-events]", err);
    return NextResponse.json(
      { data: null, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
```

### 5.4 Error Boundaries

Create granular error boundaries for each route segment:

```tsx
// File: app/(public)/tournaments/error.tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TournamentError({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log to error reporting service
    console.error("[TournamentError]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="text-muted-foreground">
        We couldn&apos;t load the tournaments. Please try again.
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
```

> [!WARNING]
> Never expose internal error details (stack traces, database errors, query strings) to end users. Log them server-side and return generic messages to the client.

---

## 6. Database Query Patterns

### 6.1 Typed Supabase Client

```tsx
// File: lib/supabase/server.ts
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

export async function createServerClient() {
  const cookieStore = await cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
}
```

```tsx
// File: lib/supabase/client.ts
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/database.types";

export function createBrowserClient() {
  return createClientComponentClient<Database>();
}
```

### 6.2 Query Rules

**Always handle errors:**

```tsx
// ✅ Correct — error is checked
const { data, error } = await supabase
  .from("players")
  .select("id, name, sport")
  .eq("team_id", teamId);

if (error) {
  throw new Error(`Failed to fetch players: ${error.message}`);
}

// ❌ Wrong — error is ignored
const { data } = await supabase
  .from("players")
  .select("*")
  .eq("team_id", teamId);
```

**Always specify columns in `.select()`:**

```tsx
// ✅ Correct — only fetches needed columns
const { data, error } = await supabase
  .from("tournaments")
  .select("id, name, sport, start_date, status")
  .eq("status", "active");

// ❌ Wrong — fetches everything (wasteful, potential data leakage)
const { data, error } = await supabase
  .from("tournaments")
  .select("*");
```

**Use pagination for list queries:**

```tsx
const PAGE_SIZE = 20;

export async function getTournaments(page: number = 1) {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from("tournaments")
    .select("id, name, sport, start_date, status", { count: "exact" })
    .order("start_date", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch tournaments: ${error.message}`);
  }

  return {
    tournaments: data,
    totalCount: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
    currentPage: page,
  };
}
```

### 6.3 Row-Level Security (RLS)

> [!CAUTION]
> **Never bypass RLS.** Always use the authenticated client, never the service role client for user-facing operations. The service role client (`lib/supabase/admin.ts`) is **only** for server-side admin operations like webhooks or cron jobs.

```tsx
// ✅ Correct — uses authenticated client, RLS applies
const supabase = await createServerClient();
const { data } = await supabase.from("players").select("*");

// ❌ Wrong — bypasses RLS, dangerous
const supabase = createAdminClient();
const { data } = await supabase.from("players").select("*");
```

### 6.4 Database Column ↔ TypeScript Mapping

Keep transformations clean between `snake_case` database columns and `camelCase` TypeScript:

```tsx
// File: lib/utils/transform.ts
import type { Player } from "@/types";

interface PlayerRow {
  id: string;
  full_name: string;
  email: string;
  team_id: string | null;
  created_at: string;
  updated_at: string;
}

export function toPlayer(row: PlayerRow): Player {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    teamId: row.team_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
```

---

## 7. Git Conventions

### 7.1 Branch Naming

```
feature/add-tournament-bracket
feature/live-score-websocket
fix/match-timer-not-resetting
fix/login-redirect-loop
refactor/extract-auth-middleware
docs/update-api-reference
chore/upgrade-supabase-client
```

| Prefix       | Purpose                          |
| ------------ | -------------------------------- |
| `feature/`   | New functionality                |
| `fix/`       | Bug fixes                        |
| `refactor/`  | Code restructuring (no behavior change) |
| `docs/`      | Documentation changes            |
| `chore/`     | Tooling, deps, config changes    |
| `test/`      | Adding or fixing tests           |

### 7.2 Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Examples:**

```
feat(tournament): add bracket generation algorithm
fix(auth): resolve session expiry redirect loop
refactor(components): extract shared match card component
docs(readme): add local development setup guide
chore(deps): upgrade next.js to 14.2.0
test(services): add unit tests for match scoring logic
style(ui): update color palette to match brand guidelines
perf(queries): add index hint for tournament listing query
```

**Rules:**
- Use imperative mood: "add feature" not "added feature"
- Keep the subject line under 72 characters
- Reference issue numbers in the footer: `Closes #42`

### 7.3 Pull Request Template

Every PR should follow this checklist:

```markdown
## Description
Brief description of changes.

## Type
- [ ] Feature
- [ ] Bug Fix
- [ ] Refactor
- [ ] Documentation

## Checklist
- [ ] Code follows the project coding standards
- [ ] TypeScript strict mode passes with no errors
- [ ] All new code has appropriate types (no `any`)
- [ ] Zod validation added for new inputs
- [ ] Error handling follows structured response pattern
- [ ] RLS policies considered for new tables/queries
- [ ] No `console.log` statements (use proper error logging)
- [ ] Responsive design verified on mobile
- [ ] Loading and error states implemented
- [ ] Tested manually in development

## Screenshots (if UI changes)
```

---

## 8. Code Quality

### 8.1 Tooling Stack

| Tool       | Purpose                | Config File          |
| ---------- | ---------------------- | -------------------- |
| **ESLint** | Code linting           | `.eslintrc.json`     |
| **Prettier** | Code formatting      | `.prettierrc`        |
| **Husky**  | Git hooks              | `.husky/`            |
| **lint-staged** | Pre-commit linting | `package.json`       |

### 8.2 ESLint Configuration

```jsonc
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }
    ],
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "prefer-const": "error",
    "no-var": "error",
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling"],
          "index"
        ],
        "newlines-between": "always",
        "alphabetize": { "order": "asc" }
      }
    ]
  }
}
```

### 8.3 Prettier Configuration

```jsonc
// .prettierrc
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 90,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 8.4 Pre-commit Hooks

```jsonc
// package.json (partial)
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ]
  }
}
```

```bash
# .husky/pre-commit
npx lint-staged
```

### 8.5 Import Order

Imports must follow this order, separated by blank lines:

```tsx
// 1. React / Next.js built-ins
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// 2. Third-party libraries
import { z } from "zod";
import { toast } from "sonner";

// 3. Internal: components
import { Button } from "@/components/ui/button";
import { PlayerCard } from "@/components/shared/player-card";

// 4. Internal: lib (services, utils, validations, constants)
import { getPlayer } from "@/lib/services/player-service";
import { cn } from "@/lib/utils/cn";

// 5. Internal: types (always use `import type`)
import type { Player, Match } from "@/types";
```

### 8.6 Forbidden Patterns

```tsx
// ❌ No `any`
const data: any = fetchData();

// ❌ No console.log in production code
console.log("debug:", data);

// ❌ No unused imports
import { useState, useEffect } from "react"; // if useEffect is unused

// ❌ No inline styles
<div style={{ color: "red" }}>...</div>

// ❌ No magic numbers / strings
if (teams.length > 16) { ... }

// ✅ Use named constants
if (teams.length > MAX_BRACKET_SIZE) { ... }

// ❌ No nested ternaries
const label = a ? (b ? "X" : "Y") : "Z";

// ✅ Use explicit conditionals
let label: string;
if (a && b) label = "X";
else if (a) label = "Y";
else label = "Z";
```

---

## 9. Performance Best Practices

### 9.1 Image Optimization

Always use the Next.js `Image` component:

```tsx
// ✅ Correct
import Image from "next/image";

<Image
  src={player.avatarUrl}
  alt={`${player.name}'s avatar`}
  width={64}
  height={64}
  className="rounded-full"
  placeholder="blur"
  blurDataURL={player.avatarBlurHash}
/>

// ❌ Wrong — unoptimized, no lazy loading, no format conversion
<img src={player.avatarUrl} alt={player.name} />
```

### 9.2 Loading States with Suspense

Use `loading.tsx` files and `<Suspense>` boundaries for streaming:

```tsx
// File: app/(public)/tournaments/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function TournamentsLoading() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-48 w-full rounded-xl" />
      ))}
    </div>
  );
}
```

```tsx
// Granular Suspense boundaries
import { Suspense } from "react";

export default function TournamentPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <Suspense fallback={<HeaderSkeleton />}>
        <TournamentHeader id={params.id} />
      </Suspense>

      <Suspense fallback={<BracketSkeleton />}>
        <TournamentBracket id={params.id} />
      </Suspense>

      <Suspense fallback={<MatchListSkeleton />}>
        <UpcomingMatches tournamentId={params.id} />
      </Suspense>
    </div>
  );
}
```

### 9.3 Dynamic Imports

Use `next/dynamic` for heavy components that aren't needed on first paint:

```tsx
import dynamic from "next/dynamic";

// Heavy chart library — only loaded when component mounts
const PerformanceChart = dynamic(
  () => import("@/components/charts/performance-chart"),
  {
    loading: () => <Skeleton className="h-64 w-full" />,
    ssr: false, // Client-only chart library
  }
);
```

### 9.4 Database Query Optimization

```tsx
// ✅ Fetch only needed columns
.select("id, name, sport, status")

// ✅ Use compound filters to reduce result sets
.eq("status", "active")
.gte("start_date", new Date().toISOString())

// ✅ Limit results
.limit(10)

// ✅ Use database joins instead of multiple queries
const { data } = await supabase
  .from("matches")
  .select(`
    id,
    scheduled_at,
    status,
    home_team:teams!home_team_id(id, name),
    away_team:teams!away_team_id(id, name)
  `)
  .eq("tournament_id", tournamentId);
```

### 9.5 Caching

Use Next.js caching mechanisms:

```tsx
// Route segment config for static-ish pages
export const revalidate = 3600; // Revalidate every hour

// On-demand revalidation after mutations
import { revalidatePath } from "next/cache";

export async function createTournament(data: CreateTournamentInput) {
  // ... create tournament
  revalidatePath("/tournaments");
}
```

> [!TIP]
> Use `revalidatePath` or `revalidateTag` after mutations instead of disabling caching globally. This gives you both performance and freshness.

---

## 10. Security

### 10.1 Input Validation

**Every** piece of user input must be validated before processing:

```tsx
// Server action — validate immediately
export async function registerPlayer(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const result = playerRegistrationSchema.safeParse(rawData);

  if (!result.success) {
    return { error: "Invalid input", code: "VALIDATION_ERROR" };
  }

  // Proceed with result.data (guaranteed clean)
}
```

### 10.2 Authentication Guards

Protect routes at the layout level:

```tsx
// File: app/(admin)/layout.tsx
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  return <>{children}</>;
}
```

### 10.3 Row-Level Security Policies

Every table **must** have RLS enabled with appropriate policies:

```sql
-- Example: Players can only view/edit their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Example: Admins can view all players
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 10.4 Environment Variables

```bash
# ✅ Server-only secrets (no NEXT_PUBLIC_ prefix)
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=...
WEBHOOK_SECRET=...

# ✅ Client-safe values (NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

> [!CAUTION]
> **Never** prefix secret keys with `NEXT_PUBLIC_`. Variables with this prefix are bundled into client JavaScript and visible to anyone. Service role keys, webhook secrets, and API keys must **always** be server-only.

### 10.5 Sanitization

Always sanitize user-generated content before rendering:

```tsx
// ✅ React handles XSS by default with JSX
<p>{userComment}</p>

// ❌ NEVER use dangerouslySetInnerHTML with user content
<div dangerouslySetInnerHTML={{ __html: userComment }} />
```

### 10.6 Rate Limiting

Apply rate limiting to sensitive endpoints:

```tsx
// File: app/api/auth/route.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 requests per minute
  analytics: true,
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { data: null, error: "Too many requests", code: "RATE_LIMITED" },
      { status: 429, headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  }

  // ... handle request
}
```

### 10.7 Security Checklist

| Check                                    | Required |
| ---------------------------------------- | -------- |
| All inputs validated with Zod            | ✅        |
| RLS enabled on all tables                | ✅        |
| No secrets in `NEXT_PUBLIC_` vars        | ✅        |
| Auth checked in protected layouts        | ✅        |
| No `dangerouslySetInnerHTML` with user data | ✅     |
| Rate limiting on auth/sensitive routes   | ✅        |
| CSRF protection on mutations             | ✅        |
| Error messages don't leak internals      | ✅        |

---

## Quick Reference Card

```
┌──────────────────────────────────────────────────────┐
│                  PlayOps Standards                   │
├──────────────────────────────────────────────────────┤
│  Files:       kebab-case.tsx                         │
│  Components:  PascalCase                             │
│  Functions:   camelCase                              │
│  Constants:   UPPER_SNAKE_CASE                       │
│  Types:       PascalCase (no I/T prefix)             │
│  DB columns:  snake_case                             │
│  Branches:    feature/ fix/ refactor/ docs/          │
│  Commits:     feat: fix: chore: docs: refactor:      │
├──────────────────────────────────────────────────────┤
│  Server Components by default                        │
│  'use client' only when needed                       │
│  Zod for all input validation                        │
│  No `any` — use `unknown` + narrowing                │
│  Handle every Supabase error                         │
│  RLS always — never bypass                           │
│  No console.log — use console.error/warn             │
│  Structured responses: { data, error, code }         │
└──────────────────────────────────────────────────────┘
```

---

> **Last updated:** Project initialization
> **Maintainers:** PlayOps Development Team
