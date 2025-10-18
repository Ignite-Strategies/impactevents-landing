# 📊 Database Models Reference

## Current Models in Prisma Schema

### Core Models
1. **Organization** - The organization/nonprofit
2. **OrgMember** - Master contact list (app users + external contacts)
3. **Supporter** - Legacy contact model (to be deprecated)
4. **SupporterTag** - Tags for supporters

### Event Models
5. **Event** - Events created by organizations
6. **EventPipeline** - Pipeline for an audience type within an event
7. **EventForm** - Dynamic forms for event signups
8. **EventPipelineEntry** - Legacy pipeline model (to be deprecated)
9. **EventAttendee** - Working record linking OrgMember to Event via Pipeline
10. **EventTask** - Tasks for event management

### Stage Models
11. **Stage** - All possible deal stages (could be 30+)
12. **PipelineStage** - Junction table (which stages for THIS pipeline)

### Other Models
13. **FamilyProspect** - Family/friend prospects
14. **FamilyProspectTag** - Tags for family prospects
15. **Template** - Email templates
16. **ContactList** - Contact list management
17. **ContactListMember** - Members in a contact list

---

## Key Relationships

### The Sacred Master List
**OrgMember** = The person (app user or external contact)
- Has: firstName, lastName, email, phone, role, firebaseId
- Can be: Admin (has firebaseId + role) OR Contact (no firebaseId)

### Event → Pipeline → Attendee Flow
```
Event
  └─> EventPipeline (audienceType: "org_members", "friends_family", etc.)
      └─> PipelineStage (junction) → Stage definitions
      └─> EventAttendee (the working record)
          └─> Links to OrgMember (the person)
          └─> Has currentStage (where they are in the pipeline)
```

### Form → Submission Flow
```
EventForm (created by admin)
  - pipelineId (which pipeline)
  - targetStage (where contacts land)
  - fields (JSON)
  - publicTitle, publicDescription

When submitted:
  └─> Creates/Updates OrgMember
  └─> Creates EventAttendee in the form's pipeline at the form's targetStage
```

---

## Important Notes

- **OrgMember is NOT a pipeline** - It's the master contact list
- **EventAttendee is the prospective attendee** - The working record for an event
- **EventPipeline defines the funnel** - Which audience type
- **Stage defines deal stages** - Relational, not hardcoded
- **PipelineStage links stages to pipelines** - Junction table

---

**Last Updated:** October 7, 2025

