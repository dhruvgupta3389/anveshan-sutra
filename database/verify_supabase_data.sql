-- Quick verification queries to check if data was inserted
SELECT 'Focus Areas' as table_name, COUNT(*) as count FROM focus_areas
UNION ALL
SELECT 'Organizations', COUNT(*) FROM organizations
UNION ALL
SELECT 'Organization Focus Areas', COUNT(*) FROM organization_focus_areas
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Workspaces', COUNT(*) FROM workspaces
UNION ALL
SELECT 'NGO Data', COUNT(*) FROM ngo_data
UNION ALL
SELECT 'Verification Data', COUNT(*) FROM verification_data;

-- Also show sample data
SELECT '--- FOCUS AREAS ---' as info;
SELECT id, name, icon, color FROM focus_areas LIMIT 5;

SELECT '--- ORGANIZATIONS ---' as info;
SELECT id, name, slug, type, headquarters_city FROM organizations LIMIT 5;

SELECT '--- USERS ---' as info;
SELECT id, email, name FROM users LIMIT 5;
