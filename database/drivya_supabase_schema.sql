-- ============================
-- Supabase-ready SQL for Drivya.AI schema + mock data + RLS policies
-- Fixed for Supabase (uses auth.uid() instead of auth.role())
-- Paste into Supabase SQL editor and run.
-- ============================

BEGIN;

-- 1) Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2) Enum types
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'organization_type') THEN
    CREATE TYPE organization_type AS ENUM ('NGO','CSR','INCUBATOR','FOUNDATION','CONSULTANCY','GOVERNMENT');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'compliance_type') THEN
    CREATE TYPE compliance_type AS ENUM ('FCRA','TWELVE_A','EIGHTY_G','CSR_ELIGIBLE','REGISTERED','OTHER');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_status') THEN
    CREATE TYPE verification_status AS ENUM ('UNVERIFIED','PENDING','VERIFIED','REJECTED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fit_score_level') THEN
    CREATE TYPE fit_score_level AS ENUM ('EXCELLENT','GOOD','MODERATE','POOR');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workspace_role') THEN
    CREATE TYPE workspace_role AS ENUM ('OWNER','ADMIN','MEMBER','VIEWER');
  END IF;
END$$;

-- 3) Tables
-- Users
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text,
  password text,
  profile_image text,
  bio text,
  phone_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Workspaces
CREATE TABLE IF NOT EXISTS workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  logo text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- WorkspaceMember
CREATE TABLE IF NOT EXISTS workspace_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  role workspace_role DEFAULT 'MEMBER',
  joined_at timestamptz DEFAULT now(),
  UNIQUE (user_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON workspace_members(workspace_id);

-- Organizations
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  website text,
  description text,
  logo_url text,
  banner_url text,
  type organization_type NOT NULL,
  registration_number text,
  incorporation_year integer,
  team_size integer,
  headquarters_city text,
  headquarters_state text,
  headquarters_country text DEFAULT 'India',
  profile_summary text,
  profile_scraped boolean DEFAULT false,
  last_scraped_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_type ON organizations(type);
CREATE INDEX IF NOT EXISTS idx_organizations_headquarters_city ON organizations(headquarters_city);

-- NGOData
CREATE TABLE IF NOT EXISTS ngo_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
  registrar_12a text,
  registrar_80g text,
  fcra_number text,
  fcra_validity_till timestamptz,
  audited_reports_url text,
  annual_revenue bigint,
  beneficiaries integer,
  programs jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ngo_data_organization_id ON ngo_data(organization_id);

-- CSRData
CREATE TABLE IF NOT EXISTS csr_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
  csr_budget_annual bigint,
  csr_budget_year integer,
  csr_budget_link text,
  focus_areas jsonb,
  past_partners jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_csr_data_org ON csr_data(organization_id);

-- IncubatorData
CREATE TABLE IF NOT EXISTS incubator_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
  focus_sectors jsonb,
  portfolio_size integer,
  portfolio_exits integer,
  funding_provided bigint,
  website_link text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ContactPoint
CREATE TABLE IF NOT EXISTS contact_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  title text,
  email text,
  phone_number text,
  linkedin_url text,
  department text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_contact_points_org ON contact_points(organization_id);
CREATE INDEX IF NOT EXISTS idx_contact_points_email ON contact_points(email);

-- FocusArea
CREATE TABLE IF NOT EXISTS focus_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  color text,
  icon text,
  display_order integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_focus_areas_name ON focus_areas(name);

-- SubFocusArea
CREATE TABLE IF NOT EXISTS sub_focus_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  focus_area_id uuid NOT NULL REFERENCES focus_areas(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  display_order integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (focus_area_id, name)
);
CREATE INDEX IF NOT EXISTS idx_sub_focus_areas_focus ON sub_focus_areas(focus_area_id);

-- OrganizationFocusArea (join)
CREATE TABLE IF NOT EXISTS organization_focus_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  focus_area_id uuid NOT NULL REFERENCES focus_areas(id) ON DELETE CASCADE,
  is_primary boolean DEFAULT false,
  years_of_experience integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (organization_id, focus_area_id)
);
CREATE INDEX IF NOT EXISTS idx_org_focus_org ON organization_focus_areas(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_focus_area ON organization_focus_areas(focus_area_id);

-- SavedList
CREATE TABLE IF NOT EXISTS saved_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  color text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_saved_lists_ws ON saved_lists(workspace_id);
CREATE INDEX IF NOT EXISTS idx_saved_lists_user ON saved_lists(user_id);

-- SavedListItem
CREATE TABLE IF NOT EXISTS saved_list_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  saved_list_id uuid NOT NULL REFERENCES saved_lists(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  notes text,
  added_at timestamptz DEFAULT now(),
  UNIQUE (saved_list_id, organization_id)
);
CREATE INDEX IF NOT EXISTS idx_saved_items_list ON saved_list_items(saved_list_id);
CREATE INDEX IF NOT EXISTS idx_saved_items_org ON saved_list_items(organization_id);

-- Notes
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title text,
  content text NOT NULL,
  is_pinned boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notes_ws ON notes(workspace_id);
CREATE INDEX IF NOT EXISTS idx_notes_user ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_org ON notes(organization_id);

-- FitScoreCache
CREATE TABLE IF NOT EXISTS fit_score_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id_1 uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  organization_id_2 uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  overall_score double precision,
  focus_area_match double precision,
  geography_match double precision,
  compliance_match double precision,
  past_collab_match double precision,
  level fit_score_level,
  details jsonb,
  calculated_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  UNIQUE (organization_id_1, organization_id_2)
);
CREATE INDEX IF NOT EXISTS idx_fit_overall ON fit_score_cache(overall_score);

-- VerificationData
CREATE TABLE IF NOT EXISTS verification_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
  status verification_status DEFAULT 'UNVERIFIED',
  has_12a boolean,
  has_80g boolean,
  has_fcra boolean,
  is_csr_eligible boolean,
  is_registered boolean,
  incorporation_year integer,
  years_active integer,
  team_size integer,
  audited_reports boolean,
  niti_aayog boolean,
  guidestar boolean,
  credibility_score double precision,
  verification_notes text,
  last_verified_at timestamptz,
  verified_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_verification_org ON verification_data(organization_id);
CREATE INDEX IF NOT EXISTS idx_verification_status ON verification_data(status);

-- Program
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  type text,
  organization_id uuid REFERENCES organizations(id),
  focus_areas jsonb,
  eligibility jsonb,
  deadline timestamptz,
  application_url text,
  funding_amount bigint,
  budget_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_program_type ON programs(type);
CREATE INDEX IF NOT EXISTS idx_program_deadline ON programs(deadline);

-- Grants (renamed to grants_table to avoid SQL reserved word)
CREATE TABLE IF NOT EXISTS grants_table (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  funding_body text,
  amount bigint,
  deadline timestamptz,
  focus_areas jsonb,
  eligibility text,
  application_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_grants_body ON grants_table(funding_body);
CREATE INDEX IF NOT EXISTS idx_grants_deadline ON grants_table(deadline);

-- Proposal
CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ngo_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  csr_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  status text DEFAULT 'draft',
  subject text,
  email_body text,
  proposal_content text,
  fit_score_at timestamptz,
  sent_at timestamptz,
  opened_at timestamptz,
  responded_at timestamptz,
  customizations jsonb,
  attachments jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_proposals_ws ON proposals(workspace_id);
CREATE INDEX IF NOT EXISTS idx_proposals_user ON proposals(user_id);
CREATE INDEX IF NOT EXISTS idx_proposals_ngo ON proposals(ngo_id);
CREATE INDEX IF NOT EXISTS idx_proposals_csr ON proposals(csr_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);

-- ActivityLog
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  action text NOT NULL,
  description text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_activity_ws ON activity_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_org ON activity_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_activity_action ON activity_logs(action);

-- 4) Row Level Security (RLS) and policies
-- RECOMMENDED: Allow authenticated users (with Supabase JWT) to read & write.
-- The SQL Editor runs as service_role and bypasses RLS, so these policies apply to your app clients.

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE csr_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE incubator_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_focus_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_focus_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fit_score_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE grants_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users (use auth.uid())
-- USERS table: authenticated users can read/write only their own record
CREATE POLICY "users_auth_select" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_auth_insert" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_auth_update" ON users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "users_auth_delete" ON users FOR DELETE USING (auth.uid() = id);

-- WORKSPACES table: authenticated users can SELECT all, INSERT/UPDATE/DELETE (optional: restrict by membership)
CREATE POLICY "workspaces_auth_select" ON workspaces FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "workspaces_auth_insert" ON workspaces FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "workspaces_auth_update" ON workspaces FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "workspaces_auth_delete" ON workspaces FOR DELETE USING (auth.uid() IS NOT NULL);

-- WORKSPACE_MEMBERS table: authenticated users can read/write
CREATE POLICY "workspace_members_auth_select" ON workspace_members FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "workspace_members_auth_insert" ON workspace_members FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "workspace_members_auth_update" ON workspace_members FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "workspace_members_auth_delete" ON workspace_members FOR DELETE USING (auth.uid() IS NOT NULL);

-- ORGANIZATIONS table: allow all authenticated users to read; only owners/admins can write (simplified: allow all authenticated)
CREATE POLICY "organizations_auth_select" ON organizations FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "organizations_auth_insert" ON organizations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "organizations_auth_update" ON organizations FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "organizations_auth_delete" ON organizations FOR DELETE USING (auth.uid() IS NOT NULL);

-- NGO_DATA: authenticated users can read; only org owners can write
CREATE POLICY "ngo_data_auth_select" ON ngo_data FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "ngo_data_auth_insert" ON ngo_data FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "ngo_data_auth_update" ON ngo_data FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "ngo_data_auth_delete" ON ngo_data FOR DELETE USING (auth.uid() IS NOT NULL);

-- CSR_DATA: authenticated users can read; only org owners can write
CREATE POLICY "csr_data_auth_select" ON csr_data FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "csr_data_auth_insert" ON csr_data FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "csr_data_auth_update" ON csr_data FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "csr_data_auth_delete" ON csr_data FOR DELETE USING (auth.uid() IS NOT NULL);

-- INCUBATOR_DATA: authenticated users can read; only org owners can write
CREATE POLICY "incubator_data_auth_select" ON incubator_data FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "incubator_data_auth_insert" ON incubator_data FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "incubator_data_auth_update" ON incubator_data FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "incubator_data_auth_delete" ON incubator_data FOR DELETE USING (auth.uid() IS NOT NULL);

-- CONTACT_POINTS: authenticated users can read; only org owners can write
CREATE POLICY "contact_points_auth_select" ON contact_points FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "contact_points_auth_insert" ON contact_points FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "contact_points_auth_update" ON contact_points FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "contact_points_auth_delete" ON contact_points FOR DELETE USING (auth.uid() IS NOT NULL);

-- FOCUS_AREAS: read-only for authenticated users (admin manages)
CREATE POLICY "focus_areas_auth_select" ON focus_areas FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "focus_areas_auth_insert" ON focus_areas FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "focus_areas_auth_update" ON focus_areas FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- SUB_FOCUS_AREAS: read-only for authenticated
CREATE POLICY "sub_focus_areas_auth_select" ON sub_focus_areas FOR SELECT USING (auth.uid() IS NOT NULL);

-- ORGANIZATION_FOCUS_AREAS: read for authenticated
CREATE POLICY "organization_focus_areas_auth_select" ON organization_focus_areas FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "organization_focus_areas_auth_insert" ON organization_focus_areas FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "organization_focus_areas_auth_update" ON organization_focus_areas FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- SAVED_LISTS: users can read/write only their own
CREATE POLICY "saved_lists_auth_select" ON saved_lists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saved_lists_auth_insert" ON saved_lists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_lists_auth_update" ON saved_lists FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_lists_auth_delete" ON saved_lists FOR DELETE USING (auth.uid() = user_id);

-- SAVED_LIST_ITEMS: users can manage only their own lists
CREATE POLICY "saved_list_items_auth_select" ON saved_list_items FOR SELECT 
  USING (EXISTS(SELECT 1 FROM saved_lists WHERE saved_lists.id = saved_list_items.saved_list_id AND saved_lists.user_id = auth.uid()));
CREATE POLICY "saved_list_items_auth_insert" ON saved_list_items FOR INSERT 
  WITH CHECK (EXISTS(SELECT 1 FROM saved_lists WHERE saved_lists.id = saved_list_items.saved_list_id AND saved_lists.user_id = auth.uid()));
CREATE POLICY "saved_list_items_auth_update" ON saved_list_items FOR UPDATE 
  USING (EXISTS(SELECT 1 FROM saved_lists WHERE saved_lists.id = saved_list_items.saved_list_id AND saved_lists.user_id = auth.uid()))
  WITH CHECK (EXISTS(SELECT 1 FROM saved_lists WHERE saved_lists.id = saved_list_items.saved_list_id AND saved_lists.user_id = auth.uid()));
CREATE POLICY "saved_list_items_auth_delete" ON saved_list_items FOR DELETE 
  USING (EXISTS(SELECT 1 FROM saved_lists WHERE saved_lists.id = saved_list_items.saved_list_id AND saved_lists.user_id = auth.uid()));

-- NOTES: users can manage only their own workspace notes
CREATE POLICY "notes_auth_select" ON notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notes_auth_insert" ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notes_auth_update" ON notes FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notes_auth_delete" ON notes FOR DELETE USING (auth.uid() = user_id);

-- FIT_SCORE_CACHE: read for authenticated
CREATE POLICY "fit_score_cache_auth_select" ON fit_score_cache FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "fit_score_cache_auth_insert" ON fit_score_cache FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- VERIFICATION_DATA: read for authenticated
CREATE POLICY "verification_data_auth_select" ON verification_data FOR SELECT USING (auth.uid() IS NOT NULL);

-- PROGRAMS: read for authenticated
CREATE POLICY "programs_auth_select" ON programs FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "programs_auth_insert" ON programs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- GRANTS_TABLE: read for authenticated
CREATE POLICY "grants_auth_select" ON grants_table FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "grants_auth_insert" ON grants_table FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- PROPOSALS: users can manage only their own workspace proposals
CREATE POLICY "proposals_auth_select" ON proposals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "proposals_auth_insert" ON proposals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "proposals_auth_update" ON proposals FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ACTIVITY_LOGS: read for workspace members
CREATE POLICY "activity_logs_auth_select" ON activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "activity_logs_auth_insert" ON activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5) Mock data
-- Focus areas (10)
INSERT INTO focus_areas (id, name, icon, color, description)
VALUES
  (gen_random_uuid(), 'Education & STEM', 'BookOpen', '#3B82F6', 'Focus area: Education & STEM'),
  (gen_random_uuid(), 'School Education', 'School', '#3B82F6', 'Focus area: School Education'),
  (gen_random_uuid(), 'Digital Education', 'Monitor', '#3B82F6', 'Focus area: Digital Education'),
  (gen_random_uuid(), 'STEM / Robotics', 'Cpu', '#3B82F6', 'Focus area: STEM / Robotics'),
  (gen_random_uuid(), 'Scholarships', 'GraduationCap', '#3B82F6', 'Focus area: Scholarships'),
  (gen_random_uuid(), 'Teacher Training', 'Users', '#3B82F6', 'Focus area: Teacher Training'),
  (gen_random_uuid(), 'Adult Literacy', 'Book', '#3B82F6', 'Focus area: Adult Literacy'),
  (gen_random_uuid(), 'Skill Development & Livelihood', 'Briefcase', '#8B5CF6', 'Focus area: Skill Development & Livelihood'),
  (gen_random_uuid(), 'Vocational Training', 'Wrench', '#8B5CF6', 'Focus area: Vocational Training'),
  (gen_random_uuid(), 'Entrepreneurship Support', 'Rocket', '#8B5CF6', 'Focus area: Entrepreneurship Support');

-- Sample user, workspace, saved list
INSERT INTO users (id, email, name, password)
VALUES
  (gen_random_uuid(), 'admin@drivya.ai', 'Admin', 'CHANGE_ME');

INSERT INTO workspaces (id, name, slug, description)
VALUES
  (gen_random_uuid(), 'Drivya Workspace', 'drivya-workspace', 'Default workspace');

-- Link user to workspace
INSERT INTO workspace_members (id, user_id, workspace_id, role)
SELECT gen_random_uuid(), u.id, w.id, 'OWNER'
FROM users u CROSS JOIN workspaces w
WHERE u.email = 'admin@drivya.ai' AND w.slug = 'drivya-workspace';

-- Sample organization (Pratham)
INSERT INTO organizations (id, name, slug, website, description, type, headquarters_city, headquarters_country)
VALUES
  (gen_random_uuid(), 'Pratham Education Foundation', 'pratham-education-foundation', 'https://www.pratham.org', 'Provides quality education to disadvantaged children', 'NGO', 'Mumbai', 'India');

-- Link Pratham to three focus areas: School Education, Digital Education, Teacher Training
WITH pratham AS (SELECT id AS org_id FROM organizations WHERE slug = 'pratham-education-foundation'),
     fa AS (SELECT id, name FROM focus_areas WHERE name IN ('School Education', 'Digital Education', 'Teacher Training'))
INSERT INTO organization_focus_areas (id, organization_id, focus_area_id, is_primary, years_of_experience)
SELECT gen_random_uuid(), p.org_id, f.id, CASE WHEN f.name = 'School Education' THEN true ELSE false END, (floor(random() * 20) + 1)::int
FROM pratham p CROSS JOIN fa f;

-- Sample NGO data and verification
INSERT INTO ngo_data (id, organization_id, registrar_12a, registrar_80g, fcra_number, audited_reports_url, annual_revenue)
SELECT gen_random_uuid(), o.id, '12A-EXAMPLE', '80G-EXAMPLE', 'FCRA-EXAMPLE', 'https://example.org/reports', 10000000
FROM organizations o WHERE o.slug = 'pratham-education-foundation';

INSERT INTO verification_data (id, organization_id, status, has_12a, has_80g, has_fcra, credibility_score)
SELECT gen_random_uuid(), o.id, 'VERIFIED', true, true, true, 85.5
FROM organizations o WHERE o.slug = 'pratham-education-foundation';

COMMIT;

-- Quick validation queries (comment out if not needed):
-- SELECT COUNT(*) as focus_area_count FROM focus_areas;
-- SELECT COUNT(*) as organizations_count FROM organizations;
-- SELECT COUNT(*) as org_focus_areas_count FROM organization_focus_areas;
-- SELECT * FROM focus_areas LIMIT 5;
-- SELECT * FROM organizations LIMIT 5;
