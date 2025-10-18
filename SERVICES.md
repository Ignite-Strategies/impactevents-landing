# 🔧 Services Documentation

## 🚨 CRITICAL: Service Architecture Chaos

**We have MULTIPLE services using DIFFERENT models!** This is causing the pipeline population failures.

---

## 📊 Current Services Status

### ✅ NEW SYSTEM (Prisma-based)
**File:** `services/eventAttendeeService.js`
- **Models:** `OrgMember` + `EventAttendee`
- **Stages:** 7-stage funnel (in_funnel → paid)
- **Status:** ✅ **CURRENT** - Used by event creation
- **Used by:** `routes/eventsRoute.js` (event creation)

### ❌ OLD SYSTEM 1 (MongoDB-based)
**File:** `services/eventPipelineService.js`
- **Models:** `Supporter` + `EventPipelineEntry`
- **Stages:** 7-stage funnel (but old models)
- **Status:** ❌ **DEPRECATED** - Don't use
- **Used by:** Old routes (should be removed)

### ❌ OLD SYSTEM 2 (5-stage system)
**File:** `services/pipelineService.js`
- **Models:** Generic membership objects
- **Stages:** 5-stage funnel (sop_entry, rsvp, paid, attended, champion)
- **Status:** ❌ **DEPRECATED** - Wrong stages
- **Used by:** Old pipeline rules (should be removed)

---

## 🎯 The Problem

**Event creation calls:**
```javascript
// routes/eventsRoute.js line 47
const pipelineResult = await populateEventPipeline(event.id, orgId);
```

**This calls:**
```javascript
// services/eventAttendeeService.js
export async function populateEventPipeline(eventId, orgId) {
  // Uses NEW models: OrgMember + EventAttendee
  // Uses NEW field: currentStage (not stage)
  // Uses NEW 7-stage system
}
```

**But the database might have:**
- ❌ OLD `Supporter` table (not `OrgMember`)
- ❌ OLD `EventPipelineEntry` table (not `EventAttendee`)
- ❌ OLD `stage` field (not `currentStage`)

---

## 🔍 Database Reality Check

**Check what tables actually exist:**
```sql
-- Check if NEW tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('OrgMember', 'EventAttendee');

-- Check if OLD tables exist  
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('Supporter', 'EventPipelineEntry');
```

**Check if EventAttendee has the right fields:**
```sql
-- Check EventAttendee schema
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'EventAttendee';
```

---

## 🚨 Service Conflicts

### 1. Model Conflicts
- **NEW:** `OrgMember` (Prisma)
- **OLD:** `Supporter` (MongoDB)
- **Problem:** Services reference different models

### 2. Field Conflicts  
- **NEW:** `currentStage` field
- **OLD:** `stage` field
- **Problem:** Services use different field names

### 3. Stage Conflicts
- **NEW:** 7-stage funnel (in_funnel → paid)
- **OLD:** 5-stage funnel (sop_entry → champion)
- **Problem:** Different stage hierarchies

### 4. Table Conflicts
- **NEW:** `EventAttendee` table
- **OLD:** `EventPipelineEntry` table
- **Problem:** Services reference different tables

---

## 🧹 Cleanup Required

### Immediate Actions
1. **Delete deprecated services:**
   - ❌ `services/eventPipelineService.js` (uses old Supporter model)
   - ❌ `services/pipelineService.js` (uses old 5-stage system)

2. **Update eventAttendeeService.js:**
   - ✅ Fix field names (`stage` → `currentStage`)
   - ✅ Fix table names (`EventPipelineEntry` → `EventAttendee`)
   - ✅ Fix model names (`Supporter` → `OrgMember`)

3. **Database migration:**
   - ✅ Ensure NEW tables exist
   - ✅ Remove OLD tables
   - ✅ Update field names

### Service Consolidation
**Keep ONLY:**
- ✅ `services/eventAttendeeService.js` (NEW system)
- ✅ `services/eventDataCheckerService.js` (validation)
- ✅ `services/csvNormalizer.js` (CSV processing)

**Remove:**
- ❌ `services/eventPipelineService.js`
- ❌ `services/pipelineService.js`
- ❌ `services/supporterMutation.js`

---

## 🎯 Correct Service Architecture

### Single Source of Truth
```javascript
// services/eventAttendeeService.js
export async function populateEventPipeline(eventId, orgId) {
  // Uses: OrgMember + EventAttendee
  // Uses: currentStage field
  // Uses: 7-stage funnel
  // Creates: EventAttendee records
}
```

### Database Schema
```sql
-- NEW tables (keep these)
OrgMember (master contacts)
EventAttendee (pipeline records)
Event (events)
Organization (orgs)

-- OLD tables (remove these)
Supporter (deprecated)
EventPipelineEntry (deprecated)
```

---

## 🚀 Next Steps

1. **Check database reality** - What tables actually exist?
2. **Fix eventAttendeeService.js** - Use correct field names
3. **Delete old services** - Remove deprecated code
4. **Test pipeline population** - Make sure it works
5. **Update documentation** - Keep this current

---

## 📝 Service Usage Guide

### For Event Creation
```javascript
// ✅ CORRECT - Use this service
import { populateEventPipeline } from '../services/eventAttendeeService.js';

const result = await populateEventPipeline(eventId, orgId);
```

### For Pipeline Management
```javascript
// ✅ CORRECT - Use EventAttendee model
const attendees = await prisma.eventAttendee.findMany({
  where: { eventId },
  include: { orgMember: true }
});
```

### ❌ DON'T USE
```javascript
// ❌ WRONG - Old services
import { pushSupportersToEvent } from '../services/eventPipelineService.js';
import { applyIntakeRules } from '../services/pipelineService.js';
```

---

## 🔥 Critical Rules

1. **ONLY use `eventAttendeeService.js`** for pipeline operations
2. **ONLY use `OrgMember` + `EventAttendee`** models
3. **ONLY use `currentStage`** field (not `stage`)
4. **ONLY use 7-stage funnel** (not 5-stage)
5. **DELETE old services** to prevent confusion

**This documentation must be updated when services change!**
