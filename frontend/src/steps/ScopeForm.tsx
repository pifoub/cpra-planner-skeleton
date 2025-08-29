import React, { useEffect, useState } from 'react';
import type { CPRARequest } from '../types';

/**
 * Form for reviewing and editing the extracted CPRA request scope.
 */
export default function ScopeForm({
  draft,
  registerNext,
}: {
  draft: CPRARequest;
  registerNext: (fn: () => CPRARequest) => void;
}) {
  const [f, setF] = useState<CPRARequest>(draft);

  /** Update a nested field within the request object. */
  function up(path: string, val: any) {
    setF(prev => {
      const c = structuredClone(prev);
      const parts = path.split('.');
      let o: any = c;
      for (let i = 0; i < parts.length - 1; i++) {
        o = o[parts[i]];
      }
      o[parts.at(-1)!] = val;
      return c;
    });
  }

  useEffect(() => {
    registerNext(() => f);
  }, [f, registerNext]);

  return (
    <div className='grid grid-cols-2 gap-4'>
      <div>
        <label className='block text-sm text-gray-600'>Requester Name</label>
        <input
          className='w-full border p-2'
          value={f.requester.name}
          onChange={e => up('requester.name', e.target.value)}
        />
      </div>
      <div>
        <label className='block text-sm text-gray-600'>Requester Email</label>
        <input
          className='w-full border p-2'
          value={f.requester.email ?? ''}
          onChange={e => up('requester.email', e.target.value)}
        />
      </div>
      <div>
        <label className='block text-sm text-gray-600'>Received Date (YYYY-MM-DD)</label>
        <input
          className='w-full border p-2'
          value={f.receivedDate}
          onChange={e => up('receivedDate', e.target.value)}
        />
      </div>
      <div className='col-span-2'>
        <label className='block text-sm text-gray-600'>Records Sought</label>
        <textarea
          className='w-full border p-2'
          rows={4}
          value={f.description}
          onChange={e => up('description', e.target.value)}
        />
      </div>
      <div>
        <label className='block text-sm text-gray-600'>Date Range Start</label>
        <input
          className='w-full border p-2'
          value={f.range?.start ?? ''}
          onChange={e => up('range.start', e.target.value)}
        />
      </div>
      <div>
        <label className='block text-sm text-gray-600'>Date Range End</label>
        <input
          className='w-full border p-2'
          value={f.range?.end ?? ''}
          onChange={e => up('range.end', e.target.value)}
        />
      </div>
      <div className='col-span-2'>
        <label className='block text-sm text-gray-600'>Departments (comma-separated)</label>
        <input
          className='w-full border p-2'
          value={f.departments.join(', ')}
          onChange={e =>
            up(
              'departments',
              e.target.value
                .split(',')
                .map((s: string) => s.trim())
                .filter(Boolean)
            )
          }
        />
      </div>
      <div>
        <label className='block text-sm text-gray-600'>Apply Extension?</label>
        <input
          type='checkbox'
          checked={f.extension.apply}
          onChange={e => up('extension.apply', e.target.checked)}
        />
      </div>
      {/* Primary action moved to Stepper */}
    </div>
  );
}

