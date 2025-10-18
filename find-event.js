import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findEvent() {
  try {
    console.log('🔍 Searching for events in production database...');
    
    // Find all events
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log(`📊 Found ${events.length} events total`);
    
    if (events.length > 0) {
      console.log('🎯 Latest events:');
      events.forEach((event, index) => {
        console.log(`\n${index + 1}. Event ID: ${event.id}`);
        console.log(`   Name: ${event.name}`);
        console.log(`   Slug: ${event.slug}`);
        console.log(`   Date: ${event.date}`);
        console.log(`   Org ID: ${event.orgId}`);
        console.log(`   Created: ${event.createdAt}`);
      });
    } else {
      console.log('❌ No events found!');
    }
    
    // Also check for your specific org
    console.log('\n🏢 Checking for your org events...');
    const orgEvents = await prisma.event.findMany({
      where: { orgId: 'cmgfvz9v10000nt284k875eoc' }
    });
    
    console.log(`📊 Found ${orgEvents.length} events for your org`);
    if (orgEvents.length > 0) {
      orgEvents.forEach(event => {
        console.log(`✅ ${event.name} (${event.id})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

findEvent();
