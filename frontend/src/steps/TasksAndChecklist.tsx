import React, { useState } from 'react';
import type { Timeline } from '../types';
import Card from '../components/Card';

const REDACTION_ITEMS = [
  'Attorney–client / work product',
  'Personnel/medical privacy',
  'Law-enforcement investigations',
  'Security-sensitive infrastructure',
  'IDs (SSN/DL), DOB, financial',
  'Personal contact info',
  'Trade secrets / proprietary',
  'Juvenile/student/protected victims',
  'Settlement/mediation',
  'Deliberative process',
  'Prepare redaction log',
];

/** Checklist for redaction and task synchronization step. */
export default function TasksAndChecklist({
  matterId: _matterId,
  tl: _tl,
  recipients: _recipients,
}: {
  matterId: string;
  tl: Timeline;
  recipients: string[];
}) {
  const [items, setItems] = useState(
    REDACTION_ITEMS.map(() => ({ checked: false, timestamp: null as string | null }))
  );
  const [ics, setIcs] = useState<string | null>(null);
  const [preview, setPreview] = useState<
    { summary: string; start: string; end: string } | null
  >(null);

  /** Demo-only action generating a sample ICS file and preview. */
  function generateIcs() {
    const now = new Date();
    const later = new Date(now.getTime() + 60 * 60 * 1000);
    const sampleEvent = {
      summary: 'Demo Event',
      start: now.toISOString(),
      end: later.toISOString(),
    };
    const start = sampleEvent.start.replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    const end = sampleEvent.end.replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    const dtstamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    const sampleIcs = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CPRA Demo//EN
BEGIN:VEVENT
UID:demo-1
DTSTAMP:${dtstamp}
SUMMARY:${sampleEvent.summary}
DTSTART:${start}
DTEND:${end}
END:VEVENT
END:VCALENDAR`;
    setIcs(btoa(sampleIcs));
    setPreview({
      summary: sampleEvent.summary,
      start: now.toLocaleString(),
      end: later.toLocaleString(),
    });
  }

  return (
    <div className='grid grid-cols-2 gap-6'>
      <div>
        <h2 className='font-semibold mb-2'>Redaction Checklist</h2>
        <ul className='space-y-2'>
          {REDACTION_ITEMS.map((item, i) => (
            <li key={i} className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={items[i].checked}
                onChange={() =>
                  setItems(prev =>
                    prev.map((v, idx) =>
                      idx === i
                        ? {
                            checked: !v.checked,
                            timestamp: !v.checked
                              ? new Date().toLocaleString()
                              : null,
                          }
                        : v
                    )
                  )
                }
              />
              <span>{item}</span>
              {items[i].timestamp && (
                <span className='text-xs text-gray-500'>
                  ({items[i].timestamp})
                </span>
              )}
            </li>
          ))}
        </ul>
        <div className='mt-4 p-2 bg-blue-50 text-blue-800 text-sm text-center'>
          In production this will sync to Proprietary Software / Google / Microsoft.
        </div>
      </div>
      <div>
        <h2 className='font-semibold mb-2'>Task Sync</h2>
        <p className='text-sm text-gray-600 mb-2'>
          Creates calendar holds and returns an ICS file you can import.
        </p>
        <button className='btn-primary' onClick={generateIcs}>
          Generate ICS
        </button>
        {ics && (
          <div className='mt-3 space-y-3'>
            <a
              download='cpra_events.ics'
              href={`data:text/calendar;base64,${ics}`}
              className='underline text-blue-700'
            >
              Download ICS
            </a>
            {preview && (
              <Card
                title={preview.summary}
                value={`${preview.start} – ${preview.end}`}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

