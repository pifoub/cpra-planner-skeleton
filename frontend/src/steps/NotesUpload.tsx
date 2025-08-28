import React, { useState } from 'react';
import { postJSON } from '../lib/api';
import type { CPRARequest } from '../types';

export default function NotesUpload({
  onExtract,
}: {
  onExtract: (draft: CPRARequest) => void;
}) {
  const [notes, setNotes] = useState(
    'Public Records Act request by Jane Rivera <jrivera@example.com> on 2025-08-10. Records sought: emails and texts regarding agenda item 4.'
  );
  const [error, setError] = useState<string | null>(null);

  async function extract() {
    try {
      const res = await postJSON('/api/extract/scope', { notes });
      onExtract(res.request);
      setError(null);
    } catch (e) {
      console.error(e);
      setError('Failed to extract scope');
    }
  }

  return (
    <div className='space-y-3'>
      <textarea
        className='w-full h-40 border p-3'
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />
      {error && <p className='text-red-600'>{error}</p>}
      <div className='flex gap-2'>
        <button className='btn-primary' onClick={extract}>
          Extract Draft Scope
        </button>
      </div>
    </div>
  );
}
