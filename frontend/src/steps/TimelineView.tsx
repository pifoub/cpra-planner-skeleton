import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { postJSON } from '../lib/api';
import type { CPRARequest, Timeline } from '../types';

/** Display the computed timeline for approval. */
export default function TimelineView({
  req,
  registerNext,
}: {
  req: CPRARequest;
  registerNext: (fn: () => Timeline, ready?: boolean) => void;
}) {
  const [tl, setTl] = useState<Timeline | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setTl(await postJSON('/api/timeline/calc', req));
        setError(null);
      } catch (e) {
        console.error(e);
        setError('Failed to calculate timeline');
      }
    })();
  }, [req]);

  useEffect(() => {
    registerNext(() => tl!, !!tl);
  }, [tl, registerNext]);

  if (error) return <div className='text-red-600'>{error}</div>;
  if (!tl) return <div>Calculating...</div>;

  const draftProd = tl.milestones.find(m => m.label === 'Draft production')?.due ?? '';

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-3 gap-4'>
        <Card title='Determination Due' value={tl.determinationDue} />
        {tl.extensionDue && <Card title='Extension Due' value={tl.extensionDue} />}
        <Card title='Draft Production' value={draftProd} />
      </div>
      {/* Primary action moved to Stepper */}
    </div>
  );
}
