/**
 * Season Journal Service (PS-05) - MongoDB Version
 * 
 * Records crop events, recommendations, outcomes, and enables
 * the outcome learning loop.
 */

import { FOLLOW_UP_DAYS, MISSING_DATA_ALERT_DAYS } from './config/constants';
import { JournalEntry, FollowUp, IJournalEntry, IFollowUp } from './database/models/Journal';
import { getGroqClient } from './clients/groqClient';

export interface MissingDataAlert {
  fieldId: string;
  alertType: string;
  message: string;
  messageHindi: string;
  daysSinceLastObservation: number;
  priority: 'high' | 'medium' | 'low';
}

export class JournalService {
  /**
   * Create a new journal entry.
   */
  async createEntry(entry: Partial<IJournalEntry>) {
    const record = new JournalEntry(entry);
    await record.save();
    return record;
  }

  /**
   * Get journal entries for a farmer, optionally filtered by field or crop.
   */
  async getEntries(farmerId: string, filters?: { fieldId?: string; cropId?: string; type?: string }) {
    const query: any = { farmerId };
    if (filters?.fieldId) query.fieldId = filters.fieldId;
    if (filters?.cropId) query.cropId = filters.cropId;
    if (filters?.type) query.type = filters.type;

    return await JournalEntry.find(query).sort({ createdAt: -1 });
  }

  /**
   * Record outcome feedback for a journal entry (the learning loop).
   */
  async recordOutcome(
    entryId: string,
    feedback: 'better' | 'same' | 'worse',
    outcomePhoto?: string,
    outcomeNotes?: string
  ) {
    const entry = await JournalEntry.findById(entryId);
    if (!entry) return null;

    entry.outcomeFeedback = feedback;
    entry.outcomePhoto = outcomePhoto;
    entry.outcomeNotes = outcomeNotes;
    entry.outcomeRecordedAt = new Date();
    await entry.save();

    // Mark follow-up as completed
    await FollowUp.findOneAndUpdate(
      { journalEntryId: entryId },
      { status: 'completed' }
    );

    return entry;
  }

  /**
   * Create a follow-up reminder.
   */
  async createFollowUp(journalEntryId: string, farmerId: string, message: string) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + FOLLOW_UP_DAYS);

    const record = new FollowUp({
      journalEntryId,
      dueDate,
      status: 'pending',
      message,
      farmerId,
    });
    await record.save();
    return record;
  }

  /**
   * Get pending follow-ups for a farmer.
   */
  async getPendingFollowUps(farmerId: string) {
    const followUps = await FollowUp.find({ farmerId, status: 'pending' });
    const now = new Date();
    
    // Update overdue
    for (const f of followUps) {
      if (f.dueDate < now) {
        f.status = 'overdue';
        await f.save();
      }
    }
    
    return followUps;
  }

  /**
   * Missing Data Detective: check for gaps in farm records.
   */
  async checkMissingData(farmerId: string, fieldId: string): Promise<MissingDataAlert[]> {
    const alerts: MissingDataAlert[] = [];
    const fieldEntries = await JournalEntry.find({ farmerId, fieldId }).sort({ createdAt: -1 });
    const now = new Date();

    const lastObservation = fieldEntries.find(e => e.type === 'observation');

    if (lastObservation) {
      const daysSince = Math.floor((now.getTime() - lastObservation.createdAt.getTime()) / 86400000);
      if (daysSince > MISSING_DATA_ALERT_DAYS) {
        alerts.push({
          fieldId,
          alertType: 'observation_gap',
          message: `No pest or disease observation recorded for ${daysSince} days. The crop may be in a sensitive growth stage. Have you noticed insects, spots, curling, or unusual color?`,
          messageHindi: `${daysSince} दिनों से कोई कीट या रोग अवलोकन दर्ज नहीं किया गया। क्या आपने कीड़े, धब्बे, मुड़ना, या असामान्य रंग देखा है?`,
          daysSinceLastObservation: daysSince,
          priority: 'high',
        });
      }
    } else {
      alerts.push({
        fieldId,
        alertType: 'no_observations',
        message: 'No field observations recorded yet. Regular monitoring helps the AI provide better recommendations.',
        messageHindi: 'अभी तक कोई खेत अवलोकन दर्ज नहीं किया गया। नियमित निगरानी AI को बेहतर सलाह देने में मदद करती है।',
        daysSinceLastObservation: 999,
        priority: 'medium',
      });
    }

    const hasSoilTest = fieldEntries.some(e => e.type === 'observation' && e.title.toLowerCase().includes('soil'));
    if (!hasSoilTest) {
      alerts.push({
        fieldId,
        alertType: 'no_soil_test',
        message: 'No soil test result found for this field. Upload a soil test report for better fertilizer recommendations.',
        messageHindi: 'इस खेत के लिए कोई मृदा परीक्षण परिणाम नहीं मिला। बेहतर उर्वरक सलाह के लिए मृदा परीक्षण रिपोर्ट अपलोड करें।',
        daysSinceLastObservation: 999,
        priority: 'medium',
      });
    }

    const followUps = await FollowUp.find({ farmerId, status: { $ne: 'completed' }, dueDate: { $lt: now } });
    if (followUps.length > 0) {
      alerts.push({
        fieldId,
        alertType: 'pending_followups',
        message: `${followUps.length} follow-up outcome(s) are pending. Recording outcomes helps the AI learn what works for your farm.`,
        messageHindi: `${followUps.length} फॉलो-अप परिणाम लंबित हैं। परिणाम दर्ज करने से AI को पता चलता है कि आपके खेत के लिए क्या काम करता है।`,
        daysSinceLastObservation: 0,
        priority: 'high',
      });
    }

    return alerts;
  }

  /**
   * Get farm timeline.
   */
  async getTimeline(farmerId: string, fieldId?: string) {
    const query: any = { farmerId };
    if (fieldId) query.fieldId = fieldId;

    const entries = await JournalEntry.find(query).sort({ createdAt: -1 });
    const followUps = await FollowUp.find({ farmerId });

    return {
      entries,
      followUps,
      stats: {
        totalEntries: entries.length,
        outcomesRecorded: entries.filter(e => e.outcomeFeedback).length,
        pendingFollowUps: followUps.filter(f => f.status === 'pending').length,
      },
    };
  }

  /**
   * Process raw spoken text into a structured journal entry using AI.
   */
  async processVoiceLog(farmerId: string, fieldId: string, spokenText: string): Promise<IJournalEntry> {
    const groq = getGroqClient();
    const parsedData = await groq.parseJournalEntry(spokenText);

    const entryData = {
      farmerId,
      fieldId,
      fieldName: 'Field 01 (Wheat)',
      type: parsedData.type || 'observation',
      title: parsedData.title || 'Voice Log Entry',
      notes: parsedData.notes || spokenText,
      cost: parsedData.cost,
      quantity: parsedData.quantity,
    };

    return await this.createEntry(entryData);
  }
}

let _instance: JournalService | null = null;
export function getJournalService(): JournalService {
  if (!_instance) _instance = new JournalService();
  return _instance;
}
