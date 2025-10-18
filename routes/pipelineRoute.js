/**
 * Pipeline Management Routes
 * Handles pipeline CRUD operations and stage management
 */

import express from 'express';
import { getPrismaClient } from '../config/database.js';
import { createEventPipeline } from '../services/pipeline.js';
import { moveToStage, getStageStats, bulkMoveToStage } from '../services/stageService.js';

const router = express.Router();
const prisma = getPrismaClient();

/**
 * Create pipeline for event
 */
router.post('/events/:eventId/pipelines', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { audienceType, stages } = req.body;
    
    console.log(`🎯 Creating pipeline for event ${eventId}, audience: ${audienceType}`);
    
    // Get event to get orgId
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Create pipeline
    const result = await createEventPipeline(eventId, event.orgId, audienceType);
    
    if (result.success) {
      res.status(201).json(result.pipeline);
    } else {
      res.status(400).json({ error: result.error });
    }
    
  } catch (error) {
    console.error('❌ Create pipeline error:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * Get pipeline for event
 */
router.get('/events/:eventId/pipelines/:audienceType', async (req, res) => {
  try {
    const { eventId, audienceType } = req.params;
    
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
    
    if (!pipeline) {
      return res.status(404).json({ error: 'Pipeline not found' });
    }
    
    res.json(pipeline);
    
  } catch (error) {
    console.error('❌ Get pipeline error:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * Update pipeline stages
 */
router.patch('/events/:eventId/pipelines/:audienceType', async (req, res) => {
  try {
    const { eventId, audienceType } = req.params;
    const { stages } = req.body;
    
    const pipeline = await prisma.eventPipeline.update({
      where: {
        eventId_audienceType: {
          eventId,
          audienceType
        }
      },
      data: { stages }
    });
    
    res.json(pipeline);
    
  } catch (error) {
    console.error('❌ Update pipeline error:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * Move attendee to stage
 */
router.patch('/attendees/:attendeeId/move', async (req, res) => {
  try {
    const { attendeeId } = req.params;
    const { stage } = req.body;
    
    const result = await moveToStage(attendeeId, stage);
    
    if (result.success) {
      res.json(result.attendee);
    } else {
      res.status(400).json({ error: result.error });
    }
    
  } catch (error) {
    console.error('❌ Move attendee error:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * Bulk move attendees to stage
 */
router.patch('/attendees/bulk-move', async (req, res) => {
  try {
    const { attendeeIds, stage } = req.body;
    
    const result = await bulkMoveToStage(attendeeIds, stage);
    
    res.json(result);
    
  } catch (error) {
    console.error('❌ Bulk move error:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * Get stage statistics
 */
router.get('/events/:eventId/pipelines/:audienceType/stats', async (req, res) => {
  try {
    const { eventId, audienceType } = req.params;
    
    const pipeline = await prisma.eventPipeline.findUnique({
      where: {
        eventId_audienceType: {
          eventId,
          audienceType
        }
      }
    });
    
    if (!pipeline) {
      return res.status(404).json({ error: 'Pipeline not found' });
    }
    
    const stats = await getStageStats(pipeline.id);
    
    if (stats.success) {
      res.json(stats);
    } else {
      res.status(400).json({ error: stats.error });
    }
    
  } catch (error) {
    console.error('❌ Get stats error:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;