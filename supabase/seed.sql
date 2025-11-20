-- Seed script for PM Wizard
-- Creates sample data with role assignments for testing

-- Note: This assumes you have test users created in Supabase Auth
-- Replace these UUIDs with actual user IDs from your auth.users table

-- Sample organization
INSERT INTO organizations (id, name, slug, tier, created_by)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Acme Corporation', 'acme-corp', 'growth', NULL);

-- Sample profiles (create these users in Supabase Auth first)
-- User 1: admin@example.com (Admin)
-- User 2: member@example.com (Member)
-- User 3: viewer@example.com (Viewer)

-- Assign organization roles
-- INSERT INTO user_organization_roles (user_id, organization_id, role)
-- VALUES 
--   ('user-1-uuid', '00000000-0000-0000-0000-000000000001', 'admin'),
--   ('user-2-uuid', '00000000-0000-0000-0000-000000000001', 'member'),
--   ('user-3-uuid', '00000000-0000-0000-0000-000000000001', 'viewer');

-- Sample team
INSERT INTO teams (id, organization_id, name, description)
VALUES 
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Development Team', 'Core development team');

-- Sample project
INSERT INTO projects (id, organization_id, name, description, status, deadline)
VALUES 
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Website Redesign', 'Complete redesign of company website', 'active', NOW() + INTERVAL '30 days');

-- Assign project roles (uncomment and replace UUIDs after creating users)
-- INSERT INTO user_project_roles (user_id, project_id, role)
-- VALUES 
--   ('user-1-uuid', '00000000-0000-0000-0000-000000000003', 'admin'),
--   ('user-2-uuid', '00000000-0000-0000-0000-000000000003', 'member'),
--   ('user-3-uuid', '00000000-0000-0000-0000-000000000003', 'viewer');

-- Sample milestone
INSERT INTO milestones (id, project_id, name, due_date, status)
VALUES 
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'Design Phase', NOW() + INTERVAL '10 days', 'in_progress');

-- Sample tasks (uncomment and replace user UUIDs)
-- INSERT INTO tasks (project_id, milestone_id, title, description, status, priority, assigned_to)
-- VALUES 
--   ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'Create wireframes', 'Design wireframes for all pages', 'in_progress', 'high', 'user-2-uuid'),
--   ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'Review brand guidelines', 'Ensure design aligns with brand', 'todo', 'medium', 'user-2-uuid'),
--   ('00000000-0000-0000-0000-000000000003', NULL, 'Setup development environment', 'Configure local dev environment', 'completed', 'high', 'user-2-uuid');
