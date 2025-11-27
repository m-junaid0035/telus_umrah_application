# Task: Fix Card Heights and Add Scroll-to-Top on Navigation

## Issues to Fix:
1. Cards on home page and packages page have unequal heights due to varying data amounts ✅
2. When users navigate to different pages via buttons/links, page doesn't reset to top ✅

## Plan:
1. **Fix Card Heights:**
   - Make cards equal height using CSS flexbox or min-height ✅
   - Ensure consistent layout across home and packages pages ✅
   - Use flexbox properties to distribute content evenly ✅

2. **Add Scroll-to-Top on Navigation:**
   - Create a ScrollToTop component that triggers on route changes ✅
   - Add it to the root layout ✅
   - Use usePathname hook to detect route changes ✅

## Files to Modify:
- src/components/HomePage.tsx (card height fixes) ✅
- src/components/UmrahPackagesPage.tsx (card height fixes) ✅
- src/app/layout.tsx (add ScrollToTop component) ✅
- Create src/components/ScrollToTop.tsx (new component) ✅

## Implementation Steps:
1. Create ScrollToTop component ✅
2. Update layout.tsx to include ScrollToTop ✅
3. Fix HomePage.tsx card heights ✅
4. Fix UmrahPackagesPage.tsx card heights ✅
