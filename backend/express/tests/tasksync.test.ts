// Tests for converting timelines into calendar events.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createTaskSync } from '../src/services/tasksync.js';

const payload = {
  timeline: {
    determinationDue: '2025-01-27',
    extensionDue: '2025-02-10',
    milestones: [{ label: 'Draft production', due: '2025-02-10' }],
  },
};

/**
 * createTaskSync should include all relevant events in the ICS payload.
 */
test('createTaskSync builds ICS with events', () => {
  const result = createTaskSync(payload);
  const ics = Buffer.from(result.icsFileBase64, 'base64').toString();
  assert.match(ics, /CPRA Determination Due/);
  assert.match(ics, /CPRA Extension Due/);
  assert.match(ics, /CPRA Draft Production/);
});
