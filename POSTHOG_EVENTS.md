# PostHog Event Tracking Documentation

## Overview
This document lists all PostHog events tracked in PM Wizard with role-based context.

## User Events

### Authentication
- **user_logged_in**
  - Properties: `role`, `method` (email/google)
  - Triggered: On successful login
  - Roles: All

- **login_failed**
  - Properties: `error`
  - Triggered: On login error
  - Roles: All

- **login_attempt**
  - Properties: `method` (google)
  - Triggered: When OAuth login initiated
  - Roles: All

## Project Events

### Project Management (Admin Only)
- **wizard_started**
  - Properties: `role` (admin)
  - Triggered: When project wizard opens
  - Roles: Admin

- **project_created**
  - Properties: `role`, `template`, `team_size`
  - Triggered: When project is successfully created
  - Roles: Admin

### Project Viewing
- **projects_viewed**
  - Properties: `role` (admin/member/viewer)
  - Triggered: When projects list page is accessed
  - Roles: All

## Task Events

### Task Management
- **task_completed**
  - Properties: `role`, `task_id`
  - Triggered: When member marks task as complete
  - Roles: Member

## Analytics Events

### Analytics Pages
- **analytics_viewed**
  - Properties: `role` (admin/member/viewer)
  - Triggered: When any analytics page is accessed
  - Roles: All

### Reports (Viewer)
- **report_viewed**
  - Properties: `role`, `page`
  - Triggered: When viewer accesses reports page
  - Roles: Viewer

## Page View Events

### Automatic Tracking
- **$pageview**
  - Properties: `page_name`, `role`
  - Triggered: On every page navigation
  - Roles: All

## User Identification

### User Properties
When a user logs in, they are identified with:
- `userId`: Supabase user ID
- `email`: User email
- `role`: Current role (admin/member/viewer)
- `organization_id`: Organization ID (if applicable)

## Implementation Notes

1. All events include role context for segmentation
2. Events are tracked client-side using `posthog-js`
3. User identification happens on login
4. Page views are automatically tracked via PostHogProvider
5. Sensitive data (passwords, API keys) is never tracked

## Future Events to Add

- **task_created** (Admin)
- **task_assigned** (Admin)
- **comment_added** (Admin, Member)
- **file_uploaded** (Admin, Member)
- **team_member_invited** (Admin)
- **role_assigned** (Admin)
- **notification_sent** (All)
- **search_performed** (All)
- **export_requested** (Viewer)
