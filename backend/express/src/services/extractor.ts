import type { CPRARequest, CPRARequestDraft, Requester } from './types.js';

function parseDate(raw: string): string {
  const d = new Date(raw);
  return isNaN(d.getTime()) ? raw : d.toISOString().slice(0, 10);
}

/** Derive a draft CPRA request from a structured CPRA summary. */
export function extractScope(notes: string): CPRARequestDraft {
  let name = 'Unknown Requester';
  let email = 'requester@example.com';
  const rm = notes.match(/Requester:\s*(.*?)\s*[\u2013-]\s*(\S+)/);
  if (rm) {
    name = rm[1].trim();
    email = rm[2].trim();
  }
  let received = '2025-01-01';
  const dm = notes.match(/Date Received:\s*([^\n]+)/);
  if (dm) received = parseDate(dm[1]);
  let matter = 'No matter found';
  const sm = notes.match(/Matter:\s*([^\n]+)/);
  if (sm) matter = sm[1].trim();
  let rangeStart: string | undefined;
  let rangeEnd: string | undefined = received;
  const rmRange = notes.match(/Time Range:\s*([^\n]+)/);
  if (rmRange) {
    const parts = rmRange[1].split(/\s*[\u2013-]\s*/);
    if (parts.length === 2) {
      rangeStart = parseDate(parts[0]);
      rangeEnd = parseDate(parts[1]);
    }
  }
  let recordText = '';
  const rt = notes.match(/Record Types:\s*([^\n]+)/);
  const recordTypes = rt ? rt[1].split(/[;,]/).map(s => s.trim()).filter(Boolean) : [];
  if (rt) recordText = rt[1].trim();
  const cust = notes.match(/Custodians:\s*([^\n]+)/);
  const custodians = cust ? cust[1].split(/[;,]/).map(s => s.trim()).filter(Boolean) : [];
  const pf = notes.match(/Preferred Format\/Delivery:\s*([^\n]+)/);
  const preferred = pf ? pf[1].trim() : '';
  const requester: Requester = { name, email };
  const draft: CPRARequest = {
    requester,
    receivedDate: received,
    matter,
    description: recordText,
    recordTypes,
    custodians,
    preferredFormatDelivery: preferred,
    range: { start: rangeStart, end: rangeEnd },
    departments: [],
    extension: { apply: false, reasons: [] },
  };
  return {
    request: draft,
    confidences: { requester: 0.6, receivedDate: 0.7, matter: 0.6, description: 0.6 },
  };
}
