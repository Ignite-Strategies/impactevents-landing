import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkEvents() {
  try {
    console.log('🔍 Checking events in database...');
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`📊 Found ${events.length} events total`);
    
    if (events.length > 0) {
      console.log('🎯 Latest event:');
      console.log(JSON.stringify(events[0], null, 2));
    } else {
      console.log('❌ No events found in database!');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkEvents();
