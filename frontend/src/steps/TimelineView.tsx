import React, { useEffect, useRef, useState } from 'react';
import Card from '../components/Card';
import type { CPRARequest, Timeline } from '../types';
import { computeTimeline, DateMath } from '../lib/timeline';

/** Display the computed timeline for approval. */
export default function TimelineView({
  req,
  registerNext,
}: {
  req: CPRARequest;
  registerNext: (fn: () => { timeline: Timeline; edited: boolean }, ready?: boolean) => void;
}) {
  const initial = useRef({
    applyExt: req.extension?.apply ?? false,
    adjustWeekends: true,
  });
  const [applyExt, setApplyExt] = useState(initial.current.applyExt);
  const [adjustWeekends, setAdjustWeekends] = useState(initial.current.adjustWeekends);
  const [tl, setTl] = useState<Timeline | null>(null);
  const [math, setMath] = useState<DateMath | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const { timeline, math } = computeTimeline(req, {
        applyExtension: applyExt,
        adjustWeekends,
      });
      setTl(timeline);
      setMath(math);
      setError(null);
    } catch (e) {
      console.error(e);
      setError('Failed to calculate timeline');
    }
  }, [req, applyExt, adjustWeekends]);

  useEffect(() => {
    const edited =
      applyExt !== initial.current.applyExt ||
      adjustWeekends !== initial.current.adjustWeekends;
    registerNext(() => ({ timeline: tl!, edited }), !!tl);
  }, [tl, registerNext, applyExt, adjustWeekends]);

  if (error) return <div className='text-red-600'>{error}</div>;
  if (!tl || !math) return <div>Calculating...</div>;

  const draftProd = tl.milestones.find(m => m.label === 'Draft production')?.due ?? '';

  return (
    <div className='space-y-4'>
      <div className='bg-yellow-50 border border-yellow-200 text-yellow-800 p-2 rounded'>
        Holidays are not considered in this demo.
      </div>
      <div className='flex gap-4'>
        <label className='flex items-center gap-2 text-sm'>
          <input
            type='checkbox'
            checked={applyExt}
            onChange={e => setApplyExt(e.target.checked)}
          />
          Apply extension
        </label>
        <label className='flex items-center gap-2 text-sm'>
          <input
            type='checkbox'
            checked={adjustWeekends}
            onChange={e => setAdjustWeekends(e.target.checked)}
          />
          Adjust for weekends
        </label>
      </div>
      <div className='grid grid-cols-3 gap-4'>
        <Card title='Determination Due' value={tl.determinationDue} />
        {tl.extensionDue && <Card title='Extension Due' value={tl.extensionDue} />}
        <Card title='Draft Production' value={draftProd} />
      </div>
      <details className='border rounded p-2'>
        <summary className='cursor-pointer'>Date math</summary>
        <ul className='list-disc pl-5 text-sm space-y-1 mt-2'>
          <li>Received: {math.received}</li>
          <li>+10 days: {math.plus10}</li>
          {applyExt && math.extensionBase && (
            <li>+14 day extension: {math.extensionBase}</li>
          )}
          {adjustWeekends && (
            <li>
              Weekend adjustment: determination {tl.determinationDue}
              {applyExt && tl.extensionDue ? `, extension ${tl.extensionDue}` : ''}
            </li>
          )}
        </ul>
      </details>
      {/* Primary action moved to Stepper */}
    </div>
  );
}
