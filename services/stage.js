/**
 * Stage Service - The 7 deal stages for org_members
 * Manages stage progression and validation
 */

import { getPrismaClient } from '../config/database.js';

const prisma = getPrismaClient();

// 7-Stage Funnel Hierarchy for org_members
export const STAGE_HIERARCHY = [
  'in_funnel',
  'general_awareness', 
  'personal_invite',
  'expressed_interest',
  'soft_commit',
  'paid',
  'cant_attend'
];

// Stage definitions with rich data
export const STAGE_DEFINITIONS = {
  in_funnel: {
    name: 'In Funnel',
    description: 'Just entered the pipeline',
    color: '#6B7280',
    icon: '🎯',
    isFinal: false
  },
  general_awareness: {
    name: 'General Awareness',
    description: 'Knows about the event',
    color: '#3B82F6',
    icon: '👁️',
    isFinal: false
  },
  personal_invite: {
    name: 'Personal Invite',
    description: 'Received personal invitation',
    color: '#8B5CF6',
    icon: '📧',
    isFinal: false
  },
  expressed_interest: {
    name: 'Expressed Interest',
    description: 'Showed interest in attending',
    color: '#F59E0B',
    icon: '🤔',
    isFinal: false
  },
  soft_commit: {
    name: 'Soft Commit',
    description: 'Committed to attend (not paid)',
    color: '#10B981',
    icon: '🤝',
    isFinal: false
  },
  paid: {
    name: 'Paid',
    description: 'Purchased ticket/paid',
    color: '#059669',
    icon: '💰',
    isFinal: true
  },
  cant_attend: {
    name: "Can't Attend",
    description: 'Opted out or declined',
    color: '#EF4444',
    icon: '❌',
    isFinal: true
  }
};

/**
 * Validate stage progression (no downgrades allowed)
 */
export function validateStageProgression(currentStage, newStage) {
  const currentIndex = STAGE_HIERARCHY.indexOf(currentStage);
  const newIndex = STAGE_HIERARCHY.indexOf(newStage);
  
  if (newIndex === -1) {
    return { valid: false, error: 'Invalid stage' };
  }
  
  // Allow forward movement or same stage
  if (newIndex < currentIndex) {
    return { 
      valid: false, 
      error: 'Cannot downgrade stage',
      currentStage,
      attemptedStage: newStage,
      hierarchy: STAGE_HIERARCHY
    };
  }
  
  return { valid: true };
}

/**
 * Move EventAttendee to new stage
 */
export async function moveToStage(attendeeId, newStage) {
  try {
    console.log(`🔄 Moving attendee ${attendeeId} to stage: ${newStage}`);
    
    // Get current attendee
    const attendee = await prisma.eventAttendee.findUnique({
      where: { id: attendeeId },
      include: { 
        orgMember: true,
        pipeline: true
      }
    });
    
    if (!attendee) {
      return { success: false, error: 'Attendee not found' };
    }
    
    // Validate stage progression
    const validation = validateStageProgression(attendee.currentStage, newStage);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }
    
    // Update attendee
    const updatedAttendee = await prisma.eventAttendee.update({
      where: { id: attendeeId },
      data: { 
        currentStage: newStage,
        updatedAt: new Date()
      },
      include: { 
        orgMember: true,
        pipeline: true
      }
    });
    
    console.log(`✅ Moved ${attendee.orgMember.firstName} ${attendee.orgMember.lastName} to ${newStage}`);
    
    return {
      success: true,
      attendee: updatedAttendee,
      message: `Moved to ${newStage}`
    };
    
  } catch (error) {
    console.error('❌ Move to stage error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get attendees by stage for a pipeline
 */
export async function getAttendeesByStage(pipelineId, stage) {
  try {
    const attendees = await prisma.eventAttendee.findMany({
      where: { 
        pipelineId,
        currentStage: stage
      },
      include: {
        orgMember: {
          select: {
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
    
    return { success: true, attendees };
    
  } catch (error) {
    console.error('❌ Get attendees by stage error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get stage statistics for a pipeline
 */
export async function getStageStats(pipelineId) {
  try {
    const stageCounts = {};
    
    for (const stage of STAGE_HIERARCHY) {
      stageCounts[stage] = await prisma.eventAttendee.count({
        where: { 
          pipelineId,
          currentStage: stage
        }
      });
    }
    
    const total = Object.values(stageCounts).reduce((sum, count) => sum + count, 0);
    const softCommit = stageCounts.soft_commit || 0;
    const paid = stageCounts.paid || 0;
    
    const conversionRates = {
      softCommitRate: total > 0 ? (softCommit / total * 100).toFixed(1) : 0,
      paidRate: total > 0 ? (paid / total * 100).toFixed(1) : 0,
      softCommitToPaidRate: softCommit > 0 ? (paid / softCommit * 100).toFixed(1) : 0
    };
    
    return {
      success: true,
      totalAttendees: total,
      stageCounts,
      conversionRates,
      hierarchy: STAGE_HIERARCHY,
      stageDefinitions: STAGE_DEFINITIONS
    };
    
  } catch (error) {
    console.error('❌ Get stage stats error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Bulk move attendees to stage
 */
export async function bulkMoveToStage(attendeeIds, newStage) {
  try {
    console.log(`🔄 Bulk moving ${attendeeIds.length} attendees to stage: ${newStage}`);
    
    const results = {
      success: [],
      errors: []
    };
    
    for (const attendeeId of attendeeIds) {
      const result = await moveToStage(attendeeId, newStage);
      if (result.success) {
        results.success.push(result.attendee);
      } else {
        results.errors.push({ attendeeId, error: result.error });
      }
    }
    
    console.log(`✅ Bulk move complete: ${results.success.length} success, ${results.errors.length} errors`);
    
    return {
      success: true,
      moved: results.success.length,
      errors: results.errors.length,
      results
    };
    
  } catch (error) {
    console.error('❌ Bulk move to stage error:', error);
    return { success: false, error: error.message };
  }
}