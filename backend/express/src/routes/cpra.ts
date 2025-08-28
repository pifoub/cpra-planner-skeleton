import { Router } from 'express';
import { extractScope } from '../services/extractor.js';
import { computeTimeline } from '../services/rules.js';
import { renderLetter } from '../services/templates.js';
import { createTaskSync } from '../services/tasksync.js';

const r = Router();

r.post('/extract/scope', (req, res) => {
  const notes = req.body?.notes;
  if (typeof notes !== 'string') {
    return res.status(400).json({ detail: 'notes must be a string' });
  }
  return res.json(extractScope(notes));
});

r.post('/timeline/calc', (req, res) => {
  const adjust = req.query.adjustForHolidays !== 'false';
  try {
    const timeline = computeTimeline(req.body, adjust);
    return res.json(timeline);
  } catch (err: any) {
    return res.status(400).json({ detail: err.message });
  }
});

r.post('/letters/ack', (req, res) => {
  try {
    const html = renderLetter('ack.html', req.body);
    return res.json({ html });
  } catch (err: any) {
    return res.status(400).json({ detail: err.message });
  }
});

r.post('/letters/extension', (req, res) => {
  try {
    const html = renderLetter('extension.html', req.body);
    return res.json({ html });
  } catch (err: any) {
    return res.status(400).json({ detail: err.message });
  }
});

r.post('/tasks/sync', (req, res) => {
  try {
    return res.json(createTaskSync(req.body));
  } catch (err: any) {
    return res.status(400).json({ detail: err.message });
  }
});

export default r;
