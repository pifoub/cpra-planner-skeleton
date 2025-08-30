// Tests for scope extraction from structured summaries.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractScope } from '../src/services/extractor.js';

/**
 * extractor.parseScope should convert summary into structured request data.
 */
test('extractScope parses summary', () => {
  const notes =
    'CPRA Request Summary (for tracker)\n\nRequester: John Doe – john.doe@example.com\n\nDate Received: Jan 5, 2025\n\nMatter: Budget Inquiry\n\nTime Range: Jan 1, 2024 – Jan 5, 2025\n\nCustodians: Finance, IT\n\nRecord Types: Emails; texts\n\nPreferred Format/Delivery: Email';
  const draft = extractScope(notes);
  assert.equal(draft.request.requester.email, 'john.doe@example.com');
  assert.equal(draft.request.requester.name, 'John Doe');
  assert.equal(draft.request.receivedDate, '2025-01-05');
  assert.equal(draft.request.matter, 'Budget Inquiry');
  assert.deepEqual(draft.request.recordTypes, ['Emails', 'texts']);
  assert.deepEqual(draft.request.custodians, ['Finance', 'IT']);
  assert.equal(draft.request.preferredFormatDelivery, 'Email');
  assert.equal(draft.request.range?.start, '2024-01-01');
  assert.equal(draft.request.range?.end, '2025-01-05');
});

