/**
 * Universal Pipeline Hydration Service
 * Hydrates pipeline with stages and attendees
 */

import { getPrismaClient } from '../config/database.js';

const prisma = getPrismaClient();

/**
 * Universal Pipeline Hydration
 * Returns: pipeline + stages + attendees
 */
export async function hydratePipeline(eventId, audienceType = 'org_members') {
  try {
    console.log(`💧 HYDRATE: eventId=${eventId}, audienceType=${audienceType}`);
    
    // 1. Get EventPipeline
    const pipeline = await prisma.eventPipeline.findUnique({
      where: {
        eventId_audienceType: {
          eventId,
          audienceType
        }
      }
    });
    
    if (!pipeline) {
      return { 
        success: false, 
        error: 'Pipeline not found - user needs to create it first' 
      };
    }
    
    // 2. Get Stages for this pipeline (via PipelineStage junction)
    const pipelineStages = await prisma.pipelineStage.findMany({
      where: { pipelineId: pipeline.id },
      include: {
        stage: true // Get the full Stage data
      },
      orderBy: { orderIndex: 'asc' }
    });
    
    const stages = pipelineStages.map(ps => ({
      id: ps.stage.id,
      slug: ps.stage.slug,
      name: ps.stage.name,
      description: ps.stage.description,
      orderIndex: ps.orderIndex
    }));
    
    // 3. Get EventAttendees for this pipeline
    const attendees = await prisma.eventAttendee.findMany({
      where: { pipelineId: pipeline.id },
      include: {
        orgMember: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            tags: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`✅ HYDRATED: ${stages.length} stages, ${attendees.length} attendees`);
    
    return {
      success: true,
      pipeline: {
        id: pipeline.id,
        eventId: pipeline.eventId,
        audienceType: pipeline.audienceType,
        isActive: pipeline.isActive
      },
      stages,
      attendees
    };
    
  } catch (error) {
    console.error('❌ HYDRATE error:', error);
    return { success: false, error: error.message };
  }
}

