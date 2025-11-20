-- Role-checking SQL functions for PM Wizard

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
