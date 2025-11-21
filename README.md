# PM Wizard - Role-Based Project & Task Management

A wizard-driven project and task management web application with role-based dashboard architecture built with Next.js 14+, Supabase, and shadcn/ui.

## Overview

PM Wizard streamlines project setup through conversational UI and provides three distinct role-based dashboards:

- **Admin Dashboard**: Full project management, team management, and settings
- **Member Dashboard**: Task-focused view with assigned work and collaboration features
- **Viewer Dashboard**: Read-only overview with project status monitoring

**Note:** Comprehensive analytics features are planned for v1.1. Current MVP includes basic task/project statistics in dashboards.

## Technology Stack

- **Framework**: Next.js 14+ with App Router and TypeScript
- **UI Components**: shadcn/ui with Radix UI primitives and Tailwind CSS
- **State Management**: Zustand for all client state
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security, built-in auth)
- **File Storage**: Cloudflare R2 (S3-compatible object storage)
- **AI Integration**: OpenAI API (Admin-only features)
- **Email**: Resend with React Email templates
- **Analytics**: PostHog (Product Analytics with role-based event tracking)
- **Testing**: Jest, React Testing Library, Playwright

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Cloudflare account (for R2 storage)
- OpenAI API key
- Resend account
- PostHog account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pm-wizard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local` and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```
   
   See `dev_input.md` for detailed instructions on obtaining each credential.

4. **Set up Supabase**
   
   - Create a new Supabase project
   - Run migrations: `supabase db push`
   - Run seed script: `supabase db reset`
   
   See `dev_input.md` for detailed Supabase setup instructions.

5. **Set up Cloudflare R2**
   
   - Create an R2 bucket
   - Generate API tokens
   - Configure CORS settings
   
   See `dev_input.md` for detailed R2 setup instructions.

6. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
pm-wizard/
├── app/
│   ├── (admin)/          # Admin-only routes and dashboard
│   ├── (member)/         # Member routes and dashboard
│   ├── (viewer)/         # Viewer routes and dashboard
│   ├── (auth)/           # Authentication pages
│   └── api/              # API routes with role validation
├── components/
│   ├── role/             # Role-specific components
│   ├── dashboards/       # Dashboard layouts per role
│   ├── navigation/       # Role-specific navigation
│   ├── wizard/           # Project creation wizard
│   ├── tasks/            # Task management components
│   ├── teams/            # Team management components
│   ├── comments/         # Collaboration features
│   ├── notifications/    # Notification system
│   ├── analytics/        # Role-specific analytics
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── supabase/         # Supabase client utilities
│   ├── rbac.ts           # Role-based access control
│   ├── permissions.ts    # Permission checking
│   ├── cloudflare-r2.ts  # R2 file storage
│   ├── openai.ts         # OpenAI integration
│   └── resend.ts         # Email service
├── store/                # Zustand state stores
├── hooks/                # Custom React hooks
├── emails/               # React Email templates
├── supabase/
│   └── migrations/       # Database migrations
├── __tests__/            # Unit tests
└── e2e/                  # End-to-end tests
```

## Role-Based Architecture

### Three User Roles

1. **Admin**
   - Full access to all features
   - Project creation and management
   - Team management and role assignment
   - Organization settings
   - AI-powered features

2. **Member**
   - Task-focused dashboard
   - Edit own assigned tasks
   - Comment and upload files
   - Limited project context

3. **Viewer**
   - Read-only access
   - Analytics and reports
   - Project status monitoring
   - No edit capabilities

### Permission Matrix

| Action                     | Admin | Member | Viewer |
|---------------------------|-------|--------|--------|
| Create/Edit/Delete Project| ✅     | ❌      | ❌      |
| Assign Roles              | ✅     | ❌      | ❌      |
| Create Tasks              | ✅     | ❌      | ❌      |
| Edit Own Tasks            | ✅     | ✅      | ❌      |
| Comment on Tasks          | ✅     | ✅      | ❌      |
| Upload Files              | ✅     | ✅      | ❌      |
| View Basic Stats          | ✅     | ✅      | ✅      |
| Manage Teams              | ✅     | ❌      | ❌      |

**Note:** Comprehensive analytics features deferred to v1.1. MVP includes basic task/project statistics.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:e2e:ui` - Run E2E tests with UI
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Testing

**Unit Tests (Jest + React Testing Library)**
```bash
npm run test
```

**E2E Tests (Playwright)**
```bash
npm run test:e2e
```

**Role-Based Testing**
- Test all features with Admin, Member, and Viewer accounts
- Verify RLS policies enforce permissions at database level
- Test role switching and dashboard transitions

### Database Migrations

**Create a new migration**
```bash
supabase migration new <migration_name>
```

**Apply migrations**
```bash
supabase db push
```

**Generate TypeScript types**
```bash
supabase gen types typescript --local > lib/database.types.ts
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy

See `dev_input.md` for detailed deployment instructions.

### Environment Variables for Production

Ensure all environment variables from `.env.local` are added to your production environment:
- Supabase credentials
- Cloudflare R2 credentials
- OpenAI API key
- Resend API key
- Google Analytics ID

## Key Features

### Project Creation Wizard (Admin Only)
- Conversational, step-by-step interface
- AI-powered task suggestions
- Role assignment during project creation
- Auto-save and draft recovery

### Role-Specific Dashboards
- Admin: Command center with full controls
- Member: Task-focused, action-oriented
- Viewer: Read-only overview with basic stats

### Collaboration
- Comments with @mentions
- File uploads (Cloudflare R2)
- Real-time updates (Supabase Realtime)
- Role-appropriate notifications

### Analytics
- Role-specific metrics
- Activity timelines
- Progress tracking
- CSV exports (Admin only)

**Note:** Comprehensive analytics features planned for v1.1. MVP includes basic task/project statistics.

### Security
- Row Level Security (RLS) policies
- Role-based API validation
- Secure file storage with presigned URLs
- GDPR compliance features

## Documentation

- **PRD**: `prd_pm_wizard.md` - Complete product requirements
- **Task List**: `tasks_pm_wizard.md` - Development task breakdown
- **Developer Input**: `dev_input.md` - Manual setup instructions
- **Coding Agent Prompt**: `coding-agent-prompt.md` - AI agent instructions

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Ensure all tests pass
5. Submit a pull request

## License

[Your License Here]

## Support

For issues and questions, please refer to the documentation files or create an issue in the repository.
