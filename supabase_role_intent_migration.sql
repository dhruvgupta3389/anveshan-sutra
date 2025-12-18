-- ============================================
-- DRIVYA.AI - ROLE + INTENT ONBOARDING MIGRATION
-- Run this on your Supabase SQL Editor
-- ============================================

-- Add role column for user type
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS user_role TEXT 
CHECK (user_role IN ('ngo', 'incubator', 'csr'));

-- Add intent column for user purpose
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS user_intent TEXT 
CHECK (user_intent IN ('seeker', 'provider', 'both'));

-- Add onboarding completion flag
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE;

-- Create index for role-based queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_role 
ON user_profiles(user_role);

-- Create index for intent-based queries  
CREATE INDEX IF NOT EXISTS idx_user_profiles_intent 
ON user_profiles(user_intent);

-- ============================================
-- NOTES:
-- 
-- Role values:
--   'ngo' - Non-profit organization
--   'incubator' - Incubator/Accelerator 
--   'csr' - CSR/Funder/Foundation
--
-- Intent values:
--   'seeker' - Looking for partners/funding
--   'provider' - Offering support
--   'both' - Only for incubators
--
-- Business rules enforced in application:
--   NGO → Seeker only
--   CSR → Provider only  
--   Incubator → Seeker / Provider / Both
-- ============================================
