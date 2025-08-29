import React, { useEffect, useState } from 'react';
import { postJSON } from '../lib/api';
import type { CPRARequest, Timeline, LetterKind } from '../types';

/** Step for previewing acknowledgment or extension letters. */
export default function LettersEditor({
  req,
  tl,
  registerNext,
}: {
  req: CPRARequest;
  tl: Timeline;
  registerNext: (fn: () => { edited: boolean }, ready?: boolean) => void;
}) {
  const [kind, setKind] = useState<LetterKind>('ack');
  const [html, setHtml] = useState('');
  const [initialHtml, setInitialHtml] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await postJSON(
          `/api/letters/${kind === 'ack' ? 'ack' : 'extension'}`,
          { request: req, timeline: tl, agency: { signatureBlock: 'City Clerk' } }
        );
        setHtml(data.html);
        setInitialHtml(data.html);
        setError(null);
      } catch (e) {
        console.error(e);
        setError('Failed to load letter');
      }
    })();
  }, [kind, req, tl]);

  useEffect(() => {
    registerNext(() => ({ edited: html !== initialHtml }), html !== '');
  }, [html, initialHtml, registerNext]);

  return (
    <div className='space-y-3'>
      <div className='flex gap-2'>
        <button
          className={'btn ' + (kind === 'ack' ? 'bg-blue-600 text-white' : '')}
          onClick={() => setKind('ack')}
        >
          Acknowledgment
        </button>
        <button
          className={'btn ' + (kind === 'extension' ? 'bg-blue-600 text-white' : '')}
          onClick={() => setKind('extension')}
        >
          Extension
        </button>
      </div>
      {error && <p className='text-red-600'>{error}</p>}
      <textarea
        className='w-full border p-3 h-64'
        value={html}
        onChange={e => setHtml(e.target.value)}
      ></textarea>
      {/* Primary action moved to Stepper */}
    </div>
  );
}
