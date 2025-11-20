# Product Requirements Document: Wizard-Based Project & Task Management App
## UPDATED: Role-Based Dashboard Architecture

## 1. Introduction/Overview

This document outlines the requirements for a conversational, wizard-driven project and task management web application. Unlike traditional project management tools that rely on complex forms and cluttered dashboards, this app uses a Typeform-style interactive wizard to guide users through project creation and task assignment in 3-5 minutes.

**Problem Statement:** Small teams, startups, freelancers, and non-technical managers find existing project management tools (Jira, Asana, ClickUp) overwhelming and time-consuming to set up. The friction of manual configuration prevents quick project initialization.

**Solution:** A web app that streamlines project setup through conversational UI, intelligent defaults, and smart automation, making project management accessible and efficient. Each user experiences a role-appropriate dashboard tailored to their responsibilities.

---

## 2. Goals

1. Enable users to create fully structured projects with tasks, milestones, and team assignments in under 5 minutes
2. Reduce onboarding friction by 80% compared to traditional PM tools through wizard-based UX
3. **Provide role-specific dashboards that show only relevant information and actions for Admin, Member, and Viewer roles**
4. Support team collaboration through simple commenting, mentions, and file sharing
5. Deliver actionable insights through visual analytics and automated reports
6. Enable offline access and real-time sync via Progressive Web App (PWA) technology
7. Integrate seamlessly with email and WhatsApp for notifications

---

## 3. User Stories

### Core User Workflows

**As an Admin**, I want to create projects through a conversational wizard and assign tasks to my team so that I can manage all work from a centralized dashboard.

**As an Admin**, I want to see all projects, manage team members, and control project settings so that I maintain oversight of organizational work.

**As a Member**, I want to see only the tasks assigned to me and projects I'm working on so that I can focus on my responsibilities without distractions.

**As a Member**, I want to update task status, add comments, and upload files so that I can collaborate effectively with my team.

**As a Viewer**, I want to see project progress and team activities in read-only mode so that I can stay informed without accidentally making changes.

**As a Viewer**, I want to access analytics and reports so that I can monitor performance and generate insights for stakeholders.

**As any user**, I want to receive notifications about relevant activities via email and browser push so that I stay informed about my work.

**As a freelancer (Admin role)**, I want to use pre-built project templates so that I can quickly structure common project types.

**As a team member (Member role)**, I want a simple dashboard showing my tasks and deadlines so that I can prioritize my work without navigating complex interfaces.

---

## 4. Functional Requirements

### 4.1 User Authentication & Account Management

**REQ-4.1.1:** The system must support user registration via email/password.

**REQ-4.1.2:** The system must support social login via Google and Microsoft accounts.

**REQ-4.1.3:** All users register through the same signup flow - role assignment happens after account creation when they are added to projects or organizations.

**REQ-4.1.4:** The system must allow users to reset passwords via email verification link.

**REQ-4.1.5:** The system must maintain secure session management with token-based authentication.

**REQ-4.1.6:** The system must allow users to update their profile (name, avatar, email, notification preferences).

**REQ-4.1.7:** Upon login, the system must detect the user's primary role and route them to the appropriate dashboard (Admin, Member, or Viewer).

**REQ-4.1.8:** If a user has multiple roles across different projects, the system must default to the highest permission level for the default view.

### 4.2 Role-Based Dashboard System

**REQ-4.2.1:** The system must provide three distinct dashboard experiences based on user role:
- **Admin Dashboard**: Full project management, team management, settings, and analytics
- **Member Dashboard**: Task-focused view with assigned work, collaboration features, and limited project context
- **Viewer Dashboard**: Read-only overview with analytics, reports, and project status monitoring

**REQ-4.2.2:** The system must dynamically render navigation, features, and UI elements based on the user's role in the current context.

**REQ-4.2.3:** When a user switches between projects where they have different roles, the system must adjust the dashboard accordingly.

**REQ-4.2.4:** The system must clearly indicate the current role to the user with a visible badge or indicator in the navigation bar.

**REQ-4.2.5:** The system must prevent role escalation - users cannot access Admin features from Member or Viewer dashboards.

### 4.3 Admin Dashboard Features

**REQ-4.3.1:** Admin dashboard must include:
- Project creation wizard access
- All projects overview with management controls
- Team management panel
- Organization settings
- Full task management (create, edit, assign, delete)
- Analytics and reports
- User invitation and role assignment
- Billing and quota management

**REQ-4.3.2:** Admin dashboard must show visual hierarchy of: Organization → Teams → Projects → Tasks

**REQ-4.3.3:** Admins must see workload distribution across team members with visual indicators

**REQ-4.3.4:** Admins must have quick actions for: Create Project, Invite User, Create Team, Assign Tasks

**REQ-4.3.5:** Admin dashboard must display alerts for: overdue tasks, quota limits approaching, users needing role updates

### 4.4 Member Dashboard Features

**REQ-4.4.1:** Member dashboard must include:
- "My Tasks" as the primary view
- Projects where the member is assigned (with limited context)
- Task detail and editing capabilities for assigned tasks
- Commenting and file upload features
- Personal task filters (due date, priority, status)
- Simplified navigation focused on execution

**REQ-4.4.2:** Member dashboard must NOT show:
- Project creation or deletion options
- Team management features
- User role management
- Organization settings
- Billing information
- Tasks assigned to other users (unless part of the same project context)

**REQ-4.4.3:** Members must see a focused task list with clear priorities and deadlines

**REQ-4.4.4:** Members must be able to mark tasks complete, add comments, and upload files without navigating away from the main dashboard

**REQ-4.4.5:** Member dashboard must show project context cards with: project name, milestone progress, team members, but no edit controls

### 4.5 Viewer Dashboard Features

**REQ-4.5.1:** Viewer dashboard must include:
- Project overview cards (read-only)
- Analytics and reports
- Activity timeline across all visible projects
- Task completion statistics
- Team performance metrics
- Simple progress visualizations

**REQ-4.5.2:** Viewer dashboard must NOT show:
- Any edit, create, or delete buttons
- Comment boxes or file upload interfaces
- Task assignment controls
- User management features
- Settings or configuration options

**REQ-4.5.3:** All interactive elements must be disabled or hidden with clear visual indication of view-only mode

**REQ-4.5.4:** Viewers must see a banner or badge indicating "View Only Mode" throughout their session

**REQ-4.5.5:** Viewer dashboard must focus on data visualization and reporting - optimized for stakeholders and executives

### 4.6 Project Creation Wizard (Admin Only)

**REQ-4.6.1:** The system must present a step-by-step wizard interface for project creation (one question per screen).

**REQ-4.6.2:** The wizard must collect: project name, project description/goals, key milestones, team assignment (via checkboxes for existing teams or individual user selection with role assignment), and project deadlines.

**REQ-4.6.3:** The system must provide 3-5 pre-built project templates (Marketing Campaign, Software Launch, Event Planning, General Project, Content Creation).

**REQ-4.6.4:** The system must allow Admins to select a template or start from scratch.

**REQ-4.6.5:** The wizard must use smooth animations and transitions between steps.

**REQ-4.6.6:** The system must display a progress indicator showing wizard completion percentage.

**REQ-4.6.7:** The system must allow users to navigate backward to previous wizard steps.

**REQ-4.6.8:** The wizard must use conversational, friendly language (e.g., "Great! Let's add your team members").

**REQ-4.6.9:** Upon completion, the system must auto-generate the project with suggested tasks based on the selected template.

**REQ-4.6.10:** The system must allow users to skip optional wizard steps.

**REQ-4.6.11:** During team assignment, the wizard must allow Admins to specify roles (Admin, Member, Viewer) for each added user or team.

**REQ-4.6.12:** The system must auto-save wizard progress locally (via localStorage or IndexedDB) after each completed step.

**REQ-4.6.13:** When a user returns to an incomplete wizard, the system must detect existing draft data and prompt: "Resume previous setup or start new?"

**REQ-4.6.14:** The system must create a temporary project draft in the database after the user completes the first step (project name) and update it as subsequent steps are filled.

**REQ-4.6.15:** Draft projects older than 7 days must be automatically deleted via scheduled cleanup job.

**REQ-4.6.16:** The wizard must include a visible "Save as Draft" button allowing users to exit intentionally without losing progress.

### 4.7 Task Assignment & Management

**REQ-4.7.1:** After project creation, Admins must launch a task assignment wizard.

**REQ-4.7.2:** The wizard must allow Admins to create tasks with: task name, description, assignee (Member role), due date, and milestone association.

**REQ-4.7.3:** Members must be able to view and edit only their assigned tasks from their Member Dashboard.

**REQ-4.7.4:** The system must support natural language task creation for Admins (e.g., "Design landing page by Friday, assign to Sam as Member").

**REQ-4.7.5:** The system must auto-link tasks to the appropriate milestone based on due date or user selection.

**REQ-4.7.6:** The system must allow Admins to bulk-add tasks from templates.

**REQ-4.7.7:** The wizard must provide smart suggestions for common tasks based on project type.

**REQ-4.7.8:** The system must validate that assignees are members of the project with appropriate roles.

**REQ-4.7.9:** Admins must be able to exit the wizard and add tasks later from the Admin Dashboard.

**REQ-4.7.10:** Members can edit task details (description, status, priority) but cannot change assignee or delete tasks.

**REQ-4.7.11:** Viewers can only view task information with no edit capabilities.

### 4.8 Organization, Team & Project Structure

**REQ-4.8.1:** The system must organize work as: Organization → Teams (optional grouping) → Projects → Tasks (with optional milestone grouping).

**REQ-4.8.2:** Each user account can belong to multiple organizations with different roles in each.

**REQ-4.8.3:** The first user to create an organization automatically becomes an Admin for that organization.

**REQ-4.8.4:** Organization Admins must be able to invite users to join their organization via email.

**REQ-4.8.5:** New users invited to an organization have no project access until explicitly added to projects by Admins with role assignment (Admin, Member, or Viewer).

**REQ-4.8.6:** All users within an organization must be able to see all projects they have access to based on their assigned roles.

**REQ-4.8.7:** Admins must be able to create named teams (e.g., "Marketing Team", "Dev Team", "Design Squad").

**REQ-4.8.8:** Teams must be collections of users that can be quickly assigned to projects with designated roles.

**REQ-4.8.9:** A user can belong to multiple teams within their organization with different roles in each team context.

**REQ-4.8.10:** Projects remain the primary organizational unit for work.

**REQ-4.8.11:** When creating a project, Admins must be able to assign individual users OR entire teams to the project with specified roles.

**REQ-4.8.12:** If a team is assigned to a project with a specific role (e.g., Members), all team members automatically gain that role for that project.

**REQ-4.8.13:** Users must be able to have different roles in different projects (e.g., Admin in Project A, Member in Project B, Viewer in Project C).

**REQ-4.8.14:** The system must support three roles per project: Admin, Member, Viewer.

**REQ-4.8.15:** Project Admins must be able to: edit project details, add/remove members, add/remove teams, delete the project, change member roles, and manage teams.

**REQ-4.8.16:** Project Members must be able to: create/edit/complete assigned tasks, comment on their tasks, and upload files to their tasks.

**REQ-4.8.17:** Project Viewers must be able to: view projects and tasks, view analytics, but not edit or create anything.

**REQ-4.8.18:** When a user is added to a team that's already assigned to projects, they must automatically gain the team's role for those projects.

**REQ-4.8.19:** When a user is removed from a team, their individual access to projects must be evaluated (they retain access if individually assigned with a role).

**REQ-4.8.20:** Organization Admins must be able to manage teams: create, rename, add/remove members with roles, and delete teams.

**REQ-4.8.21:** Deleting a team must not delete projects; Admins must be prompted to reassign team members or remove team assignment from projects.

**REQ-4.8.22:** The API must enforce role-based access control (RBAC) rules at the endpoint level.

**REQ-4.8.23:** Only Admins and Members may perform mutating actions (POST, PATCH, DELETE) on `/api/tasks`, `/api/comments`, and `/api/projects` endpoints, with Members restricted to their assigned resources.

**REQ-4.8.24:** All roles may perform GET requests for view access within their assigned projects and roles.

**Permissions Matrix:**

| Action                        | Admin | Member | Viewer |
| ----------------------------- | ----- | ------ | ------ |
| Access Admin Dashboard        | ✅     | ❌      | ❌      |
| Access Member Dashboard       | ✅     | ✅      | ❌      |
| Access Viewer Dashboard       | ✅     | ✅      | ✅      |
| Create/Edit/Delete Project    | ✅     | ❌      | ❌      |
| Add/Remove Members            | ✅     | ❌      | ❌      |
| Assign User Roles             | ✅     | ❌      | ❌      |
| Create Tasks                  | ✅     | ❌      | ❌      |
| Edit Own Assigned Tasks       | ✅     | ✅      | ❌      |
| Complete Own Tasks            | ✅     | ✅      | ❌      |
| Delete Tasks                  | ✅     | ❌      | ❌      |
| Comment on Own Tasks          | ✅     | ✅      | ❌      |
| Upload Files to Own Tasks     | ✅     | ✅      | ❌      |
| View All Projects             | ✅     | Limited| ✅      |
| View All Tasks                | ✅     | Own    | ✅      |
| Manage Teams                  | ✅     | ❌      | ❌      |
| View Analytics                | ✅     | Limited| ✅      |
| Export Data                   | ✅     | ❌      | ❌      |
| Manage Organization Settings  | ✅     | ❌      | ❌      |

### 4.9 Dashboard Navigation & Role Switching

**REQ-4.9.1:** The system must provide a role indicator badge in the navigation bar showing current role (Admin, Member, or Viewer).

**REQ-4.9.2:** Users with Admin role must have access to all three dashboard views via a dashboard switcher in the navigation.

**REQ-4.9.3:** Users with only Member role must see only the Member Dashboard.

**REQ-4.9.4:** Users with only Viewer role must see only the Viewer Dashboard.

**REQ-4.9.5:** The navigation menu must dynamically show/hide menu items based on current role and permissions.

**REQ-4.9.6:** When switching projects, the system must update the role indicator if the user's role differs in the new project context.

**REQ-4.9.7:** The system must provide a "Project Context Selector" allowing users to switch between projects, automatically adjusting permissions and dashboard features.

### 4.10 Team Collaboration

**REQ-4.10.1:** The system must allow Admins and Members to comment on tasks they have access to.

**REQ-4.10.2:** Comments must support @mentions to notify specific team members.

**REQ-4.10.3:** The system must support simple emoji reactions on comments (👍, ✅, ⚠️).

**REQ-4.10.4:** Each project must have a simple chat-like side panel for general discussions (Admins and Members only).

**REQ-4.10.5:** The system must allow Admins and Members to attach files to tasks they have edit access to (via direct upload or external links).

**REQ-4.10.6:** Supported file uploads must include: images, PDFs, documents (Word, Excel), and zip files (max 10MB per file).

**REQ-4.10.7:** Users must be able to paste external file links (Google Drive, Dropbox, etc.) into tasks.

**REQ-4.10.8:** The system must display file previews for images and PDFs for all roles.

**REQ-4.10.9:** Comments must display timestamps and author names.

**REQ-4.10.10:** The system must show a notification badge for unread comments.

**REQ-4.10.11:** Viewers can see comments and files but cannot add new ones or react to existing ones.

### 4.11 Notifications

**REQ-4.11.1:** The system must send in-app notifications for: task assignments (Members), @mentions (all roles), upcoming due dates (Admins and Members), overdue tasks (Admins and assigned Members), and new comments on relevant tasks.

**REQ-4.11.2:** The system must send email notifications for all events listed in REQ-4.11.1.

**REQ-4.11.3:** Notification content must be role-appropriate (Admins receive all project notifications, Members receive only their task notifications, Viewers receive project milestone notifications).

**REQ-4.11.4:** Users must be able to mark in-app notifications as read.

**REQ-4.11.5:** Users must be able to configure basic email notification preferences (enable/disable email notifications globally).

**REQ-4.11.6:** The system must display a notification badge showing unread notification count.

**Note:** Browser push notifications, granular notification preferences per event type, and notification batching/digests are post-MVP features.

### 4.12 Analytics & Monitoring

**REQ-4.12.1:** The system must track basic completion metrics: task completion rate (%), project completion rate (%), and tasks completed per user.

**REQ-4.12.2:** The system must display role-appropriate analytics:
- **Admin Dashboard**: Full project analytics, team performance, individual user metrics, workload distribution
- **Member Dashboard**: Personal task completion stats, time to completion, tasks by priority
- **Viewer Dashboard**: High-level project health, completion percentages, milestone progress, team velocity

**REQ-4.12.3:** The system must display simple progress indicators on all dashboards (progress bars, completion percentages).

**REQ-4.12.4:** The system must display an activity timeline for each project showing: task creations, completions, comments, and file uploads.

**REQ-4.12.5:** The activity timeline must be filterable by date range and team member (Admin and Viewer dashboards only).

**REQ-4.12.6:** The system must track internal user behavior metrics for UX improvement: wizard completion rate, time to complete wizard, feature adoption rates, dashboard usage by role, user retention, and task completion patterns.

**REQ-4.12.7:** Internal analytics must not be visible to end users.

**REQ-4.12.8:** The system must implement analytics tracking hooks from day one using Google Analytics 4 (free tier) for cost efficiency.

**Note:** Visual charts, weekly reports, PDF exports, and workload distribution analytics are post-MVP features.

### 4.13 AI Integration

**REQ-4.13.1:** The system must provide AI-powered project template suggestions based on project description input using OpenAI API (Admin Dashboard only).

**REQ-4.13.2:** The AI must suggest task breakdowns when Admins describe a project goal using GPT-4 Turbo or GPT-3.5 Turbo (e.g., "Launch a new website" → suggests tasks like "Design mockups," "Develop frontend," "Write content," etc.).

**REQ-4.13.3:** The system must send predictive reminders (e.g., "You have 3 tasks due tomorrow") to Admins and Members using AI-generated summaries.

**REQ-4.13.4:** The AI must detect when a team member is overloaded (>80% task capacity) and suggest reallocating tasks to Admins using GPT analysis of workload data.

**REQ-4.13.5:** AI suggestions must be optional and non-intrusive (displayed as subtle recommendations).

**REQ-4.13.6:** The system must use OpenAI's streaming API for better user experience during task generation.

**REQ-4.13.7:** Total OpenAI API costs must not exceed $100 USD per month. Implement rate limiting per organization tier:
- Free tier: 5 AI suggestions per project (GPT-3.5 Turbo)
- Starter tier: 25 AI suggestions per project (GPT-3.5 Turbo)
- Growth tier: 100 AI suggestions per project (GPT-4 Turbo)

**REQ-4.13.8:** AI features must only be accessible to Admin role users.

**REQ-4.13.9:** The system must implement exponential backoff retry logic for OpenAI API failures.

**REQ-4.13.10:** AI responses must be cached in Supabase for 24 hours to reduce API costs for similar queries.

### 4.14 Integrations

**REQ-4.14.1:** The system must integrate with email providers (Gmail, Outlook) via OAuth for user authentication.

**REQ-4.14.2:** The system must use Resend for all transactional email delivery with role-appropriate templates.

**REQ-4.14.3:** Email templates must be built using React Email for type-safe, responsive designs.

**REQ-4.14.4:** Email integration must allow Admins to create tasks by forwarding emails to a unique project email address (parsed via Resend webhooks).

**REQ-4.14.5:** The system must support OAuth authentication for Google and Microsoft accounts via Supabase Auth.

### 4.15 Search Functionality

**REQ-4.15.1:** The system must provide role-appropriate global search:
- **Admins**: Search across all projects, tasks, comments, and users
- **Members**: Search across assigned tasks, projects they're part of, and their comments
- **Viewers**: Search across visible projects, tasks, and comments (read-only results)

**REQ-4.15.2:** Search results must be grouped by type (Projects, Tasks, Comments).

**REQ-4.15.3:** The system must support search filters: by project, by assignee (Admins only), by date range, and by status.

**REQ-4.15.4:** Search must provide real-time results as the user types.

**REQ-4.15.5:** The system must highlight search terms in results.

### 4.16 Data Export & Portability

**REQ-4.16.1:** Admins must be able to export task lists as CSV (task name, assignee, status, due date, milestone).

**REQ-4.16.2:** CSV exports must be available per project (Admin only).

**REQ-4.16.3:** Viewers can request read-only exports that Admins must approve.

**Note:** PDF reports with charts and branding are post-MVP features.

### 4.17 Multi-Device & Offline Support (PWA)

**REQ-4.17.1:** The system must be built as a Progressive Web App (PWA).

**REQ-4.17.2:** The PWA must be installable on desktop and mobile devices.

**REQ-4.17.3:** The app must function in view-only mode when offline for all roles: viewing projects, viewing tasks, and viewing comments.

**REQ-4.17.4:** The app must display a prominent visual indicator when offline (e.g., banner or badge).

**REQ-4.17.5:** When offline, any attempt to create/edit data must show a friendly message: "You're offline. Changes will be saved when you reconnect."

**REQ-4.17.6:** The UI must be fully responsive and optimized for mobile screens with role-appropriate layouts.

**Note:** Full offline mode with queued actions and automatic sync is a post-MVP feature. MVP focuses on read-only offline access to reduce complexity.

### 4.18 Onboarding

**REQ-4.18.1:** New users must see a role-appropriate welcome screen on first login:
- **Admin**: Interactive tutorial on creating projects, inviting team, and assigning tasks
- **Member**: Tutorial on viewing assigned tasks, updating status, and collaborating
- **Viewer**: Tutorial on navigating analytics, reports, and project status

**REQ-4.18.2:** The system must provide a sample project pre-loaded with demo tasks for Admins on first login.

**REQ-4.18.3:** The sample project must include tooltips explaining key features relevant to each role.

**REQ-4.18.4:** Users must be able to dismiss or delete the sample project.

**REQ-4.18.5:** The system must display contextual tooltips during the first project creation wizard (Admin only).

---

## 5. Non-Goals (Out of Scope)

### MVP Exclusions (Can be added post-launch)
1. **Custom role creation**: Users cannot define roles beyond Admin, Member, Viewer
2. **Dashboard customization**: Users cannot rearrange dashboard widgets or choose alternative layouts
3. **Cross-project task views for Members**: Members see tasks project-by-project, not aggregated across all projects
4. **Advanced permission granularity**: No per-task or per-field permissions
5. **Visual analytics charts**: No line charts, bar charts, or advanced visualizations in MVP
6. **PDF reports and exports**: No report generation or export functionality
7. **Weekly automated reports**: No email digests or scheduled reports
8. **Browser push notifications**: Email and in-app only; no PWA push in MVP
9. **Granular notification preferences**: Only global email on/off; no per-event-type controls
10. **Notification batching/digests**: All notifications sent immediately
11. **Full offline mode with sync**: View-only offline access; no queued actions or conflict resolution
12. **Workload distribution analytics**: No team member workload visualizations in MVP

### Long-term Exclusions
13. **Task dependencies and blocking**: Tasks cannot block other tasks or have prerequisites
14. **Gantt charts**: No timeline visualization beyond simple milestone grouping
15. **Time tracking**: No manual time entry or timer functionality
16. **Budget tracking**: No financial or cost management features
17. **Resource allocation algorithms**: No automated resource planning beyond AI workload suggestions
18. **Advanced Kanban boards**: No drag-and-drop Kanban or swimlane views
19. **Custom field creation**: Users cannot add custom fields to tasks or projects
20. **White-label or self-hosted options**: SaaS-only deployment initially
21. **Mobile native apps**: PWA only; no iOS/Android native apps in MVP
22. **Video conferencing integration**: No built-in video calls or screen sharing
23. **Multi-language support**: English only in MVP
24. **Recurring tasks**: No automated recurring task creation
25. **Audit logs**: No detailed change history tracking (may be added for enterprise)
26. **Public API**: No API access for third-party integrations
27. **Custom branding**: No organization-level branding customization in MVP
28. **WhatsApp integration**: No WhatsApp Business API integration in MVP
29. **Enterprise features**: SSO, advanced audit logs, and complex permissions are planned way into the future

---

## 6. Design Considerations

### 6.1 Visual Design Principles

- **Role-Based UI**: Each dashboard has a distinct visual identity while maintaining brand consistency
- **Admin Dashboard**: Command center aesthetic with comprehensive controls and data-dense views
- **Member Dashboard**: Task-focused, clean, and action-oriented with minimal distractions
- **Viewer Dashboard**: Analytics-first with emphasis on data visualization and high-level metrics
- **Wizard UX**: Follow Typeform's conversational pattern with one question per screen, smooth transitions, and progress indicators
- **Minimalism**: Clean, uncluttered interface with generous whitespace
- **Color palette**: Use a friendly, modern color scheme (blues/purples for primary actions, reds for urgent/overdue)
- **Role indicators**: Clear visual badges showing current role (Admin badge in primary color, Member badge in secondary color, Viewer badge in neutral color)
- **Typography**: Use clear, readable fonts (e.g., Inter, Source Sans Pro)
- **Micro-interactions**: Include subtle animations for task completion, role switching, button clicks, and page transitions

### 6.2 Component Guidelines

- **Role-Aware Components**: All components must accept a `userRole` prop to render appropriate controls
- **Buttons**: Primary (CTA), Secondary, and Tertiary button styles with disabled states for unauthorized actions
- **Forms**: Inline validation with friendly error messages, disabled fields for Viewer role
- **Cards**: Project and task cards with role-appropriate actions (Admin sees edit/delete, Member sees update, Viewer sees no actions)
- **Modals**: Use for confirmations (delete actions for Admins) and quick-edit dialogs (Admins and Members)
- **Loading states**: Skeleton screens for loading content
- **Empty states**: Friendly illustrations and CTAs appropriate to role (Admin: "Create your first project", Member: "No tasks assigned yet", Viewer: "No data available")
- **Role badges**: Small, unobtrusive badges showing current role in navigation and context switchers

### 6.3 Accessibility

- **WCAG 2.1 AA compliance**: Minimum contrast ratios, keyboard navigation, ARIA labels
- **Screen reader support**: Semantic HTML, proper labeling, and role announcements
- **Focus indicators**: Clear visual focus states for keyboard navigation
- **Role context announcements**: Screen readers announce role changes and permission contexts

### 6.4 Responsive Breakpoints

- Mobile: 320px - 768px (optimized for Member and Viewer dashboards)
- Tablet: 769px - 1024px (all dashboards functional)
- Desktop: 1025px+ (optimal experience for Admin dashboard)

---

## 7. Technical Considerations

### 7.1 Technology Stack

- **Framework**: Next.js 14+ with App Router and TypeScript for full-stack development
- **UI Components**: shadcn/ui with Radix UI primitives and Tailwind CSS
- **State Management**: Zustand for all client state (auth, role management, dashboard state, projects, tasks, notifications)
- **Database & Auth**: Supabase (PostgreSQL database, authentication, real-time subscriptions, RLS for role enforcement)
- **File Storage**: Cloudflare R2 (S3-compatible object storage with zero egress fees)
- **File Handling**: @aws-sdk/client-s3 (works with Cloudflare R2 via S3-compatible API)
- **PWA Framework**: next-pwa plugin for service worker management (basic caching only for MVP)
- **Real-time**: Supabase Realtime for live updates (role-filtered subscriptions)
- **AI Integration**: OpenAI API (GPT-4 Turbo or GPT-3.5 Turbo for cost efficiency)
- **Email**: Resend for transactional emails
- **Analytics**: Google Analytics 4 for user behavior tracking (free tier)
- **Testing**: Jest + React Testing Library for component tests, Playwright for E2E tests (including role-based access tests)
- **Deployment**: Vercel (recommended for Next.js) or Netlify

### 7.2 Architecture Notes

- **API Design**: Next.js API Routes (App Router) with RESTful conventions, Supabase Row Level Security (RLS) for data access control
- **Role-Based Access Control**: 
  - Frontend: Zustand stores for role state, middleware for route protection
  - Backend: Supabase RLS policies enforcing role permissions at database level
  - API: Middleware checking user role before processing requests
- **Data Model**: Key entities are Organizations, Users (with role junction tables), Teams, Projects, Tasks, Comments, Milestones, Notifications, UserProjectRoles (junction table). Include `deleted_at` timestamp fields for soft-delete functionality.
- **Authentication**: Supabase Auth with built-in session management, supports email/password and OAuth (Google, Microsoft)
- **Caching Strategy**: Next.js built-in caching, Supabase query caching, Zustand for client-side state management with role-aware cache
- **Real-time Updates**: Supabase Realtime subscriptions for live dashboard updates with role-based filtering
- **Offline Sync**: Next.js service worker with cache-first strategy for read-only offline mode
- **File Storage Architecture**: Cloudflare R2 with S3-compatible API, using presigned URLs for secure uploads/downloads
- **AI Integration**: OpenAI API with streaming responses for better UX, rate limiting per organization tier
- **Email Templates**: Resend with React Email for type-safe, responsive email templates
- **Scheduled Jobs**: Vercel Cron Jobs for:
  - Draft cleanup (delete drafts older than 7 days)
  - Soft-delete cleanup (permanently delete records older than 30 days)
  - Usage metrics calculation
  - Grace period expiration checks and enforcement
  - Email reminders for grace period (days 1, 7, 14, 28)
  - Email digest sending (post-MVP)

### 7.3 Security Requirements

- **Authentication**: Supabase Auth with secure password hashing (bcrypt), OAuth 2.0 for social logins (Google, Microsoft)
- **Authorization**: Row Level Security (RLS) policies in Supabase enforcing role-based access at database level
  - Policies must check user role in `user_project_roles` junction table before allowing operations
  - Admin-only tables (organization settings, billing) must have strict RLS policies
- **Role Validation**: Next.js middleware for route protection based on role
  - `/admin/*` routes accessible only to Admin role
  - `/member/*` routes accessible to Admin and Member roles
  - `/viewer/*` routes accessible to all roles
- **API Security**: Middleware on all API routes validating user role before processing
- **Data Encryption**: HTTPS for all communications (enforced by Vercel/Netlify), Supabase handles encryption at rest
- **Input Validation**: Zod schemas for type-safe validation on both client and server
- **File Upload Security**: Validate file types and sizes before upload, use signed URLs for temporary access, scan for malware (optional: AWS S3 with AWS Macie)
- **GDPR Compliance**: Implement right to access, right to deletion, data portability, and cookie consent mechanisms from day one
- **Rate Limiting**: Use Supabase built-in rate limiting or Vercel Edge Config for API route protection

### 7.4 Performance Requirements

- **Page Load Time**: Initial load < 3 seconds on 3G connection
- **Dashboard Switching**: Role-based dashboard switch < 500ms
- **Interaction Response**: UI interactions should feel instant (< 100ms)
- **Wizard Completion**: Wizard should load each step in < 500ms
- **Search**: Search results should appear in < 1 second
- **Offline Sync**: Changes should sync within 5 seconds of reconnection
- **Real-time Updates**: Role-filtered real-time updates delivered within 2 seconds

### 7.5 Scalability Considerations

- **Database Indexing**: Index commonly queried fields in Supabase (user_id, project_id, role, due_date, deleted_at)
- **Role Junction Table**: Efficiently index user_project_roles for fast permission checks
- **API Pagination**: Use Supabase's built-in pagination (range queries) for large lists (default 50 items per page)
- **Lazy Loading**: Use Next.js dynamic imports and React lazy loading for dashboard widgets
- **CDN**: Vercel Edge Network or Cloudflare CDN for static assets and edge caching
- **Quota Enforcement**: Implement middleware in Next.js API routes to check organization tier limits before allowing resource creation
- **Storage Monitoring**: Track per-organization storage usage via S3 API or Supabase Storage API
- **Connection Pooling**: Supabase handles connection pooling automatically (PgBouncer)
- **Role-Based Query Optimization**: Cache role permission checks, use Supabase RLS for automatic filtering

---

## 8. Success Metrics

### 8.1 User Adoption Metrics

- **Wizard Completion Rate**: Target 85%+ of users complete project creation wizard
- **Time to First Project**: Target < 5 minutes from signup to first project created (Admin users)
- **User Retention**: Target 60%+ weekly active users after 30 days (across all roles)
- **Feature Adoption**: Target 70%+ of Members use task updates and comments within first week
- **Dashboard Usage**: Track time spent in each dashboard type, aim for Admin 40%, Member 45%, Viewer 15%
- **Role Distribution**: Target healthy distribution (Admin 20%, Member 60%, Viewer 20%)

### 8.2 Performance Metrics

- **Task Completion Rate**: Track % of tasks marked complete vs. created (Member focus metric)
- **Project Velocity**: Measure average time to complete projects (Admin focus metric)
- **Collaboration Engagement**: Track comment frequency and @mention usage (Member and Admin)
- **Viewer Engagement**: Track analytics page views and report access (Viewer focus metric)

### 8.3 Business Metrics

- **User Growth**: Track monthly active users (MAU) segmented by role
- **User Satisfaction**: Target NPS score > 40 (segment by role)
- **Support Ticket Volume**: Measure reduction in "how to" support requests vs. traditional PM tools
- **Dashboard Preference**: Track which role users spend most time in (for users with multiple roles)

---

## 9. Open Questions

**All previous open questions have been answered and integrated into the PRD. Below are new questions related to role-based architecture:**

1. **Default Role Assignment**: When inviting users without specifying a role, what should be the default? (Suggested: Member)

2. **Role Upgrade Requests**: Should Members be able to request Admin access, or must Admins proactively grant it? (Suggested: Manual assignment only to maintain security)

3. **Multi-Organization Role Consistency**: If a user is Admin in Org A, should they start as Admin when invited to Org B? (Suggested: No, roles are organization-specific)

4. **Guest Access**: Should there be a limited "Guest" role for external collaborators? (Suggested: Post-MVP feature)

5. **Role Transition Period**: When changing roles (e.g., Member to Viewer), should there be a grace period? (Suggested: Immediate enforcement for security)

6. **Dashboard Bookmarking**: Can users bookmark specific dashboard views (e.g., Member prefers Admin view when available)? (Suggested: Post-MVP feature)

**Implementation details that can be decided during development:**

7. **Cloudflare R2 Configuration**: What are the optimal CORS settings and lifecycle rules for file storage? (Suggested: Auto-delete files from deleted projects after 30 days)

8. **OpenAI Model Selection**: Should we use GPT-4 Turbo for all tiers or reserve it for Growth tier? (Suggested: GPT-3.5 for Free/Starter, GPT-4 Turbo for Growth)

9. **React Email Templates**: What email template library should we use for consistent styling? (Suggested: React Email with custom branded templates)

10. **Database Backup Strategy**: What is the backup frequency and retention policy? (Suggested: Daily backups with 30-day retention)

11. **Monitoring & Error Tracking**: Which tools should be used for application monitoring and error tracking? (Suggested: Sentry for errors, Vercel Analytics for performance)

---

## Document Metadata

- **Document Version**: 2.0 (Updated for Role-Based Dashboards)
- **Last Updated**: November 18, 2025
- **Document Owner**: Product Team
- **Target Audience**: Junior to Mid-Level Developers
- **Estimated Development Timeline**: 14-18 weeks for MVP (increased from 12-16 weeks due to role-based complexity)
- **Major Changes from v1.0**:
  - Unified signup flow for all users
  - Three distinct role-based dashboards (Admin, Member, Viewer)
  - Role-specific permissions and features throughout the application
  - Updated data model with user_project_roles junction table
  - Role-aware UI components and navigation
  - Enhanced security with role-based RLS policies