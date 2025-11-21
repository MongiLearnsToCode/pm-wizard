# Task List: Wizard-Based Project & Task Management App
## UPDATED: Role-Based Dashboard Architecture + PostHog Analytics

**Source PRD:** `prd-wizard-task-app.md` (v2.1 - PostHog Integration)

## Current State Assessment

This is a **greenfield project** - no existing codebase. We will be building from scratch with the following technology stack:

- **Framework:** Next.js 14+ with App Router and TypeScript
- **UI Components:** shadcn/ui with Radix UI primitives and Tailwind CSS
- **State Management:** Zustand for all client state (auth, role management, dashboard state, projects, tasks, notifications)
- **Database & Auth:** Supabase (PostgreSQL database, Row Level Security for role enforcement, built-in auth)
- **File Storage:** Cloudflare R2 (S3-compatible object storage with zero egress fees)
- **File Handling:** @aws-sdk/client-s3 (works with Cloudflare R2 via S3-compatible API)
- **Real-time:** Supabase Realtime subscriptions with role-based filtering
- **AI:** OpenAI API (GPT-4 Turbo or GPT-3.5 Turbo for cost efficiency, Admin-only features)
- **Email:** Resend with React Email for transactional emails
- **Analytics:** PostHog (Product Analytics with role-based event tracking, Session Replay post-MVP, Feature Flags post-MVP)
- **Testing:** Jest + React Testing Library (components), Playwright (E2E including role-based access)
- **Deployment:** Vercel (recommended) or Netlify

## Key Architectural Changes for Role-Based Dashboards

### Role Assignment Model (Per-Project)
**CRITICAL**: Roles are assigned per-project, not globally per-user. A single user can have different roles across different projects:
- **Admin** on Project A (projects they created)
- **Member** on Project B (projects where they're a team member)
- **Viewer** on Project C (projects they're invited to observe)

### New Data Model Components
- **user_project_roles** junction table: Links users to projects with specific roles (Admin, Member, Viewer)
  - Columns: user_id, project_id, role, assigned_at, assigned_by
  - Primary key: (user_id, project_id)
  - Role is determined by this table for each project
- **user_organization_roles** junction table: Links users to organizations with roles
- Role-based RLS policies on all tables filtering by project_id AND user role

### New UI Components
- Role-aware dashboard layouts (3 distinct dashboards that switch based on selected project)
- **Project/Role switcher** in navigation showing current project and role
- Role indicator badge showing current role for selected project
- Dashboard switcher for users with multiple roles across projects
- Role-specific navigation menus that update when project changes
- Permission-aware buttons and forms that check role in current project context

### New Backend Logic
- Role validation middleware for API routes (checks role for specific project)
- Role-based query filtering (filters by project_id and user_role)
- Permission checking utilities (getUserRoleForProject, checkPermissionForProject)
- Role-aware notification routing
- Project context management in Zustand store

### Role Switching Flow
1. User logs in → System detects all projects and roles
2. Default to last selected project/role (from localStorage)
3. User can switch projects via project switcher
4. Dashboard dynamically re-renders based on role in selected project
5. Navigation, features, and permissions update accordingly
6. PostHog tracks role and project context in all events

## Relevant Files

### Next.js Application Structure (Updated)
- `app/layout.tsx` - Root layout with providers (Supabase, theme, **PostHog**, **role context**)
- `instrumentation-client.ts` - PostHog initialization (Next.js 15.3+)
- `app/page.tsx` - Landing/login page (unified for all users)
- `app/(auth)/login/page.tsx` - Login page
- `app/(auth)/register/page.tsx` - Registration page (unified)
- **`app/(admin)/layout.tsx`** - Admin dashboard layout (Admin-only route)
- **`app/(admin)/dashboard/page.tsx`** - Admin dashboard page
- **`app/(admin)/projects/[id]/page.tsx`** - Admin project detail page
- **`app/(admin)/teams/page.tsx`** - Team management page (Admin-only)
- **`app/(admin)/settings/page.tsx`** - Organization settings page (Admin-only)
- **`app/(member)/layout.tsx`** - Member dashboard layout
- **`app/(member)/dashboard/page.tsx`** - Member dashboard page (task-focused)
- **`app/(member)/tasks/page.tsx`** - Member task list page
- **`app/(viewer)/layout.tsx`** - Viewer dashboard layout
- **`app/(viewer)/dashboard/page.tsx`** - Viewer dashboard page (analytics-focused)
- **`app/(viewer)/reports/page.tsx`** - Viewer reports page
- `app/api/projects/route.ts` - Projects API routes with role validation
- `app/api/projects/[id]/route.ts` - Project detail API routes with role checking
- `app/api/tasks/route.ts` - Tasks API routes with role-based filtering
- `app/api/tasks/[id]/route.ts` - Task detail API routes with ownership validation
- `app/api/teams/route.ts` - Teams API routes (Admin-only)
- `app/api/comments/route.ts` - Comments API routes (Admin and Member only)
- **`app/api/roles/assign/route.ts`** - Role assignment endpoint (Admin-only)
- **`app/api/roles/check/route.ts`** - Role checking utility endpoint
- `app/api/notifications/route.ts` - Notifications API with role-based content
- `app/api/wizard/drafts/route.ts` - Wizard draft management (Admin-only)
- `app/api/ai/suggest-template/route.ts` - AI template suggestions (Admin-only)
- `app/api/ai/suggest-tasks/route.ts` - AI task breakdown (Admin-only)
- `app/api/files/upload/route.ts` - File upload endpoint with role validation
- `app/api/analytics/route.ts` - Analytics endpoints with role-appropriate data
- `app/api/search/route.ts` - Global search endpoint with role-based filtering
- `app/api/cron/cleanup/route.ts` - Scheduled cleanup job
- `app/api/cron/grace-period/route.ts` - Grace period enforcement job

### Components (using shadcn/ui conventions) - Updated
- **`components/role/role-badge.tsx`** - Role indicator badge component (shows current role for selected project)
- **`components/role/role-guard.tsx`** - Component wrapper for role-based rendering (checks role in project context)
- **`components/role/project-switcher.tsx`** - Project/role switcher (lists all projects with user's role for each)
- **`components/role/dashboard-switcher.tsx`** - Dashboard view switcher (deprecated - use project-switcher)
- **`components/dashboards/admin-dashboard.tsx`** - Admin-specific dashboard layout (for projects where user is Admin)
- **`components/dashboards/member-dashboard.tsx`** - Member-specific dashboard layout (for projects where user is Member)
- **`components/dashboards/viewer-dashboard.tsx`** - Viewer-specific dashboard layout (for projects where user is Viewer)
- **`components/navigation/admin-nav.tsx`** - Admin navigation menu (shows when viewing project as Admin)
- **`components/navigation/member-nav.tsx`** - Member navigation menu (shows when viewing project as Member)
- **`components/navigation/viewer-nav.tsx`** - Viewer navigation menu (shows when viewing project as Viewer)
- `components/ui/button.tsx` - shadcn Button component **with role-aware disabled states per project**
- `components/ui/card.tsx` - shadcn Card component **with role-based action visibility per project**
- `components/ui/dialog.tsx` - shadcn Dialog component
- `components/ui/dropdown-menu.tsx` - shadcn Dropdown Menu
- `components/ui/input.tsx` - shadcn Input component **with read-only mode for Viewers**
- `components/ui/select.tsx` - shadcn Select component
- `components/ui/badge.tsx` - shadcn Badge component (for role indicators)
- `components/ui/progress.tsx` - shadcn Progress component
- `components/ui/checkbox.tsx` - shadcn Checkbox component
- `components/ui/toast.tsx` - shadcn Toast/Sonner for notifications
- `components/wizard/project-wizard.tsx` - Multi-step project creation wizard **(Admin-only, creates new project where user becomes Admin)**
- **`components/wizard/role-assignment-step.tsx`** - Role assignment wizard step
- `components/wizard/task-wizard.tsx` - Task assignment wizard **(Admin-only)**
- `components/wizard/wizard-step.tsx` - Reusable wizard step component
- `components/wizard/wizard-progress.tsx` - Progress indicator component
- `components/dashboard/project-card.tsx` - Project card component **with role-based actions**
- `components/dashboard/task-list.tsx` - Task list component **with role-filtered tasks**
- `components/dashboard/filter-bar.tsx` - Dashboard filter component **role-aware**
- **`components/tasks/task-item-admin.tsx`** - Task item for Admin (full controls)
- **`components/tasks/task-item-member.tsx`** - Task item for Member (limited controls)
- **`components/tasks/task-item-viewer.tsx`** - Task item for Viewer (read-only)
- `components/tasks/task-detail.tsx` - Task detail modal **with role-based editing**
- `components/comments/comment-thread.tsx` - Comment section **with role-based posting**
- `components/notifications/notification-bell.tsx` - Notification dropdown **with role-filtered content**
- **`components/teams/team-role-selector.tsx`** - Team member role assignment component
- `components/teams/team-selector.tsx` - Team checkbox selector **with role assignment**
- **`components/analytics/admin-analytics.tsx`** - Comprehensive analytics for Admins
- **`components/analytics/member-analytics.tsx`** - Personal stats for Members
- **`components/analytics/viewer-analytics.tsx`** - High-level metrics for Viewers
- `components/analytics/progress-bar.tsx` - Simple progress visualization
- `components/analytics/activity-timeline.tsx` - Activity feed component **role-filtered**
- `components/layout/navbar.tsx` - Top navigation bar **with role indicator**
- `components/layout/sidebar.tsx` - Side navigation **role-specific menus**
- **`components/onboarding/admin-tour.tsx`** - Admin onboarding tutorial
- **`components/onboarding/member-tour.tsx`** - Member onboarding tutorial
- **`components/onboarding/viewer-tour.tsx`** - Viewer onboarding tutorial
- **`components/providers/posthog-provider.tsx`** - PostHog context provider with role tracking

### Hooks & Utilities - Updated
- **`hooks/use-role.ts`** - Hook for accessing current user role
- **`hooks/use-role-permissions.ts`** - Hook for checking specific permissions
- **`hooks/use-dashboard-context.ts`** - Hook for dashboard state management
- **`hooks/use-posthog.ts`** - Hook for PostHog analytics with role context
- `hooks/use-auth.ts` - Supabase auth hook **with role detection**
- `hooks/use-projects.ts` - Project data fetching hook **with role-based filtering** (uses Zustand)
- `hooks/use-tasks.ts` - Task data fetching hook **with role-based filtering** (uses Zustand)
- `hooks/use-notifications.ts` - Notifications hook **with role-appropriate content** (uses Zustand)
- `hooks/use-wizard-draft.ts` - Wizard draft persistence hook
- `lib/supabase/client.ts` - Supabase client initialization
- `lib/supabase/server.ts` - Supabase server-side client
- `lib/supabase/middleware.ts` - Supabase auth middleware **with role checking**
- **`lib/rbac.ts`** - Role-based access control utilities
- **`lib/permissions.ts`** - Permission checking functions
- **`lib/role-policies.ts`** - RLS policy helpers
- `lib/cloudflare-r2.ts` - Cloudflare R2 client utilities (S3-compatible)
- `lib/openai.ts` - OpenAI API integration with streaming support **Admin-only**
- `lib/resend.ts` - Resend email service utilities **with React Email templates**
- **`lib/posthog.ts`** - PostHog client utilities **with role event tracking helpers**
- `lib/utils.ts` - General utility functions
- `lib/validations.ts` - Zod validation schemas **with role-based validation**
- **`store/role-store.ts`** - Zustand role state management
- `store/auth-store.ts` - Zustand auth state
- `store/project-store.ts` - Zustand project state
- `store/task-store.ts` - Zustand task state
- `store/notification-store.ts` - Zustand notification state
- `store/ui-store.ts` - Zustand UI state (modals, sidebars, etc.)

### Database & Configuration - Updated
- `supabase/migrations/` - Supabase SQL migrations
- `supabase/migrations/20240101000000_initial_schema.sql` - Initial database schema **with role tables**
- **`supabase/migrations/20240101000001_user_roles.sql`** - User role junction tables
- `supabase/migrations/20240101000002_rls_policies.sql` - Row Level Security policies **role-based**
- **`supabase/migrations/20240101000003_role_functions.sql`** - SQL functions for role checking
- `supabase/seed.sql` - Database seeding script **with role assignments**
- `.env.local` - Local environment variables (including PostHog keys)
- `.env.example` - Environment variables template
- `next.config.js` - Next.js configuration (with PWA plugin)
- `middleware.ts` - **Next.js middleware for role-based route protection**
- `instrumentation-client.ts` - PostHog initialization for client-side tracking
- `tailwind.config.ts` - Tailwind CSS configuration
- `components.json` - shadcn/ui configuration
- `tsconfig.json` - TypeScript configuration
- `jest.config.js` - Jest configuration
- `playwright.config.ts` - Playwright E2E test configuration

### Testing - Updated
- `__tests__/components/` - Component tests
- **`__tests__/components/role/`** - Role-specific component tests
- **`__tests__/rbac/`** - Role-based access control tests
- `__tests__/api/` - API route tests **with role validation tests**
- `e2e/` - Playwright E2E tests
- `e2e/auth.spec.ts` - Authentication flow tests
- **`e2e/role-routing.spec.ts`** - Role-based routing tests
- **`e2e/admin-wizard.spec.ts`** - Admin wizard flow tests
- **`e2e/member-tasks.spec.ts`** - Member task management tests
- **`e2e/viewer-readonly.spec.ts`** - Viewer read-only access tests
- `e2e/tasks.spec.ts` - Task management tests

---

## Tasks

- [ ] 1.0 Project Setup & Infrastructure Configuration
  - [ ] 1.1 Initialize Next.js 14+ project with App Router and TypeScript: `npx create-next-app@latest` with app directory enabled
  - [ ] 1.2 Install and configure shadcn/ui: Run `npx shadcn-ui@latest init`, configure Tailwind CSS with design tokens
  - [ ] 1.3 Set up Supabase project: Create project in Supabase Cloud, note project URL and anon key
  - [ ] 1.4 Install Supabase client libraries: `npm install @supabase/supabase-js @supabase/ssr`
  - [ ] 1.5 Configure environment variables: Create `.env.local` with NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, Cloudflare R2 credentials (access key, secret key, bucket name, account ID), OpenAI API key, Resend API key, NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST
  - [ ] 1.6 Set up Cloudflare R2 bucket: Create bucket in Cloudflare dashboard, configure CORS settings, generate R2 API tokens, note endpoint URL
  - [ ] 1.7 Install additional dependencies: `npm install zustand zod @aws-sdk/client-s3 openai resend react-email @radix-ui/react-icons lucide-react date-fns posthog-js`
  - [ ] 1.8 Configure ESLint and Prettier for consistent code style
  - [ ] 1.9 Set up testing framework: Install Jest, React Testing Library, and Playwright for E2E tests
  - [ ] 1.10 Create project folder structure including role-specific routes: `app/(admin)/`, `app/(member)/`, `app/(viewer)/`, `components/role/`, `lib/rbac.ts`, `store/` (for Zustand stores), `emails/` (for React Email templates)
  - [ ] 1.11 Initialize Git repository with `.gitignore` for node_modules, .env files, and .next build artifacts
  - [ ] 1.12 Create README.md with setup instructions and role-based architecture overview
  - [ ] 1.13 Set up PostHog project: Create project in PostHog Cloud (free tier), note API key and host URL (us.i.posthog.com or eu.i.posthog.com)
  - [ ] 1.14 Install PostHog: Run `npx -y @posthog/wizard@latest` for automated setup OR `npm install posthog-js` for manual install
  - [ ] 1.15 Create instrumentation-client.ts: Initialize PostHog with environment variables, defaults flag '2025-05-24', person_profiles: 'identified_only', capture_pageview: false
  - [ ] 1.16 Add PostHog environment variables to .env.local and .env.example: NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST

- [ ] 2.0 Database Schema & Core Models with Role Support
  - [ ] 2.1 Design database schema: Create ERD with entities including **user_project_roles** and **user_organization_roles** junction tables
  - [ ] 2.2 Create initial Supabase migration: `supabase migration new initial_schema`, define all tables
  - [ ] 2.3 Create role junction tables migration: `supabase migration new user_roles`, define user_project_roles (user_id, project_id, role ENUM['admin','member','viewer']), user_organization_roles
  - [ ] 2.4 Add role ENUM type: CREATE TYPE user_role AS ENUM ('admin', 'member', 'viewer')
  - [ ] 2.5 Add soft-delete support: Include `deleted_at` timestamptz fields on relevant tables
  - [ ] 2.6 Add billing/quota fields to organizations table
  - [ ] 2.7 Define table relationships with role constraints: Foreign keys with CASCADE/SET NULL, unique constraints on role assignments
  - [ ] 2.8 Create indexes: Add B-tree indexes on role columns (user_id + project_id + role), frequently queried fields
  - [ ] 2.9 Create role-checking SQL functions: `check_user_role(user_id, project_id, required_role)`, `get_user_highest_role(user_id, project_id)`
  - [ ] 2.10 Create database types file: Use Supabase CLI to generate TypeScript types including role enums
  - [ ] 2.11 Push migration to Supabase: Run `supabase db push`
  - [ ] 2.12 Create seed script with role assignments: Sample organizations, users with different roles across projects
  - [ ] 2.13 Test database: Verify role tables, constraints, and functions work correctly

- [ ] 3.0 Authentication & Role-Based Authorization System
  - [ ] 3.1 Set up Supabase Auth: Configure email/password and OAuth providers in Supabase dashboard
  - [ ] 3.2 Create Supabase client utilities: `lib/supabase/client.ts` and `lib/supabase/server.ts`
  - [ ] 3.3 Create RBAC utilities: `lib/rbac.ts` with functions: getUserRole(userId, projectId), checkPermission(userId, projectId, action), hasRole(userId, projectId, role)
  - [ ] 3.4 Create permission constants: `lib/permissions.ts` defining all available actions (CREATE_PROJECT, EDIT_TASK, VIEW_ANALYTICS, etc.)
  - [ ] 3.5 Create auth middleware with role detection: `lib/supabase/middleware.ts` to protect routes and inject role into request context
  - [ ] 3.6 Create Next.js middleware.ts: Route protection based on role - redirect /admin/* to login if not Admin, etc.
  - [ ] 3.7 Build unified login page: `app/(auth)/login/page.tsx` with email/password form and OAuth buttons
  - [ ] 3.8 Build unified registration page: `app/(auth)/register/page.tsx` - no role selection, roles assigned post-registration
  - [ ] 3.9 Implement password reset flow: Forgot password page, email templates, reset confirmation
  - [ ] 3.10 Create role detection hook: `hooks/use-role.ts` returning current user's role in current project context
  - [ ] 3.11 Create permissions hook: `hooks/use-role-permissions.ts` with functions like canEditTask(), canCreateProject(), canViewAnalytics()
  - [ ] 3.12 Set up Row Level Security (RLS) with role policies: Create RLS policies checking user_project_roles table before allowing data access
  - [ ] 3.13 Create RLS policy helpers: `lib/role-policies.ts` with reusable policy functions
  - [ ] 3.14 Implement role-based rate limiting: Different limits for Admin vs Member API calls
  - [ ] 3.15 Add session management with role caching: Cache user roles in session to reduce database queries
  - [ ] 3.16 Write tests: Auth flows, role detection, permission checking, RLS policy enforcement for all three roles

- [ ] 4.0 Role State Management & Context
  - [ ] 4.1 Create role store: `store/role-store.ts` using Zustand with currentRole, availableRoles, setRole, switchRole functions
  - [ ] 4.2 Create auth store: `store/auth-store.ts` using Zustand for authentication state (user, session, isLoading)
  - [ ] 4.3 Create project store: `store/project-store.ts` using Zustand for projects list, current project, filters
  - [ ] 4.4 Create task store: `store/task-store.ts` using Zustand for tasks list, current task, filters
  - [ ] 4.5 Create notification store: `store/notification-store.ts` using Zustand for notifications, unread count
  - [ ] 4.6 Create UI store: `store/ui-store.ts` using Zustand for modals, sidebars, loading states
  - [ ] 4.7 Create dashboard context hook: `hooks/use-dashboard-context.ts` managing current dashboard view and project context
  - [ ] 4.8 Implement role switching logic: Function to switch between available roles when user has multiple roles in different projects
  - [ ] 4.9 Create role guard component: `components/role/role-guard.tsx` - wrapper component that shows/hides content based on required role
  - [ ] 4.10 Build role badge component: `components/role/role-badge.tsx` displaying current role with color coding (Admin=blue, Member=green, Viewer=gray)
  - [ ] 4.11 Build dashboard switcher: `components/role/dashboard-switcher.tsx` - dropdown in navbar for users with multiple roles
  - [ ] 4.12 Implement role persistence: Store last active role in Zustand with localStorage persistence
  - [ ] 4.13 Add role transition animations: Smooth transitions when switching dashboards
  - [ ] 4.14 Integrate Zustand devtools: Add middleware for debugging state changes in development
  - [ ] 4.15 Write tests: Role switching, Zustand store updates, role guard rendering, role persistence

- [ ] 5.0 Admin Dashboard & Navigation
  - [ ] 5.1 Create Admin layout: `app/(admin)/layout.tsx` with full-featured navbar, sidebar, and main content area
  - [ ] 5.2 Build Admin dashboard page: `app/(admin)/dashboard/page.tsx` with all projects overview, quick actions, team stats
  - [ ] 5.3 Create Admin navigation component: `components/navigation/admin-nav.tsx` with links to Projects, Teams, Settings, Analytics, Wizard
  - [ ] 5.4 Build Admin dashboard component: `components/dashboards/admin-dashboard.tsx` with project cards, workload charts, quick create buttons
  - [ ] 5.5 Implement project management section: Grid of project cards with edit/delete actions, team assignment visibility
  - [ ] 5.6 Add team management link: Route to dedicated team management page showing all teams with member lists
  - [ ] 5.7 Create quick action buttons: "Create Project" (opens wizard), "Invite User", "Create Team", "Assign Tasks"
  - [ ] 5.8 Build workload distribution view: Visual representation of tasks per team member with overload indicators
  - [ ] 5.9 Add alerts section: Display overdue tasks, quota warnings, pending invitations
  - [ ] 5.10 Implement organization selector: Dropdown to switch between organizations (for Admins in multiple orgs)
  - [ ] 5.11 Add dashboard filters: Filter projects by team, status, date range
  - [ ] 5.12 Implement real-time updates: Subscribe to Supabase Realtime for live project/task updates in Admin dashboard
  - [ ] 5.13 Write tests: Admin layout rendering, navigation links, permission checks, real-time updates

- [ ] 6.0 Member Dashboard & Navigation
  - [ ] 6.1 Create Member layout: `app/(member)/layout.tsx` with simplified navbar and task-focused layout
  - [ ] 6.2 Build Member dashboard page: `app/(member)/dashboard/page.tsx` with "My Tasks" as primary view
  - [ ] 6.3 Create Member navigation component: `components/navigation/member-nav.tsx` with links to My Tasks, Projects (limited), Profile
  - [ ] 6.4 Build Member dashboard component: `components/dashboards/member-dashboard.tsx` focused on assigned tasks, upcoming deadlines
  - [ ] 6.5 Implement "My Tasks" view: Task list filtered to current user, grouped by priority/due date, quick completion checkboxes
  - [ ] 6.6 Add task filters for Members: Filter by project, priority, due date, status
  - [ ] 6.7 Create task quick-edit: Inline editing for task description, status, priority without leaving dashboard
  - [ ] 6.8 Build project context cards: Show project info for tasks but without edit controls - project name, milestone, team members
  - [ ] 6.9 Add personal stats widget: Tasks completed this week, completion rate, upcoming deadlines count
  - [ ] 6.10 Implement task notifications panel: Show recent @mentions, new assignments, due date reminders
  - [ ] 6.11 Create task detail sidebar: Slide-out panel for viewing full task details, adding comments, uploading files
  - [ ] 6.12 Add calendar view: Optional view showing tasks on a calendar by due date
  - [ ] 6.13 Implement real-time task updates: Subscribe to Realtime for assigned task changes
  - [ ] 6.14 Write tests: Member layout, task filtering, permission restrictions, read-only project info

- [ ] 7.0 Viewer Dashboard & Navigation
  - [ ] 7.1 Create Viewer layout: `app/(viewer)/layout.tsx` with minimal navigation focused on reporting
  - [ ] 7.2 Build Viewer dashboard page: `app/(viewer)/dashboard/page.tsx` with high-level analytics and project status
  - [ ] 7.3 Create Viewer navigation component: `components/navigation/viewer-nav.tsx` with links to Dashboard, Reports, Analytics
  - [ ] 7.4 Build Viewer dashboard component: `components/dashboards/viewer-dashboard.tsx` emphasizing data visualization
  - [ ] 7.5 Implement project overview cards: Read-only project cards showing progress, status, key metrics
  - [ ] 7.6 Create completion metrics display: Project completion %, task completion %, team velocity using shadcn Progress and Card
  - [ ] 7.7 Build activity timeline for Viewers: Chronological view of project events (task completions, milestones reached)
  - [ ] 7.8 Add team performance widget: Stats on team members without ability to drill into individual tasks
  - [ ] 7.9 Create "View Only" banner: Persistent banner at top indicating read-only mode
  - [ ] 7.10 Implement data export for Viewers: "Request Export" button that notifies Admin to approve CSV export
  - [ ] 7.11 Build reports page: `app/(viewer)/reports/page.tsx` with pre-generated reports (completion stats, milestone progress)
  - [ ] 7.12 Add date range filters: Allow Viewers to filter analytics by date range
  - [ ] 7.13 Disable all interactive elements: Ensure no edit buttons, form inputs are read-only, no comment boxes
  - [ ] 7.14 Implement real-time analytics updates: Subscribe to Realtime for metrics updates
  - [ ] 7.15 Write tests: Viewer layout, read-only enforcement, analytics display, export request flow

- [ ] 8.0 Organization & Team Management (Admin Only)
  - [ ] 8.1 Create organization API routes with Admin checks: `app/api/organizations/route.ts` (POST, GET), `app/api/organizations/[id]/route.ts` (GET, PATCH, DELETE)
  - [ ] 8.2 Add middleware to organization routes: Verify requester is Admin before allowing operations
  - [ ] 8.3 Implement organization service functions: createOrganization (auto-assign creator as Admin), addMember with role, removeMember, transferOwnership
  - [ ] 8.4 Create email invitation system with role assignment: Generate tokens, send emails specifying invited role, accept endpoint creates user_organization_roles entry
  - [ ] 8.5 Build organization settings page: `app/(admin)/settings/page.tsx` with tabs for General, Members (with roles), Teams, Billing - Admin only
  - [ ] 8.6 Create member list with role indicators: Table showing all org members with role badges, Admin can change roles
  - [ ] 8.7 Build role assignment UI: Dropdown or radio buttons for Admin to assign/change user roles (Admin, Member, Viewer)
  - [ ] 8.8 Create team API routes with Admin checks: `app/api/teams/route.ts` and `app/api/teams/[id]/route.ts` - full CRUD, Admin only
  - [ ] 8.9 Implement team member management with roles: Add/remove members with role specification, validate permissions
  - [ ] 8.10 Build team management page: `app/(admin)/teams/page.tsx` with team list, create/edit dialogs, member lists with roles
  - [ ] 8.11 Create team role selector component: `components/teams/team-role-selector.tsx` for assigning roles to team members
  - [ ] 8.12 Handle team deletion flow: Prompt Admin to reassign members or confirm removal from associated projects
  - [ ] 8.13 Add RLS policies for organization and team tables: Enforce only Admins can edit
  - [ ] 8.14 Implement audit logging for role changes: Log when Admins assign/change roles for compliance
  - [ ] 8.15 Write tests: Organization CRUD (Admin only), team management (Admin only), role assignment, RLS enforcement, member invitation with roles

- [ ] 9.0 Project Creation Wizard (Admin Only)
  - [ ] 9.1 Protect wizard routes: Add middleware to `/admin/wizard` routes ensuring only Admins can access
  - [ ] 9.2 Design project templates with role suggestions: Templates include suggested role assignments (e.g., Marketing Campaign suggests: 1 Admin, 3 Members, 2 Viewers)
  - [ ] 9.3 Create wizard draft API routes with Admin check: `app/api/wizard/drafts/route.ts` validates requester is Admin
  - [ ] 9.4 Install shadcn Form components: Button, Input, Textarea, Select, Checkbox, Label, RadioGroup
  - [ ] 9.5 Create wizard step components: ProjectNameStep, ProjectDescriptionStep, MilestonesStep, TeamAssignmentWithRolesStep, DeadlineStep, TemplateSummaryStep
  - [ ] 9.6 Build role assignment step: `components/wizard/role-assignment-step.tsx` allowing Admin to assign roles to users/teams during project creation
  - [ ] 9.7 Implement user/team selection with role dropdowns: Checkboxes for selection + dropdown for role (Admin, Member, Viewer) per user/team
  - [ ] 9.8 Build main wizard component: `components/wizard/project-wizard.tsx` with multi-step form, progress indicator, role assignment integration
  - [ ] 9.9 Implement auto-save to localStorage and database: Save after each step including role assignments
  - [ ] 9.10 Add "Resume draft" detection: Check localStorage and Supabase for drafts, show AlertDialog
  - [ ] 9.11 Add "Save as Draft" button: Save progress with role assignments to database
  - [ ] 9.12 Implement wizard completion: Create project, create user_project_roles entries for all assigned users with specified roles, auto-generate tasks
  - [ ] 9.13 Add task pre-assignment in wizard: Allow Admin to pre-assign generated tasks to specific Members during wizard
  - [ ] 9.14 Create wizard page: `app/(admin)/wizard/page.tsx` rendering ProjectWizard
  - [ ] 9.15 Write tests: Wizard access (Admin only), role assignment, project creation with roles, Playwright E2E for full wizard with role assignments

- [ ] 10.0 Task Management with Role-Based Permissions
  - [ ] 10.1 Create task API routes with role validation: `app/api/tasks/route.ts` - GET filters by user role, POST checks Admin permission
  - [ ] 10.2 Implement role-based task filtering in GET endpoint: Admins see all, Members see only assigned tasks, Viewers see all (read-only)
  - [ ] 10.3 Add ownership validation in PATCH/DELETE: Members can only edit their assigned tasks, Admins can edit any task
  - [ ] 10.4 Build task wizard for Admins: `components/wizard/task-wizard.tsx` with assignee dropdown (restricted to Members) and role verification
  - [ ] 10.5 Create Admin task list: `components/tasks/task-item-admin.tsx` with full controls (edit, delete, reassign, change status)
  - [ ] 10.6 Create Member task item: `components/tasks/task-item-member.tsx` with limited controls (edit description, update status, add comments)
  - [ ] 10.7 Create Viewer task item: `components/tasks/task-item-viewer.tsx` completely read-only, grayed out, no interactive elements
  - [ ] 10.8 Build role-aware task detail component: `components/tasks/task-detail.tsx` rendering different views based on role
  - [ ] 10.9 Implement inline task editing for Members: Quick-edit form for description, status, priority on Member dashboard
  - [ ] 10.10 Add task completion toggle: Checkbox for Admins and assigned Members, disabled for Viewers
  - [ ] 10.11 Implement task reassignment (Admin only): Dropdown to change assignee, updates user_project_roles if needed
  - [ ] 10.12 Add bulk task operations for Admins: Select multiple tasks, bulk delete, bulk reassign, bulk status update
  - [ ] 10.13 Create RLS policies for tasks: Admins full access, Members see and edit own tasks, Viewers read-only
  - [ ] 10.14 Add task pages: `app/(admin)/tasks/page.tsx`, `app/(member)/tasks/page.tsx`, `app/(viewer)/tasks/page.tsx` with role-appropriate views
  - [ ] 10.15 Write tests: Task CRUD with role validation, ownership checks, filtering by role, bulk operations (Admin only), RLS enforcement

- [ ] 11.0 Collaboration Features with Role Restrictions
  - [ ] 11.1 Create comment API routes with role checks: `app/api/comments/route.ts` - POST validates Admin or Member role, GET filters by access
  - [ ] 11.2 Implement comment permissions: Only Admins and Members can create comments, Viewers can only read
  - [ ] 11.3 Build comment thread component: `components/comments/comment-thread.tsx` with conditional rendering (comment box hidden for Viewers)
  - [ ] 11.4 Implement @mentions with role awareness: Parse @username, validate mentioned user has project access, create role-appropriate notifications
  - [ ] 11.5 Add emoji reactions with role restrictions: Admins and Members can react, Viewers see reactions but cannot add
  - [ ] 11.6 Set up Cloudflare R2 integration: Create `lib/cloudflare-r2.ts` with uploadFile, deleteFile, generatePresignedUrl functions using @aws-sdk/client-s3
  - [ ] 11.7 Configure R2 client: Initialize S3Client with R2 endpoint (https://[account-id].r2.cloudflarestorage.com), credentials, and region config
  - [ ] 11.8 Create file upload endpoint with role validation: `app/api/files/upload/route.ts` - only Admins and Members can upload
  - [ ] 11.9 Implement presigned URL generation: Generate temporary upload/download URLs with 1-hour expiration
  - [ ] 11.10 Implement file attachment on tasks: File picker for Admins and Members, disabled/hidden for Viewers
  - [ ] 11.11 Add file preview support: All roles can view previews, only Admins and Members can delete files
  - [ ] 11.12 Enforce file upload limits: Check organization tier and user role before allowing upload (10MB Free, 25MB Starter/Growth)
  - [ ] 11.13 Create project chat panel: Reuse comments for project-level discussions, hide input box for Viewers
  - [ ] 11.14 Add unread comment indicators: Badge showing unread count, role-filtered (Admins see all, Members see own task comments)
  - [ ] 11.15 Implement RLS policies for comments: Admins and Members can create, all roles can read within project scope
  - [ ] 11.16 Add role badge to comment authors: Show if comment author is Admin, Member, or Viewer
  - [ ] 11.17 Write tests: Comment creation (role validation), @mentions, reactions (role restrictions), R2 file uploads (role validation), presigned URLs, Viewer read-only enforcement

- [ ] 12.0 Notifications with Role-Appropriate Content
  - [ ] 12.1 Create notification API routes: `app/api/notifications/route.ts` with role-based filtering
  - [ ] 12.2 Define role-specific notification triggers:
    - Admins: All project events, team changes, quota warnings, member requests
    - Members: Task assignments, @mentions on own tasks, task due dates, comments on own tasks
    - Viewers: Milestone completions, project status changes, weekly reports
  - [ ] 12.3 Implement notification creation logic with role routing: Check recipient role before creating notification
  - [ ] 12.4 Set up Resend email service: Create `lib/resend.ts` with sendEmail function, configure API key
  - [ ] 12.5 Install React Email: `npm install react-email @react-email/components`
  - [ ] 12.6 Create email templates using React Email in `emails/` directory:
    - `TaskAssigned.tsx` (for Members)
    - `ProjectCreated.tsx` (for Admins)
    - `MentionNotification.tsx` (all roles)
    - `DueReminder.tsx` (Admins and Members)
    - `WeeklyDigest.tsx` (Viewers)
  - [ ] 12.7 Build notification bell component with role indicator: `components/notifications/notification-bell.tsx` showing role-filtered notifications using Zustand store
  - [ ] 12.8 Create notification list UI with role context: Display different notification types per role, use role badge colors
  - [ ] 12.9 Implement notification preferences by role: Separate email settings for Admin notifications vs Member/Viewer notifications
  - [ ] 12.10 Add notification persistence with role metadata: Store role context with each notification for proper filtering
  - [ ] 12.11 Create notification cleanup job: Delete based on role and age (Admin notifications kept longer)
  - [ ] 12.12 Implement due date reminder job: Send to Admins (all tasks) and Members (own tasks only) using React Email templates
  - [ ] 12.13 Add real-time notifications with role filtering: Supabase Realtime subscription filtered by user role, update Zustand notification store
  - [ ] 12.14 Create notification digest for Viewers: Weekly summary email using React Email template with project highlights
  - [ ] 12.15 Write tests: Notification creation by role, Resend email sending to correct roles, React Email template rendering, role-based filtering, real-time delivery

- [ ] 13.0 Analytics with Role-Appropriate Views (PostHog Integration)
  - [ ] 13.1 Create PostHog utilities: `lib/posthog.ts` with helper functions for tracking role-specific events
  - [ ] 13.2 Implement role-based event tracking functions: trackAdminEvent, trackMemberEvent, trackViewerEvent with automatic role property inclusion
  - [ ] 13.3 Create usePostHog hook: `hooks/use-posthog.ts` that automatically includes current user role in all events
  - [ ] 13.4 Build PostHog Provider: `components/providers/posthog-provider.tsx` wrapping app with user identification and pageview tracking
  - [ ] 13.5 Implement user identification on login: Call posthog.identify() with user ID, email, name, and current role
  - [ ] 13.6 Set up organization group analytics: Use posthog.group('organization', orgId) to track organization-level behavior
  - [ ] 13.7 Implement key event tracking for Admin role:
    - 'project_created' - When admin creates project via wizard
    - 'wizard_completed' - Wizard flow completion with step duration
    - 'team_created' - Team management actions
    - 'role_assigned' - Role assignment to users
    - 'user_invited' - User invitation sent
    - 'task_assigned' - Task assignment to members
  - [ ] 13.8 Implement key event tracking for Member role:
    - 'task_completed' - Task marked as complete
    - 'task_updated' - Task details edited
    - 'comment_added' - Comment posted on task
    - 'file_uploaded' - File attached to task
    - 'mention_sent' - @mention used in comment
  - [ ] 13.9 Implement key event tracking for Viewer role:
    - 'dashboard_viewed' - Dashboard access
    - 'report_viewed' - Report opened
    - 'analytics_accessed' - Analytics tab viewed
    - 'export_requested' - Export request made
  - [ ] 13.10 Implement common event tracking for all roles:
    - 'login' - User authentication with role context
    - 'dashboard_switched' - Role/dashboard change event
    - 'search_performed' - Search query with role filter context
    - 'notification_clicked' - Notification interaction
  - [ ] 13.11 Add wizard step tracking: Track each wizard step completion for funnel analysis (step_name, step_duration, role)
  - [ ] 13.12 Create analytics API routes with role filtering: `app/api/analytics/admin/route.ts`, `app/api/analytics/member/route.ts`, `app/api/analytics/viewer/route.ts`
  - [ ] 13.13 Build Admin analytics component: `components/analytics/admin-analytics.tsx` with comprehensive project analytics, team performance, individual metrics, workload distribution
  - [ ] 13.14 Build Member analytics component: `components/analytics/member-analytics.tsx` with personal stats only (own task completion, time tracking, productivity)
  - [ ] 13.15 Build Viewer analytics component: `components/analytics/viewer-analytics.tsx` with high-level metrics (project health, team velocity, milestone progress)
  - [ ] 13.16 Implement role-specific progress indicators: Different metrics for each role (Admins see all, Members see personal, Viewers see aggregated)
  - [ ] 13.17 Create activity timeline with role filtering: Admins see all activities, Members see own activities, Viewers see milestone/project-level activities
  - [ ] 13.18 Add activity filtering by role: Date range and team member filters (available to Admins and Viewers only)
  - [ ] 13.19 Create role-specific stat cards: Different KPIs for each role using shadcn Card
  - [ ] 13.20 Implement CSV export with role restrictions: Admins can export all data, Members can export own tasks, Viewers request exports from Admins
  - [ ] 13.21 Add export approval flow for Viewers: Request button → notification to Admin → Admin approves → Viewer gets download link
  - [ ] 13.22 Set up PostHog custom dashboards: Create dashboards for Role Distribution, Wizard Completion Funnel, Feature Adoption, Project Health, Performance Metrics
  - [ ] 13.23 Configure PostHog person properties: Set properties for user_id, email, name, role, organization_id, organization_tier, signup_date, last_login
  - [ ] 13.24 Configure PostHog group properties: Set properties for organization (organization_id, name, tier, member_count, project_count, created_at)
  - [ ] 13.25 Create analytics pages: `app/(admin)/analytics/page.tsx`, `app/(member)/analytics/page.tsx`, `app/(viewer)/analytics/page.tsx`
  - [ ] 13.26 Write tests: Event tracking per role, analytics calculation, role-based filtering, CSV export permissions, PostHog integration, user identification, group analytics

- [ ] 14.0 AI Integration (Admin Only)
  - [ ] 14.1 Protect AI endpoints: Add middleware to all AI routes ensuring only Admins can access
  - [ ] 14.2 Set up OpenAI API: Install `npm install openai`, create `lib/openai.ts` with OpenAI client configuration
  - [ ] 14.3 Configure OpenAI client: Initialize with API key from environment variables, set organization ID if applicable
  - [ ] 14.4 Create AI service with Admin check: `lib/openai.ts` with Admin role validation before API calls
  - [ ] 14.5 Implement project template suggestions (Admin only): POST `/app/api/ai/suggest-template/route.ts` using GPT-3.5 Turbo with role check
  - [ ] 14.6 Build task breakdown generation (Admin only): POST `/app/api/ai/suggest-tasks/route.ts` using GPT-4 Turbo for Growth tier, GPT-3.5 for others
  - [ ] 14.7 Implement streaming responses: Use OpenAI streaming API for better UX during task generation, handle stream on client
  - [ ] 14.8 Create AI response caching: Store AI suggestions in Supabase with 24-hour TTL to reduce API costs
  - [ ] 14.9 Implement AI rate limiting per organization: Check tier and AI usage count, enforce limits (Free=5, Starter=25, Growth=100)
  - [ ] 14.10 Add predictive reminders with role targeting: Use GPT to analyze task patterns, send to Admins (all tasks) and Members (own tasks)
  - [ ] 14.11 Implement workload detection for Admins: Analyze team capacity using GPT-4, suggest reallocation to Admin only
  - [ ] 14.12 Build AI suggestion UI (Admin wizard only): Display streaming responses in project wizard with loading states
  - [ ] 14.13 Track AI usage with Admin attribution: Increment counter in organizations table, log which Admin used AI features
  - [ ] 14.14 Add AI budget monitoring per organization: Track OpenAI API costs, alert Admins if approaching $100/month limit
  - [ ] 14.15 Implement exponential backoff retry: Retry OpenAI API calls with exponential backoff on rate limit errors (429)
  - [ ] 14.16 Implement error handling: Gracefully handle OpenAI failures (network errors, rate limits) without blocking Admin workflow
  - [ ] 14.17 Add AI loading states in Admin UI: Skeleton loaders and progress indicators during AI processing
  - [ ] 14.18 Hide AI features from Member and Viewer dashboards: No AI suggestions or controls visible
  - [ ] 14.19 Write tests: AI endpoint access (Admin only), template suggestions, streaming responses, rate limiting, caching, error handling, retry logic, role enforcement

- [ ] 15.0 Quota Management & Billing (Admin Only)
  - [ ] 15.1 Create quota utilities with Admin checks: `lib/quota.ts` with checkQuota, updateUsage, enforceLimit - Admin operations only
  - [ ] 15.2 Implement quota middleware: Check org tier limits, require Admin role for quota modifications
  - [ ] 15.3 Add usage tracking across all roles: Track resources created by Admins, Members' task completions, Viewers' report accesses
  - [ ] 15.4 Create usage API route (Admin only): GET `/app/api/organizations/[id]/usage/route.ts` accessible only to Admins
  - [ ] 15.5 Build usage dashboard (Admin settings): Show Progress bars for projects, storage, AI, users - Admin-only view
  - [ ] 15.6 Implement limit warnings to Admins: At 80% and 95% usage, notify Admins only via email and in-app
  - [ ] 15.7 Add grace period logic (Admin managed): When limits exceeded, Admins receive notifications and manage grace period
  - [ ] 15.8 Create grace period job: Check expired periods, notify Admins, block resource creation by all roles
  - [ ] 15.9 Build tier upgrade UI (Admin only): Settings page with tier comparison, upgrade button for Admins
  - [ ] 15.10 Implement quota enforcement across roles: When quota exceeded, prevent Admins from creating projects, Members can't be assigned new tasks
  - [ ] 15.11 Add storage calculation: Track file uploads by all roles, attribute to organization quota
  - [ ] 15.12 Create billing page (Admin only): `app/(admin)/billing/page.tsx` with usage, tier, and payment info
  - [ ] 15.13 Display quota limits in UI per role: Admins see full details, Members see simple status, Viewers see nothing
  - [ ] 15.14 Write tests: Quota checking, usage tracking by role, grace period (Admin notifications), tier upgrades (Admin only), enforcement across roles

- [ ] 16.0 Search with Role-Based Filtering
  - [ ] 16.1 Create search API route with role filtering: `app/api/search/route.ts` - Admins search all, Members search own content, Viewers search visible content
  - [ ] 16.2 Add role-based search indexes: Create GIN indexes in Supabase with role-aware queries
  - [ ] 16.3 Implement search with role-specific results:
    - Admins: Search all projects, tasks, comments, users
    - Members: Search assigned tasks, projects they're in, own comments
    - Viewers: Search visible projects, tasks (read-only), comments (read-only)
  - [ ] 16.4 Build role-aware search UI component: Input with role indicator, results grouped by type with role badges
  - [ ] 16.5 Create search results dropdown: Popover showing role-appropriate results with permission indicators
  - [ ] 16.6 Add result highlighting: Mark matching terms, indicate access level with role badges
  - [ ] 16.7 Implement keyboard shortcuts: Cmd/Ctrl+K with role-aware search scope indicator
  - [ ] 16.8 Create advanced search pages: `app/(admin)/search/page.tsx`, `app/(member)/search/page.tsx`, `app/(viewer)/search/page.tsx` with role-appropriate filters
  - [ ] 16.9 Add role-specific filters: Admins can filter by assignee, Members can't, Viewers can filter by project/date only
  - [ ] 16.10 Implement search result limits per role: Admins unlimited, Members 100 results, Viewers 50 results
  - [ ] 16.11 Add saved filters with role context: Save filter preferences per role
  - [ ] 16.12 Write tests: Search filtering by role, result grouping, access level validation, keyboard shortcuts

- [ ] 17.0 Data Lifecycle & Soft Delete with Role Permissions
  - [ ] 17.1 Implement soft-delete utilities: `lib/soft-delete.ts` with role checks (only Admins can delete)
  - [ ] 17.2 Update delete API routes with Admin validation: Only Admins can soft-delete projects, tasks, comments
  - [ ] 17.3 Add includeDeleted query parameter (Admin only): Admins can view deleted items, other roles cannot
  - [ ] 17.4 Display deleted projects with badge (Admin only): Show "Deleted" Badge in Admin dashboard, hidden from Members/Viewers
  - [ ] 17.5 Implement one-click restore (Admin only): "Restore" Button in Admin dashboard
  - [ ] 17.6 Create permanent deletion job: Automatically delete records >30 days old, log Admin who originally deleted
  - [ ] 17.7 Implement Cloudflare R2 file cleanup: Remove files from R2 bucket when entities permanently deleted using deleteFile function
  - [ ] 17.8 Configure R2 lifecycle rules: Set up automatic deletion of orphaned files after 30 days in Cloudflare dashboard
  - [ ] 17.9 Add pre-deletion warning emails (to Admins): 7 days before permanent deletion, notify Admins using Resend + React Email
  - [ ] 17.10 Handle deleted user cleanup across roles: When user deleted, update role assignments, preserve content
  - [ ] 17.11 Add deleted filter toggle (Admin only): Switch to show deleted items in Admin dashboard
  - [ ] 17.12 Update RLS policies: Ensure only Admins can see deleted items
  - [ ] 17.13 Write tests: Soft delete (Admin only), restore (Admin only), permanent deletion, R2 file cleanup, role enforcement

- [ ] 18.0 PWA & Offline Support (All Roles)
  - [ ] 18.1 Install next-pwa: Configure with basic Workbox settings
  - [ ] 18.2 Create PWA manifest: Define app name, icons, theme colors, role-appropriate descriptions
  - [ ] 18.3 Add manifest to layout: Link in all role-specific layouts
  - [ ] 18.4 Configure service worker with role caching: Different caching strategies per role (Admins cache more, Viewers cache reports)
  - [ ] 18.5 Cache API responses by role: Admin caches all data, Member caches own tasks, Viewer caches analytics
  - [ ] 18.6 Implement offline detection: `hooks/use-online-status.ts` for all roles
  - [ ] 18.7 Create offline banner: Show in all dashboards with role-appropriate messaging
  - [ ] 18.8 Disable editing when offline: Block Admin/Member actions, Viewer already read-only
  - [ ] 18.9 Create offline fallback page: Role-aware message explaining limited functionality
  - [ ] 18.10 Add app icons: Generate icon sets for all platforms
  - [ ] 18.11 Test PWA installation: Verify on all platforms, test role-specific caching
  - [ ] 18.12 Write tests: Service worker by role, cache behavior, offline detection across roles

- [ ] 19.0 GDPR Compliance with Role Considerations
  - [ ] 19.1 Create data export API with role filtering: Generate JSON export of user data scoped to their role
  - [ ] 19.2 Implement account deletion with role cleanup: Remove user from all role assignments, anonymize contributions
  - [ ] 19.3 Handle Admin deletion specially: Transfer Admin ownership or require org owner reassignment before deletion
  - [ ] 19.4 Create cookie consent banner: Same for all roles
  - [ ] 19.5 Build privacy policy page: Document role-based data access
  - [ ] 19.6 Create terms of service: Include role responsibilities and permissions
  - [ ] 19.7 Add data portability by role: CSV/JSON export scoped to role permissions
  - [ ] 19.8 Build GDPR settings page: Show data stored, role assignments, export buttons
  - [ ] 19.9 Implement right to rectification: All roles can edit own profile, Admins can edit org settings
  - [ ] 19.10 Add account deletion flow with role warnings: Explain impact on team if deleting Admin account
  - [ ] 19.11 Create data retention documentation: Specify retention per role (Admin data kept longer for audit)
  - [ ] 19.12 Write tests: Data export by role, account deletion, role cleanup, anonymization

- [ ] 20.0 Onboarding with Role-Specific Tutorials
  - [ ] 20.1 Create role detection on first login: Redirect to appropriate onboarding based on assigned role
  - [ ] 20.2 Build Admin onboarding tour: `components/onboarding/admin-tour.tsx` teaching project creation, team management, task assignment
  - [ ] 20.3 Create sample project for Admins: Pre-loaded with demo tasks, team assignments, role examples
  - [ ] 20.4 Build Member onboarding tour: `components/onboarding/member-tour.tsx` teaching task viewing, status updates, commenting
  - [ ] 20.5 Create sample tasks for Members: Pre-assigned demo tasks showing how to complete, comment, upload files
  - [ ] 20.6 Build Viewer onboarding tour: `components/onboarding/viewer-tour.tsx` teaching analytics navigation, report viewing
  - [ ] 20.7 Create sample analytics for Viewers: Pre-populated dashboard showing example metrics
  - [ ] 20.8 Add role-specific tooltips: Contextual help during first use of features
  - [ ] 20.9 Implement dismissible onboarding: Allow users to skip or replay tours
  - [ ] 20.10 Create role-badge explanation: Tooltip explaining what each role can do
  - [ ] 20.11 Add help center links per role: Different help documentation for Admin/Member/Viewer
  - [ ] 20.12 Write tests: Onboarding flow per role, sample data creation, tour progression

- [ ] 21.0 Role-Based Testing & Quality Assurance
  - [ ] 21.1 Write role-specific component tests: Test all three variants of components (Admin/Member/Viewer views)
  - [ ] 21.2 Test RBAC utilities: Verify getUserRole, checkPermission, hasRole functions work correctly
  - [ ] 21.3 Write API route tests with role validation: Test all endpoints with Admin, Member, Viewer tokens
  - [ ] 21.4 Create E2E test suite for Admin role: Playwright tests for project creation, team management, task assignment
  - [ ] 21.5 Create E2E test suite for Member role: Test task viewing, editing own tasks, commenting
  - [ ] 21.6 Create E2E test suite for Viewer role: Test read-only access, analytics viewing, export requests
  - [ ] 21.7 Test role-based routing: Verify /admin routes blocked for non-Admins, etc.
  - [ ] 21.8 Test RLS policies exhaustively: Verify data access rules for all three roles
  - [ ] 21.9 Test role switching: Verify users with multiple roles can switch dashboards correctly
  - [ ] 21.10 Test quota enforcement across roles: Verify limits prevent actions by all roles appropriately
  - [ ] 21.11 Test notification routing by role: Verify correct notifications go to correct roles
  - [ ] 21.12 Test dashboard rendering performance: Each role's dashboard should load quickly
  - [ ] 21.13 Perform accessibility testing per role: Keyboard nav, screen readers for all three dashboards
  - [ ] 21.14 Conduct manual QA by role: Have testers use each role exclusively for realistic testing
  - [ ] 21.15 Set up CI/CD with role-based test suites: Separate test jobs for Admin, Member, Viewer flows
  - [ ] 21.16 Add code coverage by role: Track coverage for role-specific code paths
  - [ ] 21.17 Test PostHog event tracking: Verify all role-specific events fire correctly with proper properties
  - [ ] 21.18 Test PostHog user identification: Verify posthog.identify() called on login with correct data
  - [ ] 21.19 Test PostHog group analytics: Verify organization-level tracking works correctly

- [ ] 22.0 Deployment & Monitoring with Role Tracking
  - [ ] 22.1 Prepare Supabase for production: Verify all migrations including role tables applied
  - [ ] 22.2 Configure Cloudflare R2 for production: Verify CORS settings, set up lifecycle rules for automatic cleanup, confirm bucket policies
  - [ ] 22.3 Set up Vercel project: Import GitHub repo, configure build settings, set framework preset to Next.js
  - [ ] 22.4 Configure production environment variables: Add all env vars in Vercel dashboard (Supabase keys, Cloudflare R2 credentials, OpenAI API key, Resend API key, PostHog keys)
  - [ ] 22.5 Set up custom domain: Add domain in Vercel, configure DNS, enable auto-SSL
  - [ ] 22.6 Configure Vercel Cron Jobs: Set up cron schedules for cleanup (daily), grace period checks (daily), reminders (hourly)
  - [ ] 22.7 Set up Resend in production: Verify sending domain in Resend dashboard, configure DKIM and SPF records in DNS
  - [ ] 22.8 Test React Email templates in production: Send test emails for all template types (task assigned, mention, digest)
  - [ ] 22.9 Configure PostHog in production: Verify PostHog API key in production env, test event tracking works, set up role-based dashboards in PostHog UI
  - [ ] 22.10 Set up error tracking: Configure Sentry (or Vercel Analytics) for both frontend and API routes, test error capture
  - [ ] 22.11 Enable Vercel Web Analytics: Turn on Web Analytics in Vercel dashboard for performance monitoring
  - [ ] 22.12 Set up uptime monitoring: Configure UptimeRobot or similar to monitor homepage and API health endpoint
  - [ ] 22.13 Configure database backups: Enable Supabase automatic backups (should be on by default), verify backup schedule
  - [ ] 22.14 Create health check endpoints: `app/api/health/route.ts` returning status, `app/api/health/db/route.ts` checking Supabase connection, `app/api/health/r2/route.ts` checking R2 connectivity
  - [ ] 22.15 Test deployment with all roles: Register test users, assign roles, verify each dashboard, test file uploads to R2, test OpenAI integration, verify PostHog tracking
  - [ ] 22.16 Verify Cron jobs: Check Vercel logs to ensure scheduled jobs are running correctly
  - [ ] 22.17 Set up PostHog monitoring dashboards: Create custom dashboards showing wizard completion funnel, role distribution, feature adoption rates, performance metrics
  - [ ] 22.18 Create deployment runbook: Document deployment process, rollback procedure, environment variable checklist
  - [ ] 22.19 Configure Vercel preview deployments: Ensure preview URLs work for testing PR changes before merging
  - [ ] 22.20 Set up production alerts: Configure Sentry alerts for critical errors, Vercel alerts for deployment failures, Resend webhooks for email delivery failures
  - [ ] 22.21 Verify OpenAI API budget monitoring: Check usage dashboard, set up alerts if approaching $100/month
  - [ ] 22.22 Test Cloudflare R2 performance: Verify upload/download speeds, presigned URL generation, file cleanup
  - [ ] 22.23 Verify PostHog is tracking production events: Check PostHog dashboard for live events, verify person profiles are being created, confirm group analytics working
  - [ ] 22.24 Create post-deployment checklist: Verify role-based routing, RLS policies, role assignments, file storage, email delivery, AI features, PostHog tracking

---

## Development Phases & Estimated Timeline (Updated for Role-Based Architecture)

Based on the PRD estimate of 14-18 weeks for MVP with role-based dashboards:

### Phase 1: Foundation & Role Infrastructure (Weeks 1-3)
- Tasks 1.0, 2.0, 3.0, 4.0 - Infrastructure, database with role tables, authentication with role detection, role state management
- **Milestone**: Developers can register, be assigned roles, login with role detection, and access role-appropriate API endpoints. PostHog tracking initialized.

### Phase 2: Dashboard Shells & Navigation (Weeks 4-5)
- Tasks 5.0, 6.0, 7.0 - Admin, Member, and Viewer dashboard layouts with role-specific navigation
- **Milestone**: Three distinct dashboards render correctly with proper navigation for each role. PostHog tracking dashboard views.

### Phase 3: Core Data Models & Permissions (Weeks 6-8)
- Tasks 8.0, 9.0, 10.0 - Organizations with role assignment, Admin project wizard with role assignment, task management with role-based permissions
- **Milestone**: Admins can create projects and assign roles, Members can edit own tasks, Viewers have read-only access. PostHog tracks wizard completion funnel.

### Phase 4: Collaboration & Notifications (Weeks 9-11)
- Tasks 11.0, 12.0 - Comments/files with role restrictions, notifications with role-appropriate content
- **Milestone**: Team collaboration works with proper role restrictions, notifications routed correctly by role. PostHog tracks collaboration events.

### Phase 5: Analytics & Advanced Features (Weeks 12-14)
- Tasks 13.0, 14.0, 15.0, 16.0 - PostHog analytics integration, AI for Admins only, quota management (Admin only), search with role filtering
- **Milestone**: PostHog fully integrated with role-based tracking, Admin AI features work, quotas enforced, search respects roles

### Phase 6: Polish & Compliance (Weeks 15-16)
- Tasks 17.0, 18.0, 19.0, 20.0 - Soft-delete (Admin only), PWA, GDPR compliance, role-specific onboarding
- **Milestone**: App is installable, GDPR compliant, onboarding guides users per role. PostHog tracks onboarding completion.

### Phase 7: Testing & Deployment (Weeks 17-18)
- Tasks 21.0, 22.0 - Comprehensive role-based testing, production deployment with role monitoring
- **Milestone**: MVP deployed with all three role dashboards functional and tested. PostHog production monitoring active.

---

## Priority Recommendations (Updated)

### Must-Have for MVP Launch
- Tasks 1.0-7.0 (Infrastructure through all three dashboard shells, including PostHog setup)
- Task 8.0 (Organization & team management with role assignment)
- Task 9.0 (Admin wizard with role assignment)
- Task 10.0 (Task management with role permissions)
- Task 11.0 (Comments/files with role restrictions)
- Task 12.0 (Notifications with role routing)
- Task 13.0 (PostHog analytics with role-based event tracking)
- Task 21.0 (Core role-based testing including PostHog event verification)
- Task 22.0 (Deployment with role monitoring and PostHog production setup)

### Should-Have (Can launch without, but add quickly)
- Task 14.0 (AI for Admins - differentiator)
- Task 15.0 (Quota management - Admin feature)
- Task 16.0 (Search with role filtering - improves UX)
- Task 20.0 (Role-specific onboarding - reduces confusion)

### Nice-to-Have (Post-MVP)
- Task 17.0 (Soft-delete Admin features)
- Task 18.0 (Full PWA offline mode)
- Task 19.0 (GDPR - required for EU but can be added post-MVP for US launch)
- PostHog Session Replay (for UX debugging)
- PostHog Feature Flags (for gradual feature rollout)
- Advanced role features (custom roles, granular permissions)
- Dashboard customization per role
- Cross-project views for Members

---

## Notes for Developers

### Role-Based Development Strategy
- **Always think role-first**: Before building any feature, consider: "Which roles can access this?"
- **Test with all three roles**: Every feature must be tested with Admin, Member, and Viewer accounts
- **Use RoleGuard everywhere**: Wrap components in RoleGuard to ensure proper rendering
- **Leverage RLS**: Let Supabase RLS handle data filtering - don't rely only on frontend checks

### Role Testing Checklist
For every new feature, verify:
1. ✅ Admin can perform all actions
2. ✅ Member can perform only allowed actions
3. ✅ Viewer cannot perform any write actions
4. ✅ RLS policies enforce permissions at database level
5. ✅ API routes validate role before processing
6. ✅ UI elements are hidden/disabled appropriately per role
7. ✅ PostHog events fire correctly with role property

### Database Management
- **Migrations**: `supabase migration new <name>` for role-related schema changes
- **Apply migrations**: `supabase db push`
- **Generate types**: `supabase gen types typescript --local > lib/database.types.ts` (includes role enums)
- **Seed with roles**: Ensure seed script creates users with all three roles for testing

### Role Constants & Types
```typescript
// Use these constants throughout the app
export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer'
}

// Permission checking
export const RolePermissions = {
  [UserRole.ADMIN]: ['create', 'read', 'update', 'delete', 'assign_roles'],
  [UserRole.MEMBER]: ['read', 'update_own', 'comment', 'upload'],
  [UserRole.VIEWER]: ['read']
};
```

### shadcn/ui with Role Awareness
- Add components: `npx shadcn-ui@latest add <component-name>`
- Customize components to accept `userRole` prop
- Example: `<Button disabled={userRole === 'viewer'}>Edit</Button>`

### Environment Setup
Same as before, plus:
- Ensure role enums are properly defined in Supabase
- Seed database with test users in all three roles
- Test each dashboard separately during development
- Configure Cloudflare R2 credentials correctly (endpoint, account ID, access keys)
- Set up OpenAI API key with appropriate usage limits
- Configure Resend with verified sending domain
- **Set up PostHog project and add API keys to .env.local**

### PostHog Setup & Integration

#### Installation
```bash
# Option 1: Automated wizard (recommended)
npx -y @posthog/wizard@latest

# Option 2: Manual installation
npm install posthog-js
```

#### Environment Variables
Add to `.env.local`:
```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com  # or eu.i.posthog.com
```

#### Initialization (Next.js 15.3+)
Create `instrumentation-client.ts` in project root:
```typescript
// instrumentation-client.ts
import posthog from 'posthog-js'

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  defaults: '2025-05-24',
  person_profiles: 'identified_only',
  capture_pageview: false, // We'll do this manually with role context
  capture_pageleave: true,
})
```

#### Role-Based Event Tracking
Create helper utilities in `lib/posthog.ts`:
```typescript
import posthog from 'posthog-js'
import { UserRole } from './rbac'

export const trackRoleEvent = (
  eventName: string,
  role: UserRole,
  properties?: Record<string, any>
) => {
  posthog.capture(eventName, {
    role,
    ...properties,
  })
}

// Specific event helpers
export const trackAdminEvent = {
  projectCreated: (projectId: string) =>
    trackRoleEvent('project_created', UserRole.ADMIN, { projectId }),
  teamCreated: (teamId: string) =>
    trackRoleEvent('team_created', UserRole.ADMIN, { teamId }),
  roleAssigned: (userId: string, role: UserRole) =>
    trackRoleEvent('role_assigned', UserRole.ADMIN, { targetUser: userId, assignedRole: role }),
  wizardCompleted: (duration: number, steps: number) =>
    trackRoleEvent('wizard_completed', UserRole.ADMIN, { duration, steps }),
}

export const trackMemberEvent = {
  taskCompleted: (taskId: string, duration?: number) =>
    trackRoleEvent('task_completed', UserRole.MEMBER, { taskId, duration }),
  commentAdded: (taskId: string, length: number) =>
    trackRoleEvent('comment_added', UserRole.MEMBER, { taskId, commentLength: length }),
  fileUploaded: (taskId: string, fileSize: number, fileType: string) =>
    trackRoleEvent('file_uploaded', UserRole.MEMBER, { taskId, fileSize, fileType }),
}

export const trackViewerEvent = {
  reportViewed: (reportId: string) =>
    trackRoleEvent('report_viewed', UserRole.VIEWER, { reportId }),
  analyticsAccessed: () =>
    trackRoleEvent('analytics_accessed', UserRole.VIEWER),
  exportRequested: (dataType: string) =>
    trackRoleEvent('export_requested', UserRole.VIEWER, { dataType }),
}

// Common events for all roles
export const trackCommonEvent = {
  login: (role: UserRole) =>
    trackRoleEvent('login', role),
  dashboardSwitched: (fromRole: UserRole, toRole: UserRole) =>
    posthog.capture('dashboard_switched', { fromRole, toRole }),
  searchPerformed: (query: string, role: UserRole, resultsCount: number) =>
    trackRoleEvent('search_performed', role, { query, resultsCount }),
  notificationClicked: (notificationType: string, role: UserRole) =>
    trackRoleEvent('notification_clicked', role, { notificationType }),
}
```

#### User Identification
In your auth hook/store, identify users after login:
```typescript
// After successful login
import posthog from 'posthog-js'
import { useAuthStore } from '@/store/auth-store'
import { useRoleStore } from '@/store/role-store'

// In your login handler
const handleLogin = async (user) => {
  // ... login logic
  
  // Identify user in PostHog
  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    role: currentRole,
    signup_date: user.created_at,
  })

  // Set organization as a group
  posthog.group('organization', user.organizationId, {
    name: organization.name,
    tier: organization.tier,
    member_count: organization.memberCount,
    created_at: organization.created_at,
  })
}
```

#### PostHog Provider Component
Create `components/providers/posthog-provider.tsx`:
```typescript
'use client'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { useAuthStore } from '@/store/auth-store'
import { useRoleStore } from '@/store/role-store'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const user = useAuthStore((state) => state.user)
  const currentRole = useRoleStore((state) => state.currentRole)

  // Track pageviews with role context
  useEffect(() => {
    if (pathname && user) {
      posthog.capture('$pageview', {
        role: currentRole,
        path: pathname,
      })
    }
  }, [pathname, searchParams, currentRole, user])

  // Identify user on mount
  useEffect(() => {
    if (user) {
      posthog.identify(user.id, {
        email: user.email,
        name: user.name,
        role: currentRole,
      })
    }
  }, [user, currentRole])

  return <>{children}</>
}
```

Add to your root layout:
```typescript
// app/layout.tsx
import { PostHogProvider } from '@/components/providers/posthog-provider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}
```

#### Custom Hook
Create `hooks/use-posthog.ts`:
```typescript
import { useCallback } from 'react'
import posthog from 'posthog-js'
import { useRoleStore } from '@/store/role-store'

export function usePostHog() {
  const currentRole = useRoleStore((state) => state.currentRole)

  const trackEvent = useCallback(
    (eventName: string, properties?: Record<string, any>) => {
      posthog.capture(eventName, {
        role: currentRole,
        ...properties,
      })
    },
    [currentRole]
  )

  return { trackEvent, posthog }
}
```

#### Usage in Components
```typescript
'use client'
import { usePostHog } from '@/hooks/use-posthog'
import { trackAdminEvent } from '@/lib/posthog'

export function ProjectCard({ project }) {
  const { trackEvent } = usePostHog()

  const handleEdit = () => {
    trackEvent('project_edit_clicked', { projectId: project.id })
    // ... edit logic
  }

  const handleComplete = () => {
    // Using helper function
    trackAdminEvent.projectCreated(project.id)
    // ... completion logic
  }

  return (
    <div>
      <button onClick={handleEdit}>Edit Project</button>
      <button onClick={handleComplete}>Complete</button>
    </div>
  )
}
```

#### Wizard Step Tracking
```typescript
// In your wizard component
import { trackAdminEvent } from '@/lib/posthog'

const handleStepComplete = (stepName: string, stepDuration: number) => {
  posthog.capture('wizard_step_completed', {
    role: 'admin',
    step_name: stepName,
    step_duration: stepDuration,
    step_number: currentStep,
  })
}

const handleWizardComplete = () => {
  trackAdminEvent.wizardCompleted(totalDuration, totalSteps)
}
```

### Key PostHog Events to Track

**Admin Events:**
- `project_created` - When admin creates project
- `wizard_completed` - Wizard flow completion
- `wizard_step_completed` - Each wizard step
- `team_created` - Team management
- `role_assigned` - Role assignment
- `user_invited` - User invitation sent
- `task_assigned` - Task assignment

**Member Events:**
- `task_completed` - Task marked complete
- `task_updated` - Task details edited
- `comment_added` - Comment posted
- `file_uploaded` - File attached to task
- `mention_sent` - @mention used

**Viewer Events:**
- `dashboard_viewed` - Dashboard access
- `report_viewed` - Report opened
- `analytics_accessed` - Analytics tab viewed
- `export_requested` - Export request made

**Common Events (All Roles):**
- `login` - User authentication
- `dashboard_switched` - Role/dashboard change
- `search_performed` - Search query
- `notification_clicked` - Notification interaction

### PostHog Custom Dashboards to Create

1. **Role Distribution Dashboard**
   - Active users by role (pie chart)
   - Role switching patterns (sankey diagram)
   - Time spent per role (bar chart)

2. **Wizard Completion Funnel**
   - Step-by-step completion rates
   - Drop-off points identification
   - Average time per step
   - Completion rates by organization tier

3. **Feature Adoption Dashboard**
   - Feature usage by role
   - Adoption rates over time
   - Most/least used features per role

4. **Project Health Dashboard**
   - Project creation rate
   - Task completion rate
   - Team collaboration metrics (comments, file uploads)
   - Average project duration

5. **Performance Metrics**
   - Dashboard load times by role
   - API response times
   - Error rates by endpoint
   - Real-time active users

### PostHog Best Practices for This Project

1. **Always include role context** - Every event should have the user's current role
2. **Group by organization** - Use PostHog groups for organization-level analytics
3. **Track wizard steps** - Each wizard step should fire an event for funnel analysis
4. **Session replay (post-MVP)** - Enable for debugging role-switching issues
5. **Feature flags (post-MVP)** - Use for testing role-specific features
6. **Custom dashboards** - Create separate dashboards for Admin/Member/Viewer metrics
7. **Funnel analysis** - Track wizard completion, onboarding completion per role
8. **Never track sensitive data** - No passwords, API keys, or personal data in events

### Zustand State Management
All state is managed with Zustand stores - no React Context needed:
```typescript
// Example: Role Store
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RoleStore {
  currentRole: 'admin' | 'member' | 'viewer';
  availableRoles: Array<'admin' | 'member' | 'viewer'>;
  setRole: (role: 'admin' | 'member' | 'viewer') => void;
}

export const useRoleStore = create<RoleStore>()(
  persist(
    (set) => ({
      currentRole: 'member',
      availableRoles: ['member'],
      setRole: (role) => set({ currentRole: role }),
    }),
    { name: 'role-storage' }
  )
);
```

### Cloudflare R2 Setup
R2 is S3-compatible, so use @aws-sdk/client-s3:
```typescript
import { S3Client } from '@aws-sdk/client-s3';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});
```

### OpenAI Integration
Use the official OpenAI SDK with streaming:
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Streaming example
const stream = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [{ role: 'user', content: 'Suggest tasks for...' }],
  stream: true,
});
```

### Resend + React Email
Create type-safe email templates:
```typescript
// emails/TaskAssigned.tsx
import { Html, Button } from '@react-email/components';

export const TaskAssigned = ({ taskName, projectName }) => (
  <Html>
    <h1>New Task Assigned</h1>
    <p>You've been assigned: {taskName}</p>
    <Button href="https://app.com/tasks">View Task</Button>
  </Html>
);

// lib/resend.ts
import { Resend } from 'resend';
import { TaskAssigned } from '@/emails/TaskAssigned';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'notifications@yourdomain.com',
  to: user.email,
  subject: 'New Task Assigned',
  react: TaskAssigned({ taskName, projectName }),
});
```

### Common Pitfalls to Avoid
1. **Forgetting role checks**: Always validate role on both frontend AND backend
2. **Not using RLS**: Don't rely solely on application logic - enforce with RLS policies
3. **Hardcoding role logic**: Use constants and utilities, not string literals
4. **Ignoring role context**: Remember users can have different roles in different projects
5. **Incomplete testing**: Must test each feature with all three roles
6. **Missing role indicators**: Always show users which role they're currently in
7. **Forgetting PostHog tracking**: Add event tracking as you build, not as an afterthought
8. **Not testing PostHog events**: Verify events fire correctly in development before deploying

### Getting Help
- **PRD Reference**: Updated PRD v2.1 with PostHog integration and role-based architecture
- **Role Architecture**: Section 7.2 in PRD
- **Permissions Matrix**: Section 4.8 in PRD
- **PostHog Configuration**: Section 7.6 in PRD
- **Supabase RLS**: https://supabase.com/docs/guides/auth/row-level-security
- **PostHog Docs**: https://posthog.com/docs
- **Role-Based Testing**: Playwright examples in e2e/role-*.spec.ts files

---

**Task List Complete**: 22 parent tasks with 260+ actionable sub-tasks ready for implementation with full role-based dashboard architecture and PostHog analytics integration. Estimated timeline: 14-18 weeks for MVP.