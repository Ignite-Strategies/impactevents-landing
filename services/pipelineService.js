/**
 * Pipeline Service - Business logic for pipeline management
 * Handles EventPipeline CRUD operations
 */

import { getPrismaClient } from '../config/database.js';

const prisma = getPrismaClient();

// 7-Stage Funnel Hierarchy
export const STAGE_HIERARCHY = [
  'in_funnel',
  'general_awareness', 
  'personal_invite',
  'expressed_interest',
  'soft_commit',
  'paid',
  'cant_attend'
];

/**
 * Create EventPipeline for an event
 */
export async function createEventPipeline(eventId, orgId, audienceType = 'org_members') {
  try {
    console.log(`🎯 Creating EventPipeline: eventId=${eventId}, audienceType=${audienceType}`);
    
    const pipeline = await prisma.eventPipeline.create({
      data: {
        orgId,
        eventId,
        audienceType,
        stages: STAGE_HIERARCHY,
        isActive: true
      }
    });
    
    console.log(`✅ EventPipeline created: ${pipeline.id}`);
    return { success: true, pipeline };
    
  } catch (error) {
    console.error('❌ Create EventPipeline error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get EventPipeline by event and audience type
 */
export async function getEventPipeline(eventId, audienceType = 'org_members') {
  try {
    const pipeline = await prisma.eventPipeline.findUnique({
      where: {
        eventId_audienceType: {
          eventId,
          audienceType
        }
      },
      include: {
        attendees: {
          include: {
            orgMember: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            }
          }
        }
      }
    });
    
    return { success: true, pipeline };
    
  } catch (error) {
    console.error('❌ Get EventPipeline error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Apply paid status to supporter (legacy function)
 */
export async function applyPaid(eventId, supporterId, audienceType) {
  try {
    console.log('💰 APPLY PAID: Applying paid status to supporter');
    
    // Update the pipeline entry to paid stage
    const entry = await prisma.eventPipelineEntry.updateMany({
      where: {
        eventId,
        supporterId,
        audienceType
      },
      data: {
        stage: 'paid'
      }
    });
    
    console.log('💰 APPLY PAID: Updated', entry.count, 'entries');
    
    return {
      success: true,
      message: 'Applied paid status to supporter',
      supporterId,
      stage: 'paid'
    };
    
  } catch (error) {
    console.error('❌ APPLY PAID error:', error);
    return { success: false, error: error.message };
  }
}