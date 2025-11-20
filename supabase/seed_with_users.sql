-- ============================================================================
-- PM WIZARD - SEED DATA
-- ============================================================================
-- Run this in Supabase Dashboard > SQL Editor after creating test users
-- ============================================================================

-- Insert profiles for test users
INSERT INTO profiles (id, full_name, avatar_url) VALUES
  ('cc5048f2-1dea-4d0d-af2a-e6ebf3809a18', 'Admin User', NULL),
  ('24bab7c0-9a19-4534-9fbb-d7c567766968', 'Member User', NULL),
  ('d4702e63-1f49-4482-bf45-82eaf1febcbe', 'Viewer User', NULL);

-- Create test organization
INSERT INTO organizations (id, name, slug, tier, created_by) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Acme Corporation', 'acme-corp', 'growth', 'cc5048f2-1dea-4d0d-af2a-e6ebf3809a18');

-- Assign organization roles
INSERT INTO user_organization_roles (user_id, organization_id, role) VALUES
  ('cc5048f2-1dea-4d0d-af2a-e6ebf3809a18', '11111111-1111-1111-1111-111111111111', 'admin'),
  ('24bab7c0-9a19-4534-9fbb-d7c567766968', '11111111-1111-1111-1111-111111111111', 'member'),
  ('d4702e63-1f49-4482-bf45-82eaf1febcbe', '11111111-1111-1111-1111-111111111111', 'viewer');

-- Create test team
INSERT INTO teams (id, organization_id, name, description, created_by) VALUES
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Development Team', 'Core development team', 'cc5048f2-1dea-4d0d-af2a-e6ebf3809a18');

-- Add team members
INSERT INTO team_members (team_id, user_id) VALUES
  ('22222222-2222-2222-2222-222222222222', 'cc5048f2-1dea-4d0d-af2a-e6ebf3809a18'),
  ('22222222-2222-2222-2222-222222222222', '24bab7c0-9a19-4534-9fbb-d7c567766968');

-- Create test project
INSERT INTO projects (id, organization_id, name, description, status, deadline, created_by) VALUES
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Website Redesign', 'Complete redesign of company website', 'active', NOW() + INTERVAL '30 days', 'cc5048f2-1dea-4d0d-af2a-e6ebf3809a18');

-- Assign project roles
INSERT INTO user_project_roles (user_id, project_id, role) VALUES
  ('cc5048f2-1dea-4d0d-af2a-e6ebf3809a18', '33333333-3333-3333-3333-333333333333', 'admin'),
  ('24bab7c0-9a19-4534-9fbb-d7c567766968', '33333333-3333-3333-3333-333333333333', 'member'),
  ('d4702e63-1f49-4482-bf45-82eaf1febcbe', '33333333-3333-3333-3333-333333333333', 'viewer');

-- Create milestone
INSERT INTO milestones (id, project_id, name, due_date, status) VALUES
  ('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'Phase 1: Design', NOW() + INTERVAL '10 days', 'in_progress');

-- Create sample tasks
INSERT INTO tasks (project_id, milestone_id, title, description, status, priority, assigned_to, due_date, created_by) VALUES
  ('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'Create wireframes', 'Design wireframes for all main pages', 'in_progress', 'high', '24bab7c0-9a19-4534-9fbb-d7c567766968', NOW() + INTERVAL '5 days', 'cc5048f2-1dea-4d0d-af2a-e6ebf3809a18'),
  ('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'Review brand guidelines', 'Review and update brand guidelines document', 'todo', 'medium', '24bab7c0-9a19-4534-9fbb-d7c567766968', NOW() + INTERVAL '7 days', 'cc5048f2-1dea-4d0d-af2a-e6ebf3809a18'),
  ('33333333-3333-3333-3333-333333333333', NULL, 'Setup development environment', 'Configure local dev environment for new design', 'completed', 'high', '24bab7c0-9a19-4534-9fbb-d7c567766968', NOW() - INTERVAL '2 days', 'cc5048f2-1dea-4d0d-af2a-e6ebf3809a18'),
  ('33333333-3333-3333-3333-333333333333', NULL, 'Competitor analysis', 'Research competitor websites and features', 'todo', 'low', NULL, NOW() + INTERVAL '15 days', 'cc5048f2-1dea-4d0d-af2a-e6ebf3809a18');

-- Create sample notifications
INSERT INTO notifications (user_id, type, title, content, link, read) VALUES
  ('cc5048f2-1dea-4d0d-af2a-e6ebf3809a18', 'project_created', 'Project Created', 'Website Redesign project has been created', '/admin/projects/33333333-3333-3333-3333-333333333333', true),
  ('24bab7c0-9a19-4534-9fbb-d7c567766968', 'task_assigned', 'New Task Assigned', 'You have been assigned to: Create wireframes', '/member/tasks', false),
  ('24bab7c0-9a19-4534-9fbb-d7c567766968', 'task_assigned', 'New Task Assigned', 'You have been assigned to: Review brand guidelines', '/member/tasks', false),
  ('d4702e63-1f49-4482-bf45-82eaf1febcbe', 'project_update', 'Project Status Update', 'Website Redesign is now active', '/viewer/dashboard', false);

-- ============================================================================
-- SEED COMPLETE
-- ============================================================================
-- Test users can now log in:
-- Admin:  admin@test.com / Test123456!
-- Member: member@test.com / Test123456!
-- Viewer: viewer@test.com / Test123456!
-- ============================================================================
