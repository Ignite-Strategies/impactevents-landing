# 🏗️ System Architecture

## Production Stack
- **Frontend**: `ignitestrategescrm-frontend.vercel.app` (React + Vite)
- **Backend**: `eventscrm-backend.onrender.com` (Express + Prisma) - ❌ **FAILED DEPLOY**
- **Database**: `ignite_crm` on `dpg-d3h78ljuibrs73an9kag-a` (PostgreSQL)
- **Database GUI**: `pgadmin-cjk2.onrender.com`

## Render Services Status
- ✅ **`pgadmin`** - Deployed (Database GUI)
- ✅ **`Ignite CRM`** - Available (PostgreSQL Database)
- ✅ **`ignite-pay-backend`** - Deployed (Payment API)
- ❌ **`eventscrm-backend`** - **FAILED DEPLOY** (CRM API)

## Environment Variables (Render)
- ✅ **`DATABASE_URL`** - PostgreSQL connection
- ✅ **`FIREBASE_SERVICE_ACCOUNT_KEY`** - Firebase admin
- ✅ **`GOOGLE_CLIENT_SECRET`** - Google OAuth
- ❌ **`SUPPORTER_DB`** - OLD MongoDB (DEPRECATED)

## Modular Service Architecture
```
services/
├── pipeline.js      -- EventPipeline management (funnel definitions)
├── stage.js         -- Stage progression and validation
├── audience.js      -- Audience types and attendee creation
└── audienceStages.js -- Stage trees per audience type
```

## 5 Pipeline Audience Types
1. **`org_members`** - Internal org members (full 7-stage funnel)
2. **`friends_family`** - Friends & family (shorter 5-stage funnel)
3. **`landing_page_public`** - Landing page public (direct to soft commit)
4. **`community_partners`** - Community partners (professional funnel)
5. **`cold_outreach`** - Cold outreach (extra nurturing stages)

## Relational Data Flow
```
Event Creation
    ↓
Create EventPipeline (audience type)
    ↓
Create EventAttendee records (working records)
    ↓
Stage progression (no downgrades)
    ↓
Final attendance tracking
```

## Key Models
- **EventPipeline** = Funnel definition (static)
- **EventAttendee** = Working records (relational)
- **OrgMember** = Master contact list
- **Event** = Event details

## Database Connection
- **Production**: `DATABASE_URL` environment variable in Render
- **Local**: No local database, uses production
- **Migrations**: Run on Render (not local)

## Status: ✅ PRODUCTION ONLY
- ✅ All systems on production
- ✅ No localhost anywhere
- ✅ Database accessible via pgAdmin
- ✅ Modular service architecture
