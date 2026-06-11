-- ============================================
-- FREELANCER PROJECT TRACKER - SUPABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('FREELANCER', 'CLIENT');
CREATE TYPE project_status AS ENUM ('PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED');
CREATE TYPE task_status AS ENUM ('BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED');
CREATE TYPE scope_item_status AS ENUM ('IN_SCOPE', 'OUT_OF_SCOPE', 'UNDER_REVIEW');
CREATE TYPE activity_type AS ENUM (
  'TASK_CREATED', 'TASK_UPDATED', 'TASK_STATUS_CHANGED', 'TASK_COMPLETED',
  'PROJECT_CREATED', 'PROJECT_UPDATED', 'PROJECT_STATUS_CHANGED', 'PROJECT_COMPLETED',
  'CLIENT_ACCESSED_VIEW', 'CLIENT_COMMENT_ADDED',
  'SCOPE_ITEM_ADDED', 'SCOPE_ITEM_APPROVED'
);

-- ============================================
-- TABLES
-- ============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'CLIENT',

  -- Freelancer-specific fields
  freelancer_id UUID,

  -- Client-specific fields
  client_id UUID,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Freelancers table
CREATE TABLE freelancers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Public profile info
  bio TEXT,
  avatar TEXT,

  -- Business info
  hourly_rate INTEGER, -- in cents
  timezone TEXT NOT NULL DEFAULT 'UTC',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id)
);

-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Client info
  company TEXT,
  phone TEXT,

  -- Relations
  freelancer_id UUID REFERENCES freelancers(id),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id)
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Basic info
  name TEXT NOT NULL,
  description TEXT,
  status project_status NOT NULL DEFAULT 'ACTIVE',

  -- Timeline
  start_date TIMESTAMPTZ,
  due_date TIMESTAMPTZ,

  -- Relations
  freelancer_id UUID NOT NULL REFERENCES freelancers(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

  -- Metadata
  budget INTEGER, -- in cents
  completion_percentage INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Basic info
  title TEXT NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'BACKLOG',

  -- Timeline
  due_date TIMESTAMPTZ,

  -- Relations
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- Metadata
  "order" INTEGER NOT NULL DEFAULT 0,
  estimate INTEGER, -- in minutes
  time_spent INTEGER NOT NULL DEFAULT 0,
  is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
  blocked_reason TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Scope items table
CREATE TABLE scope_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Basic info
  title TEXT NOT NULL,
  description TEXT,
  status scope_item_status NOT NULL DEFAULT 'IN_SCOPE',

  -- Relations
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- Tracking
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by TEXT,

  UNIQUE(project_id, title)
);

-- Activity log table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Activity info
  type activity_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,

  -- Relations
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Metadata
  metadata JSONB,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Client access tokens table
CREATE TABLE client_access_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Token info
  token TEXT NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  -- Relations
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,

  -- Access control
  can_view_tasks BOOLEAN NOT NULL DEFAULT TRUE,
  can_view_timeline BOOLEAN NOT NULL DEFAULT TRUE,
  can_view_budget BOOLEAN NOT NULL DEFAULT FALSE,

  -- Tracking
  expires_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  access_count INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Weekly reports table
CREATE TABLE weekly_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Report info
  week TIMESTAMPTZ NOT NULL,

  -- Relations
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- Summary data
  tasks_completed INTEGER NOT NULL DEFAULT 0,
  tasks_in_progress INTEGER NOT NULL DEFAULT 0,
  time_tracked INTEGER NOT NULL DEFAULT 0,

  -- HTML content for sending
  html_content TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(project_id, week)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_freelancers_user_id ON freelancers(user_id);
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_freelancer_id ON clients(freelancer_id);
CREATE INDEX idx_projects_freelancer_id ON projects(freelancer_id);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_due_date ON projects(due_date);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_scope_items_project_id ON scope_items(project_id);
CREATE INDEX idx_scope_items_status ON scope_items(status);
CREATE INDEX idx_activity_logs_project_id ON activity_logs(project_id);
CREATE INDEX idx_activity_logs_type ON activity_logs(type);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_client_access_tokens_token ON client_access_tokens(token);
CREATE INDEX idx_client_access_tokens_client_id ON client_access_tokens(client_id);
CREATE INDEX idx_client_access_tokens_is_active ON client_access_tokens(is_active);
CREATE INDEX idx_weekly_reports_project_id ON weekly_reports(project_id);
CREATE INDEX idx_weekly_reports_week ON weekly_reports(week);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_freelancers_updated_at BEFORE UPDATE ON freelancers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_access_tokens_updated_at BEFORE UPDATE ON client_access_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE freelancers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE scope_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_access_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS POLICIES
-- ============================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- FREELANCERS POLICIES
-- ============================================

-- Freelancers can view their own profile
CREATE POLICY "Freelancers can view own profile" ON freelancers
  FOR SELECT USING (auth.uid() = user_id);

-- Freelancers can update their own profile
CREATE POLICY "Freelancers can update own profile" ON freelancers
  FOR UPDATE USING (auth.uid() = user_id);

-- Freelancers can insert their own profile
CREATE POLICY "Freelancers can insert own profile" ON freelancers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- CLIENTS POLICIES
-- ============================================

-- Clients can view their own profile
CREATE POLICY "Clients can view own profile" ON clients
  FOR SELECT USING (auth.uid() = user_id);

-- Clients can update their own profile
CREATE POLICY "Clients can update own profile" ON clients
  FOR UPDATE USING (auth.uid() = user_id);

-- Clients can insert their own profile
CREATE POLICY "Clients can insert own profile" ON clients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Freelancers can view clients assigned to them
CREATE POLICY "Freelancers can view their clients" ON clients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'FREELANCER'
      AND u.freelancer_id = clients.freelancer_id
    )
  );

-- ============================================
-- PROJECTS POLICIES
-- ============================================

-- Freelancers can view their own projects
CREATE POLICY "Freelancers can view own projects" ON projects
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM freelancers WHERE id = projects.freelancer_id
    )
  );

-- Freelancers can create projects
CREATE POLICY "Freelancers can create projects" ON projects
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM freelancers WHERE id = projects.freelancer_id
    )
  );

-- Freelancers can update their own projects
CREATE POLICY "Freelancers can update own projects" ON projects
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM freelancers WHERE id = projects.freelancer_id
    )
  );

-- Freelancers can delete their own projects
CREATE POLICY "Freelancers can delete own projects" ON projects
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM freelancers WHERE id = projects.freelancer_id
    )
  );

-- Clients can view projects assigned to them via valid access tokens
CREATE POLICY "Clients can view projects via tokens" ON projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM client_access_tokens cat
      WHERE cat.project_id = projects.id
      AND cat.client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
      AND cat.is_active = true
      AND (cat.expires_at IS NULL OR cat.expires_at > NOW())
    )
  );

-- ============================================
-- TASKS POLICIES
-- ============================================

-- Freelancers can view tasks in their projects
CREATE POLICY "Freelancers can view project tasks" ON tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = tasks.project_id
      AND auth.uid() IN (
        SELECT user_id FROM freelancers WHERE id = p.freelancer_id
      )
    )
  );

-- Freelancers can create tasks in their projects
CREATE POLICY "Freelancers can create project tasks" ON tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = tasks.project_id
      AND auth.uid() IN (
        SELECT user_id FROM freelancers WHERE id = p.freelancer_id
      )
    )
  );

-- Freelancers can update tasks in their projects
CREATE POLICY "Freelancers can update project tasks" ON tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = tasks.project_id
      AND auth.uid() IN (
        SELECT user_id FROM freelancers WHERE id = p.freelancer_id
      )
    )
  );

-- Freelancers can delete tasks in their projects
CREATE POLICY "Freelancers can delete project tasks" ON tasks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = tasks.project_id
      AND auth.uid() IN (
        SELECT user_id FROM freelancers WHERE id = p.freelancer_id
      )
    )
  );

-- Clients can view tasks in projects they have access to
CREATE POLICY "Clients can view accessible project tasks" ON tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN client_access_tokens cat ON cat.project_id = p.id
      WHERE p.id = tasks.project_id
      AND cat.client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
      AND cat.can_view_tasks = true
      AND cat.is_active = true
      AND (cat.expires_at IS NULL OR cat.expires_at > NOW())
    )
  );

-- ============================================
-- SCOPE ITEMS POLICIES
-- ============================================

-- Freelancers can manage scope items in their projects
CREATE POLICY "Freelancers can manage project scope items" ON scope_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = scope_items.project_id
      AND auth.uid() IN (
        SELECT user_id FROM freelancers WHERE id = p.freelancer_id
      )
    )
  );

-- Clients can view scope items in accessible projects
CREATE POLICY "Clients can view accessible project scope items" ON scope_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN client_access_tokens cat ON cat.project_id = p.id
      WHERE p.id = scope_items.project_id
      AND cat.client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
      AND cat.is_active = true
      AND (cat.expires_at IS NULL OR cat.expires_at > NOW())
    )
  );

-- ============================================
-- ACTIVITY LOGS POLICIES
-- ============================================

-- Freelancers can view activity logs for their projects
CREATE POLICY "Freelancers can view project activity logs" ON activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = activity_logs.project_id
      AND auth.uid() IN (
        SELECT user_id FROM freelancers WHERE id = p.freelancer_id
      )
    )
  );

-- Freelancers can create activity logs for their projects
CREATE POLICY "Freelancers can create project activity logs" ON activity_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = activity_logs.project_id
      AND auth.uid() IN (
        SELECT user_id FROM freelancers WHERE id = p.freelancer_id
      )
    )
  );

-- Clients can view activity logs for accessible projects
CREATE POLICY "Clients can view accessible project activity logs" ON activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN client_access_tokens cat ON cat.project_id = p.id
      WHERE p.id = activity_logs.project_id
      AND cat.client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
      AND cat.is_active = true
      AND (cat.expires_at IS NULL OR cat.expires_at > NOW())
    )
  );

-- ============================================
-- CLIENT ACCESS TOKENS POLICIES
-- ============================================

-- Freelancers can manage access tokens for their clients
CREATE POLICY "Freelancers can manage client access tokens" ON client_access_tokens
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM clients c
      WHERE c.id = client_access_tokens.client_id
      AND auth.uid() IN (
        SELECT user_id FROM freelancers WHERE id = c.freelancer_id
      )
    )
  );

-- Clients can view their own access tokens
CREATE POLICY "Clients can view own access tokens" ON client_access_tokens
  FOR SELECT USING (
    client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
  );

-- ============================================
-- WEEKLY REPORTS POLICIES
-- ============================================

-- Freelancers can manage weekly reports for their projects
CREATE POLICY "Freelancers can manage project weekly reports" ON weekly_reports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = weekly_reports.project_id
      AND auth.uid() IN (
        SELECT user_id FROM freelancers WHERE id = p.freelancer_id
      )
    )
  );

-- Clients can view weekly reports for accessible projects
CREATE POLICY "Clients can view accessible project weekly reports" ON weekly_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN client_access_tokens cat ON cat.project_id = p.id
      WHERE p.id = weekly_reports.project_id
      AND cat.client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
      AND cat.is_active = true
      AND (cat.expires_at IS NULL OR cat.expires_at > NOW())
    )
  );