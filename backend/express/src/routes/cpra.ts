import { Router } from 'express';
import { extractScope } from '../services/extractor.js';
import { computeTimeline } from '../services/rules.js';
import { renderLetter } from '../services/templates.js';
import { createTaskSync } from '../services/tasksync.js';

const r = Router();

/** Extract a draft CPRA scope from meeting notes. */
r.post('/extract/scope', (req, res) => {
  const notes = req.body?.notes;
  if (typeof notes !== 'string') {
    return res.status(400).json({ detail: 'notes must be a string' });
  }
  return res.json(extractScope(notes));
});

/** Calculate statutory deadlines and milestones for a request. */
r.post('/timeline/calc', (req, res) => {
  const adjust = req.query.adjustForHolidays !== 'false';
  try {
    const timeline = computeTimeline(req.body, adjust);
    return res.json(timeline);
  } catch (err: any) {
    return res.status(400).json({ detail: err.message });
  }
});

/** Render an acknowledgement letter. */
r.post('/letters/ack', (req, res) => {
  try {
    const html = renderLetter('ack.html', req.body);
    return res.json({ html });
  } catch (err: any) {
    return res.status(400).json({ detail: err.message });
  }
});

/** Render an extension letter. */
r.post('/letters/extension', (req, res) => {
  try {
    const html = renderLetter('extension.html', req.body);
    return res.json({ html });
  } catch (err: any) {
    return res.status(400).json({ detail: err.message });
  }
});

/** Create calendar events and return an ICS file. */
r.post('/tasks/sync', (req, res) => {
  try {
    return res.json(createTaskSync(req.body));
  } catch (err: any) {
    return res.status(400).json({ detail: err.message });
  }
});

export default r;
