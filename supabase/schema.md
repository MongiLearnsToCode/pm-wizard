# Database Schema Design - PM Wizard

## Core Entities

### users (managed by Supabase Auth)
- id (uuid, PK)
- email (text)
- created_at (timestamptz)
- updated_at (timestamptz)

### profiles
- id (uuid, PK, FK -> auth.users)
- full_name (text)
- avatar_url (text)
- notification_preferences (jsonb)
- created_at (timestamptz)
- updated_at (timestamptz)

### organizations
- id (uuid, PK)
- name (text)
- slug (text, unique)
- tier (enum: 'free', 'starter', 'growth')
- quota_projects (int)
- quota_storage_mb (int)
- quota_ai_requests (int)
- usage_projects (int, default 0)
- usage_storage_mb (int, default 0)
- usage_ai_requests (int, default 0)
- grace_period_ends_at (timestamptz)
- created_by (uuid, FK -> auth.users)
- created_at (timestamptz)
- updated_at (timestamptz)
- deleted_at (timestamptz)

### user_organization_roles
- id (uuid, PK)
- user_id (uuid, FK -> auth.users)
- organization_id (uuid, FK -> organizations)
- role (user_role enum: 'admin', 'member', 'viewer')
- created_at (timestamptz)
- UNIQUE(user_id, organization_id)

### teams
- id (uuid, PK)
- organization_id (uuid, FK -> organizations)
- name (text)
- description (text)
- created_by (uuid, FK -> auth.users)
- created_at (timestamptz)
- updated_at (timestamptz)
- deleted_at (timestamptz)

### team_members
- id (uuid, PK)
- team_id (uuid, FK -> teams)
- user_id (uuid, FK -> auth.users)
- created_at (timestamptz)
- UNIQUE(team_id, user_id)

### projects
- id (uuid, PK)
- organization_id (uuid, FK -> organizations)
- name (text)
- description (text)
- status (enum: 'draft', 'active', 'completed', 'archived')
- deadline (timestamptz)
- created_by (uuid, FK -> auth.users)
- created_at (timestamptz)
- updated_at (timestamptz)
- deleted_at (timestamptz)

### user_project_roles
- id (uuid, PK)
- user_id (uuid, FK -> auth.users)
- project_id (uuid, FK -> projects)
- role (user_role enum: 'admin', 'member', 'viewer')
- created_at (timestamptz)
- UNIQUE(user_id, project_id)

### team_project_roles
- id (uuid, PK)
- team_id (uuid, FK -> teams)
- project_id (uuid, FK -> projects)
- role (user_role enum: 'admin', 'member', 'viewer')
- created_at (timestamptz)
- UNIQUE(team_id, project_id)

### milestones
- id (uuid, PK)
- project_id (uuid, FK -> projects)
- name (text)
- due_date (timestamptz)
- status (enum: 'pending', 'in_progress', 'completed')
- created_at (timestamptz)
- updated_at (timestamptz)

### tasks
- id (uuid, PK)
- project_id (uuid, FK -> projects)
- milestone_id (uuid, FK -> milestones, nullable)
- title (text)
- description (text)
- status (enum: 'todo', 'in_progress', 'completed')
- priority (enum: 'low', 'medium', 'high')
- assigned_to (uuid, FK -> auth.users, nullable)
- due_date (timestamptz)
- created_by (uuid, FK -> auth.users)
- created_at (timestamptz)
- updated_at (timestamptz)
- deleted_at (timestamptz)

### comments
- id (uuid, PK)
- task_id (uuid, FK -> tasks)
- user_id (uuid, FK -> auth.users)
- content (text)
- mentions (uuid[], array of user IDs)
- created_at (timestamptz)
- updated_at (timestamptz)

### files
- id (uuid, PK)
- task_id (uuid, FK -> tasks)
- uploaded_by (uuid, FK -> auth.users)
- filename (text)
- file_size (bigint)
- file_type (text)
- storage_path (text)
- created_at (timestamptz)

### notifications
- id (uuid, PK)
- user_id (uuid, FK -> auth.users)
- type (text)
- title (text)
- content (text)
- link (text)
- read (boolean, default false)
- created_at (timestamptz)

### wizard_drafts
- id (uuid, PK)
- user_id (uuid, FK -> auth.users)
- organization_id (uuid, FK -> organizations)
- draft_data (jsonb)
- step (int)
- created_at (timestamptz)
- updated_at (timestamptz)

### ai_cache
- id (uuid, PK)
- query_hash (text, unique)
- response (jsonb)
- expires_at (timestamptz)
- created_at (timestamptz)

## Indexes

- organizations: slug, created_by
- user_organization_roles: user_id, organization_id, role
- user_project_roles: user_id, project_id, role
- team_project_roles: team_id, project_id
- projects: organization_id, status, deleted_at
- tasks: project_id, assigned_to, status, due_date, deleted_at
- comments: task_id, user_id
- files: task_id
- notifications: user_id, read, created_at
- wizard_drafts: user_id, organization_id

## Role-Based Access Control

### Admin Role
- Full CRUD on all resources within their organization
- Can assign/change roles
- Can manage teams and projects
- Can delete resources (soft delete)

### Member Role
- Read access to assigned projects
- CRUD on own assigned tasks
- Create comments and upload files
- Cannot manage teams or assign roles

### Viewer Role
- Read-only access to assigned projects
- Cannot create, update, or delete anything
- Can view analytics and reports
