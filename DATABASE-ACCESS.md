# 🗄️ Database Access & Queries

## Production Database Access

### pgAdmin (Database GUI)
- **URL**: https://pgadmin-cjk2.onrender.com/
- **Database**: `ignite_crm`
- **Host**: `dpg-d3h78ljuibrs73an9kag-a`
- **Status**: ✅ **ACTIVE**

### Key Database Tables
```sql
-- Core Tables
"Organization"     -- Your orgs
"OrgMember"        -- Your contacts  
"Event"            -- Your events
"EventPipeline"    -- Event funnels
"EventAttendee"    -- Working records
"EventForm"        -- Dynamic forms
```

## Find Your Event
```sql
-- Check all events
SELECT id, name, slug, date, "orgId", "createdAt" 
FROM "Event" 
ORDER BY "createdAt" DESC;

-- Check your specific org events
SELECT id, name, slug, date 
FROM "Event" 
WHERE "orgId" = 'cmgfvz9v10000nt284k875eoc';

-- Check for "Bros & Brews" event
SELECT * FROM "Event" 
WHERE name LIKE '%Bros%' OR slug LIKE '%bros%';
```

## Verify Event Creation
```sql
-- Count events
SELECT COUNT(*) FROM "Event";

-- Latest event details
SELECT id, name, "orgId", "createdAt" 
FROM "Event" 
ORDER BY "createdAt" DESC 
LIMIT 1;
```

## Check Pipeline Population
```sql
-- Check if EventPipeline was created
SELECT * FROM "EventPipeline" 
WHERE "eventId" = 'cmggljv7z0002nt28gckp1jpe';

-- Check if EventAttendee records exist
SELECT * FROM "EventAttendee" 
WHERE "pipelineId" IN (
  SELECT id FROM "EventPipeline" 
  WHERE "eventId" = 'cmggljv7z0002nt28gckp1jpe'
);
```

## Production URLs
- **Frontend**: `ignitestrategescrm-frontend.vercel.app`
- **Backend**: `eventscrm-backend.onrender.com`
- **Database GUI**: `pgadmin-cjk2.onrender.com`
- **Database**: `ignite_crm` on `dpg-d3h78ljuibrs73an9kag-a`

## Status: ✅ ALL PRODUCTION
- ✅ No localhost anywhere
- ✅ All systems on production
- ✅ Database accessible via pgAdmin
- ✅ Event creation working
- ✅ Constant database activity confirmed

**Use pgAdmin to find your "Bros & Brews" event!** 🎯
