-- ============================================================================
-- PM WIZARD - COMBINED DATABASE MIGRATION
-- ============================================================================
-- This file combines all three migrations into one for easy execution
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================================

-- ============================================================================
-- PART 1: INITIAL SCHEMA
-- ============================================================================

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('admin', 'member', 'viewer');
CREATE TYPE project_status AS ENUM ('draft', 'active', 'completed', 'archived');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'completed');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE milestone_status AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE org_tier AS ENUM ('free', 'starter', 'growth');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  notification_preferences JSONB DEFAULT '{"email": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tier org_tier DEFAULT 'free',
  quota_projects INT DEFAULT 5,
  quota_storage_mb INT DEFAULT 100,
  quota_ai_requests INT DEFAULT 5,
  usage_projects INT DEFAULT 0,
  usage_storage_mb INT DEFAULT 0,
  usage_ai_requests INT DEFAULT 0,
  grace_period_ends_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- User-Organization roles junction table
CREATE TABLE user_organization_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);

-- Teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Team members junction table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status project_status DEFAULT 'draft',
  deadline TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- User-Project roles junction table
CREATE TABLE user_project_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- Team-Project roles junction table
CREATE TABLE team_project_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, project_id)
);

-- Milestones table
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  due_date TIMESTAMPTZ,
  status milestone_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES milestones(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status task_status DEFAULT 'todo',
  priority task_priority DEFAULT 'medium',
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  mentions UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Files table
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES auth.users(id),
  filename TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wizard drafts table
CREATE TABLE wizard_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  draft_data JSONB NOT NULL,
  step INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI cache table
CREATE TABLE ai_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_hash TEXT UNIQUE NOT NULL,
  response JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_created_by ON organizations(created_by);
CREATE INDEX idx_user_org_roles_user ON user_organization_roles(user_id);
CREATE INDEX idx_user_org_roles_org ON user_organization_roles(organization_id);
CREATE INDEX idx_user_org_roles_role ON user_organization_roles(role);
CREATE INDEX idx_user_project_roles_user ON user_project_roles(user_id);
CREATE INDEX idx_user_project_roles_project ON user_project_roles(project_id);
CREATE INDEX idx_user_project_roles_role ON user_project_roles(role);
CREATE INDEX idx_team_project_roles_team ON team_project_roles(team_id);
CREATE INDEX idx_team_project_roles_project ON team_project_roles(project_id);
CREATE INDEX idx_projects_org ON projects(organization_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_deleted ON projects(deleted_at);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_deleted ON tasks(deleted_at);
CREATE INDEX idx_comments_task ON comments(task_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_files_task ON files(task_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created ON notifications(created_at);
CREATE INDEX idx_wizard_drafts_user ON wizard_drafts(user_id);
CREATE INDEX idx_wizard_drafts_org ON wizard_drafts(organization_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wizard_drafts_updated_at BEFORE UPDATE ON wizard_drafts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PART 2: ROLE FUNCTIONS
-- ============================================================================

-- Function to check if user has a specific role in a project
CREATE OR REPLACE FUNCTION check_user_project_role(
  p_user_id UUID,
  p_project_id UUID,
  p_required_role user_role
)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_role user_role;
BEGIN
  -- Check direct user-project role
  SELECT role INTO v_user_role
  FROM user_project_roles
  WHERE user_id = p_user_id AND project_id = p_project_id;
  
  IF FOUND THEN
    -- Admin has all permissions
    IF v_user_role = 'admin' THEN
      RETURN TRUE;
    END IF;
    
    -- Check if user's role matches or exceeds required role
    IF p_required_role = 'viewer' THEN
      RETURN TRUE;
    ELSIF p_required_role = 'member' AND v_user_role IN ('member', 'admin') THEN
      RETURN TRUE;
    ELSIF p_required_role = 'admin' AND v_user_role = 'admin' THEN
      RETURN TRUE;
    END IF;
  END IF;
  
  -- Check team-based roles
  SELECT tpr.role INTO v_user_role
  FROM team_project_roles tpr
  JOIN team_members tm ON tm.team_id = tpr.team_id
  WHERE tm.user_id = p_user_id AND tpr.project_id = p_project_id
  LIMIT 1;
  
  IF FOUND THEN
    IF v_user_role = 'admin' THEN
      RETURN TRUE;
    END IF;
    
    IF p_required_role = 'viewer' THEN
      RETURN TRUE;
    ELSIF p_required_role = 'member' AND v_user_role IN ('member', 'admin') THEN
      RETURN TRUE;
    ELSIF p_required_role = 'admin' AND v_user_role = 'admin' THEN
      RETURN TRUE;
    END IF;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's highest role in a project
CREATE OR REPLACE FUNCTION get_user_project_role(
  p_user_id UUID,
  p_project_id UUID
)
RETURNS user_role AS $$
DECLARE
  v_direct_role user_role;
  v_team_role user_role;
BEGIN
  -- Check direct role
  SELECT role INTO v_direct_role
  FROM user_project_roles
  WHERE user_id = p_user_id AND project_id = p_project_id;
  
  -- Check team role
  SELECT tpr.role INTO v_team_role
  FROM team_project_roles tpr
  JOIN team_members tm ON tm.team_id = tpr.team_id
  WHERE tm.user_id = p_user_id AND tpr.project_id = p_project_id
  ORDER BY CASE tpr.role
    WHEN 'admin' THEN 1
    WHEN 'member' THEN 2
    WHEN 'viewer' THEN 3
  END
  LIMIT 1;
  
  -- Return highest role (admin > member > viewer)
  IF v_direct_role = 'admin' OR v_team_role = 'admin' THEN
    RETURN 'admin';
  ELSIF v_direct_role = 'member' OR v_team_role = 'member' THEN
    RETURN 'member';
  ELSIF v_direct_role = 'viewer' OR v_team_role = 'viewer' THEN
    RETURN 'viewer';
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is org admin
CREATE OR REPLACE FUNCTION is_org_admin(
  p_user_id UUID,
  p_org_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_organization_roles
    WHERE user_id = p_user_id 
    AND organization_id = p_org_id 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all projects user has access to
CREATE OR REPLACE FUNCTION get_user_projects(p_user_id UUID)
RETURNS TABLE (
  project_id UUID,
  project_name TEXT,
  user_role user_role
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    p.id,
    p.name,
    get_user_project_role(p_user_id, p.id) as role
  FROM projects p
  WHERE EXISTS (
    SELECT 1 FROM user_project_roles upr
    WHERE upr.user_id = p_user_id AND upr.project_id = p.id
  )
  OR EXISTS (
    SELECT 1 FROM team_project_roles tpr
    JOIN team_members tm ON tm.team_id = tpr.team_id
    WHERE tm.user_id = p_user_id AND tpr.project_id = p.id
  )
  AND p.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PART 3: ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_organization_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_project_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_project_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE wizard_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_cache ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, update own
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Organizations: Members can view, admins can manage
CREATE POLICY "Users can view orgs they belong to" ON organizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_organization_roles
      WHERE user_id = auth.uid() AND organization_id = organizations.id
    )
  );

CREATE POLICY "Org admins can update org" ON organizations FOR UPDATE
  USING (is_org_admin(auth.uid(), id));

CREATE POLICY "Users can create orgs" ON organizations FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- User organization roles: Admins can manage
CREATE POLICY "Users can view org roles" ON user_organization_roles FOR SELECT
  USING (
    user_id = auth.uid() OR
    is_org_admin(auth.uid(), organization_id)
  );

CREATE POLICY "Org admins can manage roles" ON user_organization_roles FOR ALL
  USING (is_org_admin(auth.uid(), organization_id));

-- Projects: Role-based access
CREATE POLICY "Users can view projects they have access to" ON projects FOR SELECT
  USING (
    deleted_at IS NULL AND (
      EXISTS (
        SELECT 1 FROM user_project_roles
        WHERE user_id = auth.uid() AND project_id = projects.id
      ) OR
      EXISTS (
        SELECT 1 FROM team_project_roles tpr
        JOIN team_members tm ON tm.team_id = tpr.team_id
        WHERE tm.user_id = auth.uid() AND tpr.project_id = projects.id
      )
    )
  );

CREATE POLICY "Project admins can update projects" ON projects FOR UPDATE
  USING (check_user_project_role(auth.uid(), id, 'admin'));

CREATE POLICY "Org admins can create projects" ON projects FOR INSERT
  WITH CHECK (is_org_admin(auth.uid(), organization_id));

CREATE POLICY "Project admins can delete projects" ON projects FOR DELETE
  USING (check_user_project_role(auth.uid(), id, 'admin'));

-- User project roles: Admins can manage
CREATE POLICY "Users can view project roles" ON user_project_roles FOR SELECT
  USING (
    user_id = auth.uid() OR
    check_user_project_role(auth.uid(), project_id, 'admin')
  );

CREATE POLICY "Project admins can manage roles" ON user_project_roles FOR ALL
  USING (check_user_project_role(auth.uid(), project_id, 'admin'));

-- Tasks: Role-based access
CREATE POLICY "Users can view tasks in their projects" ON tasks FOR SELECT
  USING (
    deleted_at IS NULL AND
    check_user_project_role(auth.uid(), project_id, 'viewer')
  );

CREATE POLICY "Project admins can manage tasks" ON tasks FOR ALL
  USING (check_user_project_role(auth.uid(), project_id, 'admin'));

CREATE POLICY "Members can update own tasks" ON tasks FOR UPDATE
  USING (
    assigned_to = auth.uid() AND
    check_user_project_role(auth.uid(), project_id, 'member')
  );

-- Comments: Admins and members can create
CREATE POLICY "Users can view comments" ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = comments.task_id
      AND check_user_project_role(auth.uid(), tasks.project_id, 'viewer')
    )
  );

CREATE POLICY "Members can create comments" ON comments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_id
      AND check_user_project_role(auth.uid(), tasks.project_id, 'member')
    )
  );

CREATE POLICY "Users can update own comments" ON comments FOR UPDATE
  USING (user_id = auth.uid());

-- Files: Admins and members can upload
CREATE POLICY "Users can view files" ON files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = files.task_id
      AND check_user_project_role(auth.uid(), tasks.project_id, 'viewer')
    )
  );

CREATE POLICY "Members can upload files" ON files FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_id
      AND check_user_project_role(auth.uid(), tasks.project_id, 'member')
    )
  );

-- Notifications: Users can view own
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Wizard drafts: Users can manage own
CREATE POLICY "Users can manage own drafts" ON wizard_drafts FOR ALL
  USING (user_id = auth.uid());

-- Teams: Org members can view, admins can manage
CREATE POLICY "Users can view org teams" ON teams FOR SELECT
  USING (
    deleted_at IS NULL AND
    EXISTS (
      SELECT 1 FROM user_organization_roles
      WHERE user_id = auth.uid() AND organization_id = teams.organization_id
    )
  );

CREATE POLICY "Org admins can manage teams" ON teams FOR ALL
  USING (is_org_admin(auth.uid(), organization_id));

-- Milestones: Project access required
CREATE POLICY "Users can view milestones" ON milestones FOR SELECT
  USING (check_user_project_role(auth.uid(), project_id, 'viewer'));

CREATE POLICY "Project admins can manage milestones" ON milestones FOR ALL
  USING (check_user_project_role(auth.uid(), project_id, 'admin'));

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- All tables, functions, and RLS policies have been created
-- You can now proceed with seeding test data
-- ============================================================================
