import React, { useEffect, useState } from 'react';
import type { CPRARequest, Timeline, LetterKind } from '../types';
import { ACK_TEMPLATE, EXT_TEMPLATE } from '../lib/templates';

/** Step for previewing acknowledgment or extension letters. */
export default function LettersEditor({
  req,
  tl,
  registerNext,
}: {
  req: CPRARequest;
  tl: Timeline;
  registerNext: (fn: () => { edited: boolean; kind: LetterKind }, ready?: boolean) => void;
}) {
  const [kind, setKind] = useState<LetterKind>('ack');
  const [html, setHtml] = useState('');
  const [initialHtml, setInitialHtml] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [toneFriendly, setToneFriendly] = useState(false);
  const [includeSalutation, setIncludeSalutation] = useState(true);
  const [includeContact, setIncludeContact] = useState(true);

  function stripHighlight(h: string) {
    return h.replace(/<span class="merge-field"[^>]*>(.*?)<\/span>/g, '$1');
  }

  function highlight(h: string) {
    return stripHighlight(h).replace(/{{[^}]+}}/g, m => `<span class="merge-field bg-yellow-100" title="From earlier steps">${m}</span>`);
  }

  function applyTone(h: string, friendly: boolean) {
    if (kind === 'ack') {
      const formal = 'This is to acknowledge receipt of your request on {{receivedDate}}.';
      const friendlyTxt = "Thanks for your request on {{receivedDate}}. We'll get right on it.";
      return friendly ? h.replace(formal, friendlyTxt) : h.replace(friendlyTxt, formal);
    } else {
      const formal = 'We require an extension to your request received on {{receivedDate}}.';
      const friendlyTxt = "We're working on your request from {{receivedDate}} but need a bit more time.";
      return friendly ? h.replace(formal, friendlyTxt) : h.replace(friendlyTxt, formal);
    }
  }

  function toggleTone() {
    const next = !toneFriendly;
    setToneFriendly(next);
    setHtml(h => highlight(applyTone(stripHighlight(h), next)));
  }

  function toggleSalutation() {
    const next = !includeSalutation;
    setIncludeSalutation(next);
    setHtml(h => {
      let raw = stripHighlight(h);
      const salutation = '<p>Dear Requester,</p>';
      if (next) {
        if (!raw.includes(salutation)) raw = salutation + '\n' + raw;
      } else {
        raw = raw.replace(salutation + '\n', '').replace(salutation, '');
      }
      return highlight(raw);
    });
  }

  function toggleContact() {
    const next = !includeContact;
    setIncludeContact(next);
    setHtml(h => {
      let raw = stripHighlight(h);
      const contact = '<p>Sincerely,<br>City Clerk</p>';
      if (next) {
        if (!raw.includes(contact)) raw = raw + '\n' + contact;
      } else {
        raw = raw.replace('\n' + contact, '').replace(contact, '');
      }
      return highlight(raw);
    });
  }

  useEffect(() => {
    try {
      const base = kind === 'ack' ? ACK_TEMPLATE : EXT_TEMPLATE;
      const h = highlight(base);
      setHtml(h);
      setInitialHtml(h);
      setError(null);
      setToneFriendly(false);
      setIncludeSalutation(true);
      setIncludeContact(true);
    } catch (e) {
      console.error(e);
      setError('Failed to load letter');
    }
  }, [kind]);

  useEffect(() => {
    registerNext(() => ({ edited: html !== initialHtml, kind }), html !== '');
  }, [html, initialHtml, registerNext, kind]);

  return (
    <div className='flex gap-4'>
      <div className='w-48 space-y-2'>
        <label className='flex items-center gap-2'>
          <input type='checkbox' checked={toneFriendly} onChange={toggleTone} /> Friendly tone
        </label>
        <label className='flex items-center gap-2'>
          <input type='checkbox' checked={includeSalutation} onChange={toggleSalutation} />
          Include salutation
        </label>
        <label className='flex items-center gap-2'>
          <input type='checkbox' checked={includeContact} onChange={toggleContact} /> Include contact block
        </label>
      </div>
      <div className='flex-1 space-y-3'>
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
        <div className='border p-3' dangerouslySetInnerHTML={{ __html: html }} />
        {/* Primary action moved to Stepper */}
      </div>
    </div>
  );
}
