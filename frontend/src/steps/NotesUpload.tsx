import React, { useEffect, useState } from 'react';
import { postJSON } from '../lib/api';
import type { CPRARequest } from '../types';

/** Step for uploading notes and extracting a draft scope. */
export default function NotesUpload({
  notes,
  setNotes,
  registerNext,
}: {
  notes: string;
  setNotes: (s: string) => void;
  registerNext: (fn: () => Promise<CPRARequest>, ready?: boolean) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  /** Call the backend to extract a CPRA scope from notes. */
  async function extract() {
    try {
      const res = await postJSON('/api/extract/scope', { notes });
      setError(null);
      return res.request as CPRARequest;
    } catch (e) {
      console.error(e);
      setError('Failed to extract scope');
      throw e;
    }
  }

  useEffect(() => {
    registerNext(extract, notes.trim().length > 0);
  }, [notes, registerNext]);

  return (
    <div className='space-y-3'>
      <textarea
        className='w-full h-40 border p-3'
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />
      {error && <p className='text-red-600'>{error}</p>}
    </div>
  );
}
