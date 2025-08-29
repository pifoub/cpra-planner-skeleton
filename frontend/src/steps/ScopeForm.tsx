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
  registerNext: (fn: () => CPRARequest, ready?: boolean) => void;
}) {
  const [f, setF] = useState<CPRARequest>(draft);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
  function get(obj: any, path: string) {
    return path.split('.').reduce((o, p) => (o ? o[p] : undefined), obj);
  }

  function edited(path: string) {
    return get(f, path) !== get(draft, path);
  }

  function validateEmail(v: string) {
    return /\S+@\S+\.\S+/.test(v) ? '' : 'Enter a valid email.';
  }

  function validateDate(v: string) {
    return /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(new Date(v).getTime())
      ? ''
      : 'Use YYYY-MM-DD format.';
  }

  function handle(path: string, value: any, key?: string, validator?: (v: string) => string) {
    up(path, value);
    if (key && validator) {
      const msg = validator(value);
      setErrors(e => ({ ...e, [key]: msg }));
    }
  }

  useEffect(() => {
    setErrors({
      email: validateEmail(f.requester.email ?? ''),
      receivedDate: validateDate(f.receivedDate),
      rangeStart: validateDate(f.range?.start ?? ''),
      rangeEnd: validateDate(f.range?.end ?? ''),
    });
  }, []);

  useEffect(() => {
    const valid = Object.values(errors).every(e => !e);
    registerNext(() => f, valid);
  }, [f, errors, registerNext]);

  const confirmedCount = [
    f.requester.name,
    f.requester.email,
    f.receivedDate,
    f.description,
    f.range?.start,
    f.range?.end,
  ].filter(Boolean).length;

  return (
    <div className='space-y-6'>
      <section>
        <h2 className='font-semibold mb-2'>Requester</h2>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm text-gray-600'>
              Requester Name
              {edited('requester.name') && (
                <span className='ml-2 text-xs text-blue-600'>✎ Edited</span>
              )}
            </label>
            <input
              className='w-full border p-2'
              value={f.requester.name}
              onChange={e => handle('requester.name', e.target.value)}
            />
          </div>
          <div>
            <label className='block text-sm text-gray-600'>
              Requester Email
              {edited('requester.email') && (
                <span className='ml-2 text-xs text-blue-600'>✎ Edited</span>
              )}
            </label>
            <input
              className='w-full border p-2'
              value={f.requester.email ?? ''}
              onChange={e => handle('requester.email', e.target.value, 'email', validateEmail)}
            />
            {errors.email && (
              <p className='text-xs text-red-600 mt-1'>{errors.email}</p>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className='font-semibold mb-2'>Request Details</h2>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm text-gray-600'>
              Received Date (YYYY-MM-DD)
              {edited('receivedDate') && (
                <span className='ml-2 text-xs text-blue-600'>✎ Edited</span>
              )}
            </label>
            <input
              className='w-full border p-2'
              value={f.receivedDate}
              onChange={e => handle('receivedDate', e.target.value, 'receivedDate', validateDate)}
            />
            {errors.receivedDate && (
              <p className='text-xs text-red-600 mt-1'>{errors.receivedDate}</p>
            )}
          </div>
          <div className='col-span-2'>
            <label className='block text-sm text-gray-600'>
              Records Sought
              {edited('description') && (
                <span className='ml-2 text-xs text-blue-600'>✎ Edited</span>
              )}
            </label>
            <textarea
              className='w-full border p-2'
              rows={4}
              value={f.description}
              onChange={e => handle('description', e.target.value)}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className='font-semibold mb-2'>Compliance Settings</h2>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm text-gray-600'>
              Date Range Start
              {edited('range.start') && (
                <span className='ml-2 text-xs text-blue-600'>✎ Edited</span>
              )}
            </label>
            <input
              className='w-full border p-2'
              value={f.range?.start ?? ''}
              onChange={e => handle('range.start', e.target.value, 'rangeStart', validateDate)}
            />
            {errors.rangeStart && (
              <p className='text-xs text-red-600 mt-1'>{errors.rangeStart}</p>
            )}
          </div>
          <div>
            <label className='block text-sm text-gray-600'>
              Date Range End
              {edited('range.end') && (
                <span className='ml-2 text-xs text-blue-600'>✎ Edited</span>
              )}
            </label>
            <input
              className='w-full border p-2'
              value={f.range?.end ?? ''}
              onChange={e => handle('range.end', e.target.value, 'rangeEnd', validateDate)}
            />
            {errors.rangeEnd && (
              <p className='text-xs text-red-600 mt-1'>{errors.rangeEnd}</p>
            )}
          </div>
        </div>
      </section>

      <div className='card'>
        <div className='text-sm text-gray-600'>Review</div>
        <div className='text-lg font-semibold'>{`You're confirming ${confirmedCount} items`}</div>
      </div>
    </div>
  );
}

