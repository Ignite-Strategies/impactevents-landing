# 🗄️ Database Mapping & Connection

## Production Database (Render)
- **Database**: `ignite_crm` 
- **Host**: `dpg-d3h78ljuibrs73an9kag-a`
- **Schema**: `public`
- **Status**: ✅ **ACTIVE & WORKING**

## Key Tables & Relationships

### Core Models
```sql
-- Organizations (your orgs)
Organization
├── id: cmgfvz9v10000nt284k875eoc (your org)
├── name: "Ignite Strategies"
└── pipelineDefaults: ["sop_entry", "rsvp", "paid", "attended", "champion"]

-- OrgMembers (your contacts)
OrgMember  
├── id: [unique]
├── orgId: cmgfvz9v10000nt284k875eoc
├── email: "contact@example.com"
├── firstName: "John"
└── lastName: "Doe"

-- Events (your events)
Event
├── id: cmggljv7z0002nt28gckp1jpe (Bros & Brews)
├── orgId: cmgfvz9v10000nt284k875eoc
├── name: "Bros & Brews"
├── slug: "bros-&-brews"
└── date: "2025-10-23"
```

### New Pipeline Architecture
```sql
-- EventPipeline (funnels for each event)
EventPipeline
├── id: [unique]
├── eventId: cmggljv7z0002nt28gckp1jpe
├── audienceType: "org_members" | "landing_page_public"
└── stages: ["in_funnel", "general_awareness", "personal_invite", "expressed_interest", "soft_commit", "paid", "cant_attend"]

-- EventAttendee (working records)
EventAttendee
├── id: [unique]
├── pipelineId: [links to EventPipeline]
├── orgMemberId: [links to OrgMember]
├── currentStage: "in_funnel" | "soft_commit" | "paid"
└── submittedFormId: [if from form]
```

## Connection Details
- **Backend**: `eventscrm-backend.onrender.com`
- **Database**: PostgreSQL on Render
- **Local .env**: `DATABASE_URL="PASTE_YOUR_EXTERNAL_URL_HERE"` (placeholder)
- **Production**: Uses Render's environment variables

## Verification Queries
```sql
-- Check your org
SELECT * FROM "Organization" WHERE id = 'cmgfvz9v10000nt284k875eoc';

-- Check your events  
SELECT * FROM "Event" WHERE "orgId" = 'cmgfvz9v10000nt284k875eoc';

-- Check your contacts
SELECT * FROM "OrgMember" WHERE "orgId" = 'cmgfvz9v10000nt284k875eoc';

-- Check event pipelines
SELECT * FROM "EventPipeline" WHERE "eventId" = 'cmggljv7z0002nt28gckp1jpe';
```

## Status: ✅ WORKING
- ✅ Org created: `cmgfvz9v10000nt284k875eoc`
- ✅ Event created: `cmggljv7z0002nt28gckp1jpe` 
- ✅ Backend connected to Render database
- ✅ Frontend calling production API
- ✅ Event creation flow working

**No local database needed - everything runs on Render!** 🚀
