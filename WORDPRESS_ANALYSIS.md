# WordPress Database Analysis Report

**Date**: November 2, 2025
**Database File**: `dmvcali2.sql`
**File Size**: 108 MB

---

## Executive Summary

Your WordPress site uses **WP Pro Quiz** plugin for quizzes, which stores data in custom tables. The analysis reveals significant quiz content that can be migrated to the new Next.js platform.

---

## Quiz Data Found

### Existing Quizzes (4 total)

1. **DMV Driving Test** (English)
   - Under 18: 46 questions (need 38 correct / 85%)
   - Over 18: 36 questions (need 31 correct / 85%)
   - Features: Random questions, random answers, statistics tracking
   - Status: Active

2. **DMV Driving Test in Turkish** (Türkçe)
   - Full Turkish language version
   - Same difficulty requirements
   - Includes pass/fail messaging in Turkish
   - Status: Active

3. **DMV Turkish Sign Test**
   - Focus: Road signs recognition
   - 12 questions total
   - Multiple choice format
   - Status: Active

4. **DMV Quiz Español**
   - Spanish language version
   - California written exam practice
   - Email results feature enabled
   - Status: Active

### Quiz Statistics

- **Quiz keyword mentions**: 9,108 occurrences
- **Test mentions**: 35,961 occurrences
- **Driving test mentions**: 10,574 occurrences
- **Question mentions**: 2,121 occurrences
- **Practice mentions**: 1,485 occurrences

**This indicates HEAVY quiz-focused content!**

---

## WordPress Tables Structure

### Core Content Tables
- `wp_posts` - 338 INSERT statements (mostly revisions and attachments)
- `wp_postmeta` - Post metadata (featured images, custom fields)
- `wp_terms` - 214 terms/categories
- `wp_options` - Site configuration

###  Quiz Plugin Tables (WP Pro Quiz)
- `wp_wp_pro_quiz_master` - Quiz metadata (4 quizzes found)
- `wp_wp_pro_quiz_question` - Quiz questions and answers
- `wp_wp_pro_quiz_statistic` - User attempt statistics
- `wp_wp_pro_quiz_lock` - Quiz access control
- `wp_wp_pro_quiz_prerequisite` - Quiz dependencies

### Other Plugin Tables
- `wp_nf3_*` - Ninja Forms (contact forms, not quizzes)
- `wp_rank_math_*` - RankMath SEO plugin data
- `wp_actionscheduler_*` - Background task scheduler

---

## Categories & Tags Found

### DMV-Related Categories
- **Traffic Safety**
- **Defensive Driving**
- **Driver License**
- **Traffic**
- **Driving Test**
- **DMV California**
- **Accidents**
- **Driving At Night**
- **Nighttime Driving**
- **Traffic Signs**
- **Roadway Signs**
- **DMV Written Tests**
- **DMV Online Services**
- **DMV Change of Address Online**
- **dmv kiosk**
- **Featured**
- **Drive Safely**
- **Avoid Fines**

### Multi-language Quiz Categories
- **DMV Türkçe Testi** (Turkish)
- **DMV Turkish Test**
- **DMV Turkish Sign Test**
- **DMV Turkish Traffic Sign Test**
- **DMV Quiz Español** (Spanish)

---

## Content Distribution

### Post Types
| Type | Count | Description |
|------|-------|-------------|
| Attachment | 55 | Images, PDFs, media files |
| Revision | 11 | Post revision history |
| Page | 1 | Static pages (e.g., `/news`) |
| Post | 0 | Blog posts (need deeper analysis) |

**Note**: Low published post count suggests content may be embedded in pages or custom tables

### Post Status
| Status | Count |
|--------|-------|
| Inherit | 66 | Attachments/revisions |
| Publish | 1 | Published content |

---

## Key Findings

### Strengths to Preserve
✅ **Extensive Quiz Content**: 4 multi-language quizzes with real DMV questions
✅ **Strong SEO Setup**: RankMath plugin data with analytics
✅ **Multi-language Support**: English, Turkish, Spanish content
✅ **Statistics Tracking**: User quiz attempts and scores recorded
✅ **Good Categorization**: Well-organized topics

### Challenges for Migration
⚠️ **Complex Quiz Structure**: WP Pro Quiz uses serialized PHP data
⚠️ **Minimal Blog Posts**: Only 1 published page found (may need manual URL mapping)
⚠️ **Heavy Ad Code**: Multiple AdSense scripts in content (need cleanup)
⚠️ **Plugin Dependencies**: Quiz data tied to WP Pro Quiz format

---

## Sample URLs to Preserve

Based on content analysis, URLs likely follow these patterns:

```
/news                           # Static page
/drivers-license                # Guide page (from sample data)
/new-cars                      # Guide page (from sample data)
/dmv-offices/                  # Office locator
/driving-test/                 # Quiz landing
/behind-the-wheel-mistakes/   # Educational content
/category/driving-test/        # Category archives
/category/defensive-driving/   # Category archives
/category/traffic-safety/      # Category archives
```

---

## Recommended Migration Strategy

### Phase 1: Quiz Migration (HIGH PRIORITY)
1. Extract all quiz data from `wp_wp_pro_quiz_*` tables
2. Parse serialized PHP `answer_data` fields
3. Convert to JSON format for Next.js
4. Preserve question order, correct answers, explanations
5. Migrate quiz settings (time limits, passing scores, etc.)

### Phase 2: Content Migration
1. Deep dive into `wp_posts` to find actual blog content
2. Check if content is embedded in pages
3. Extract featured images from `wp_postmeta`
4. Map all permalinks for SEO preservation
5. Clean up AdSense code

### Phase 3: SEO Data Migration
1. Extract RankMath SEO metadata
2. Preserve meta titles, descriptions
3. Migrate analytics data if needed
4. Generate comprehensive sitemap

### Phase 4: Multi-language Support
1. Decide on i18n strategy (English, Turkish, Spanish)
2. Consider keeping Turkish/Spanish quizzes as separate entities
3. Plan URL structure: `/es/quiz/`, `/tr/quiz/` or separate?

---

## Next Steps

### Immediate Actions
1. ✅ **Create Prisma schema** for quizzes + blog content
2. ⏳ **Write migration script** to extract WP Pro Quiz data
3. ⏳ **Map all WordPress URLs** (run deeper SQL analysis)
4. ⏳ **Extract sample quiz questions** to test data structure

### Questions to Resolve
- [ ] Should we keep Turkish/Spanish quizzes or focus on English?
- [ ] Do you want to preserve quiz statistics/user attempts?
- [ ] Are there blog posts we're missing (need manual check on live site)?
- [ ] Should we create NEW quizzes from DMV.ca or migrate existing ones?

---

## File Structure Reference

```
WordPress Data Location:
├── dmvcali2.sql (108 MB)
├── Analysis output:
│   ├── wordpress_analysis.json (detailed stats)
│   └── WORDPRESS_ANALYSIS.md (this file)
```

---

## Technical Notes

**WP Pro Quiz Answer Data Format**:
Answers are stored as serialized PHP arrays in the `answer_data` column. Example structure:
```php
a:4:{
  i:0;s:20:"Answer option 1";
  i:1;s:20:"Answer option 2";
  i:2;s:20:"Answer option 3";
  i:3;s:20:"Answer option 4";
}
```

This needs to be deserialized and converted to JSON for Next.js.

---

**Status**: ✅ Analysis Complete | Next: Design Database Schema
