# Organization Search System - Quick Test Guide

## 🚀 How to Test the Implementation

### Prerequisites
- Dev server running: `pnpm dev` (currently running on port 8082)
- Application available at: `http://localhost:8082`

---

## Test Scenario 1: Search Page Loads & Filters Populate

**Steps:**
1. Open `http://localhost:8082/search`
2. Verify page loads with search bar
3. Open Focus Area dropdown - should show 9 options:
   - All Areas
   - Child Welfare
   - Digital Education
   - Environment
   - Food Security
   - Healthcare
   - School Education
   - Skill Development & Livelihood
   - Teacher Training
   - Technology
   - Women Empowerment

4. Open Region dropdown - should show 7 options:
   - All Regions
   - Karnataka
   - Maharashtra
   - Pan India
   - Rajasthan
   - Tamil Nadu
   - Telangana
   - Uttar Pradesh

**Expected Result:** ✅ All 11 organizations should appear without any filters

---

## Test Scenario 2: Search by Text

**Steps:**
1. Type "Pratham" in the search box
2. Wait for results to filter (200ms debounce)

**Expected Result:** ✅ Only 1 result shown: "Pratham Education Foundation"

**Try these searches:**
- `education` → 7 results (all education-focused orgs)
- `healthcare` → 2 results (Aravind Eye Care + HCL Foundation)
- `women` → 1 result (Sambhava)
- `skills` → 4 results (skill development orgs)

---

## Test Scenario 3: Filter by Focus Area

**Steps:**
1. Leave search box empty
2. Select "School Education" from Focus Area dropdown
3. Wait for filtering

**Expected Result:** ✅ Shows 5 organizations:
- Pratham Education Foundation
- HCL Foundation
- Child Rights and You (CRY)
- Azim Premji Foundation
- Asha for Education

**Try these focus areas:**
- `Healthcare` → 2 results
- `Skill Development & Livelihood` → 4 results
- `Teacher Training` → 2 results

---

## Test Scenario 4: Filter by Region

**Steps:**
1. Leave search box and focus area empty
2. Select "Maharashtra" from Region dropdown
3. Wait for filtering

**Expected Result:** ✅ Shows 3 organizations:
- Pratham Education Foundation
- Child Rights and You (CRY)
- Asha for Education

**Try these regions:**
- `Pan India` → 4 results
- `Karnataka` → 1 result (Teach & Grow)
- `Uttar Pradesh` → 1 result (HCL Foundation)

---

## Test Scenario 5: Combined Filters

**Steps:**
1. Type "education" in search
2. Select "School Education" from Focus Area
3. Select "Maharashtra" from Region
4. Wait for filtering

**Expected Result:** ✅ Shows 2 results:
- Pratham Education Foundation (Verified, 82%)
- Asha for Education (Verified, 81%)

---

## Test Scenario 6: Sort Options

**Steps:**
1. Reset all filters
2. Change "Sort By" from "Alignment Score" to "Name (A-Z)"
3. Observe results order

**Expected Result:** ✅ Organizations should appear in alphabetical order

**Try sorting:**
- `Alignment Score` (default) → Highest scores first (Aravind Eye Care 92%, HCL Foundation 90%, etc.)
- `Name (A-Z)` → Alphabetical (Aravind, Asha for Education, Azim Premji, etc.)
- `Recently Added` → Insertion order (Pratham, Teach & Grow, HCL Foundation, etc.)

---

## Test Scenario 7: No Results Message

**Steps:**
1. Type "nonexistent" in search box
2. Wait for filtering

**Expected Result:** ✅ "No organizations found" message appears with:
- Subtitle: "Try adjusting your search criteria"
- "Clear Filters" button

---

## Test Scenario 8: Clear Filters Button

**Steps:**
1. Apply multiple filters (search + focus area + region + sort)
2. Click "Clear Filters" button
3. Verify all filters reset

**Expected Result:** ✅ 
- Search box becomes empty
- Dropdowns reset to default values
- All 11 organizations appear again
- Sort resets to "Alignment Score"

---

## Test Scenario 9: View Organization Details

**Steps:**
1. Search for any organization (e.g., "Pratham")
2. Click "View Details" button on the result card
3. Wait for detail page to load

**Expected Result:** ✅ Page shows:
- Organization name: "Pratham Education Foundation" ✓
- Verification badge: Green checkmark
- Type badge: "NGO"
- Region badge: "Maharashtra"
- Verification status badge: "verified"
- Mission statement
- 3 Focus area badges: "School Education", "Digital Education", "Teacher Training"
- Alignment score: 82 (in colored box)
- Project details: "Learning by Doing" (2022), "Digital Literacy Drive" (2023)
- Partner history: Government of India, UNICEF, World Bank
- Target beneficiaries: Children, Teachers, Rural Communities
- Buttons: "View Details", "Save", "Website"

---

## Test Scenario 10: Detail Page Navigation

**Steps:**
1. Direct URL access: `http://localhost:8082/organization/org-6`
2. Wait for page to load
3. Verify Aravind Eye Care System appears

**Try these direct URLs:**
- `/organization/org-1` → Pratham Education Foundation (82%)
- `/organization/org-3` → HCL Foundation (90%)
- `/organization/org-6` → Aravind Eye Care System (92%)
- `/organization/org-11` → Sambhava (76%)

**Expected Result:** ✅ Correct organization loads from API

---

## Test Scenario 11: API Endpoints (Developer Testing)

### Test individual API endpoints directly:

**Get all organizations:**
```bash
curl http://localhost:8082/api/organizations
```
Expected: JSON with 11 organizations, total: 11

**Search with filters:**
```bash
curl "http://localhost:8082/api/organizations/search?q=education&focusArea=School%20Education"
```
Expected: Filtered results matching the criteria

**Get focus areas:**
```bash
curl http://localhost:8082/api/organizations/filters/focus-areas
```
Expected: Array of 9 focus areas sorted alphabetically

**Get regions:**
```bash
curl http://localhost:8082/api/organizations/filters/regions
```
Expected: Array of 7 regions sorted alphabetically

**Get single organization:**
```bash
curl http://localhost:8082/api/organizations/org-1
```
Expected: Complete data for Pratham Education Foundation

---

## Test Scenario 12: Shortlist Functionality

**Steps:**
1. On search page, click "Save" button on any organization
2. Button should change to "Saved" with filled heart
3. Click again to remove from shortlist

**Expected Result:** ✅ 
- Button toggles between "Save" and "Saved"
- Heart icon fills/unfills
- Visual feedback on interaction

---

## Verification Checklist

- [ ] Search page loads with 11 organizations visible
- [ ] Focus area dropdown shows 9 options
- [ ] Region dropdown shows 7 options
- [ ] Text search filters correctly
- [ ] Focus area filter works
- [ ] Region filter works
- [ ] Combined filters work together
- [ ] Sort options work correctly
- [ ] "No organizations found" only appears for empty results
- [ ] Clear Filters resets everything
- [ ] View Details links work and navigate to correct organization
- [ ] Detail page displays all organization information
- [ ] Direct URL access to detail pages works
- [ ] All API endpoints return correct data
- [ ] Shortlist button functionality works
- [ ] No console errors or warnings (except deprecation warnings)

---

## Common Issues & Solutions

**Issue:** "No organizations found" on fresh load
- **Solution:** Wait for page to load completely, check browser console for API errors

**Issue:** Dropdowns appear empty
- **Solution:** Check that `/api/organizations/filters/*` endpoints are returning data
- Test with: `curl http://localhost:8082/api/organizations/filters/focus-areas`

**Issue:** Search results not updating
- **Solution:** Check network tab to verify API calls are being made
- The app uses 200ms debounce, so wait briefly after typing

**Issue:** Organization detail page shows "not found"
- **Solution:** Verify the organization ID is correct (org-1 through org-11)
- Check that `/api/organizations/:id` endpoint is accessible

---

## Performance Notes

- All API responses are instant (no database queries, using in-memory JSON)
- Search results update with 200ms debounce (optimized for user experience)
- No external API calls or dependencies
- Fully self-contained with sample data

---

## Next Steps (Phase 2)

Once Phase 1 testing is complete, Phase 2 will include:
- [ ] Supabase database integration (replace JSON with real database)
- [ ] User authentication (email/password)
- [ ] Persistent shortlist (save to database)
- [ ] Advanced matching algorithm (calculate fit scores)
- [ ] PPT proposal generation
- [ ] NGO submission form for adding new organizations
- [ ] Admin dashboard for managing organizations

