/**
 * Seed Stages Service
 * Creates the 7 default stages for org_members
 */

import { getPrismaClient } from '../config/database.js';

const prisma = getPrismaClient();

// The 7 agreed-upon stages for org_members
export const DEFAULT_ORG_MEMBER_STAGES = [
  {
    slug: 'in_funnel',
    name: 'In Funnel',
    description: 'Just entered the pipeline'
  },
  {
    slug: 'general_awareness',
    name: 'General Awareness',
    description: 'Knows about the event'
  },
  {
    slug: 'personal_invite',
    name: 'Personal Invite',
    description: 'Received personal invitation'
  },
  {
    slug: 'expressed_interest',
    name: 'Expressed Interest',
    description: 'Showed interest in attending'
  },
  {
    slug: 'soft_commit',
    name: 'Soft Commit',
    description: 'Committed to attend (not paid)'
  },
  {
    slug: 'paid',
    name: 'Paid',
    description: 'Purchased ticket/paid'
  },
  {
    slug: 'cant_attend',
    name: "Can't Attend",
    description: 'Opted out or declined'
  }
];

/**
 * Seed the 7 default stages for an org
 */
export async function seedOrgStages(orgId) {
  try {
    console.log(`🌱 Seeding 7 default stages for org: ${orgId}`);
    
    const stages = [];
    
    for (const stageData of DEFAULT_ORG_MEMBER_STAGES) {
      // Check if stage already exists
      let stage = await prisma.stage.findUnique({
        where: {
          orgId_slug: {
            orgId,
            slug: stageData.slug
          }
        }
      });
      
      if (!stage) {
        stage = await prisma.stage.create({
          data: {
            orgId,
            ...stageData
          }
        });
        console.log(`✅ Created stage: ${stage.slug}`);
      } else {
        console.log(`⏭️ Stage already exists: ${stage.slug}`);
      }
      
      stages.push(stage);
    }
    
    console.log(`🌱 Seeded ${stages.length} stages for org`);
    return { success: true, stages };
    
  } catch (error) {
    console.error('❌ Seed stages error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Link stages to a pipeline in order
 */
export async function linkStagesToPipeline(pipelineId, stageIds) {
  try {
    console.log(`🔗 Linking ${stageIds.length} stages to pipeline: ${pipelineId}`);
    
    const pipelineStages = [];
    
    for (let i = 0; i < stageIds.length; i++) {
      const pipelineStage = await prisma.pipelineStage.create({
        data: {
          pipelineId,
          stageId: stageIds[i],
          orderIndex: i
        }
      });
      pipelineStages.push(pipelineStage);
    }
    
    console.log(`✅ Linked ${pipelineStages.length} stages to pipeline`);
    return { success: true, pipelineStages };
    
  } catch (error) {
    console.error('❌ Link stages error:', error);
    return { success: false, error: error.message };
  }
}

