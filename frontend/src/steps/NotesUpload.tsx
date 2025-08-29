import React, { useEffect, useState } from 'react';
import type { CPRARequest } from '../types';
import { SAMPLE_NOTES } from '../sampleNotes';

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

  type Preview = {
    requester: string | null;
    received: string | null;
    description: string | null;
    conf: { requester: number; received: number; description: number };
  };

  const [preview, setPreview] = useState<Preview | null>(null);

  /**
   * Very small client-side parser to simulate extraction. Looks for patterns
   * like "request by NAME <email> on YYYY-MM-DD" and "Records sought: ...".
   */
  function simulateExtraction(text: string): Preview {
    const nameMatch = text.match(/request by ([^<\n]+)</i);
    const dateMatch = text.match(/on (\d{4}-\d{2}-\d{2})/);
    const descMatch = text.match(/records sought:([^\.]+)/i);
    return {
      requester: nameMatch ? nameMatch[1].trim() : null,
      received: dateMatch ? dateMatch[1] : null,
      description: descMatch ? descMatch[1].trim() : null,
      conf: {
        requester: nameMatch ? 0.9 : 0.2,
        received: dateMatch ? 0.9 : 0.2,
        description: descMatch ? 0.9 : 0.2,
      },
    };
  }

  /** Load preview whenever notes change. */
  useEffect(() => {
    if (notes.trim().length > 0) {
      setPreview(simulateExtraction(notes));
    } else {
      setPreview(null);
    }
    registerNext(extract, notes.trim().length > 0);
  }, [notes, registerNext]);

  /** Simulated extraction returning a CPRARequest object. */
  async function extract() {
    try {
      const p = simulateExtraction(notes);
      setError(null);
      return {
        requester: { name: p.requester ?? '' },
        receivedDate: p.received ?? '',
        description: p.description ?? '',
        range: {},
        departments: [],
        extension: { apply: false, reasons: [] },
      } as CPRARequest;
    } catch (e) {
      console.error(e);
      setError('Failed to extract scope');
      throw e;
    }
  }

  function loadSample() {
    setNotes(SAMPLE_NOTES);
  }

  function ConfidenceChip({ score }: { score: number }) {
    let label = 'Low';
    let color = 'bg-red-200';
    if (score > 0.8) {
      label = 'High';
      color = 'bg-green-200';
    } else if (score > 0.5) {
      label = 'Med';
      color = 'bg-yellow-200';
    }
    return (
      <span
        className={`ml-2 px-2 py-0.5 rounded text-xs ${color}`}
        title={`Confidence ${(score * 100).toFixed(0)}%`}
      >
        {label}
      </span>
    );
  }

  return (
    <div className='space-y-3'>
      <textarea
        className='w-full h-40 border p-3'
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder='Paste attorney notes here...'
      />
      {notes.trim().length === 0 && (
        <div className='text-center text-sm text-gray-500 space-y-2'>
          <p>No notes loaded yet.</p>
          <button className='btn' type='button' onClick={loadSample}>
            Load sample notes
          </button>
        </div>
      )}
      {preview && (
        <div className='space-y-1 text-sm'>
          <p>
            <span className='font-medium'>Requester:</span>{' '}
            {preview.requester || <span className='text-gray-400'>N/A</span>}
            <ConfidenceChip score={preview.conf.requester} />
          </p>
          <p>
            <span className='font-medium'>Received:</span>{' '}
            {preview.received || <span className='text-gray-400'>N/A</span>}
            <ConfidenceChip score={preview.conf.received} />
          </p>
          <p>
            <span className='font-medium'>Description:</span>{' '}
            {preview.description || <span className='text-gray-400'>N/A</span>}
            <ConfidenceChip score={preview.conf.description} />
          </p>
        </div>
      )}
      {error && <p className='text-red-600'>{error}</p>}
    </div>
  );
}
