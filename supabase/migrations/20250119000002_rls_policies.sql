-- Row Level Security Policies for PM Wizard

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
