/**
 * Stage Routes - Get stage definitions
 */

import express from 'express';
import { getPrismaClient } from '../config/database.js';

const router = express.Router();
const prisma = getPrismaClient();

// Default 7-stage funnel for org_members
const DEFAULT_STAGES = [
  {
    slug: 'in_funnel',
    name: 'In Funnel',
    description: 'Just entered the pipeline',
    color: '#6B7280',
    icon: '🎯',
    isFinal: false
  },
  {
    slug: 'general_awareness',
    name: 'General Awareness',
    description: 'Knows about the event',
    color: '#3B82F6',
    icon: '👁️',
    isFinal: false
  },
  {
    slug: 'personal_invite',
    name: 'Personal Invite',
    description: 'Received personal invitation',
    color: '#8B5CF6',
    icon: '📧',
    isFinal: false
  },
  {
    slug: 'expressed_interest',
    name: 'Expressed Interest',
    description: 'Showed interest in attending',
    color: '#F59E0B',
    icon: '🤔',
    isFinal: false
  },
  {
    slug: 'soft_commit',
    name: 'Soft Commit',
    description: 'Committed to attend (not paid)',
    color: '#10B981',
    icon: '🤝',
    isFinal: false
  },
  {
    slug: 'paid',
    name: 'Paid',
    description: 'Purchased ticket/paid',
    color: '#059669',
    icon: '💰',
    isFinal: true
  },
  {
    slug: 'cant_attend',
    name: "Can't Attend",
    description: 'Opted out or declined',
    color: '#EF4444',
    icon: '❌',
    isFinal: true
  }
];

/**
 * Get stages for a pipeline (MVP1: return default stages)
 */
router.get('/pipelines/:pipelineId/stages', async (req, res) => {
  try {
    const { pipelineId } = req.params;
    
    // MVP1: Return default stages
    // MVP2: Query custom stages from database
    console.log(`📋 Getting stages for pipeline: ${pipelineId}`);
    
    res.json(DEFAULT_STAGES);
    
  } catch (error) {
    console.error('❌ Get stages error:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * Get all available stages (for stage library)
 */
router.get('/stages', async (req, res) => {
  try {
    console.log('📚 Getting all available stages');
    
    // MVP1: Return default stages
    // MVP2: Query all stages from database
    res.json(DEFAULT_STAGES);
    
  } catch (error) {
    console.error('❌ Get all stages error:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;

