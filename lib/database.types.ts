export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'member' | 'viewer'
export type ProjectStatus = 'draft' | 'active' | 'completed' | 'archived'
export type TaskStatus = 'todo' | 'in_progress' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'
export type MilestoneStatus = 'pending' | 'in_progress' | 'completed'
export type OrgTier = 'free' | 'starter' | 'growth'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          notification_preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          notification_preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          notification_preferences?: Json
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          tier: OrgTier
          quota_projects: number
          quota_storage_mb: number
          quota_ai_requests: number
          usage_projects: number
          usage_storage_mb: number
          usage_ai_requests: number
          grace_period_ends_at: string | null
          created_by: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          tier?: OrgTier
          quota_projects?: number
          quota_storage_mb?: number
          quota_ai_requests?: number
          usage_projects?: number
          usage_storage_mb?: number
          usage_ai_requests?: number
          grace_period_ends_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          name?: string
          slug?: string
          tier?: OrgTier
          quota_projects?: number
          quota_storage_mb?: number
          quota_ai_requests?: number
          usage_projects?: number
          usage_storage_mb?: number
          usage_ai_requests?: number
          grace_period_ends_at?: string | null
          updated_at?: string
          deleted_at?: string | null
        }
      }
      user_organization_roles: {
        Row: {
          id: string
          user_id: string
          organization_id: string
          role: UserRole
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id: string
          role: UserRole
          created_at?: string
        }
        Update: {
          role?: UserRole
        }
      }
      teams: {
        Row: {
          id: string
          organization_id: string
          name: string
          description: string | null
          created_by: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          description?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          name?: string
          description?: string | null
          updated_at?: string
          deleted_at?: string | null
        }
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          created_at?: string
        }
        Update: {}
      }
      projects: {
        Row: {
          id: string
          organization_id: string
          name: string
          description: string | null
          status: ProjectStatus
          deadline: string | null
          created_by: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          description?: string | null
          status?: ProjectStatus
          deadline?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          name?: string
          description?: string | null
          status?: ProjectStatus
          deadline?: string | null
          updated_at?: string
          deleted_at?: string | null
        }
      }
      user_project_roles: {
        Row: {
          id: string
          user_id: string
          project_id: string
          role: UserRole
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          role: UserRole
          created_at?: string
        }
        Update: {
          role?: UserRole
        }
      }
      team_project_roles: {
        Row: {
          id: string
          team_id: string
          project_id: string
          role: UserRole
          created_at: string
        }
        Insert: {
          id?: string
          team_id: string
          project_id: string
          role: UserRole
          created_at?: string
        }
        Update: {
          role?: UserRole
        }
      }
      milestones: {
        Row: {
          id: string
          project_id: string
          name: string
          due_date: string | null
          status: MilestoneStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          due_date?: string | null
          status?: MilestoneStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          due_date?: string | null
          status?: MilestoneStatus
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          milestone_id: string | null
          title: string
          description: string | null
          status: TaskStatus
          priority: TaskPriority
          assigned_to: string | null
          due_date: string | null
          created_by: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          milestone_id?: string | null
          title: string
          description?: string | null
          status?: TaskStatus
          priority?: TaskPriority
          assigned_to?: string | null
          due_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          title?: string
          description?: string | null
          status?: TaskStatus
          priority?: TaskPriority
          assigned_to?: string | null
          due_date?: string | null
          updated_at?: string
          deleted_at?: string | null
        }
      }
      comments: {
        Row: {
          id: string
          task_id: string
          user_id: string
          content: string
          mentions: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          content: string
          mentions?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          content?: string
          mentions?: string[] | null
          updated_at?: string
        }
      }
      files: {
        Row: {
          id: string
          task_id: string
          uploaded_by: string | null
          filename: string
          file_size: number
          file_type: string
          storage_path: string
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          uploaded_by?: string | null
          filename: string
          file_size: number
          file_type: string
          storage_path: string
          created_at?: string
        }
        Update: {}
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          content: string | null
          link: string | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          content?: string | null
          link?: string | null
          read?: boolean
          created_at?: string
        }
        Update: {
          read?: boolean
        }
      }
      wizard_drafts: {
        Row: {
          id: string
          user_id: string
          organization_id: string
          draft_data: Json
          step: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id: string
          draft_data: Json
          step?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          draft_data?: Json
          step?: number
          updated_at?: string
        }
      }
      ai_cache: {
        Row: {
          id: string
          query_hash: string
          response: Json
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          query_hash: string
          response: Json
          expires_at: string
          created_at?: string
        }
        Update: {}
      }
    }
    Functions: {
      check_user_project_role: {
        Args: {
          p_user_id: string
          p_project_id: string
          p_required_role: UserRole
        }
        Returns: boolean
      }
      get_user_project_role: {
        Args: {
          p_user_id: string
          p_project_id: string
        }
        Returns: UserRole | null
      }
      is_org_admin: {
        Args: {
          p_user_id: string
          p_org_id: string
        }
        Returns: boolean
      }
    }
  }
}
