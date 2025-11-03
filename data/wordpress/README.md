# WordPress Data Directory

## Place Your WordPress Database Here

This directory is for storing your WordPress database export for analysis and migration.

### Instructions:

1. **Export your WordPress MySQL database** from your current hosting:
   - Via phpMyAdmin: Export as `.sql` file
   - Via command line: `mysqldump -u username -p database_name > dmvcalifornia_backup.sql`
   - Via hosting control panel (cPanel, Plesk, etc.)

2. **Place the SQL dump file in this directory**:
   ```
   data/wordpress/dmvcalifornia_backup.sql
   ```

3. **Optional: Export WordPress media files**:
   - Download `/wp-content/uploads/` folder from your WordPress installation
   - Place in: `data/wordpress/wp-content/uploads/`

### What We'll Analyze:

From your WordPress database, we'll extract:
- **Posts** (`wp_posts` table) - All blog articles
- **Post Meta** (`wp_postmeta`) - Featured images, custom fields
- **Categories/Tags** (`wp_terms`, `wp_term_taxonomy`) - Content organization
- **URLs** - Current permalink structure for SEO preservation
- **Images** - Media library references

### Security Note:

⚠️ **This directory is in `.gitignore`** - Your database will NOT be committed to Git, keeping your data secure.

### Files Expected:

- ✅ `dmvcalifornia_backup.sql` (or similar .sql file)
- ✅ `wp-content/uploads/` (optional, for images)
- ✅ Any other WordPress exports you want to analyze

Once you've placed your database dump here, let Claude know and we'll analyze the structure!
