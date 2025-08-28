import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderLetter } from '../src/services/templates.js';

test('renderLetter applies nl2br filter', () => {
  const context = {
    request: {
      requester: { name: 'Jane', email: 'jane@example.com' },
      receivedDate: '2025-01-01',
      description: 'Line1\nLine2',
      range: {},
      departments: [],
      extension: { apply: false, reasons: [] },
    },
    timeline: { determinationDue: '2025-01-10', milestones: [] },
  };
  const html = renderLetter('ack.html', context);
  assert.ok(html.includes('Line1<br>\nLine2'));
  assert.ok(html.includes('2025-01-10'));
});
