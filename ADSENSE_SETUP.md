# Google AdSense Setup Guide

## Step 1: Get Your AdSense Publisher ID

1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Sign in with your Google account
3. Find your **Publisher ID** (format: `ca-pub-XXXXXXXXXXXXXXXX`)
   - Usually found in: Account → Account Information → Publisher ID

## Step 2: Update Configuration Files

### A. Update Environment Variables

1. Create `.env.local` file (copy from `.env.local.example`):
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Publisher ID:
   ```
   NEXT_PUBLIC_ADSENSE_ID=ca-pub-YOUR-ACTUAL-ID-HERE
   ```

### B. Update Layout File

1. Open `src/app/layout.tsx`
2. Find line 104: `ca-pub-XXXXXXXXXXXXXXXX`
3. Replace with your actual Publisher ID

### C. Update AdSense Component

1. Open `src/components/AdSense.tsx`
2. Find line 35: `data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"`
3. Replace with your actual Publisher ID

## Step 3: Create Ad Units in AdSense

1. Go to AdSense → Ads → By ad unit
2. Click **"+ By ad unit"**
3. Choose **Display ads**
4. Create ad units for different locations:

### Recommended Ad Units:

| Ad Unit Name | Recommended Size | Location |
|--------------|-----------------|-----------|
| Homepage Top | Responsive | Above content |
| Homepage Sidebar | 300x600 | Right sidebar |
| Blog Post Top | Responsive | Below title |
| Blog Post Middle | Responsive | Middle of content |
| Blog Post Bottom | Responsive | After content |
| Blog Sidebar | 300x250 | Right sidebar |

5. For each ad unit, Google will give you an **Ad Slot ID** (e.g., `1234567890`)
6. Copy these IDs to `src/config/adsense.ts`

## Step 4: Update Ad Slot IDs

Edit `src/config/adsense.ts` and replace the placeholder IDs:

```typescript
adSlots: {
  homepageTop: 'YOUR-ACTUAL-SLOT-ID',
  homepageSidebar: 'YOUR-ACTUAL-SLOT-ID',
  blogPostTop: 'YOUR-ACTUAL-SLOT-ID',
  // ... etc
}
```

## Step 5: Add Ads to Pages

### Example: Add to Blog Post Page

Open `src/app/[slug]/page.tsx` and add:

```tsx
import AdSense from '@/components/AdSense';
import ADSENSE_CONFIG from '@/config/adsense';

// Inside your component, add ads at desired locations:

{/* Ad at top of blog post */}
<AdSense adSlot={ADSENSE_CONFIG.adSlots.blogPostTop} />

{/* Ad in middle of content */}
<AdSense adSlot={ADSENSE_CONFIG.adSlots.blogPostMiddle} />

{/* Ad at bottom */}
<AdSense adSlot={ADSENSE_CONFIG.adSlots.blogPostBottom} />
```

### Example: Add to Homepage

Open `src/app/page.tsx`:

```tsx
import AdSense from '@/components/AdSense';
import ADSENSE_CONFIG from '@/config/adsense';

// Add in appropriate sections:
<AdSense adSlot={ADSENSE_CONFIG.adSlots.homepageTop} />
```

## Step 6: Deploy and Verify

1. **Test Locally:**
   ```bash
   npm run dev
   ```
   - Ads won't show in development (they need to be on your verified domain)

2. **Deploy to Vercel:**
   ```bash
   git add -A
   git commit -m "Add Google AdSense"
   git push origin main
   ```

3. **Add Environment Variable in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_ADSENSE_ID` with your Publisher ID
   - Redeploy the site

4. **Verify Domain in AdSense:**
   - Go to AdSense → Sites
   - Add `dmvcalifornia.us`
   - Follow verification steps

## Step 7: Wait for Approval

- Ads may take **24-48 hours** to start showing after:
  - Domain verification
  - Content review by Google
  - First deployment

## Common Ad Placements (Best Practices)

### Blog Posts:
- ✅ Top of post (below title)
- ✅ Middle of content (after 2-3 paragraphs)
- ✅ Bottom of post (before comments/related posts)
- ✅ Sidebar (if you add one)

### Homepage:
- ✅ Above the fold (near top)
- ✅ Between content sections
- ✅ Sidebar

### Practice Tests:
- ✅ Before starting test
- ✅ After completing test
- ✅ Sidebar during test

## Notes

- **Auto Ads**: Google can also place ads automatically if you enable "Auto ads" in AdSense
- **Responsive**: Use `adFormat="auto"` for responsive ads that adapt to screen size
- **Policy**: Make sure your content complies with [AdSense policies](https://support.google.com/adsense/answer/48182)

## Troubleshooting

**Ads not showing?**
- Check browser console for errors
- Verify Publisher ID is correct
- Make sure domain is verified in AdSense
- Wait 24-48 hours after setup
- Check if ad blockers are interfering
- Ensure site is live on verified domain (not localhost)

**Need help?**
- [AdSense Help Center](https://support.google.com/adsense/)
- [AdSense Community](https://support.google.com/adsense/community)
