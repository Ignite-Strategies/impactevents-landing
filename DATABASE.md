# 🗄️ Database Configuration

## Production Database (Render)
- **Database**: `ignite_crm` 
- **Host**: `dpg-d3h78ljuibrs73an9kag-a`
- **Schema**: `public`
- **Status**: ✅ **ACTIVE & WORKING**
- **Environment Variable**: `DATABASE_URL` (set in Render)

## Render Environment Variables
- ✅ **`DATABASE_URL`** - PostgreSQL connection string
- ✅ **`FIREBASE_SERVICE_ACCOUNT_KEY`** - Firebase admin SDK
- ✅ **`GOOGLE_CLIENT_SECRET`** - Google OAuth
- ❌ **`SUPPORTER_DB`** - OLD MongoDB (DEPRECATED - ignore this)

## Local Development
- **Local .env**: `DATABASE_URL="PASTE_YOUR_EXTERNAL_URL_HERE"` (placeholder)
- **Purpose**: Local development uses production database
- **No local database needed** - Everything runs on Render production

## Database Models (Prisma)
```sql
-- Core Tables
"Organization"     -- Your orgs
"OrgMember"        -- Your contacts  
"Event"            -- Your events
"EventPipeline"    -- Event funnels (5 audience types)
"EventAttendee"    -- Working records
"EventForm"        -- Dynamic forms
```

## 5 Pipeline Audience Types
1. **`org_members`** - Internal org members
2. **`friends_family`** - Friends & family  
3. **`landing_page_public`** - Landing page public
4. **`community_partners`** - Community partners
5. **`cold_outreach`** - Cold outreach

## Database Operations
- **Migrations**: Run on Render (not local)
- **Queries**: Use production database
- **Models**: EventPipeline + EventAttendee (relational)

## Status: ✅ PRODUCTION ONLY
- ✅ No local database needed
- ✅ All operations on Render database
- ✅ Environment variables set in Render
- ✅ Database URL: `DATABASE_URL` in Render environment
