/**
 * Audience Stages Service - RELATIONAL & MODULAR
 * Defines stage trees based on audience type
 */

// Different audiences get different stage progressions
export const AUDIENCE_STAGE_TREES = {
  // Internal org members - full funnel
  org_members: [
    'in_funnel',
    'general_awareness', 
    'personal_invite',
    'expressed_interest',
    'soft_commit',
    'paid',
    'cant_attend'
  ],
  
  // Friends & family - shorter funnel
  friends_family: [
    'in_funnel',
    'personal_invite',  // Skip general awareness
    'soft_commit',      // Skip expressed interest
    'paid',
    'cant_attend'
  ],
  
  // Landing page public - direct to soft commit
  landing_page_public: [
    'in_funnel',
    'soft_commit',      // Direct to soft commit
    'paid',
    'cant_attend'
  ],
  
  // Community partners - professional funnel
  community_partners: [
    'in_funnel',
    'general_awareness',
    'personal_invite',
    'expressed_interest',
    'soft_commit',
    'paid',
    'cant_attend'
  ],
  
  // Cold outreach - longer nurturing
  cold_outreach: [
    'in_funnel',
    'general_awareness',
    'general_awareness', // Extra nurturing
    'personal_invite',
    'expressed_interest',
    'soft_commit',
    'paid',
    'cant_attend'
  ]
};

/**
 * Get stage tree for audience type
 */
export function getStageTree(audienceType) {
  return AUDIENCE_STAGE_TREES[audienceType] || AUDIENCE_STAGE_TREES.org_members;
}

/**
 * Get next stage in progression
 */
export function getNextStage(currentStage, audienceType) {
  const stageTree = getStageTree(audienceType);
  const currentIndex = stageTree.indexOf(currentStage);
  
  if (currentIndex === -1 || currentIndex >= stageTree.length - 1) {
    return null; // Already at final stage
  }
  
  return stageTree[currentIndex + 1];
}

/**
 * Get previous stage in progression
 */
export function getPreviousStage(currentStage, audienceType) {
  const stageTree = getStageTree(audienceType);
  const currentIndex = stageTree.indexOf(currentStage);
  
  if (currentIndex <= 0) {
    return null; // Already at first stage
  }
  
  return stageTree[currentIndex - 1];
}

/**
 * Validate stage progression for audience
 */
export function validateStageProgression(currentStage, newStage, audienceType) {
  const stageTree = getStageTree(audienceType);
  
  const currentIndex = stageTree.indexOf(currentStage);
  const newIndex = stageTree.indexOf(newStage);
  
  if (newIndex === -1) {
    return { valid: false, error: `Invalid stage for ${audienceType} audience` };
  }
  
  // Allow forward movement or same stage
  if (newIndex < currentIndex) {
    return { 
      valid: false, 
      error: 'Cannot downgrade stage',
      currentStage,
      attemptedStage: newStage,
      stageTree
    };
  }
  
  return { valid: true };
}

/**
 * Get stage statistics for audience
 */
export function getAudienceStageStats(attendees, audienceType) {
  const stageTree = getStageTree(audienceType);
  const stats = {};
  
  // Initialize all stages to 0
  stageTree.forEach(stage => {
    stats[stage] = 0;
  });
  
  // Count attendees by stage
  attendees.forEach(attendee => {
    if (stats.hasOwnProperty(attendee.currentStage)) {
      stats[attendee.currentStage]++;
    }
  });
  
  const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
  
  return {
    audienceType,
    stageTree,
    stageCounts: stats,
    totalAttendees: total
  };
}

/**
 * Get conversion rates for audience
 */
export function getAudienceConversionRates(stats) {
  const { stageCounts, totalAttendees } = stats;
  
  // Find key stages
  const softCommit = stageCounts.soft_commit || 0;
  const paid = stageCounts.paid || 0;
  const cantAttend = stageCounts.cant_attend || 0;
  
  return {
    softCommitRate: totalAttendees > 0 ? (softCommit / totalAttendees * 100).toFixed(1) : 0,
    paidRate: totalAttendees > 0 ? (paid / totalAttendees * 100).toFixed(1) : 0,
    softCommitToPaidRate: softCommit > 0 ? (paid / softCommit * 100).toFixed(1) : 0,
    optOutRate: totalAttendees > 0 ? (cantAttend / totalAttendees * 100).toFixed(1) : 0
  };
}
