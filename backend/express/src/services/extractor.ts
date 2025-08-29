import type { CPRARequest, CPRARequestDraft, Requester } from './types.js';

const EMAIL_RE = /[\w\.-]+@[\w\.-]+/;
const DATE_RE = /(\b\d{4}-\d{2}-\d{2}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}\b)/i;

/** Return the first email address found in `text` or `null`. */
function firstEmail(text: string): string | null {
  const m = text.match(EMAIL_RE);
  return m ? m[0] : null;
}

/** Return the first date-like string found in `text` or `null`. */
function firstDate(text: string): string | null {
  const m = text.match(DATE_RE);
  if (!m) return null;
  const raw = m[0];
  const d = new Date(raw);
  return isNaN(d.getTime()) ? raw : d.toISOString().slice(0, 10);
}

/** Derive a draft CPRA request from free-form meeting notes. */
export function extractScope(notes: string): CPRARequestDraft {
  const email = firstEmail(notes) || 'requester@example.com';
  let name = 'Unknown Requester';
  const nameMatch = notes.match(/(?:from|by|request(?:or|ed) by|requester)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
  if (nameMatch) name = nameMatch[1];
  const received = firstDate(notes) || '2025-01-01';
  let subject = 'No subject found';
  const subjectMatch = notes.match(/subject[:\s]+(.+)/i);
  if (subjectMatch) subject = subjectMatch[1].trim();
  let desc = 'All emails related to agenda item';
  const descMatch =
    notes.match(/records sought[:\s]+(.+)/i) || notes.match(/request[:\s]+(.+)/i);
  if (descMatch) desc = descMatch[1].trim();
  const requester: Requester = { name, email };
  const draft: CPRARequest = {
    requester,
    receivedDate: received,
    subject,
    description: desc,
    range: { start: '2024-01-01', end: received },
    departments: [],
    extension: { apply: false, reasons: [] },
  };
  return {
    request: draft,
    confidences: { requester: 0.6, receivedDate: 0.7, subject: 0.6, description: 0.6 },
  };
}
