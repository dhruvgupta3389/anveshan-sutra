-- ============================================
-- DRIVYA.AI - NGO JOURNEY MIGRATION
-- Run this on your Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. ENHANCE ORGANIZATIONS TABLE FOR NGOs
-- ============================================

-- Add NGO-specific fields
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS year_registered INTEGER;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS beneficiary_scale TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS needs_funding BOOLEAN DEFAULT false;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS needs_mentorship BOOLEAN DEFAULT false;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS needs_infrastructure BOOLEAN DEFAULT false;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS needs_pilots BOOLEAN DEFAULT false;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS submitted_by UUID REFERENCES auth.users(id);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged'));
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS moderation_notes TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMPTZ;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS moderated_by UUID REFERENCES auth.users(id);

-- ============================================
-- 2. USER ORGANIZATION LINK
-- ============================================

-- Link users to their organization(s)
CREATE TABLE IF NOT EXISTS user_organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'member')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, organization_id)
);

ALTER TABLE user_organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own org links" ON user_organizations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create org links" ON user_organizations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 3. PRIVATE NOTES (Per Org Per User)
-- ============================================

-- Note: shortlist table already has notes column, so this extends it
-- Add updated_at to shortlist if not exists
ALTER TABLE shortlist ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE shortlist ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0;
ALTER TABLE shortlist ADD COLUMN IF NOT EXISTS tags TEXT[];

-- ============================================
-- 4. EMAIL DRAFTS
-- ============================================

CREATE TABLE IF NOT EXISTS email_drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id TEXT REFERENCES organizations(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    recipient_email TEXT,
    recipient_name TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE email_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own email drafts" ON email_drafts
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 5. PPT DRAFTS
-- ============================================

CREATE TABLE IF NOT EXISTS ppt_drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    organization_ids TEXT[], -- Array of org IDs included
    content JSONB NOT NULL, -- Structured PPT content
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ppt_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own ppt drafts" ON ppt_drafts
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 6. MOU DRAFTS
-- ============================================

CREATE TABLE IF NOT EXISTS mou_drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    partner_organization_id TEXT REFERENCES organizations(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content JSONB NOT NULL, -- Structured MoU content
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE mou_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own mou drafts" ON mou_drafts
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 7. COLLABORATION FEEDBACK (From Previous Task)
-- ============================================

CREATE TABLE IF NOT EXISTS collaboration_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL CHECK (action_type IN ('viewed_profile', 'downloaded_ppt', 'shortlisted', 'contacted')),
    outcome TEXT CHECK (outcome IN ('started_conversation', 'scheduled_meeting', 'proposal_shared', 'partnership_formed')),
    is_positive BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, organization_id, action_type)
);

ALTER TABLE collaboration_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own feedback" ON collaboration_feedback
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 8. PLATFORM FEEDBACK
-- ============================================

CREATE TABLE IF NOT EXISTS platform_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    feedback_type TEXT NOT NULL CHECK (feedback_type IN ('ux', 'feature', 'bug', 'other')),
    message TEXT,
    page_context TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE platform_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can submit feedback" ON platform_feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own feedback" ON platform_feedback
    FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- 9. ADD TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE TRIGGER update_email_drafts_updated_at
    BEFORE UPDATE ON email_drafts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ppt_drafts_updated_at
    BEFORE UPDATE ON ppt_drafts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mou_drafts_updated_at
    BEFORE UPDATE ON mou_drafts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shortlist_updated_at
    BEFORE UPDATE ON shortlist
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 10. INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_org_moderation ON organizations(moderation_status);
CREATE INDEX IF NOT EXISTS idx_org_submitted_by ON organizations(submitted_by);
CREATE INDEX IF NOT EXISTS idx_user_orgs_user ON user_organizations(user_id);
CREATE INDEX IF NOT EXISTS idx_email_drafts_user ON email_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_ppt_drafts_user ON ppt_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_feedback_org ON collaboration_feedback(organization_id);

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
