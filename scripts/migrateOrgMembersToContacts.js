/**
 * Migration Script: OrgMember → Contact + OrgMember
 * 
 * Migrates existing OrgMembers to new Contact-based architecture
 */

import { getPrismaClient } from '../config/database.js';

const prisma = getPrismaClient();

async function migrateOrgMembersToContacts() {
  try {
    console.log('🚀 Starting OrgMember → Contact migration...');
    
    // Get all existing OrgMembers
    const orgMembers = await prisma.orgMember.findMany();
    
    console.log(`📋 Found ${orgMembers.length} OrgMembers to migrate`);
    
    for (const orgMember of orgMembers) {
      console.log(`\n🔄 Migrating: ${orgMember.firstName} ${orgMember.lastName} (${orgMember.email})`);
      
      // 1. Create Contact
      const contact = await prisma.contact.create({
        data: {
          orgId: orgMember.orgId,
          firstName: orgMember.firstName,
          lastName: orgMember.lastName,
          email: orgMember.email,
          phone: orgMember.phone
        }
      });
      
      console.log(`✅ Created Contact: ${contact.id}`);
      
      // 2. Update OrgMember to link to Contact
      await prisma.orgMember.update({
        where: { id: orgMember.id },
        data: { contactId: contact.id }
      });
      
      console.log(`✅ Linked OrgMember to Contact`);
      
      // 3. Update any EventAttendees to link to Contact
      const updated = await prisma.eventAttendee.updateMany({
        where: { orgMemberId: orgMember.id },
        data: { contactId: contact.id }
      });
      
      if (updated.count > 0) {
        console.log(`✅ Updated ${updated.count} EventAttendee records`);
      }
    }
    
    console.log('\n🎉 Migration complete!');
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateOrgMembersToContacts()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

