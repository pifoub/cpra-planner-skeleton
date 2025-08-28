import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeTimeline } from '../src/services/rules.js';

const baseReq = {
  requester: { name: 'Jane', email: 'jane@example.com' },
  receivedDate: '01/15/2025',
  description: 'Records',
  range: {},
  departments: [],
  extension: { apply: true, reasons: [] },
};

test('computeTimeline handles extension and roll forward', () => {
  const tl = computeTimeline(baseReq);
  assert.equal(tl.determinationDue, '2025-01-27');
  assert.equal(tl.extensionDue, '2025-02-10');
  const labels = tl.milestones.map(m => m.label);
  assert(labels.includes('Draft production'));
});

test('computeTimeline parses natural language date', () => {
  const tl = computeTimeline({ ...baseReq, receivedDate: 'Jan 15, 2025' });
  assert.equal(tl.determinationDue, '2025-01-27');
});

test('computeTimeline rejects invalid date', () => {
  assert.throws(() => computeTimeline({ ...baseReq, receivedDate: 'bad-date' }), /Unrecognized date format/);
});
