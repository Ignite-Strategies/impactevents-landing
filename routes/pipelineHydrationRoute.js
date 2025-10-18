/**
 * Pipeline Hydration Routes
 * "This is orglist so hydrate that stage flow and people"
 */

import express from 'express';
import { hydratePipelineWithAttendees, getPipelineStats } from '../services/pipelineHydrationService.js';

const router = express.Router();

/**
 * Hydrate pipeline with stages and attendees
 * GET /api/events/:eventId/pipeline/hydrate?audienceType=org_members
 */
router.get('/events/:eventId/pipeline/hydrate', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { audienceType = 'org_members' } = req.query;
    
    console.log(`💧 HYDRATE ROUTE: eventId=${eventId}, audienceType=${audienceType}`);
    
    const result = await hydratePipelineWithAttendees(eventId, audienceType);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json({ error: result.error });
    }
    
  } catch (error) {
    console.error('❌ HYDRATE ROUTE error:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * Get pipeline stats
 * GET /api/pipelines/:pipelineId/stats
 */
router.get('/pipelines/:pipelineId/stats', async (req, res) => {
  try {
    const { pipelineId } = req.params;
    
    const result = await getPipelineStats(pipelineId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json({ error: result.error });
    }
    
  } catch (error) {
    console.error('❌ STATS ROUTE error:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;

