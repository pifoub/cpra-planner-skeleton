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

test('extractScope handles Requester label and natural date', () => {
  const notes =
    'Requester: Karen Nuisance (email: knuisa@gmail.com)\nDate/Time Received: August 29, 2025, 11:14 a.m. PT\nSubject: California Public Records Act request related to Agenda Item 5 (Vista Ridge Transfer Station modernization).';
  const draft = extractScope(notes);
  assert.equal(draft.request.requester.email, 'knuisa@gmail.com');
  assert.equal(draft.request.requester.name, 'Karen Nuisance');
  assert.equal(draft.request.receivedDate, '2025-08-29');
  assert.equal(
    draft.request.description,
    'California Public Records Act request related to Agenda Item 5 (Vista Ridge Transfer Station modernization).'
  );
});
