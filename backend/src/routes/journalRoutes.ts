/**
 * Journal API Routes (PS-05) - Async
 */
import { Router, type Request, type Response } from 'express';
import { getJournalService } from '../services/journalService';

export const journalRoutes = Router();
const service = getJournalService();

// POST /api/journal/entry
journalRoutes.post('/entry', async (req: Request, res: Response) => {
  try {
    const entry = await service.createEntry(req.body);
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create journal entry' });
  }
});
// POST /api/journal/voice-log
journalRoutes.post('/voice-log', async (req: Request, res: Response) => {
  try {
    const { farmerId, fieldId, text } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });
    
    const entry = await service.processVoiceLog(farmerId || 'gunjan', fieldId || 'field-1', text);
    res.status(201).json(entry);
  } catch (err) {
    console.error('Voice log error:', err);
    res.status(500).json({ error: 'Failed to process voice log' });
  }
});

// GET /api/journal/entries
journalRoutes.get('/entries', async (req: Request, res: Response) => {
  try {
    const farmerId = (req.query.farmerId as string) || 'gunjan';
    const entries = await service.getEntries(farmerId, {
      fieldId: req.query.fieldId as string,
      cropId: req.query.cropId as string,
      type: req.query.type as string,
    });
    res.json({ entries, count: entries.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
});

// PUT /api/journal/entry/:id/feedback
journalRoutes.put('/entry/:id/feedback', async (req: Request, res: Response) => {
  try {
    const { feedback, outcomePhoto, outcomeNotes } = req.body;
    const updated = await service.recordOutcome(req.params.id, feedback, outcomePhoto, outcomeNotes);
    if (!updated) return res.status(404).json({ error: 'Entry not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to record feedback' });
  }
});

// POST /api/journal/follow-up
journalRoutes.post('/follow-up', async (req: Request, res: Response) => {
  try {
    const { journalEntryId, farmerId, message } = req.body;
    const followUp = await service.createFollowUp(journalEntryId, farmerId, message);
    res.status(201).json(followUp);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create follow-up' });
  }
});

// GET /api/journal/follow-ups
journalRoutes.get('/follow-ups', async (req: Request, res: Response) => {
  try {
    const farmerId = (req.query.farmerId as string) || 'gunjan';
    const followUps = await service.getPendingFollowUps(farmerId);
    res.json({ followUps, count: followUps.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch follow-ups' });
  }
});

// GET /api/journal/missing-data
journalRoutes.get('/missing-data', async (req: Request, res: Response) => {
  try {
    const farmerId = (req.query.farmerId as string) || 'gunjan';
    const fieldId = (req.query.fieldId as string) || 'field-1';
    const alerts = await service.checkMissingData(farmerId, fieldId);
    res.json({ alerts, count: alerts.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check missing data' });
  }
});

// GET /api/journal/timeline
journalRoutes.get('/timeline', async (req: Request, res: Response) => {
  try {
    const farmerId = (req.query.farmerId as string) || 'gunjan';
    const fieldId = req.query.fieldId as string;
    const timeline = await service.getTimeline(farmerId, fieldId);
    res.json(timeline);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});
