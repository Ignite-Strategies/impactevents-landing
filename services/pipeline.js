/**
 * Pipeline Service - RELATIONAL & MODULAR
 * Manages EventPipeline records (the funnel definitions)
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
 * Pipeline name = Audience type (they're the same thing)
 */
export async function createEventPipeline(eventId, orgId, pipelineName = 'org_members') {
  try {
    console.log(`🎯 Creating EventPipeline: eventId=${eventId}, pipelineName=${pipelineName}`);
    
    const pipeline = await prisma.eventPipeline.create({
      data: {
        orgId,
        eventId,
        audienceType: pipelineName, // Pipeline name = Audience type
        stages: STAGE_HIERARCHY,
        isActive: true
      }
    });
    
    console.log(`✅ EventPipeline created: ${pipeline.id} (${pipelineName})`);
    return { success: true, pipeline };
    
  } catch (error) {
    console.error('❌ Create EventPipeline error:', error);
    return { success: false, error: error.message };
  }
}