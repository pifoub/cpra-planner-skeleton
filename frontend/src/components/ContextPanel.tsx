import React from 'react';

export type StepContext = {
  does: string;
  ai: string;
  lawyer: string;
  note?: string;
};

/** Side panel explaining the current step. */
export default function ContextPanel({ context }: { context: StepContext }) {
  return (
    <div className='space-y-4 text-sm'>
      <div>
        <h2 className='font-semibold'>What this step does</h2>
        <p>{context.does}</p>
      </div>
      <div>
        <h2 className='font-semibold'>What the AI drafts</h2>
        <p>{context.ai}</p>
      </div>
      <div>
        <h2 className='font-semibold'>What the lawyer decides</h2>
        <p>{context.lawyer}</p>
      </div>
      {context.note && (
        <div>
          <h2 className='font-semibold'>Note</h2>
          <p>{context.note}</p>
        </div>
      )}
    </div>
  );
}
