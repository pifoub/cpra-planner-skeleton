// Tests for timeline computation rules.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeTimeline } from '../src/services/rules.js';

const baseReq = {
  requester: { name: 'Jane', email: 'jane@example.com' },
  receivedDate: '01/15/2025',
  matter: 'Records',
  description: 'Records',
  recordTypes: [],
  custodians: [],
  preferredFormatDelivery: '',
  range: {},
  departments: [],
  extension: { apply: true, reasons: [] },
};

/**
 * computeTimeline should roll deadlines forward when extension applies.
 */
test('computeTimeline handles extension and roll forward', () => {
  const tl = computeTimeline(baseReq);
  assert.equal(tl.determinationDue, '2025-01-27');
  assert.equal(tl.extensionDue, '2025-02-10');
  const labels = tl.milestones.map(m => m.label);
  assert(labels.includes('Draft production'));
});

/**
 * Natural language dates must be parsed correctly.
 */
test('computeTimeline parses natural language date', () => {
  const tl = computeTimeline({ ...baseReq, receivedDate: 'Jan 15, 2025' });
  assert.equal(tl.determinationDue, '2025-01-27');
});

/**
 * Invalid dates should raise an error.
 */
test('computeTimeline rejects invalid date', () => {
  assert.throws(() => computeTimeline({ ...baseReq, receivedDate: 'bad-date' }), /Unrecognized date format/);
});
