/**
 * Pipeline Hydration Service
 * Hydrates pipeline with stages and attendees
 */

import { getPrismaClient } from '../config/database.js';

const prisma = getPrismaClient();

// Default 7-stage funnel
const DEFAULT_STAGES = [
  'in_funnel',
  'general_awareness',
  'personal_invite',
  'expressed_interest',
  'soft_commit',
  'paid',
  'cant_attend'
];

/**
 * Hydrate pipeline with stages and attendees
 * "This is orglist so hydrate that stage flow and people"
 */
export async function hydratePipelineWithAttendees(eventId, audienceType = 'org_members') {
  try {
    console.log(`💧 HYDRATE: eventId=${eventId}, audienceType=${audienceType}`);
    
    // Get or create EventPipeline
    let pipeline = await prisma.eventPipeline.findUnique({
      where: {
        eventId_audienceType: {
          eventId,
          audienceType
        }
      }
    });
    
    if (!pipeline) {
      console.log('⚠️ Pipeline not found, creating...');
      const event = await prisma.event.findUnique({ where: { id: eventId } });
      
      pipeline = await prisma.eventPipeline.create({
        data: {
          orgId: event.orgId,
          eventId,
          audienceType,
          stages: DEFAULT_STAGES,
          isActive: true
        }
      });
    }
    
    // Get attendees grouped by stage
    const attendees = await prisma.eventAttendee.findMany({
      where: {
        eventId,
        pipelineId: pipeline.id
      },
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
    
    // Group attendees by stage
    const stageGroups = {};
    pipeline.stages.forEach(stage => {
      stageGroups[stage] = attendees.filter(a => a.currentStage === stage);
    });
    
    console.log(`✅ HYDRATED: ${attendees.length} attendees across ${pipeline.stages.length} stages`);
    
    return {
      success: true,
      pipeline: {
        id: pipeline.id,
        audienceType: pipeline.audienceType,
        stages: pipeline.stages
      },
      stageGroups,
      totalAttendees: attendees.length
    };
    
  } catch (error) {
    console.error('❌ HYDRATE error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get pipeline stats
 */
export async function getPipelineStats(pipelineId) {
  try {
    const pipeline = await prisma.eventPipeline.findUnique({
      where: { id: pipelineId },
      include: {
        attendees: {
          select: {
            currentStage: true
          }
        }
      }
    });
    
    if (!pipeline) {
      return { success: false, error: 'Pipeline not found' };
    }
    
    // Count by stage
    const stageCounts = {};
    pipeline.stages.forEach(stage => {
      stageCounts[stage] = pipeline.attendees.filter(a => a.currentStage === stage).length;
    });
    
    return {
      success: true,
      totalAttendees: pipeline.attendees.length,
      stageCounts,
      conversionRate: {
        softCommit: stageCounts.soft_commit || 0,
        paid: stageCounts.paid || 0,
        softCommitToPaid: stageCounts.soft_commit > 0 
          ? ((stageCounts.paid / stageCounts.soft_commit) * 100).toFixed(1)
          : 0
      }
    };
    
  } catch (error) {
    console.error('❌ Stats error:', error);
    return { success: false, error: error.message };
  }
}

