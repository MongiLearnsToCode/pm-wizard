# Role-Switching Architecture
**Date:** November 21, 2025  
**Status:** Architecture Defined

## Overview

PM Wizard implements a **per-project role system** where users can have different roles across different projects. This document outlines how role-switching works and how it's implemented throughout the application.

---

## Core Concept

### Roles Are Per-Project, Not Per-User

**Key Principle**: A single user account can simultaneously be:
- **Admin** on Project A (projects they created or manage)
- **Member** on Project B (projects where they're assigned tasks)
- **Viewer** on Project C (projects they observe)

This is fundamentally different from traditional role systems where a user has one global role.

---

## User Journey

### 1. Account Creation
```
User signs up → Creates account → No role assigned yet
```
- All users register through the same unified signup flow
- No role selection during registration
- Roles are assigned when user is added to projects

### 2. First Project
```
User creates first project → Automatically becomes Admin for that project
```
- Creating a project makes you the Admin
- You can then invite others as Admin, Member, or Viewer

### 3. Being Invited
```
Admin invites user to Project B as Member → User now has 2 roles across 2 projects
```
- User receives invitation email
- Accepts invitation
- Now has access to Project B with Member role

### 4. Role Switching
```
User logs in → Sees Project A (Admin) and Project B (Member)
User clicks Project Switcher → Selects Project B
Dashboard changes from Admin view to Member view
```

---

## Technical Implementation

### Database Schema

**user_project_roles** table:
```sql
CREATE TABLE user_project_roles (
  user_id UUID REFERENCES auth.users(id),
  project_id UUID REFERENCES projects(id),
  role TEXT CHECK (role IN ('admin', 'member', 'viewer')),
  assigned_at TIMESTAMP DEFAULT NOW(),
  assigned_by UUID REFERENCES auth.users(id),
  PRIMARY KEY (user_id, project_id)
);
```

**Key Points:**
- Composite primary key ensures one role per user per project
- Role is stored per project relationship
- Tracks who assigned the role and when

### Zustand Store (Project Context)

```typescript
interface ProjectContextStore {
  currentProjectId: string | null;
  currentProjectRole: 'admin' | 'member' | 'viewer' | null;
  currentProjectName: string | null;
  availableProjects: Array<{
    id: string;
    name: string;
    role: 'admin' | 'member' | 'viewer';
    lastActivity: string;
  }>;
  switchProject: (projectId: string) => Promise<void>;
  loadUserProjects: () => Promise<void>;
}
```

### Role Detection Flow

```typescript
// 1. User logs in
const { data: { user } } = await supabase.auth.getUser();

// 2. Fetch all projects and roles
const { data: projectRoles } = await supabase
  .from('user_project_roles')
  .select('project_id, role, projects(name, updated_at)')
  .eq('user_id', user.id);

// 3. Load last selected project from localStorage
const lastProjectId = localStorage.getItem('lastProjectId');

// 4. Determine which project/role to show
const defaultProject = projectRoles.find(p => p.project_id === lastProjectId)
  || projectRoles.find(p => p.role === 'admin')
  || projectRoles[0];

// 5. Set context and route to appropriate dashboard
setCurrentProject(defaultProject.project_id, defaultProject.role);
router.push(`/${defaultProject.role}/dashboard`);
```

### Project Switcher Component

```typescript
<ProjectSwitcher
  currentProject={currentProjectId}
  projects={availableProjects}
  onSwitch={(projectId) => {
    const project = availableProjects.find(p => p.id === projectId);
    switchProject(projectId);
    router.push(`/${project.role}/dashboard`);
  }}
/>
```

**Features:**
- Dropdown showing all accessible projects
- Color-coded role badges (Admin: blue, Member: green, Viewer: gray)
- Current project highlighted
- Search/filter for many projects
- Keyboard navigation support

### Dynamic Dashboard Rendering

```typescript
// Layout determines which dashboard to show
export default function DashboardLayout({ children }) {
  const { currentProjectRole } = useProjectContext();
  
  return (
    <>
      {currentProjectRole === 'admin' && <AdminNav />}
      {currentProjectRole === 'member' && <MemberNav />}
      {currentProjectRole === 'viewer' && <ViewerNav />}
      
      <main>{children}</main>
    </>
  );
}
```

### API Route Protection

```typescript
// API routes check role for specific project
export async function GET(request: Request) {
  const { user } = await getUser(request);
  const projectId = request.headers.get('x-project-id');
  
  // Check user's role for this project
  const { data: roleData } = await supabase
    .from('user_project_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('project_id', projectId)
    .single();
  
  if (!roleData || roleData.role !== 'admin') {
    return new Response('Forbidden', { status: 403 });
  }
  
  // Proceed with admin-only operation
}
```

### Row Level Security (RLS)

```sql
-- Users can only see projects where they have a role
CREATE POLICY "Users see own projects"
ON projects FOR SELECT
USING (
  id IN (
    SELECT project_id 
    FROM user_project_roles 
    WHERE user_id = auth.uid()
  )
);

-- Users can only edit projects where they are Admin
CREATE POLICY "Admins can edit projects"
ON projects FOR UPDATE
USING (
  id IN (
    SELECT project_id 
    FROM user_project_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);
```

---

## UI/UX Patterns

### Role Badge
```tsx
<Badge variant={roleColor}>
  {currentProjectRole === 'admin' && '👑 Admin'}
  {currentProjectRole === 'member' && '👤 Member'}
  {currentProjectRole === 'viewer' && '👁️ Viewer'}
</Badge>
```

### Navigation Updates
- Admin: Shows "Create Project", "Manage Team", "Settings"
- Member: Shows "My Tasks", "Projects", "Profile"
- Viewer: Shows "Dashboard", "Reports", "Analytics"

### Feature Gating
```tsx
<RoleGuard allowedRoles={['admin']}>
  <Button onClick={deleteProject}>Delete Project</Button>
</RoleGuard>
```

---

## PostHog Event Tracking

All events include project and role context:

```typescript
trackEvent('task_completed', {
  role: currentProjectRole,
  project_id: currentProjectId,
  project_name: currentProjectName,
  user_id: user.id,
});
```

**Key Events:**
- `project_switched` - When user changes projects
- `role_context_loaded` - When role is determined on login
- `permission_denied` - When user tries unauthorized action
- All feature events include role and project context

---

## Edge Cases Handled

### 1. User Removed from Project
```
User viewing Project A → Admin removes user from Project A
→ System detects on next API call
→ Redirects to default project
→ Shows toast: "You no longer have access to Project A"
```

### 2. Role Changed While Viewing
```
User viewing Project A as Member → Admin promotes to Admin
→ System detects role change
→ Refreshes dashboard to Admin view
→ Shows toast: "Your role has been updated to Admin"
```

### 3. Project Deleted
```
User viewing Project A → Admin deletes Project A
→ System detects on next API call
→ Redirects to project list
→ Shows toast: "Project A has been deleted"
```

### 4. No Projects Available
```
New user logs in → No projects assigned yet
→ Shows empty state
→ CTA: "Create Your First Project" (becomes Admin)
→ Or: "Wait for invitation" (if can't create)
```

---

## Migration Path

For existing implementations:

1. **Add project context to all API calls**
   - Include project_id in headers or params
   - Update API routes to validate role per project

2. **Update Zustand stores**
   - Add project context store
   - Persist last selected project

3. **Create project switcher component**
   - Add to all dashboard layouts
   - Wire up to context store

4. **Update RLS policies**
   - Add project_id filters
   - Check role in user_project_roles table

5. **Update PostHog tracking**
   - Include project_id and role in all events
   - Create project-level dashboards

---

## Benefits

✅ **Flexibility**: Users can participate in multiple projects with appropriate permissions  
✅ **Security**: Role enforcement at database level per project  
✅ **UX**: Clean, focused dashboards for each role  
✅ **Scalability**: Easy to add users to projects without global permission changes  
✅ **Analytics**: Track behavior by role and project context  

---

## Documentation Updated

- ✅ `prd_pm_wizard.md` - Requirements updated with role-switching
- ✅ `coding-agent-prompt.md` - Development rules updated
- ✅ `tasks_pm_wizard.md` - Architecture and components updated
- ✅ `ROLE_SWITCHING_ARCHITECTURE.md` - This document created

---

**Next Steps**: Implement project switcher component and update existing role detection logic to support per-project roles.
