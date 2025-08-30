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

  function toYMD(s: string): string {
    const d = new Date(s);
    return isNaN(d.getTime()) ? s : d.toISOString().slice(0, 10);
  }

  function buildRecords(
    recordTypes: string[] = [],
    custodians: string[] = [],
    preferred?: string | null
  ): string {
    const lines: string[] = [];
    if (recordTypes.length)
      lines.push(`Record Types: ${recordTypes.join(', ')}`);
    if (custodians.length)
      lines.push(`Custodians: ${custodians.join(', ')}`);
    if (preferred) lines.push(`Preferred Format/Delivery: ${preferred}`);
    return lines.join('\n');
  }

  type Preview = {
    requester: string | null;
    matter: string | null;
    received: string | null;
    recordTypes: string[];
    custodians: string[];
    preferred: string | null;
    conf: { requester: number; matter: number; received: number };
  };

  const [preview, setPreview] = useState<Preview | null>(null);

  type ExtractResp = {
    request: CPRARequest;
    confidences: { requester: number; matter: number; receivedDate: number };
  };

  async function runExtraction(text: string): Promise<ExtractResp> {
    const res = await fetch('/api/extract/scope', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: text }),
    });
    if (!res.ok) throw new Error('extract failed');
    return res.json();
  }

  /** Load preview whenever notes change. */
  useEffect(() => {
    if (notes.trim().length > 0) {
      runExtraction(notes)
        .then(data => {
          const received = data.request.receivedDate
            ? toYMD(data.request.receivedDate)
            : null;
          data.request.receivedDate = received || '';
          data.request.description = buildRecords(
            data.request.recordTypes,
            data.request.custodians,
            data.request.preferredFormatDelivery
          );
          setPreview({
            requester: data.request.requester.name || null,
            matter: data.request.matter || null,
            received,
            recordTypes: data.request.recordTypes || [],
            custodians: data.request.custodians || [],
            preferred: data.request.preferredFormatDelivery || null,
            conf: {
              requester: data.confidences.requester,
              matter: data.confidences.matter,
              received: data.confidences.receivedDate,
            },
          });
        })
        .catch(() => setPreview(null));
    } else {
      setPreview(null);
    }
  }, [notes]);

  useEffect(() => {
    registerNext(extract, !!preview);
  }, [registerNext, preview]);

  /** Extraction returning a CPRARequest object. */
  async function extract() {
    try {
      const data = await runExtraction(notes);
      data.request.receivedDate = data.request.receivedDate
        ? toYMD(data.request.receivedDate)
        : '';
      data.request.description = buildRecords(
        data.request.recordTypes,
        data.request.custodians,
        data.request.preferredFormatDelivery
      );
      setError(null);
      return data.request;
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
            <span className='font-medium'>Matter:</span>{' '}
            {preview.matter || <span className='text-gray-400'>N/A</span>}
            <ConfidenceChip score={preview.conf.matter} />
          </p>
          <p>
            <span className='font-medium'>Logged:</span>{' '}
            {preview.received || <span className='text-gray-400'>N/A</span>}
            <ConfidenceChip score={preview.conf.received} />
          </p>
          {preview.recordTypes.length > 0 && (
            <p>
              <span className='font-medium'>Record Types:</span>{' '}
              {preview.recordTypes.join(', ')}
            </p>
          )}
          {preview.custodians.length > 0 && (
            <p>
              <span className='font-medium'>Custodians:</span>{' '}
              {preview.custodians.join(', ')}
            </p>
          )}
          {preview.preferred && (
            <p>
              <span className='font-medium'>Preferred Format/Delivery:</span>{' '}
              {preview.preferred}
            </p>
          )}
        </div>
      )}
      {error && <p className='text-red-600'>{error}</p>}
    </div>
  );
}
