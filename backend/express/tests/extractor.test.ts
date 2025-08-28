// Tests for scope extraction from meeting notes.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractScope } from '../src/services/extractor.js';

/**
 * extractor.parseScope should convert notes into structured request data.
 */
test('extractScope parses notes', () => {
  const notes =
    'Meeting notes from John Doe <john.doe@example.com> on 2025-01-05. Records sought: Budget documents.';
  const draft = extractScope(notes);
  assert.equal(draft.request.requester.email, 'john.doe@example.com');
  assert.equal(draft.request.requester.name, 'John Doe');
  assert.equal(draft.request.receivedDate, '2025-01-05');
  assert.equal(draft.request.description, 'Budget documents.');
});
