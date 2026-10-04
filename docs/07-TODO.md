# 📋 PlayOps — KK Wagh Sports Portal: Master Task List

> **Project:** PlayOps — College Sports Management Portal  
> **Stack:** Next.js 15 · TypeScript · Supabase · Tailwind CSS · shadcn/ui  
> **Last Updated:** *(auto-update on each sprint)*

> [!NOTE]
> **Legend**  
> - **Priority:** `P0` = Must-have (launch blocker) · `P1` = Should-have (core experience) · `P2` = Nice-to-have (enhancement)  
> - **Complexity:** `Easy` ≈ 1–2 hrs · `Medium` ≈ 3–6 hrs · `Hard` ≈ 7+ hrs  
> - Checkbox syntax: `- [x]` = Done · `- [ ]` = Pending

---

## 🔧 Setup & Configuration

| # | Task | Priority | Complexity |
|---|------|----------|------------|
| 1 | Initialize Next.js 15 project | P0 | Easy |
| 2 | Install Tailwind CSS | P0 | Easy |
| 3 | Install shadcn/ui | P0 | Easy |
| 4 | Set up Supabase project | P0 | Easy |
| 5 | Configure environment variables | P0 | Easy |
| 6 | Set up Supabase clients | P0 | Medium |
| 7 | Configure auth middleware | P0 | Medium |
| 8 | Set up folder structure | P0 | Easy |
| 9 | Configure ESLint + Prettier | P1 | Easy |
| 10 | Set up Git repo + .gitignore | P0 | Easy |

- [x] **Initialize Next.js 15 project with TypeScript** `P0` `Easy`  
  Create the project using `create-next-app@latest` with the App Router, TypeScript, and `src/` directory enabled.

- [x] **Install and configure Tailwind CSS** `P0` `Easy`  
  Tailwind comes bundled with `create-next-app`; verify `tailwind.config.ts`, configure theme extensions (colors, fonts, spacing) for PlayOps branding.

- [x] **Install and configure shadcn/ui** `P0` `Easy`  
  Run `npx shadcn@latest init`. Choose *New York* style, CSS variables mode. Install foundational components: `Button`, `Input`, `Card`, `Dialog`, `Table`, `Tabs`, `Badge`, `Toast`, `Dropdown Menu`, `Avatar`, `Sheet`.

- [x] **Set up Supabase project** `P0` `Easy`  
  Create a new Supabase project on [supabase.com](https://supabase.com). Note down the **Project URL**, **Anon Key**, and **Service Role Key**.

- [x] **Configure environment variables** `P0` `Easy`  
  Create `.env.local` with:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  RESEND_API_KEY=
  ```
  Add `.env.local` to `.gitignore`. Create `.env.example` as a template.

- [x] **Set up Supabase client (browser + server)** `P0` `Medium`  
  Create utility files:
  - `src/lib/supabase/client.ts` — browser client (`createBrowserClient`)
  - `src/lib/supabase/server.ts` — server client (`createServerClient` with cookie handling)
  - `src/lib/supabase/middleware.ts` — middleware client for session refresh
  - `src/lib/supabase/admin.ts` — admin/service-role client for server-only operations

- [x] **Configure middleware for auth** `P0` `Medium`  
  Create `src/middleware.ts`:
  - Refresh Supabase auth session on every request
  - Redirect unauthenticated users away from `/dashboard/*` and `/admin/*`
  - Redirect authenticated users away from `/login` and `/register`
  - Role-based route protection (admin vs. player routes)

- [x] **Set up project folder structure** `P0` `Easy`  
  ```
  src/
  ├── app/
  │   ├── (public)/          # Landing, tournaments, live scores
  │   ├── (auth)/            # Login, register, reset-password
  │   ├── dashboard/         # Player dashboard (protected)
  │   └── admin/             # Admin dashboard (protected)
  ├── components/
  │   ├── ui/                # shadcn/ui primitives
  │   ├── layout/            # Navbar, Sidebar, Footer
  │   ├── forms/             # Reusable form components
  │   └── shared/            # Data tables, charts, cards
  ├── lib/
  │   ├── supabase/          # Supabase clients
  │   ├── utils.ts           # Utility helpers
  │   ├── constants.ts       # App-wide constants
  │   └── validations/       # Zod schemas
  ├── hooks/                 # Custom React hooks
  ├── types/                 # TypeScript type definitions
  └── styles/                # Global CSS
  ```

- [x] **Configure ESLint and Prettier** `P1` `Easy`  
  Extend Next.js ESLint config. Add Prettier with `prettier-plugin-tailwindcss` for automatic class sorting. Create `.prettierrc` and `.eslintrc.json`.

- [x] **Set up Git repository and .gitignore** `P0` `Easy`  
  Initialize repo, configure `.gitignore` for Next.js/Node, create initial commit with project scaffold.


---

## 🗄️ Database

| # | Task | Priority | Complexity |
|---|------|----------|------------|
| 1 | Create enum types | P0 | Easy |
| 2 | Create users table | P0 | Easy |
| 3 | Create players table | P0 | Medium |
| 4 | Create sports table | P0 | Easy |
| 5 | Create venues table | P0 | Easy |
| 6 | Create teams table | P0 | Easy |
| 7 | Create team_players table | P0 | Easy |
| 8 | Create tournaments table | P0 | Medium |
| 9 | Create tournament_registrations | P0 | Easy |
| 10 | Create matches table | P0 | Medium |
| 11 | Create match_events table | P0 | Medium |
| 12 | Create points_table table | P0 | Easy |
| 13 | Create player_performance table | P1 | Medium |
| 14 | Create notifications table | P1 | Easy |
| 15 | Create certificates table | P2 | Easy |
| 16 | Create reports table | P2 | Easy |
| 17 | Set up RLS policies | P0 | Hard |
| 18 | Create database indexes | P1 | Medium |
| 19 | Create database functions | P0 | Hard |
| 20 | Seed sample data | P1 | Medium |

### Enums & Types

- [x] **Create enum types** `P0` `Easy`  
  Define PostgreSQL enums in a migration file:
  - `user_role` → `admin`, `player`
  - `sport_type` → `cricket`, `football`, `basketball`, `volleyball`, `badminton`, `table_tennis`, `athletics`, `chess`, `kabaddi`, `kho_kho`
  - `sport_category` → `team`, `individual`, `dual`
  - `gender_category` → `men`, `women`, `mixed`
  - `tournament_format` → `knockout`, `league`, `group_knockout`
  - `tournament_status` → `upcoming`, `registration_open`, `ongoing`, `completed`, `cancelled`
  - `match_status` → `scheduled`, `live`, `completed`, `cancelled`, `postponed`
  - `registration_status` → `pending`, `approved`, `rejected`
  - `notification_type` → `match_update`, `tournament_update`, `team_update`, `general`, `certificate`
  - `event_type` → `goal`, `wicket`, `foul`, `point`, `card_yellow`, `card_red`, `substitution`, `timeout`

### Core Tables

- [x] **Create `users` table** `P0` `Easy`  
  Extends Supabase `auth.users`. Stores `id` (FK to auth.users), `full_name`, `email`, `role` (user_role enum), `avatar_url`, `created_at`, `updated_at`.

- [x] **Create `players` table** `P0` `Medium`  
  Player profile: `id`, `user_id` (FK → users), `prn` (college PRN), `department`, `year_of_study`, `phone`, `date_of_birth`, `gender`, `blood_group`, `height_cm`, `weight_kg`, `preferred_sports` (text[]), `jersey_number`, `medical_conditions`, `emergency_contact_name`, `emergency_contact_phone`, `qr_code_data`, `is_active`, `created_at`, `updated_at`.

- [x] **Create `sports` table** `P0` `Easy`  
  Sport catalog: `id`, `name`, `sport_type` (enum), `category` (enum), `icon_url`, `max_players_per_team`, `min_players_per_team`, `description`, `rules`, `is_active`, `created_at`.

- [x] **Create `venues` table** `P0` `Easy`  
  Venue details: `id`, `name`, `location`, `capacity`, `sport_type` (enum[]), `facilities` (text[]), `image_url`, `is_indoor`, `is_active`, `created_at`.

- [x] **Create `teams` table** `P0` `Easy`  
  Team info: `id`, `name`, `sport_id` (FK → sports), `tournament_id` (FK → tournaments), `captain_id` (FK → players), `logo_url`, `department`, `gender_category` (enum), `is_active`, `created_at`, `updated_at`.

- [x] **Create `team_players` table** `P0` `Easy`  
  Junction table: `id`, `team_id` (FK → teams), `player_id` (FK → players), `jersey_number`, `position`, `is_substitute`, `joined_at`.

### Tournament & Match Tables

- [x] **Create `tournaments` table** `P0` `Medium`  
  Tournament master: `id`, `name`, `sport_id` (FK → sports), `format` (enum), `status` (enum), `gender_category` (enum), `description`, `rules`, `start_date`, `end_date`, `registration_deadline`, `max_teams`, `min_teams`, `venue_id` (FK → venues), `organizer_id` (FK → users), `banner_url`, `is_featured`, `created_at`, `updated_at`.

- [x] **Create `tournament_registrations` table** `P0` `Easy`  
  Registration tracking: `id`, `tournament_id` (FK), `team_id` (FK), `registered_by` (FK → users), `status` (registration_status enum), `remarks`, `registered_at`, `reviewed_at`, `reviewed_by` (FK → users).

- [x] **Create `matches` table** `P0` `Medium`  
  Match scheduling: `id`, `tournament_id` (FK), `round_number`, `match_number`, `team_a_id` (FK → teams), `team_b_id` (FK → teams), `venue_id` (FK), `scheduled_at`, `started_at`, `ended_at`, `status` (match_status enum), `score_team_a`, `score_team_b`, `winner_id` (FK → teams), `is_draw`, `next_match_id` (FK → matches, for knockout brackets), `remarks`, `created_at`, `updated_at`.

- [x] **Create `match_events` table** `P0` `Medium`  
  Live event log: `id`, `match_id` (FK), `event_type` (enum), `team_id` (FK), `player_id` (FK → players), `minute`, `description`, `metadata` (jsonb), `created_at`.

### Derived / Aggregation Tables

- [x] **Create `points_table` table** `P0` `Easy`  
  League standings: `id`, `tournament_id` (FK), `team_id` (FK), `played`, `won`, `lost`, `drawn`, `goals_for` (or runs_for), `goals_against`, `goal_difference`, `points`, `net_run_rate` (for cricket), `rank`, `updated_at`.

- [x] **Create `player_performance` table** `P1` `Medium`  
  Individual stats: `id`, `player_id` (FK), `match_id` (FK), `tournament_id` (FK), `sport_id` (FK), `goals`, `assists`, `wickets`, `runs`, `catches`, `points_scored`, `fouls`, `cards_yellow`, `cards_red`, `minutes_played`, `is_man_of_match`, `metadata` (jsonb), `created_at`.

### Support Tables

- [x] **Create `notifications` table** `P1` `Easy`  
  In-app notifications: `id`, `user_id` (FK), `title`, `message`, `type` (notification_type enum), `reference_id` (generic FK), `reference_type` (e.g., `match`, `tournament`), `is_read`, `read_at`, `created_at`.

- [x] **Create `certificates` table** `P2` `Easy`  
  Certificate records: `id`, `player_id` (FK), `tournament_id` (FK), `type` (e.g., `winner`, `runner_up`, `participation`, `man_of_tournament`), `title`, `issued_at`, `file_url`, `template_data` (jsonb), `created_at`.

- [x] **Create `reports` table** `P2` `Easy`  
  Generated reports: `id`, `title`, `type` (e.g., `tournament_summary`, `player_report`), `reference_id`, `reference_type`, `generated_by` (FK → users), `file_url`, `metadata` (jsonb), `created_at`.

### Database Configuration

- [x] **Set up Row Level Security (RLS) policies for each table** `P0` `Hard`  
  Define granular policies:
  - `users`: Users can read own row; admins can read all.
  - `players`: Players can read/update own profile; admins full CRUD.
  - `sports`, `venues`: Public read; admin-only write.
  - `teams`, `team_players`: Public read; admin write; captain can update own team.
  - `tournaments`: Public read; admin write.
  - `tournament_registrations`: Players read own; admin read/write all.
  - `matches`, `match_events`: Public read; admin write.
  - `points_table`: Public read; system/admin write.
  - `player_performance`: Player reads own; admin writes.
  - `notifications`: User reads/updates own; admin creates.
  - `certificates`: Player reads own; admin creates.
  - `reports`: Admin only.

- [x] **Create database indexes** `P1` `Medium`  
  Add indexes for performance:
  - `players(user_id)`, `players(prn)`
  - `teams(tournament_id)`, `teams(sport_id)`
  - `team_players(team_id, player_id)` unique
  - `matches(tournament_id)`, `matches(status)`, `matches(scheduled_at)`
  - `match_events(match_id)`
  - `points_table(tournament_id, team_id)` unique
  - `player_performance(player_id)`, `player_performance(match_id)`
  - `notifications(user_id, is_read)`
  - `tournaments(status)`, `tournaments(sport_id)`
  - `certificates(player_id)`

- [x] **Create database functions and triggers** `P0` `Hard`  
  - `handle_new_user()` — trigger to auto-create user row on auth signup
  - `update_points_table()` — trigger on match completion to recalculate standings
  - `calculate_net_run_rate()` — for cricket league tables
  - `update_updated_at()` — generic trigger for `updated_at` columns
  - `generate_fixtures_knockout()` — stored function for single-elimination bracket
  - `generate_fixtures_league()` — stored function for round-robin pairings
  - `get_team_standings()` — function to retrieve sorted points table

- [x] **Seed sample data** `P1` `Medium`  
  Create seed script with: 2 admin users, 30 players, 8 sports, 4 venues, 12 teams, 3 tournaments, 20+ matches, sample match events and points table entries.

---

## 🔐 Authentication

| # | Task | Priority | Complexity |
|---|------|----------|------------|
| 1 | Email/password registration | P0 | Medium |
| 2 | Email/password login | P0 | Medium |
| 3 | Google OAuth login | P1 | Medium |
| 4 | Logout functionality | P0 | Easy |
| 5 | Password reset flow | P1 | Medium |
| 6 | Role-based middleware | P0 | Medium |
| 7 | Protected route components | P0 | Medium |
| 8 | Auth context/provider | P0 | Medium |

- [ ] **Email/password registration** `P0` `Medium`  
  Registration page at `/register` with form: full name, email, password, confirm password. Validate with Zod. Call `supabase.auth.signUp()`. Trigger `handle_new_user()` to create users row. Show email confirmation notice.

- [ ] **Email/password login** `P0` `Medium`  
  Login page at `/login` with email + password. Call `supabase.auth.signInWithPassword()`. Redirect based on role: admin → `/admin`, player → `/dashboard`.

- [ ] **Google OAuth login** `P1` `Medium`  
  Add "Sign in with Google" button. Configure Google provider in Supabase dashboard. Handle OAuth callback at `/auth/callback`. Map Google profile to users table.

- [ ] **Logout functionality** `P0` `Easy`  
  Logout button in navbar/sidebar. Call `supabase.auth.signOut()`. Clear session cookies. Redirect to `/`.

- [ ] **Password reset flow** `P1` `Medium`  
  "Forgot password" link on login page → sends reset email via `supabase.auth.resetPasswordForEmail()`. Create `/auth/reset-password` page to accept new password via `supabase.auth.updateUser()`.

- [ ] **Role-based middleware** `P0` `Medium`  
  Extend `middleware.ts`:
  - Check user role from session metadata or users table
  - `/admin/*` routes → require `admin` role
  - `/dashboard/*` routes → require `player` role
  - Return 403 or redirect on unauthorized access

- [ ] **Protected route components** `P0` `Medium`  
  Create wrapper components:
  - `<RequireAuth>` — redirects to login if not authenticated
  - `<RequireRole role="admin">` — shows 403 if wrong role
  - Use in layout files for route groups

- [ ] **Auth context/provider** `P0` `Medium`  
  Create `AuthProvider` context:
  - Manage current user state
  - Subscribe to `onAuthStateChange`
  - Provide `user`, `role`, `isLoading`, `signOut` via context
  - Wrap app in provider at root layout

---

## 🎨 Layout & Navigation

| # | Task | Priority | Complexity |
|---|------|----------|------------|
| 1 | Public navbar | P0 | Medium |
| 2 | Player sidebar | P0 | Medium |
| 3 | Admin sidebar | P0 | Medium |
| 4 | Footer | P1 | Easy |
| 5 | Responsive mobile menu | P0 | Medium |
| 6 | Breadcrumbs | P2 | Easy |
| 7 | Theme toggle | P2 | Easy |

- [ ] **Public navbar** `P0` `Medium`  
  Sticky top navigation bar with: PlayOps logo, nav links (Home, Tournaments, Live Scores, Results), Login/Register buttons. If logged in: show avatar with dropdown (Profile, Dashboard, Logout).

- [ ] **Player sidebar** `P0` `Medium`  
  Collapsible sidebar for `/dashboard/*` routes. Menu items: Dashboard, My Profile, My Team, My Matches, Performance, Notifications (with badge), Certificates. Highlight active route.

- [ ] **Admin sidebar** `P0` `Medium`  
  Collapsible sidebar for `/admin/*` routes. Menu sections:
  - **Overview:** Dashboard
  - **Manage:** Players, Sports, Venues, Teams, Tournaments, Matches
  - **Results:** Points Table, Results
  - **System:** Notifications, Certificates, Reports, Settings

- [ ] **Footer** `P1` `Easy`  
  Footer with: KK Wagh college info, quick links, contact, "Built with ❤️" credit, copyright.

- [ ] **Responsive mobile menu** `P0` `Medium`  
  Sheet/drawer-based mobile navigation for screens < 768px. Hamburger menu trigger. Smooth open/close transitions.

- [ ] **Breadcrumbs** `P2` `Easy`  
  Dynamic breadcrumb trail for admin/dashboard pages. Auto-generate from route segments. Use shadcn `Breadcrumb` component.

- [ ] **Theme toggle (dark/light mode)** `P2` `Easy`  
  Use `next-themes` for dark mode support. Toggle button in navbar. Persist preference in localStorage.

---

## 🏠 Public Pages

| # | Task | Priority | Complexity |
|---|------|----------|------------|
| 1 | Landing/Home page | P0 | Hard |
| 2 | Tournaments listing | P0 | Medium |
| 3 | Tournament detail | P0 | Hard |
| 4 | Live scores page | P1 | Hard |
| 5 | Results page | P1 | Medium |
| 6 | Points table page | P1 | Medium |

- [ ] **Landing/Home page** `P0` `Hard`  
  Hero section with college branding and CTA. Featured/ongoing tournaments carousel. Upcoming matches list. Quick stats (total players, teams, tournaments). Recent results. Responsive and visually polished.

- [ ] **Tournaments listing page** `P0` `Medium`  
  Grid/list of all tournaments at `/tournaments`. Filter by: sport, status, gender category. Search by name. Cards with: tournament name, sport, dates, status badge, team count.

- [ ] **Tournament detail page** `P0` `Hard`  
  Detailed view at `/tournaments/[id]`. Tabs: Overview, Teams, Fixtures/Bracket, Points Table, Results. Show registration button if open. Knockout bracket visualization for elimination tournaments.

- [x] **Live scores page** `P1` `Hard`  
  Real-time scores at `/live`. Use Supabase Realtime subscriptions on `matches` and `match_events` tables. Auto-update UI without refresh. Show live match cards with scores, events timeline, team info.

- [x] **Results page** `P1` `Medium`  
  Past match results at `/results`. Filter by sport, tournament, date range. Show match cards with final scores, winner badge, MVPs.

- [x] **Points table page** `P1` `Medium`  
  League standings at `/points-table`. Select tournament dropdown. Sortable table: Rank, Team, P, W, L, D, GF, GA, GD, Pts. Color-coded zones (qualified, eliminated).

---

## 👤 Player Features

| # | Task | Priority | Complexity |
|---|------|----------|------------|
| 1 | Player registration form | P0 | Medium |
| 2 | Player profile page | P0 | Medium |
| 3 | Edit profile | P0 | Medium |
| 4 | QR code display | P1 | Easy |
| 5 | View my team | P0 | Easy |
| 6 | View my matches | P0 | Medium |
| 7 | View performance stats | P1 | Medium |
| 8 | View notifications | P1 | Easy |
| 9 | View/download certificates | P2 | Medium |
| 10 | Player dashboard overview | P0 | Medium |

- [x] **Player registration form** `P0` `Medium`  
  Multi-step or single-page form at `/dashboard/register`. Fields: PRN, department, year, phone, DOB, gender, blood group, height, weight, preferred sports (multi-select), medical conditions, emergency contact. Zod validation. Upload profile photo to Supabase Storage.

- [x] **Player profile page** `P0` `Medium`  
  Profile view at `/dashboard/profile`. Display all player details. Avatar, QR code, teams, stats summary. Clean card-based layout.

- [x] **Edit profile** `P0` `Medium`  
  Edit form at `/dashboard/profile/edit`. Pre-populate with current data. Update via Supabase. Handle avatar upload/change. Toast confirmation on save.

- [x] **QR code display** `P1` `Easy`  
  Generate QR code from player's unique ID/PRN using `qrcode.react`. Display on profile page. Allow download as PNG. Used by admin for quick lookup.

- [ ] **View my team** `P0` `Easy`  
  Team page at `/dashboard/team`. List teams the player belongs to. Show team name, sport, captain, other members. Link to tournament.

- [ ] **View my matches (upcoming + past)** `P0` `Medium`  
  Matches list at `/dashboard/matches`. Two tabs: Upcoming and Past. Show match date, opponent, venue, score (for past), status badge. Link to match detail.

- [ ] **View my performance stats** `P1` `Medium`  
  Stats page at `/dashboard/performance`. Summary cards: total matches, goals/runs, assists, wins. Sport-wise breakdown. Performance trend chart over time.

- [ ] **View notifications** `P1` `Easy`  
  Notifications list at `/dashboard/notifications`. Show title, message, timestamp. Mark as read on click. Unread count badge in sidebar.

- [ ] **View/download certificates** `P2` `Medium`  
  Certificates page at `/dashboard/certificates`. List earned certificates with tournament name, type, date. Download button for PDF.

- [ ] **Player dashboard with overview** `P0` `Medium`  
  Dashboard landing at `/dashboard`. Widgets: upcoming matches (next 3), recent results, team status, notification preview, quick stats (total matches played, win rate).

---

## 🛡️ Admin — Player Management

| # | Task | Priority | Complexity |
|---|------|----------|------------|
| 1 | List all players | P0 | Medium |
| 2 | View player detail | P0 | Easy |
| 3 | Edit player | P0 | Medium |
| 4 | Delete/deactivate player | P0 | Easy |
| 5 | QR-based player lookup | P1 | Medium |
| 6 | Export player list | P2 | Medium |

- [x] **List all players with search/filter** `P0` `Medium`  
  Data table at `/admin/players` using shadcn `DataTable` + TanStack Table. Columns: Name, PRN, Department, Year, Sports, Status. Server-side pagination. Search by name/PRN. Filter by department, sport, year, status.

- [x] **View player detail** `P0` `Easy`  
  Detail page at `/admin/players/[id]`. Full player profile, teams, match history, performance summary. Admin notes section.

- [x] **Edit player** `P0` `Medium`  
  Edit form at `/admin/players/[id]/edit`. All fields editable. Admin can change role, status, department, etc. Validation with Zod.

- [x] **Delete/deactivate player** `P0` `Easy`  
  Soft delete (set `is_active = false`). Confirmation dialog. Option to fully delete with cascade warning. Deactivated players are hidden from team selection.

- [x] **QR-based player lookup** `P1` `Medium`  
  QR scanner component using device camera (`html5-qrcode` or `@yudiel/react-qr-scanner`). Scan player QR → navigate to their profile. Useful for on-ground verification at matches.

- [ ] **Export player list** `P2` `Medium`  
  Export to CSV/Excel. Filter-aware (exports current filtered view). Use a library like `xlsx` or `papaparse`. Include all relevant columns.

---

## 🛡️ Admin — Sports Management

| # | Task | Priority | Complexity |
|---|------|----------|------------|
| 1 | List sports | P0 | Easy |
| 2 | Add new sport | P0 | Easy |
| 3 | Edit sport | P0 | Easy |
| 4 | Delete sport | P0 | Easy |

- [x] **List sports** `P0` `Easy`  
  Table/card grid at `/admin/sports`. Show: name, type, category, player limits, active status, linked tournaments count.

- [x] **Add new sport** `P0` `Easy`  
  Dialog or page form. Fields: name, type (enum select), category, min/max players per team, description, rules, icon upload. Insert into `sports` table.

- [x] **Edit sport** `P0` `Easy`  
  Edit form pre-filled with existing data. Update Supabase row. Toast on success.

- [x] **Delete sport** `P0` `Easy`  
  Soft delete or hard delete with dependency check. Warn if tournaments/teams reference this sport. Confirmation dialog.

---

## 🛡️ Admin — Venue Management

| # | Task | Priority | Complexity |
|---|------|----------|------------|
| 1 | List venues | P0 | Easy |
| 2 | Add new venue | P0 | Easy |
| 3 | Edit venue | P0 | Easy |
| 4 | Delete venue | P0 | Easy |
| 5 | Venue availability calendar | P2 | Hard |

- [x] **List venues** `P0` `Easy`  
  Table at `/admin/venues`. Columns: name, location, capacity, sports supported, indoor/outdoor, status.

- [x] **Add new venue** `P0` `Easy`  
  Form: name, location, capacity, sport types (multi-select), facilities (tag input), indoor checkbox, image upload.

- [x] **Edit venue** `P0` `Easy`  
  Edit form with pre-filled data. Update in Supabase.

- [x] **Delete venue** `P0` `Easy`  
  Dependency check (scheduled matches at this venue). Soft delete with confirmation.

- [ ] **Venue availability calendar** `P2` `Hard`  
  Calendar view showing booked/available slots per venue. Integrate with match schedule. Use a calendar library (e.g., `react-big-calendar` or custom). Help admin avoid double-booking.

---

## 🛡️ Admin — Team Management

| # | Task | Priority | Complexity |
|---|------|----------|------------|
| 1 | List teams | P0 | Easy |
| 2 | Create team | P0 | Medium |
| 3 | Edit team details | P0 | Easy |
| 4 | Add players to team | P0 | Medium |
| 5 | Remove players from team | P0 | Easy |
| 6 | Assign/change captain | P0 | Easy |
| 7 | Delete team | P0 | Easy |

- [x] **List teams** `P0` `Easy`  
  Data table at `/admin/teams`. Columns: team name, sport, tournament, captain, player count, department, status. Filter by sport, tournament.

- [x] **Create team** `P0` `Medium`  
  Form at `/admin/teams/new`. Fields: name, sport (select), tournament (select), department, gender category, logo upload. After creation, redirect to team detail for player assignment.

- [x] **Edit team details** `P0` `Easy`  
  Edit team name, logo, department, gender category. Update in Supabase.

- [x] **Add players to team** `P0` `Medium`  
  Player search/select with autocomplete. Validate against: sport's max player limit, player not already on another team in same tournament, gender category match. Insert into `team_players`.

- [x] **Remove players from team** `P0` `Easy`  
  Remove player from `team_players`. Confirmation dialog. Cannot remove captain without reassignment.

- [x] **Assign/change captain** `P0` `Easy`  
  Select captain from team player list. Update `teams.captain_id`. Only one captain per team.

- [x] **Delete team** `P0` `Easy`  
  Check for active matches. Cascade delete `team_players` entries. Confirmation dialog with impact summary.

---

## 🛡️ Admin — Tournament Management

| # | Task | Priority | Complexity |
|---|------|----------|------------|
| 1 | List tournaments | P0 | Easy |
| 2 | Create tournament | P0 | Medium |
| 3 | Edit tournament | P0 | Medium |
| 4 | Delete tournament | P0 | Easy |
| 5 | Manage registrations | P0 | Medium |
| 6 | Auto-generate fixtures (knockout) | P0 | Hard |
| 7 | Auto-generate fixtures (league) | P0 | Hard |
| 8 | Set tournament rules | P1 | Easy |

- [x] **List tournaments** `P0` `Easy`  
  Data table at `/admin/tournaments`. Columns: name, sport, format, status, dates, team count, venue. Status badge coloring. Filter by status, sport.

- [x] **Create tournament form** `P0` `Medium`  
  Multi-step form at `/admin/tournaments/new`:
  - Step 1: Basic info (name, sport, format, gender category)
  - Step 2: Dates (start, end, registration deadline)
  - Step 3: Settings (max/min teams, venue, description, rules)
  - Step 4: Review & create
  
  Insert into `tournaments` table with status = `upcoming`.

- [x] **Edit tournament** `P0` `Medium`  
  Edit all tournament fields. Restrict editing certain fields after tournament starts (e.g., format, sport). Show warning for destructive changes.

- [x] **Delete tournament** `P0` `Easy`  
  Only allow if status is `upcoming` or `cancelled`. Cascade warning for registrations. Confirmation dialog.

- [x] **Manage registrations (approve/reject)** `P0` `Medium`  
  Registration management at `/admin/tournaments/[id]/registrations`. Table of pending registrations with team details. Approve/reject buttons. Add remarks on rejection. Batch approve option.

- [x] **Auto-generate fixtures (knockout)** `P0` `Hard`  
  Algorithm to generate single-elimination bracket:
  - Handle byes for non-power-of-2 team counts
  - Seed teams (random or based on ranking)
  - Create `matches` rows with `next_match_id` linking
  - Visual bracket preview before confirming
  - Assign venues and time slots

- [x] **Auto-generate fixtures (league/round-robin)** `P0` `Hard`  
  Round-robin algorithm:
  - Generate all possible pairings
  - Distribute across rounds
  - Handle odd number of teams (bye rounds)
  - Create `matches` rows
  - Create corresponding `points_table` rows initialized to 0
  - Assign venues and time slots

- [x] **Set tournament rules** `P1` `Easy`  
  Rich text or markdown editor for tournament rules. Stored in `tournaments.rules`. Displayed on tournament detail page.

---

## 🛡️ Admin — Match Management

| # | Task | Priority | Complexity |
|---|------|----------|------------|
| 1 | List matches with filters | P0 | Medium |
| 2 | Schedule new match | P0 | Medium |
| 3 | Edit match details | P0 | Easy |
| 4 | Cancel match | P0 | Easy |
| 5 | Live score update interface | P0 | Hard |
| 6 | Add match events | P0 | Hard |
| 7 | Set match result and winner | P0 | Medium |

- [x] **List matches with filters** `P0` `Medium`  
  Data table at `/admin/matches`. Columns: tournament, round, teams, venue, date/time, status, score. Filter by tournament, sport, status, date range. Quick actions column.

- [x] **Schedule new match** `P0` `Medium`  
  Form: select tournament, round, team A, team B, venue, date/time. Validate no venue conflicts. Create `matches` row with status = `scheduled`.

- [x] **Edit match details** `P0` `Easy`  
  Edit venue, date/time, teams (if not started). Cannot change teams after match starts.

- [x] **Cancel match** `P0` `Easy`  
  Set status to `cancelled`. Add reason in remarks. Notify affected players via notifications.

- [x] **Live score update interface** `P0` `Hard`  
  Real-time scoring page and ground console at `/admin/matches`:
  - Start match button (set status = `live`, record `started_at`)
  - Score increment/decrement for each team
  - Quick-add event buttons (goal, wicket, foul, etc.)
  - Live timer display
  - Save to Supabase with Realtime broadcast
  - End match button (set status = `completed`, record `ended_at`)

- [x] **Add match events (goals, wickets, etc.)** `P0` `Hard`  
  Event log interface within live scoring:
  - Select event type from dropdown
  - Select team and player involved
  - Enter minute/timestamp
  - Add description (optional)
  - Events appear in a live timeline
  - Insert into `match_events` table

- [x] **Set match result and winner** `P0` `Medium`  
  On match completion:
  - Auto-determine winner from scores
  - Handle draws
  - Update `matches.winner_id`
  - Trigger `update_points_table()` for league matches
  - For knockout: advance winner to `next_match_id`
  - Create notifications for involved players

---

## 📊 Points Table & Results

| # | Task | Priority | Complexity |
|---|------|----------|------------|
| 1 | Auto-calculate points | P0 | Hard |
| 2 | Points table display | P0 | Medium |
| 3 | Match results page | P1 | Medium |
| 4 | Tournament results summary | P1 | Medium |

- [x] **Auto-calculate points after match completion** `P0` `Hard`  
  Database trigger/action that fires when `matches.status` changes to `completed`:
  - League: Win = 3 pts, Draw = 1 pt, Loss = 0 pts (configurable)
  - Update `points_table` for both teams
  - Recalculate goal difference, net run rate
  - Update rank based on points, then GD, then head-to-head

- [x] **Points table display with sorting** `P0` `Medium`  
  Component used on public page + admin. Select tournament. Sortable columns. Highlight current user's team. Color zones for qualification.

- [x] **Match results page** `P1` `Medium`  
  View at `/results`. All completed matches. Detailed result cards with events timeline, MVPs.

- [x] **Tournament results summary** `P1` `Medium`  
  Summary view: winner, runner-up, top scorer, MVPs, all match results. Used as base for report/certificate generation.

---

## 📈 Analytics & Performance

| # | Task | Priority | Complexity |
|---|------|----------|------------|
| 1 | Player stats cards | P1 | Medium |
| 2 | Performance charts | P1 | Hard |
| 3 | Tournament statistics | P1 | Medium |
| 4 | Sport-wise analytics | P2 | Medium |
| 5 | Admin dashboard widgets | P0 | Hard |

- [ ] **Player stats cards** `P1` `Medium`  
  Reusable stat card components: total matches, win rate, goals/runs scored, clean sheets, etc. Sport-aware (show relevant stats per sport type).

- [ ] **Performance charts (Recharts)** `P1` `Hard`  
  Install `recharts`. Charts:
  - Player: performance over time (line chart), sport-wise breakdown (pie chart)
  - Team: win/loss ratio (bar chart), scoring trends
  - Tournament: match timeline, participation stats

- [ ] **Tournament statistics** `P1` `Medium`  
  Tournament-level stats: total matches, total goals/runs, highest scorer, most wins, average score, closest match. Display on tournament detail page.

- [ ] **Sport-wise analytics** `P2` `Medium`  
  Aggregate stats per sport: active players, teams, tournaments conducted, top performers. Admin analytics section.

- [ ] **Admin dashboard stats widgets** `P0` `Hard`  
  Dashboard at `/admin`:
  - KPI cards: total players, active tournaments, matches today, pending registrations
  - Recent activity feed
  - Upcoming matches list
  - Quick action buttons (create tournament, schedule match)
  - Charts: tournaments per sport (bar), registrations over time (line), player growth (area)

---

## 🔔 Notifications

| # | Task | Priority | Complexity |
|---|------|----------|------------|
| 1 | In-app notification system | P1 | Medium |
| 2 | Notification bell with count | P1 | Easy |
| 3 | Mark as read | P1 | Easy |
| 4 | Admin: send notifications | P1 | Medium |
| 5 | Email notifications (Resend) | P2 | Hard |

- [ ] **In-app notification system** `P1` `Medium`  
  Create notification service: helper functions to create notifications, fetch user notifications, mark as read. Auto-create notifications on: match scheduled, match result, registration approved/rejected, certificate issued.

- [ ] **Notification bell with count** `P1` `Easy`  
  Bell icon in navbar/sidebar. Show unread count badge. Dropdown with latest 5 notifications. "View all" link to full notifications page.

- [ ] **Mark as read** `P1` `Easy`  
  Click notification → set `is_read = true`, `read_at = now()`. "Mark all as read" button. Update unread count reactively.

- [ ] **Admin: send notifications** `P1` `Medium`  
  Admin page to broadcast notifications. Select target: all users, specific sport players, specific tournament teams, individual player. Compose title + message. Bulk insert into `notifications`.

- [ ] **Email notifications via Resend** `P2` `Hard`  
  Integrate [Resend](https://resend.com) API. Create email templates (React Email):
  - Welcome / registration confirmation
  - Match reminder (1 day before)
  - Match result
  - Certificate issued
  - Tournament registration approved/rejected
  
  Trigger emails in relevant server actions. Respect user email preferences.

---

## 🏆 Certificates

| # | Task | Priority | Complexity |
|---|------|----------|------------|
| 1 | Certificate template design | P2 | Hard |
| 2 | Generate certificate for winners | P2 | Hard |
| 3 | PDF generation | P2 | Hard |
| 4 | Download certificate | P2 | Medium |
| 5 | Bulk certificate generation | P2 | Hard |

- [ ] **Certificate template design** `P2` `Hard`  
  Design HTML/React template for certificates. Include: college logo, player name, tournament name, position (winner/runner-up/participant), date, signatures. Multiple template variants.

- [ ] **Generate certificate for winners** `P2` `Hard`  
  After tournament completion, admin can generate certificates. Select template, select winners/participants from tournament results. Populate template with data. Create `certificates` row.

- [ ] **PDF generation** `P2` `Hard`  
  Convert certificate template to PDF using `@react-pdf/renderer` or Puppeteer/Playwright on server. Upload generated PDF to Supabase Storage. Store URL in `certificates.file_url`.

- [ ] **Download certificate** `P2` `Medium`  
  Player can download their certificate from `/dashboard/certificates`. Secure download link (signed URL from Supabase Storage). Preview before download.

- [ ] **Bulk certificate generation** `P2` `Hard`  
  Generate certificates for all participants in a tournament at once. Background job to avoid timeout. Progress indicator. Batch upload to storage.

---

## 📋 Reports

| # | Task | Priority | Complexity |
|---|------|----------|------------|
| 1 | Tournament report generation | P2 | Hard |
| 2 | Player report generation | P2 | Medium |
| 3 | Export as PDF | P2 | Hard |
| 4 | Admin reports dashboard | P2 | Medium |

- [ ] **Tournament report generation** `P2` `Hard`  
  Generate detailed tournament report: overview, all matches with scores, points table, top performers, event statistics, participation summary. Stored in `reports` table.

- [ ] **Player report generation** `P2` `Medium`  
  Individual player report: profile summary, match history, performance across tournaments, achievements, stats comparison. Useful for sports committee.

- [ ] **Export as PDF** `P2` `Hard`  
  Convert report data to formatted PDF. Use `@react-pdf/renderer` or server-side HTML-to-PDF. Upload to Supabase Storage. Download link.

- [ ] **Admin reports dashboard** `P2` `Medium`  
  Reports hub at `/admin/reports`. List generated reports. Quick generate buttons for common report types. Download/view past reports.

---

## 🧪 Testing

| # | Task | Priority | Complexity |
|---|------|----------|------------|
| 1 | Set up Vitest | P1 | Easy |
| 2 | Unit tests for utilities | P1 | Medium |
| 3 | Component tests | P1 | Medium |
| 4 | Set up Playwright | P2 | Medium |
| 5 | E2E tests: auth flow | P2 | Hard |
| 6 | E2E tests: admin flows | P2 | Hard |
| 7 | E2E tests: player flows | P2 | Hard |

- [ ] **Set up Vitest** `P1` `Easy`  
  Install Vitest + React Testing Library + jsdom. Configure `vitest.config.ts`. Add test scripts to `package.json`. Create test directory structure.

- [ ] **Unit tests for utility functions** `P1` `Medium`  
  Test: date formatters, score calculators, fixture generators, validation schemas, role checkers, QR data encoding. Target 80%+ coverage for `/lib`.

- [ ] **Component tests** `P1` `Medium`  
  Test key components: login form, player registration form, data tables, stat cards, score update interface. Verify rendering, user interactions, form validation, error states.

- [ ] **Set up Playwright** `P2` `Medium`  
  Install Playwright. Configure `playwright.config.ts`. Set up test fixtures, authentication helpers, database setup/teardown scripts.

- [ ] **E2E tests for auth flow** `P2` `Hard`  
  Test scenarios: register → verify email → login → role redirect → logout. Password reset flow. Invalid credentials. OAuth flow (mock).

- [ ] **E2E tests for admin flows** `P2` `Hard`  
  Test: create sport → create venue → create tournament → approve registration → generate fixtures → update scores → complete match → verify points table. Full admin workflow.

- [ ] **E2E tests for player flows** `P2` `Hard`  
  Test: register as player → complete profile → view teams → view matches → check notifications → download certificate. Full player workflow.

---

## 🚀 Deployment

| # | Task | Priority | Complexity |
|---|------|----------|------------|
| 1 | Vercel deployment setup | P0 | Easy |
| 2 | Environment variables in Vercel | P0 | Easy |
| 3 | Custom domain | P2 | Easy |
| 4 | Performance monitoring | P2 | Medium |
| 5 | Error tracking | P2 | Medium |

- [ ] **Vercel deployment setup** `P0` `Easy`  
  Connect GitHub repository to Vercel. Configure build settings (Next.js auto-detected). Set up preview deployments for PRs. Configure production branch.

- [ ] **Environment variables in Vercel** `P0` `Easy`  
  Add all `.env` variables to Vercel dashboard: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `NEXT_PUBLIC_APP_URL`. Separate production/preview values if needed.

- [ ] **Custom domain (optional)** `P2` `Easy`  
  Configure custom domain in Vercel. DNS setup (CNAME or A record). SSL auto-provisioned by Vercel. Redirect www to non-www (or vice versa).

- [ ] **Performance monitoring** `P2` `Medium`  
  Enable Vercel Analytics for Core Web Vitals. Set up Vercel Speed Insights. Monitor: LCP, FID, CLS, TTFB. Optimize based on data.

- [ ] **Error tracking** `P2` `Medium`  
  Integrate Sentry for error monitoring. Configure `sentry.client.config.ts` and `sentry.server.config.ts`. Source map upload. Alert rules for critical errors.

---

## 📊 Progress Summary

```
Module                          Total Tasks    P0    P1    P2
──────────────────────────────────────────────────────────────
Setup & Configuration                  10      8     1     1
Database                               20     15     3     2
Authentication                          8      6     2     0
Layout & Navigation                     7      4     1     2
Public Pages                            6      3     3     0
Player Features                        10      5     3     2
Admin — Player Management               6      4     1     1
Admin — Sports Management               4      4     0     0
Admin — Venue Management                5      4     0     1
Admin — Team Management                 7      7     0     0
Admin — Tournament Management            8      6     1     1
Admin — Match Management                7      6     0     1
Points Table & Results                  4      2     2     0
Analytics & Performance                 5      1     3     1
Notifications                           5      0     4     1
Certificates                            5      0     0     5
Reports                                 4      0     0     4
Testing                                 7      0     3     4
Deployment                              5      2     0     3
──────────────────────────────────────────────────────────────
TOTAL                                 137     77    27    33
```

> [!IMPORTANT]
> **Recommended Build Order:**
> 1. Setup & Configuration (Sprint 0)
> 2. Database schema + seed data (Sprint 1)
> 3. Authentication (Sprint 1)
> 4. Layout & Navigation (Sprint 2)
> 5. Admin — Sports, Venues, Teams (Sprint 2)
> 6. Admin — Tournament + Match Management (Sprint 3)
> 7. Public Pages (Sprint 3)
> 8. Player Features (Sprint 4)
> 9. Points Table, Results, Analytics (Sprint 4)
> 10. Notifications, Certificates, Reports (Sprint 5)
> 11. Testing (Sprint 5–6)
> 12. Deployment & Polish (Sprint 6)

---

*This task list is a living document. Update checkboxes as tasks are completed.*
